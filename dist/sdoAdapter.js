(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sdoAdapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {clone} = require('./util');

module.exports = class ActiveContextCache {
  /**
   * Creates an active context cache.
   *
   * @param size the maximum size of the cache.
   */
  constructor(size = 100) {
    this.order = [];
    this.cache = new Map();
    this.size = size;
  }

  get(activeCtx, localCtx) {
    const level1 = this.cache.get(activeCtx);
    if(level1) {
      const key = JSON.stringify(localCtx);
      const result = level1.get(key);
      return result || null;
    }
    return null;
  }

  set(activeCtx, localCtx, result) {
    if(this.order.length === this.size) {
      const entry = this.order.shift();
      this.cache.get(entry.activeCtx).delete(entry.localCtx);
    }
    const key = JSON.stringify(localCtx);
    this.order.push({activeCtx, localCtx: key});
    let level1 = this.cache.get(activeCtx);
    if(!level1) {
      level1 = new Map();
      this.cache.set(activeCtx, level1);
    }
    level1.set(key, clone(result));
  }
};

},{"./util":23}],3:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = class JsonLdError extends Error {
  /**
   * Creates a JSON-LD Error.
   *
   * @param msg the error message.
   * @param type the error type.
   * @param details the error details.
   */
  constructor(
    message = 'An unspecified JSON-LD error occurred.',
    name = 'jsonld.Error',
    details = {}) {
    super(message);
    this.name = name;
    this.message = message;
    this.details = details;
  }
};

},{}],4:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

module.exports = jsonld => {
  class JsonLdProcessor {
    toString() {
      return '[object JsonLdProcessor]';
    }
  }
  Object.defineProperty(JsonLdProcessor, 'prototype', {
    writable: false,
    enumerable: false
  });
  Object.defineProperty(JsonLdProcessor.prototype, 'constructor', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: JsonLdProcessor
  });

  // The Web IDL test harness will check the number of parameters defined in
  // the functions below. The number of parameters must exactly match the
  // required (non-optional) parameters of the JsonLdProcessor interface as
  // defined here:
  // https://www.w3.org/TR/json-ld-api/#the-jsonldprocessor-interface

  JsonLdProcessor.compact = function(input, ctx) {
    if(arguments.length < 2) {
      return Promise.reject(
        new TypeError('Could not compact, too few arguments.'));
    }
    return jsonld.compact(input, ctx);
  };
  JsonLdProcessor.expand = function(input) {
    if(arguments.length < 1) {
      return Promise.reject(
        new TypeError('Could not expand, too few arguments.'));
    }
    return jsonld.expand(input);
  };
  JsonLdProcessor.flatten = function(input) {
    if(arguments.length < 1) {
      return Promise.reject(
        new TypeError('Could not flatten, too few arguments.'));
    }
    return jsonld.flatten(input);
  };

  return JsonLdProcessor;
};

},{}],5:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// TODO: move `NQuads` to its own package
module.exports = require('rdf-canonize').NQuads;

},{"rdf-canonize":41}],6:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global Node, XMLSerializer */
'use strict';

const {
  RDF_LANGSTRING,
  RDF_PLAIN_LITERAL,
  RDF_OBJECT,
  RDF_XML_LITERAL,
  XSD_STRING,
} = require('./constants');

let _Node;
if(typeof Node !== 'undefined') {
  _Node = Node;
} else {
  _Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };
}

module.exports = class Rdfa {
  /**
   * Parses the RDF dataset found via the data object from the RDFa API.
   *
   * @param data the RDFa API data object.
   *
   * @return the RDF dataset.
   */
  parse(data) {
    const dataset = {};
    dataset['@default'] = [];

    const subjects = data.getSubjects();
    for(let si = 0; si < subjects.length; ++si) {
      const subject = subjects[si];
      if(subject === null) {
        continue;
      }

      // get all related triples
      const triples = data.getSubjectTriples(subject);
      if(triples === null) {
        continue;
      }
      const predicates = triples.predicates;
      for(const predicate in predicates) {
        // iterate over objects
        const objects = predicates[predicate].objects;
        for(let oi = 0; oi < objects.length; ++oi) {
          const object = objects[oi];

          // create RDF triple
          const triple = {};

          // add subject
          if(subject.indexOf('_:') === 0) {
            triple.subject = {type: 'blank node', value: subject};
          } else {
            triple.subject = {type: 'IRI', value: subject};
          }

          // add predicate
          if(predicate.indexOf('_:') === 0) {
            triple.predicate = {type: 'blank node', value: predicate};
          } else {
            triple.predicate = {type: 'IRI', value: predicate};
          }

          // serialize XML literal
          let value = object.value;
          if(object.type === RDF_XML_LITERAL) {
            // initialize XMLSerializer
            const XMLSerializer = getXMLSerializerClass();
            const serializer = new XMLSerializer();
            value = '';
            for(let x = 0; x < object.value.length; x++) {
              if(object.value[x].nodeType === _Node.ELEMENT_NODE) {
                value += serializer.serializeToString(object.value[x]);
              } else if(object.value[x].nodeType === _Node.TEXT_NODE) {
                value += object.value[x].nodeValue;
              }
            }
          }

          // add object
          triple.object = {};

          // object is an IRI
          if(object.type === RDF_OBJECT) {
            if(object.value.indexOf('_:') === 0) {
              triple.object.type = 'blank node';
            } else {
              triple.object.type = 'IRI';
            }
          } else {
            // object is a literal
            triple.object.type = 'literal';
            if(object.type === RDF_PLAIN_LITERAL) {
              if(object.language) {
                triple.object.datatype = RDF_LANGSTRING;
                triple.object.language = object.language;
              } else {
                triple.object.datatype = XSD_STRING;
              }
            } else {
              triple.object.datatype = object.type;
            }
          }
          triple.object.value = value;

          // add triple to dataset in default graph
          dataset['@default'].push(triple);
        }
      }
    }

    return dataset;
  }
};

function getXMLSerializerClass() {
  if(typeof XMLSerializer === 'undefined') {
    return require('xmldom').XMLSerializer;
  }
  return XMLSerializer;
}

},{"./constants":9,"xmldom":1}],7:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {callbackify, normalizeDocumentLoader} = require('./util');

module.exports = class RequestQueue {
  /**
   * Creates a simple queue for requesting documents.
   */
  constructor() {
    this._requests = {};
    this.add = callbackify(this.add.bind(this));
  }

  wrapLoader(loader) {
    const self = this;
    self._loader = normalizeDocumentLoader(loader);
    return function(/* url */) {
      return self.add.apply(self, arguments);
    };
  }

  async add(url) {
    const self = this;

    let promise = self._requests[url];
    if(promise) {
      // URL already queued, wait for it to load
      return Promise.resolve(promise);
    }

    // queue URL and load it
    promise = self._requests[url] = self._loader(url);

    try {
      return await promise;
    } finally {
      delete self._requests[url];
    }
  }
};

},{"./util":23}],8:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const JsonLdError = require('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString,
  isUndefined: _isUndefined
} = require('./types');

const {
  isList: _isList,
  isValue: _isValue,
  isGraph: _isGraph,
  isSimpleGraph: _isSimpleGraph,
  isSubjectReference: _isSubjectReference
} = require('./graphTypes');

const {
  expandIri: _expandIri,
  getContextValue: _getContextValue,
  isKeyword: _isKeyword,
  process: _processContext
} = require('./context');

const {
  removeBase: _removeBase
} = require('./url');

const {
  addValue: _addValue,
  asArray: _asArray,
  compareShortestLeast: _compareShortestLeast
} = require('./util');

const api = {};
module.exports = api;

/**
 * Recursively compacts an element using the given active context. All values
 * must be in expanded form before this method is called.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the compacted property associated with the element
 *          to compact, null for none.
 * @param element the element to compact.
 * @param options the compaction options.
 * @param compactionMap the compaction map to use.
 *
 * @return the compacted value.
 */
api.compact = ({
  activeCtx,
  activeProperty = null,
  element,
  options = {},
  compactionMap = () => undefined
}) => {
  // recursively compact array
  if(_isArray(element)) {
    let rval = [];
    for(let i = 0; i < element.length; ++i) {
      // compact, dropping any null values unless custom mapped
      let compacted = api.compact({
        activeCtx,
        activeProperty,
        element: element[i],
        options,
        compactionMap
      });
      if(compacted === null) {
        // TODO: use `await` to support async
        compacted = compactionMap({
          unmappedValue: element[i],
          activeCtx,
          activeProperty,
          parent: element,
          index: i,
          options
        });
        if(compacted === undefined) {
          continue;
        }
      }
      rval.push(compacted);
    }
    if(options.compactArrays && rval.length === 1) {
      // use single element if no container is specified
      const container = _getContextValue(
        activeCtx, activeProperty, '@container') || [];
      if(container.length === 0) {
        rval = rval[0];
      }
    }
    return rval;
  }

  // use any scoped context on activeProperty
  const ctx = _getContextValue(activeCtx, activeProperty, '@context');
  if(!_isUndefined(ctx)) {
    // Note: spec's `from term` var is named `isPropertyTermScopedContext`
    activeCtx = _processContext({
      activeCtx,
      localCtx: ctx,
      isPropertyTermScopedContext: true,
      options
    });
  }

  // recursively compact object
  if(_isObject(element)) {
    if(options.link && '@id' in element &&
      options.link.hasOwnProperty(element['@id'])) {
      // check for a linked element to reuse
      const linked = options.link[element['@id']];
      for(let i = 0; i < linked.length; ++i) {
        if(linked[i].expanded === element) {
          return linked[i].compacted;
        }
      }
    }

    // do value compaction on @values and subject references
    if(_isValue(element) || _isSubjectReference(element)) {
      const rval =
        api.compactValue({activeCtx, activeProperty, value: element, options});
      if(options.link && _isSubjectReference(element)) {
        // store linked element
        if(!(options.link.hasOwnProperty(element['@id']))) {
          options.link[element['@id']] = [];
        }
        options.link[element['@id']].push({expanded: element, compacted: rval});
      }
      return rval;
    }

    // FIXME: avoid misuse of active property as an expanded property?
    const insideReverse = (activeProperty === '@reverse');

    const rval = {};

    // revert type scoped context
    activeCtx = activeCtx.revertTypeScopedContext();

    if(options.link && '@id' in element) {
      // store linked element
      if(!options.link.hasOwnProperty(element['@id'])) {
        options.link[element['@id']] = [];
      }
      options.link[element['@id']].push({expanded: element, compacted: rval});
    }

    // apply any context defined on an alias of @type
    // if key is @type and any compacted value is a term having a local
    // context, overlay that context
    let types = element['@type'] || [];
    if(types.length > 1) {
      types = Array.from(types).sort();
    }
    // find all type-scoped contexts based on current context, prior to
    // updating it
    const typeContext = activeCtx;
    for(const type of types) {
      const compactedType = api.compactIri(
        {activeCtx: typeContext, iri: type, relativeTo: {vocab: true}});

      // Use any type-scoped context defined on this value
      const ctx = _getContextValue(typeContext, compactedType, '@context');
      if(!_isUndefined(ctx)) {
        activeCtx = _processContext({
          activeCtx,
          localCtx: ctx,
          options,
          isTypeScopedContext: true
        });
      }
    }

    // process element keys in order
    const keys = Object.keys(element).sort();
    for(const expandedProperty of keys) {
      const expandedValue = element[expandedProperty];

      // compact @id and @type(s)
      if(expandedProperty === '@id' || expandedProperty === '@type') {
        // if using a type-scoped context, resolve type values against previous
        // context
        const isType = expandedProperty === '@type';
        const valueContext = isType ?
          (activeCtx.previousContext || activeCtx) : activeCtx;
        let compactedValue = _asArray(expandedValue).map(
          expandedIri => api.compactIri({
            activeCtx: valueContext,
            iri: expandedIri,
            relativeTo: {vocab: isType}
          }));
        if(compactedValue.length === 1) {
          compactedValue = compactedValue[0];
        }

        // use keyword alias and add value
        const alias = api.compactIri(
          {activeCtx, iri: expandedProperty, relativeTo: {vocab: true}});
        const isArray = _isArray(compactedValue) && expandedValue.length === 0;
        _addValue(rval, alias, compactedValue, {propertyIsArray: isArray});
        continue;
      }

      // handle @reverse
      if(expandedProperty === '@reverse') {
        // recursively compact expanded value
        const compactedValue = api.compact({
          activeCtx,
          activeProperty: '@reverse',
          element: expandedValue,
          options,
          compactionMap
        });

        // handle double-reversed properties
        for(const compactedProperty in compactedValue) {
          if(activeCtx.mappings.has(compactedProperty) &&
            activeCtx.mappings.get(compactedProperty).reverse) {
            const value = compactedValue[compactedProperty];
            const container = _getContextValue(
              activeCtx, compactedProperty, '@container') || [];
            const useArray = (
              container.includes('@set') || !options.compactArrays);
            _addValue(
              rval, compactedProperty, value, {propertyIsArray: useArray});
            delete compactedValue[compactedProperty];
          }
        }

        if(Object.keys(compactedValue).length > 0) {
          // use keyword alias and add value
          const alias = api.compactIri({
            activeCtx,
            iri: expandedProperty,
            relativeTo: {vocab: true}
          });
          _addValue(rval, alias, compactedValue);
        }

        continue;
      }

      if(expandedProperty === '@preserve') {
        // compact using activeProperty
        const compactedValue = api.compact({
          activeCtx,
          activeProperty,
          element: expandedValue,
          options,
          compactionMap});

        if(!(_isArray(compactedValue) && compactedValue.length === 0)) {
          _addValue(rval, expandedProperty, compactedValue);
        }
        continue;
      }

      // handle @index property
      if(expandedProperty === '@index') {
        // drop @index if inside an @index container
        const container = _getContextValue(
          activeCtx, activeProperty, '@container') || [];
        if(container.includes('@index')) {
          continue;
        }

        // use keyword alias and add value
        const alias = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          relativeTo: {vocab: true}
        });
        _addValue(rval, alias, expandedValue);
        continue;
      }

      // skip array processing for keywords that aren't @graph or @list
      if(expandedProperty !== '@graph' && expandedProperty !== '@list' &&
        _isKeyword(expandedProperty)) {
        // use keyword alias and add value as is
        const alias = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          relativeTo: {vocab: true}
        });
        _addValue(rval, alias, expandedValue);
        continue;
      }

      // Note: expanded value must be an array due to expansion algorithm.
      if(!_isArray(expandedValue)) {
        throw new JsonLdError(
          'JSON-LD expansion error; expanded value must be an array.',
          'jsonld.SyntaxError');
      }

      // preserve empty arrays
      if(expandedValue.length === 0) {
        const itemActiveProperty = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          value: expandedValue,
          relativeTo: {vocab: true},
          reverse: insideReverse
        });
        const nestProperty = activeCtx.mappings.has(itemActiveProperty) ?
          activeCtx.mappings.get(itemActiveProperty)['@nest'] : null;
        let nestResult = rval;
        if(nestProperty) {
          _checkNestProperty(activeCtx, nestProperty, options);
          if(!_isObject(rval[nestProperty])) {
            rval[nestProperty] = {};
          }
          nestResult = rval[nestProperty];
        }
        _addValue(
          nestResult, itemActiveProperty, expandedValue, {
            propertyIsArray: true
          });
      }

      // recusively process array values
      for(const expandedItem of expandedValue) {
        // compact property and get container type
        const itemActiveProperty = api.compactIri({
          activeCtx,
          iri: expandedProperty,
          value: expandedItem,
          relativeTo: {vocab: true},
          reverse: insideReverse
        });

        // if itemActiveProperty is a @nest property, add values to nestResult,
        // otherwise rval
        const nestProperty = activeCtx.mappings.has(itemActiveProperty) ?
          activeCtx.mappings.get(itemActiveProperty)['@nest'] : null;
        let nestResult = rval;
        if(nestProperty) {
          _checkNestProperty(activeCtx, nestProperty, options);
          if(!_isObject(rval[nestProperty])) {
            rval[nestProperty] = {};
          }
          nestResult = rval[nestProperty];
        }

        const container = _getContextValue(
          activeCtx, itemActiveProperty, '@container') || [];

        // get simple @graph or @list value if appropriate
        const isGraph = _isGraph(expandedItem);
        const isList = _isList(expandedItem);
        let inner;
        if(isList) {
          inner = expandedItem['@list'];
        } else if(isGraph) {
          inner = expandedItem['@graph'];
        }

        // recursively compact expanded item
        let compactedItem = api.compact({
          activeCtx,
          activeProperty: itemActiveProperty,
          element: (isList || isGraph) ? inner : expandedItem,
          options,
          compactionMap
        });

        // handle @list
        if(isList) {
          // ensure @list value is an array
          if(!_isArray(compactedItem)) {
            compactedItem = [compactedItem];
          }

          if(!container.includes('@list')) {
            // wrap using @list alias
            compactedItem = {
              [api.compactIri({
                activeCtx,
                iri: '@list',
                relativeTo: {vocab: true}
              })]: compactedItem
            };

            // include @index from expanded @list, if any
            if('@index' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@index',
                relativeTo: {vocab: true}
              })] = expandedItem['@index'];
            }
          } else if(nestResult.hasOwnProperty(itemActiveProperty)) {
            // can't use @list container for more than 1 list
            throw new JsonLdError(
              'JSON-LD compact error; property has a "@list" @container ' +
              'rule but there is more than a single @list that matches ' +
              'the compacted term in the document. Compaction might mix ' +
              'unwanted items into the list.',
              'jsonld.SyntaxError', {code: 'compaction to list of lists'});
          }
        }

        // Graph object compaction cases
        if(isGraph) {
          if(container.includes('@graph') && (container.includes('@id') ||
            container.includes('@index') && _isSimpleGraph(expandedItem))) {
            // get or create the map object
            let mapObject;
            if(nestResult.hasOwnProperty(itemActiveProperty)) {
              mapObject = nestResult[itemActiveProperty];
            } else {
              nestResult[itemActiveProperty] = mapObject = {};
            }

            // index on @id or @index or alias of @none
            const key = (container.includes('@id') ?
              expandedItem['@id'] : expandedItem['@index']) ||
              api.compactIri({activeCtx, iri: '@none', vocab: true});
            // add compactedItem to map, using value of `@id` or a new blank
            // node identifier

            _addValue(
              mapObject, key, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          } else if(container.includes('@graph') &&
            _isSimpleGraph(expandedItem)) {
            // container includes @graph but not @id or @index and value is a
            // simple graph object add compact value
            _addValue(
              nestResult, itemActiveProperty, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          } else {
            // wrap using @graph alias, remove array if only one item and
            // compactArrays not set
            if(_isArray(compactedItem) && compactedItem.length === 1 &&
              options.compactArrays) {
              compactedItem = compactedItem[0];
            }
            compactedItem = {
              [api.compactIri({
                activeCtx,
                iri: '@graph',
                relativeTo: {vocab: true}
              })]: compactedItem
            };

            // include @id from expanded graph, if any
            if('@id' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@id',
                relativeTo: {vocab: true}
              })] = expandedItem['@id'];
            }

            // include @index from expanded graph, if any
            if('@index' in expandedItem) {
              compactedItem[api.compactIri({
                activeCtx,
                iri: '@index',
                relativeTo: {vocab: true}
              })] = expandedItem['@index'];
            }
            _addValue(
              nestResult, itemActiveProperty, compactedItem, {
                propertyIsArray:
                  (!options.compactArrays || container.includes('@set'))
              });
          }
        } else if(container.includes('@language') ||
          container.includes('@index') || container.includes('@id') ||
          container.includes('@type')) {
          // handle language and index maps
          // get or create the map object
          let mapObject;
          if(nestResult.hasOwnProperty(itemActiveProperty)) {
            mapObject = nestResult[itemActiveProperty];
          } else {
            nestResult[itemActiveProperty] = mapObject = {};
          }

          let key;
          if(container.includes('@language')) {
          // if container is a language map, simplify compacted value to
          // a simple string
            if(_isValue(compactedItem)) {
              compactedItem = compactedItem['@value'];
            }
            key = expandedItem['@language'];
          } else if(container.includes('@index')) {
            key = expandedItem['@index'];
          } else if(container.includes('@id')) {
            const idKey = api.compactIri({activeCtx, iri: '@id', vocab: true});
            key = compactedItem[idKey];
            delete compactedItem[idKey];
          } else if(container.includes('@type')) {
            const typeKey = api.compactIri({
              activeCtx,
              iri: '@type',
              vocab: true
            });
            let types;
            [key, ...types] = _asArray(compactedItem[typeKey] || []);
            switch(types.length) {
              case 0:
                delete compactedItem[typeKey];
                break;
              case 1:
                compactedItem[typeKey] = types[0];
                break;
              default:
                compactedItem[typeKey] = types;
                break;
            }
          }

          // if compacting this value which has no key, index on @none
          if(!key) {
            key = api.compactIri({activeCtx, iri: '@none', vocab: true});
          }
          // add compact value to map object using key from expanded value
          // based on the container type
          _addValue(
            mapObject, key, compactedItem, {
              propertyIsArray: container.includes('@set')
            });
        } else {
          // use an array if: compactArrays flag is false,
          // @container is @set or @list , value is an empty
          // array, or key is @graph
          const isArray = (!options.compactArrays ||
            container.includes('@set') || container.includes('@list') ||
            (_isArray(compactedItem) && compactedItem.length === 0) ||
            expandedProperty === '@list' || expandedProperty === '@graph');

          // add compact value
          _addValue(
            nestResult, itemActiveProperty, compactedItem,
            {propertyIsArray: isArray});
        }
      }
    }

    return rval;
  }

  // only primitives remain which are already compact
  return element;
};

/**
 * Compacts an IRI or keyword into a term or prefix if it can be. If the
 * IRI has an associated value it may be passed.
 *
 * @param activeCtx the active context to use.
 * @param iri the IRI to compact.
 * @param value the value to check or null.
 * @param relativeTo options for how to compact IRIs:
 *          vocab: true to split after @vocab, false not to.
 * @param reverse true if a reverse property is being compacted, false if not.
 *
 * @return the compacted term, prefix, keyword alias, or the original IRI.
 */
api.compactIri = ({
  activeCtx,
  iri,
  value = null,
  relativeTo = {vocab: false},
  reverse = false
}) => {
  // can't compact null
  if(iri === null) {
    return iri;
  }

  // if context is from a property term scoped context composed with a
  // type-scoped context, then use the previous context instead
  if(activeCtx.isPropertyTermScoped && activeCtx.previousContext) {
    activeCtx = activeCtx.previousContext;
  }

  const inverseCtx = activeCtx.getInverse();

  // if term is a keyword, it may be compacted to a simple alias
  if(_isKeyword(iri) &&
    iri in inverseCtx &&
    '@none' in inverseCtx[iri] &&
    '@type' in inverseCtx[iri]['@none'] &&
    '@none' in inverseCtx[iri]['@none']['@type']) {
    return inverseCtx[iri]['@none']['@type']['@none'];
  }

  // use inverse context to pick a term if iri is relative to vocab
  if(relativeTo.vocab && iri in inverseCtx) {
    const defaultLanguage = activeCtx['@language'] || '@none';

    // prefer @index if available in value
    const containers = [];
    if(_isObject(value) && '@index' in value && !('@graph' in value)) {
      containers.push('@index', '@index@set');
    }

    // if value is a preserve object, use its value
    if(_isObject(value) && '@preserve' in value) {
      value = value['@preserve'][0];
    }

    // prefer most specific container including @graph, prefering @set
    // variations
    if(_isGraph(value)) {
      // favor indexmap if the graph is indexed
      if('@index' in value) {
        containers.push(
          '@graph@index', '@graph@index@set', '@index', '@index@set');
      }
      // favor idmap if the graph is has an @id
      if('@id' in value) {
        containers.push(
          '@graph@id', '@graph@id@set');
      }
      containers.push('@graph', '@graph@set', '@set');
      // allow indexmap if the graph is not indexed
      if(!('@index' in value)) {
        containers.push(
          '@graph@index', '@graph@index@set', '@index', '@index@set');
      }
      // allow idmap if the graph does not have an @id
      if(!('@id' in value)) {
        containers.push('@graph@id', '@graph@id@set');
      }
    } else if(_isObject(value) && !_isValue(value)) {
      containers.push('@id', '@id@set', '@type', '@set@type');
    }

    // defaults for term selection based on type/language
    let typeOrLanguage = '@language';
    let typeOrLanguageValue = '@null';

    if(reverse) {
      typeOrLanguage = '@type';
      typeOrLanguageValue = '@reverse';
      containers.push('@set');
    } else if(_isList(value)) {
      // choose the most specific term that works for all elements in @list
      // only select @list containers if @index is NOT in value
      if(!('@index' in value)) {
        containers.push('@list');
      }
      const list = value['@list'];
      if(list.length === 0) {
        // any empty list can be matched against any term that uses the
        // @list container regardless of @type or @language
        typeOrLanguage = '@any';
        typeOrLanguageValue = '@none';
      } else {
        let commonLanguage = (list.length === 0) ? defaultLanguage : null;
        let commonType = null;
        for(let i = 0; i < list.length; ++i) {
          const item = list[i];
          let itemLanguage = '@none';
          let itemType = '@none';
          if(_isValue(item)) {
            if('@language' in item) {
              itemLanguage = item['@language'];
            } else if('@type' in item) {
              itemType = item['@type'];
            } else {
              // plain literal
              itemLanguage = '@null';
            }
          } else {
            itemType = '@id';
          }
          if(commonLanguage === null) {
            commonLanguage = itemLanguage;
          } else if(itemLanguage !== commonLanguage && _isValue(item)) {
            commonLanguage = '@none';
          }
          if(commonType === null) {
            commonType = itemType;
          } else if(itemType !== commonType) {
            commonType = '@none';
          }
          // there are different languages and types in the list, so choose
          // the most generic term, no need to keep iterating the list
          if(commonLanguage === '@none' && commonType === '@none') {
            break;
          }
        }
        commonLanguage = commonLanguage || '@none';
        commonType = commonType || '@none';
        if(commonType !== '@none') {
          typeOrLanguage = '@type';
          typeOrLanguageValue = commonType;
        } else {
          typeOrLanguageValue = commonLanguage;
        }
      }
    } else {
      if(_isValue(value)) {
        if('@language' in value && !('@index' in value)) {
          containers.push('@language', '@language@set');
          typeOrLanguageValue = value['@language'];
        } else if('@type' in value) {
          typeOrLanguage = '@type';
          typeOrLanguageValue = value['@type'];
        }
      } else {
        typeOrLanguage = '@type';
        typeOrLanguageValue = '@id';
      }
      containers.push('@set');
    }

    // do term selection
    containers.push('@none');

    // an index map can be used to index values using @none, so add as a low
    // priority
    if(_isObject(value) && !('@index' in value)) {
      // allow indexing even if no @index present
      containers.push('@index', '@index@set');
    }

    // values without type or language can use @language map
    if(_isValue(value) && Object.keys(value).length === 1) {
      // allow indexing even if no @index present
      containers.push('@language', '@language@set');
    }

    const term = _selectTerm(
      activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue);
    if(term !== null) {
      return term;
    }
  }

  // no term match, use @vocab if available
  if(relativeTo.vocab) {
    if('@vocab' in activeCtx) {
      // determine if vocab is a prefix of the iri
      const vocab = activeCtx['@vocab'];
      if(iri.indexOf(vocab) === 0 && iri !== vocab) {
        // use suffix as relative iri if it is not a term in the active context
        const suffix = iri.substr(vocab.length);
        if(!activeCtx.mappings.has(suffix)) {
          return suffix;
        }
      }
    }
  }

  // no term or @vocab match, check for possible CURIEs
  let choice = null;
  // TODO: make FastCurieMap a class with a method to do this lookup
  const partialMatches = [];
  let iriMap = activeCtx.fastCurieMap;
  // check for partial matches of against `iri`, which means look until
  // iri.length - 1, not full length
  const maxPartialLength = iri.length - 1;
  for(let i = 0; i < maxPartialLength && iri[i] in iriMap; ++i) {
    iriMap = iriMap[iri[i]];
    if('' in iriMap) {
      partialMatches.push(iriMap[''][0]);
    }
  }
  // check partial matches in reverse order to prefer longest ones first
  for(let i = partialMatches.length - 1; i >= 0; --i) {
    const entry = partialMatches[i];
    const terms = entry.terms;
    for(const term of terms) {
      // a CURIE is usable if:
      // 1. it has no mapping, OR
      // 2. value is null, which means we're not compacting an @value, AND
      //   the mapping matches the IRI
      const curie = term + ':' + iri.substr(entry.iri.length);
      const isUsableCurie = (activeCtx.mappings.get(term)._prefix &&
        (!activeCtx.mappings.has(curie) ||
        (value === null && activeCtx.mappings.get(curie)['@id'] === iri)));

      // select curie if it is shorter or the same length but lexicographically
      // less than the current choice
      if(isUsableCurie && (choice === null ||
        _compareShortestLeast(curie, choice) < 0)) {
        choice = curie;
      }
    }
  }

  // return chosen curie
  if(choice !== null) {
    return choice;
  }

  // compact IRI relative to base
  if(!relativeTo.vocab) {
    return _removeBase(activeCtx['@base'], iri);
  }

  // return IRI as is
  return iri;
};

/**
 * Performs value compaction on an object with '@value' or '@id' as the only
 * property.
 *
 * @param activeCtx the active context.
 * @param activeProperty the active property that points to the value.
 * @param value the value to compact.
 * @param {Object} [options] - processing options.
 *
 * @return the compaction result.
 */
api.compactValue = ({activeCtx, activeProperty, value, options}) => {
  // value is a @value
  if(_isValue(value)) {
    // get context rules
    const type = _getContextValue(activeCtx, activeProperty, '@type');
    const language = _getContextValue(activeCtx, activeProperty, '@language');
    const container =
      _getContextValue(activeCtx, activeProperty, '@container') || [];

    // whether or not the value has an @index that must be preserved
    const preserveIndex = '@index' in value && !container.includes('@index');

    // if there's no @index to preserve ...
    if(!preserveIndex) {
      // matching @type or @language specified in context, compact value
      if(value['@type'] === type || value['@language'] === language) {
        return value['@value'];
      }
    }

    // return just the value of @value if all are true:
    // 1. @value is the only key or @index isn't being preserved
    // 2. there is no default language or @value is not a string or
    //   the key has a mapping with a null @language
    const keyCount = Object.keys(value).length;
    const isValueOnlyKey = (keyCount === 1 ||
      (keyCount === 2 && '@index' in value && !preserveIndex));
    const hasDefaultLanguage = ('@language' in activeCtx);
    const isValueString = _isString(value['@value']);
    const hasNullMapping = (activeCtx.mappings.has(activeProperty) &&
      activeCtx.mappings.get(activeProperty)['@language'] === null);
    if(isValueOnlyKey &&
      (!hasDefaultLanguage || !isValueString || hasNullMapping)) {
      return value['@value'];
    }

    const rval = {};

    // preserve @index
    if(preserveIndex) {
      rval[api.compactIri({
        activeCtx,
        iri: '@index',
        relativeTo: {vocab: true}
      })] = value['@index'];
    }

    if('@type' in value) {
      // compact @type IRI
      rval[api.compactIri({
        activeCtx,
        iri: '@type',
        relativeTo: {vocab: true}
      })] = api.compactIri(
        {activeCtx, iri: value['@type'], relativeTo: {vocab: true}});
    } else if('@language' in value) {
      // alias @language
      rval[api.compactIri({
        activeCtx,
        iri: '@language',
        relativeTo: {vocab: true}
      })] = value['@language'];
    }

    // alias @value
    rval[api.compactIri({
      activeCtx,
      iri: '@value',
      relativeTo: {vocab: true}
    })] = value['@value'];

    return rval;
  }

  // value is a subject reference
  const expandedProperty = _expandIri(activeCtx, activeProperty, {vocab: true},
    options);
  const type = _getContextValue(activeCtx, activeProperty, '@type');
  const compacted = api.compactIri(
    {activeCtx, iri: value['@id'], relativeTo: {vocab: type === '@vocab'}});

  // compact to scalar
  if(type === '@id' || type === '@vocab' || expandedProperty === '@graph') {
    return compacted;
  }

  return {
    [api.compactIri({
      activeCtx,
      iri: '@id',
      relativeTo: {vocab: true}
    })]: compacted
  };
};

/**
 * Removes the @preserve keywords as the last step of the compaction
 * algorithm when it is running on framed output.
 *
 * @param ctx the active context used to compact the input.
 * @param input the framed, compacted output.
 * @param options the compaction options used.
 *
 * @return the resulting output.
 */
api.removePreserve = (ctx, input, options) => {
  // recurse through arrays
  if(_isArray(input)) {
    const output = [];
    for(let i = 0; i < input.length; ++i) {
      const result = api.removePreserve(ctx, input[i], options);
      // drop nulls from arrays
      if(result !== null) {
        output.push(result);
      }
    }
    input = output;
  } else if(_isObject(input)) {
    // remove @preserve
    if('@preserve' in input) {
      if(input['@preserve'] === '@null') {
        return null;
      }
      return input['@preserve'];
    }

    // skip @values
    if(_isValue(input)) {
      return input;
    }

    // recurse through @lists
    if(_isList(input)) {
      input['@list'] = api.removePreserve(ctx, input['@list'], options);
      return input;
    }

    // handle in-memory linked nodes
    const idAlias = api.compactIri({
      activeCtx: ctx,
      iri: '@id',
      relativeTo: {vocab: true}
    });
    if(input.hasOwnProperty(idAlias)) {
      const id = input[idAlias];
      if(options.link.hasOwnProperty(id)) {
        const idx = options.link[id].indexOf(input);
        if(idx !== -1) {
          // already visited
          return options.link[id][idx];
        }
        // prevent circular visitation
        options.link[id].push(input);
      } else {
        // prevent circular visitation
        options.link[id] = [input];
      }
    }

    // recurse through properties
    const graphAlias = api.compactIri({
      activeCtx: ctx,
      iri: '@graph',
      relativeTo: {vocab: true}
    });
    for(const prop in input) {
      // potentially remove the id, if it is an unreference bnode
      if(prop === idAlias && options.bnodesToClear.includes(input[prop])) {
        delete input[idAlias];
        continue;
      }

      let result = api.removePreserve(ctx, input[prop], options);
      const container = _getContextValue(ctx, prop, '@container') || [];
      if(options.compactArrays && _isArray(result) && result.length === 1 &&
        container.length === 0 && prop !== graphAlias) {
        result = result[0];
      }
      input[prop] = result;
    }
  }
  return input;
};

/**
 * Picks the preferred compaction term from the given inverse context entry.
 *
 * @param activeCtx the active context.
 * @param iri the IRI to pick the term for.
 * @param value the value to pick the term for.
 * @param containers the preferred containers.
 * @param typeOrLanguage either '@type' or '@language'.
 * @param typeOrLanguageValue the preferred value for '@type' or '@language'.
 *
 * @return the preferred term.
 */
function _selectTerm(
  activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue) {
  if(typeOrLanguageValue === null) {
    typeOrLanguageValue = '@null';
  }

  // preferences for the value of @type or @language
  const prefs = [];

  // determine prefs for @id based on whether or not value compacts to a term
  if((typeOrLanguageValue === '@id' || typeOrLanguageValue === '@reverse') &&
    _isSubjectReference(value)) {
    // prefer @reverse first
    if(typeOrLanguageValue === '@reverse') {
      prefs.push('@reverse');
    }
    // try to compact value to a term
    const term = api.compactIri(
      {activeCtx, iri: value['@id'], relativeTo: {vocab: true}});
    if(activeCtx.mappings.has(term) &&
      activeCtx.mappings.get(term) &&
      activeCtx.mappings.get(term)['@id'] === value['@id']) {
      // prefer @vocab
      prefs.push.apply(prefs, ['@vocab', '@id']);
    } else {
      // prefer @id
      prefs.push.apply(prefs, ['@id', '@vocab']);
    }
  } else {
    prefs.push(typeOrLanguageValue);
  }
  prefs.push('@none');

  const containerMap = activeCtx.inverse[iri];
  for(let ci = 0; ci < containers.length; ++ci) {
    // if container not available in the map, continue
    const container = containers[ci];
    if(!(container in containerMap)) {
      continue;
    }

    const typeOrLanguageValueMap = containerMap[container][typeOrLanguage];
    for(let pi = 0; pi < prefs.length; ++pi) {
      // if type/language option not available in the map, continue
      const pref = prefs[pi];
      if(!(pref in typeOrLanguageValueMap)) {
        continue;
      }

      // select term
      return typeOrLanguageValueMap[pref];
    }
  }

  return null;
}

/**
 * The value of `@nest` in the term definition must either be `@nest`, or a term
 * which resolves to `@nest`.
 *
 * @param activeCtx the active context.
 * @param nestProperty a term in the active context or `@nest`.
 * @param {Object} [options] - processing options.
 */
function _checkNestProperty(activeCtx, nestProperty, options) {
  if(_expandIri(activeCtx, nestProperty, {vocab: true}, options) !== '@nest') {
    throw new JsonLdError(
      'JSON-LD compact error; nested property must have an @nest value ' +
      'resolving to @nest.',
      'jsonld.SyntaxError', {code: 'invalid @nest value'});
  }
}

},{"./JsonLdError":3,"./context":10,"./graphTypes":17,"./types":21,"./url":22,"./util":23}],9:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const XSD = 'http://www.w3.org/2001/XMLSchema#';

module.exports = {
  LINK_HEADER_REL: 'http://www.w3.org/ns/json-ld#context',

  RDF,
  RDF_LIST: RDF + 'List',
  RDF_FIRST: RDF + 'first',
  RDF_REST: RDF + 'rest',
  RDF_NIL: RDF + 'nil',
  RDF_TYPE: RDF + 'type',
  RDF_PLAIN_LITERAL: RDF + 'PlainLiteral',
  RDF_XML_LITERAL: RDF + 'XMLLiteral',
  RDF_OBJECT: RDF + 'object',
  RDF_LANGSTRING: RDF + 'langString',

  XSD,
  XSD_BOOLEAN: XSD + 'boolean',
  XSD_DOUBLE: XSD + 'double',
  XSD_INTEGER: XSD + 'integer',
  XSD_STRING: XSD + 'string',
};

},{}],10:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = require('./util');
const ActiveContextCache = require('./ActiveContextCache');
const JsonLdError = require('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString,
  isUndefined: _isUndefined
} = require('./types');

const {
  isAbsolute: _isAbsoluteIri,
  isRelative: _isRelativeIri,
  prependBase,
  parse: parseUrl
} = require('./url');

const {
  asArray: _asArray,
  compareShortestLeast: _compareShortestLeast
} = require('./util');

const MAX_CONTEXT_URLS = 10;

const INITIAL_CONTEXT_CACHE = new Map();
const INITIAL_CONTEXT_CACHE_MAX_SIZE = 10000;

const api = {};
module.exports = api;

api.cache = new ActiveContextCache();

/**
 * Processes a local context and returns a new active context.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param options the context processing options.
 * @param isPropertyTermScopedContext `true` if `localCtx` is a scoped context
 *   from a property term.
 * @param isTypeScopedContext `true` if `localCtx` is a scoped context
 *   from a type.
 *
 * @return the new active context.
 */
api.process = ({
  activeCtx, localCtx, options,
  isPropertyTermScopedContext = false,
  isTypeScopedContext = false
}) => {
  // normalize local context to an array of @context objects
  if(_isObject(localCtx) && '@context' in localCtx &&
    _isArray(localCtx['@context'])) {
    localCtx = localCtx['@context'];
  }
  const ctxs = _asArray(localCtx);

  // no contexts in array, return current active context w/o changes
  if(ctxs.length === 0) {
    return activeCtx;
  }

  // track the previous context
  const previousContext = activeCtx.previousContext || activeCtx;

  // if context is property scoped and there's a previous context, amend it,
  // not the current one
  if(isPropertyTermScopedContext && activeCtx.previousContext) {
    // TODO: consider optimizing to a shallow copy
    activeCtx = activeCtx.clone();
    activeCtx.isPropertyTermScoped = true;
    activeCtx.previousContext = api.process({
      activeCtx: activeCtx.previousContext,
      localCtx: ctxs,
      options,
      isPropertyTermScopedContext
    });
    return activeCtx;
  }

  // process each context in order, update active context
  // on each iteration to ensure proper caching
  let rval = activeCtx;
  for(let i = 0; i < ctxs.length; ++i) {
    let ctx = ctxs[i];

    // update active context to one computed from last iteration
    activeCtx = rval;

    // reset to initial context
    if(ctx === null) {
      // We can't nullify if there are protected terms and we're
      // not processing a property term scoped context
      if(!isPropertyTermScopedContext &&
        Object.keys(activeCtx.protected).length !== 0) {
        const protectedMode = (options && options.protectedMode) || 'error';
        if(protectedMode === 'error') {
          throw new JsonLdError(
            'Tried to nullify a context with protected terms outside of ' +
            'a term definition.',
            'jsonld.SyntaxError',
            {code: 'invalid context nullification'});
        } else if(protectedMode === 'warn') {
          // FIXME: remove logging and use a handler
          console.warn('WARNING: invalid context nullification');
          const oldActiveCtx = activeCtx;
          // copy all protected term definitions to fresh initial context
          rval = activeCtx = api.getInitialContext(options).clone();
          for(const [term, _protected] of
            Object.entries(oldActiveCtx.protected)) {
            if(_protected) {
              activeCtx.mappings[term] =
                util.clone(oldActiveCtx.mappings[term]);
            }
          }
          activeCtx.protected = util.clone(oldActiveCtx.protected);

          // cache result
          if(api.cache) {
            api.cache.set(oldActiveCtx, ctx, rval);
          }

          continue;
        }
        throw new JsonLdError(
          'Invalid protectedMode.',
          'jsonld.SyntaxError',
          {code: 'invalid protected mode', context: localCtx, protectedMode});
      }
      rval = activeCtx = api.getInitialContext(options).clone();
      // if context is type-scoped, ensure previous context has been set
      if(isTypeScopedContext) {
        rval.previousContext = previousContext.clone();
      }
      continue;
    }

    // get context from cache if available
    if(api.cache) {
      const cached = api.cache.get(activeCtx, ctx);
      if(cached) {
        rval = activeCtx = cached;
        continue;
      }
    }

    // dereference @context key if present
    if(_isObject(ctx) && '@context' in ctx) {
      ctx = ctx['@context'];
    }

    // context must be an object by now, all URLs retrieved before this call
    if(!_isObject(ctx)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context must be an object.',
        'jsonld.SyntaxError', {code: 'invalid local context', context: ctx});
    }

    // TODO: there is likely a `preivousContext` cloning optimization that
    // could be applied here (no need to copy it under certain conditions)

    // clone context before updating it
    rval = rval.clone();

    // define context mappings for keys in local context
    const defined = new Map();

    // handle @version
    if('@version' in ctx) {
      if(ctx['@version'] !== 1.1) {
        throw new JsonLdError(
          'Unsupported JSON-LD version: ' + ctx['@version'],
          'jsonld.UnsupportedVersion',
          {code: 'invalid @version value', context: ctx});
      }
      if(activeCtx.processingMode &&
        activeCtx.processingMode === 'json-ld-1.0') {
        throw new JsonLdError(
          '@version: ' + ctx['@version'] + ' not compatible with ' +
          activeCtx.processingMode,
          'jsonld.ProcessingModeConflict',
          {code: 'processing mode conflict', context: ctx});
      }
      rval.processingMode = 'json-ld-1.1';
      rval['@version'] = ctx['@version'];
      defined.set('@version', true);
    }

    // if not set explicitly, set processingMode to "json-ld-1.0"
    rval.processingMode =
      rval.processingMode || activeCtx.processingMode || 'json-ld-1.0';

    // handle @base
    if('@base' in ctx) {
      let base = ctx['@base'];

      if(base === null) {
        // no action
      } else if(_isAbsoluteIri(base)) {
        base = parseUrl(base);
      } else if(_isRelativeIri(base)) {
        base = parseUrl(prependBase(activeCtx['@base'].href, base));
      } else {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@base" in a ' +
          '@context must be an absolute IRI, a relative IRI, or null.',
          'jsonld.SyntaxError', {code: 'invalid base IRI', context: ctx});
      }

      rval['@base'] = base;
      defined.set('@base', true);
    }

    // handle @vocab
    if('@vocab' in ctx) {
      const value = ctx['@vocab'];
      if(value === null) {
        delete rval['@vocab'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else if(!_isAbsoluteIri(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be an absolute IRI.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else {
        rval['@vocab'] = value;
      }
      defined.set('@vocab', true);
    }

    // handle @language
    if('@language' in ctx) {
      const value = ctx['@language'];
      if(value === null) {
        delete rval['@language'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@language" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError',
          {code: 'invalid default language', context: ctx});
      } else {
        rval['@language'] = value.toLowerCase();
      }
      defined.set('@language', true);
    }

    // handle @protected; determine whether this sub-context is declaring
    // all its terms to be "protected" (exceptions can be made on a
    // per-definition basis)
    defined.set('@protected', ctx['@protected'] || false);

    // process all other keys
    for(const key in ctx) {
      api.createTermDefinition(
        rval, ctx, key, defined, options,
        isPropertyTermScopedContext);
    }

    // if context is type-scoped, ensure previous context has been set
    if(isTypeScopedContext && !rval.previousContext) {
      rval.previousContext = previousContext.clone();
    }

    // cache result
    if(api.cache) {
      api.cache.set(activeCtx, ctx, rval);
    }
  }

  return rval;
};

/**
 * Creates a term definition during context processing.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context being processed.
 * @param term the term in the local context to define the mapping for.
 * @param defined a map of defining/defined keys to detect cycles and prevent
 *          double definitions.
 * @param {Object} [options] - creation options.
 * @param {string} [options.protectedMode="error"] - "error" to throw error
 *   on `@protected` constraint violation, "warn" to allow violations and
 *   signal a warning.
 * @param isPropertyTermScopedContext `true` if `localCtx` is a scoped context
 *   from a property term.
 */
api.createTermDefinition = (
  activeCtx, localCtx, term, defined, options,
  isPropertyTermScopedContext = false) => {
  if(defined.has(term)) {
    // term already defined
    if(defined.get(term)) {
      return;
    }
    // cycle detected
    throw new JsonLdError(
      'Cyclical context definition detected.',
      'jsonld.CyclicalContext',
      {code: 'cyclic IRI mapping', context: localCtx, term});
  }

  // now defining term
  defined.set(term, false);

  if(api.isKeyword(term)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; keywords cannot be overridden.',
      'jsonld.SyntaxError',
      {code: 'keyword redefinition', context: localCtx, term});
  }

  if(term === '') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a term cannot be an empty string.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // keep reference to previous mapping for potential `@protected` check
  const previousMapping = activeCtx.mappings.get(term);

  // remove old mapping
  if(activeCtx.mappings.has(term)) {
    activeCtx.mappings.delete(term);
  }

  // get context term value
  let value;
  if(localCtx.hasOwnProperty(term)) {
    value = localCtx[term];
  }

  // clear context entry
  if(value === null || (_isObject(value) && value['@id'] === null)) {
    activeCtx.mappings.set(term, null);
    defined.set(term, true);
    return;
  }

  // convert short-hand value to object w/@id
  let simpleTerm = false;
  if(_isString(value)) {
    simpleTerm = true;
    value = {'@id': value};
  }

  if(!_isObject(value)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context term values must be ' +
      'strings or objects.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // create new mapping
  const mapping = {};
  activeCtx.mappings.set(term, mapping);
  mapping.reverse = false;

  // make sure term definition only has expected keywords
  const validKeys = ['@container', '@id', '@language', '@reverse', '@type'];

  // JSON-LD 1.1 support
  if(api.processingMode(activeCtx, 1.1)) {
    validKeys.push('@context', '@nest', '@prefix', '@protected');
  }

  for(const kw in value) {
    if(!validKeys.includes(kw)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a term definition must not contain ' + kw,
        'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
  }

  // always compute whether term has a colon as an optimization for
  // _compactIri
  const colon = term.indexOf(':');
  mapping._termHasColon = (colon !== -1);

  if('@reverse' in value) {
    if('@id' in value) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @reverse term definition must not ' +
        'contain @id.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }
    if('@nest' in value) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @reverse term definition must not ' +
        'contain @nest.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }
    const reverse = value['@reverse'];
    if(!_isString(reverse)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }

    // expand and add @id mapping
    const id = _expandIri(
      activeCtx, reverse, {vocab: true, base: false}, localCtx, defined,
      options);
    if(!_isAbsoluteIri(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be an ' +
        'absolute IRI or a blank node identifier.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }
    mapping['@id'] = id;
    mapping.reverse = true;
  } else if('@id' in value) {
    let id = value['@id'];
    if(!_isString(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @id value must be an array ' +
        'of strings or a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }
    if(id !== term) {
      // expand and add @id mapping
      id = _expandIri(
        activeCtx, id, {vocab: true, base: false}, localCtx, defined, options);
      if(!_isAbsoluteIri(id) && !api.isKeyword(id)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a @context @id value must be an ' +
          'absolute IRI, a blank node identifier, or a keyword.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx});
      }
      mapping['@id'] = id;
      // indicate if this term may be used as a compact IRI prefix
      mapping._prefix = (!mapping._termHasColon &&
        id.match(/[:\/\?#\[\]@]$/) &&
        (simpleTerm || api.processingMode(activeCtx, 1.0)));
    }
  }

  if(!('@id' in mapping)) {
    // see if the term has a prefix
    if(mapping._termHasColon) {
      const prefix = term.substr(0, colon);
      if(localCtx.hasOwnProperty(prefix)) {
        // define parent prefix
        api.createTermDefinition(activeCtx, localCtx, prefix, defined, options);
      }

      if(activeCtx.mappings.has(prefix)) {
        // set @id based on prefix parent
        const suffix = term.substr(colon + 1);
        mapping['@id'] = activeCtx.mappings.get(prefix)['@id'] + suffix;
      } else {
        // term is an absolute IRI
        mapping['@id'] = term;
      }
    } else {
      // non-IRIs *must* define @ids if @vocab is not available
      if(!('@vocab' in activeCtx)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @context terms must define an @id.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx, term});
      }
      // prepend vocab to term
      mapping['@id'] = activeCtx['@vocab'] + term;
    }
  }

  // Handle term protection
  if(value['@protected'] === true ||
    (defined.get('@protected') === true && value['@protected'] !== false)) {
    activeCtx.protected[term] = true;
    mapping.protected = true;
  }

  // IRI mapping now defined
  defined.set(term, true);

  if('@type' in value) {
    let type = value['@type'];
    if(!_isString(type)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an @context @type value must be a string.',
        'jsonld.SyntaxError',
        {code: 'invalid type mapping', context: localCtx});
    }

    if(type !== '@id' && type !== '@vocab') {
      // expand @type to full IRI
      type = _expandIri(
        activeCtx, type, {vocab: true, base: false}, localCtx, defined,
        options);
      if(!_isAbsoluteIri(type)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must be an ' +
          'absolute IRI.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
      if(type.indexOf('_:') === 0) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must be an IRI, ' +
          'not a blank node identifier.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
    }

    // add @type to mapping
    mapping['@type'] = type;
  }

  if('@container' in value) {
    // normalize container to an array form
    const container = _isString(value['@container']) ?
      [value['@container']] : (value['@container'] || []);
    const validContainers = ['@list', '@set', '@index', '@language'];
    let isValid = true;
    const hasSet = container.includes('@set');

    // JSON-LD 1.1 support
    if(api.processingMode(activeCtx, 1.1)) {
      validContainers.push('@graph', '@id', '@type');

      // check container length
      if(container.includes('@list')) {
        if(container.length !== 1) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; @context @container with @list must ' +
            'have no other values',
            'jsonld.SyntaxError',
            {code: 'invalid container mapping', context: localCtx});
        }
      } else if(container.includes('@graph')) {
        if(container.some(key =>
          key !== '@graph' && key !== '@id' && key !== '@index' &&
          key !== '@set')) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; @context @container with @graph must ' +
            'have no other values other than @id, @index, and @set',
            'jsonld.SyntaxError',
            {code: 'invalid container mapping', context: localCtx});
        }
      } else {
        // otherwise, container may also include @set
        isValid &= container.length <= (hasSet ? 2 : 1);
      }
    } else {
      // in JSON-LD 1.0, container must not be an array (it must be a string,
      // which is one of the validContainers)
      isValid &= !_isArray(value['@container']);

      // check container length
      isValid &= container.length <= 1;
    }

    // check against valid containers
    isValid &= container.every(c => validContainers.includes(c));

    // @set not allowed with @list
    isValid &= !(hasSet && container.includes('@list'));

    if(!isValid) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value must be ' +
        'one of the following: ' + validContainers.join(', '),
        'jsonld.SyntaxError',
        {code: 'invalid container mapping', context: localCtx});
    }

    if(mapping.reverse &&
      !container.every(c => ['@index', '@set'].includes(c))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value for a @reverse ' +
        'type definition must be @index or @set.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }

    // add @container to mapping
    mapping['@container'] = container;
  }

  // scoped contexts
  if('@context' in value) {
    mapping['@context'] = value['@context'];
  }

  if('@language' in value && !('@type' in value)) {
    let language = value['@language'];
    if(language !== null && !_isString(language)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @language value must be ' +
        'a string or null.', 'jsonld.SyntaxError',
        {code: 'invalid language mapping', context: localCtx});
    }

    // add @language to mapping
    if(language !== null) {
      language = language.toLowerCase();
    }
    mapping['@language'] = language;
  }

  // term may be used as a prefix
  if('@prefix' in value) {
    if(mapping._termHasColon) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @prefix used on a compact IRI term',
        'jsonld.SyntaxError',
        {code: 'invalid term definition', context: localCtx});
    }
    if(typeof value['@prefix'] === 'boolean') {
      mapping._prefix = value['@prefix'] === true;
    } else {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context value for @prefix must be boolean',
        'jsonld.SyntaxError',
        {code: 'invalid @prefix value', context: localCtx});
    }
  }

  if('@nest' in value) {
    const nest = value['@nest'];
    if(!_isString(nest) || (nest !== '@nest' && nest.indexOf('@') === 0)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @nest value must be ' +
        'a string which is not a keyword other than @nest.',
        'jsonld.SyntaxError',
        {code: 'invalid @nest value', context: localCtx});
    }
    mapping['@nest'] = nest;
  }

  // disallow aliasing @context and @preserve
  const id = mapping['@id'];
  if(id === '@context' || id === '@preserve') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context and @preserve cannot be aliased.',
      'jsonld.SyntaxError', {code: 'invalid keyword alias', context: localCtx});
  }

  // FIXME if(1.1) ... ?
  if(previousMapping && previousMapping.protected &&
    !isPropertyTermScopedContext) {
    // force new term to continue to be protected and see if the mappings would
    // be equal
    activeCtx.protected[term] = true;
    mapping.protected = true;
    if(!_deepCompare(previousMapping, mapping)) {
      const protectedMode = (options && options.protectedMode) || 'error';
      if(protectedMode === 'error') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; tried to redefine a protected term.',
          'jsonld.SyntaxError',
          {code: 'protected term redefinition', context: localCtx, term});
      } else if(protectedMode === 'warn') {
        // FIXME: remove logging and use a handler
        console.warn('WARNING: protected term redefinition', {term});
        return;
      }
      throw new JsonLdError(
        'Invalid protectedMode.',
        'jsonld.SyntaxError',
        {code: 'invalid protected mode', context: localCtx, term,
          protectedMode});
    }
  }
};

/**
 * Expands a string to a full IRI. The string may be a term, a prefix, a
 * relative IRI, or an absolute IRI. The associated absolute IRI will be
 * returned.
 *
 * @param activeCtx the current active context.
 * @param value the string to expand.
 * @param relativeTo options for how to resolve relative IRIs:
 *          base: true to resolve against the base IRI, false not to.
 *          vocab: true to concatenate after @vocab, false not to.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
api.expandIri = (activeCtx, value, relativeTo, options) => {
  return _expandIri(activeCtx, value, relativeTo, undefined, undefined,
    options);
};

/**
 * Expands a string to a full IRI. The string may be a term, a prefix, a
 * relative IRI, or an absolute IRI. The associated absolute IRI will be
 * returned.
 *
 * @param activeCtx the current active context.
 * @param value the string to expand.
 * @param relativeTo options for how to resolve relative IRIs:
 *          base: true to resolve against the base IRI, false not to.
 *          vocab: true to concatenate after @vocab, false not to.
 * @param localCtx the local context being processed (only given if called
 *          during context processing).
 * @param defined a map for tracking cycles in context definitions (only given
 *          if called during context processing).
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
function _expandIri(activeCtx, value, relativeTo, localCtx, defined, options) {
  // already expanded
  if(value === null || !_isString(value) || api.isKeyword(value)) {
    return value;
  }

  // define term dependency if not defined
  if(localCtx && localCtx.hasOwnProperty(value) &&
    defined.get(value) !== true) {
    api.createTermDefinition(activeCtx, localCtx, value, defined, options);
  }

  // if context is from a property term scoped context composed with a
  // type-scoped context, then use previous context instead
  if(activeCtx.isPropertyTermScoped && activeCtx.previousContext) {
    activeCtx = activeCtx.previousContext;
  }

  relativeTo = relativeTo || {};
  if(relativeTo.vocab) {
    const mapping = activeCtx.mappings.get(value);

    // value is explicitly ignored with a null mapping
    if(mapping === null) {
      return null;
    }

    if(mapping) {
      // value is a term
      return mapping['@id'];
    }
  }

  // split value into prefix:suffix
  const colon = value.indexOf(':');
  if(colon !== -1) {
    const prefix = value.substr(0, colon);
    const suffix = value.substr(colon + 1);

    // do not expand blank nodes (prefix of '_') or already-absolute
    // IRIs (suffix of '//')
    if(prefix === '_' || suffix.indexOf('//') === 0) {
      return value;
    }

    // prefix dependency not defined, define it
    if(localCtx && localCtx.hasOwnProperty(prefix)) {
      api.createTermDefinition(activeCtx, localCtx, prefix, defined, options);
    }

    // use mapping if prefix is defined
    if(activeCtx.mappings.has(prefix)) {
      const mapping = activeCtx.mappings.get(prefix);
      return mapping['@id'] + suffix;
    }

    // already absolute IRI
    return value;
  }

  // prepend vocab
  if(relativeTo.vocab && '@vocab' in activeCtx) {
    return activeCtx['@vocab'] + value;
  }

  // prepend base
  if(relativeTo.base) {
    return prependBase(activeCtx['@base'], value);
  }

  return value;
}

/**
 * Gets the initial context.
 *
 * @param options the options to use:
 *          [base] the document base IRI.
 *
 * @return the initial context.
 */
api.getInitialContext = options => {
  const base = parseUrl(options.base || '');
  const key = JSON.stringify({base, processingMode: options.processingMode});
  const cached = INITIAL_CONTEXT_CACHE.get(key);
  if(cached) {
    return cached;
  }

  const initialContext = {
    '@base': base,
    processingMode: options.processingMode,
    mappings: new Map(),
    inverse: null,
    getInverse: _createInverseContext,
    clone: _cloneActiveContext,
    revertTypeScopedContext: _revertTypeScopedContext,
    protected: {}
  };
  // TODO: consider using LRU cache instead
  if(INITIAL_CONTEXT_CACHE.size === INITIAL_CONTEXT_CACHE_MAX_SIZE) {
    // clear whole cache -- assumes scenario where the cache fills means
    // the cache isn't being used very efficiently anyway
    INITIAL_CONTEXT_CACHE.clear();
  }
  INITIAL_CONTEXT_CACHE.set(key, initialContext);
  return initialContext;

  /**
   * Generates an inverse context for use in the compaction algorithm, if
   * not already generated for the given active context.
   *
   * @return the inverse context.
   */
  function _createInverseContext() {
    const activeCtx = this;

    // lazily create inverse
    if(activeCtx.inverse) {
      return activeCtx.inverse;
    }
    const inverse = activeCtx.inverse = {};

    // variables for building fast CURIE map
    const fastCurieMap = activeCtx.fastCurieMap = {};
    const irisToTerms = {};

    // handle default language
    const defaultLanguage = activeCtx['@language'] || '@none';

    // create term selections for each mapping in the context, ordered by
    // shortest and then lexicographically least
    const mappings = activeCtx.mappings;
    const terms = [...mappings.keys()].sort(_compareShortestLeast);
    for(const term of terms) {
      const mapping = mappings.get(term);
      if(mapping === null) {
        continue;
      }

      let container = mapping['@container'] || '@none';
      container = [].concat(container).sort().join('');

      // iterate over every IRI in the mapping
      const ids = _asArray(mapping['@id']);
      for(const iri of ids) {
        let entry = inverse[iri];
        const isKeyword = api.isKeyword(iri);

        if(!entry) {
          // initialize entry
          inverse[iri] = entry = {};

          if(!isKeyword && !mapping._termHasColon) {
            // init IRI to term map and fast CURIE prefixes
            irisToTerms[iri] = [term];
            const fastCurieEntry = {iri, terms: irisToTerms[iri]};
            if(iri[0] in fastCurieMap) {
              fastCurieMap[iri[0]].push(fastCurieEntry);
            } else {
              fastCurieMap[iri[0]] = [fastCurieEntry];
            }
          }
        } else if(!isKeyword && !mapping._termHasColon) {
          // add IRI to term match
          irisToTerms[iri].push(term);
        }

        // add new entry
        if(!entry[container]) {
          entry[container] = {
            '@language': {},
            '@type': {},
            '@any': {}
          };
        }
        entry = entry[container];
        _addPreferredTerm(term, entry['@any'], '@none');

        if(mapping.reverse) {
          // term is preferred for values using @reverse
          _addPreferredTerm(term, entry['@type'], '@reverse');
        } else if('@type' in mapping) {
          // term is preferred for values using specific type
          _addPreferredTerm(term, entry['@type'], mapping['@type']);
        } else if('@language' in mapping) {
          // term is preferred for values using specific language
          const language = mapping['@language'] || '@null';
          _addPreferredTerm(term, entry['@language'], language);
        } else {
          // term is preferred for values w/default language or no type and
          // no language
          // add an entry for the default language
          _addPreferredTerm(term, entry['@language'], defaultLanguage);

          // add entries for no type and no language
          _addPreferredTerm(term, entry['@type'], '@none');
          _addPreferredTerm(term, entry['@language'], '@none');
        }
      }
    }

    // build fast CURIE map
    for(const key in fastCurieMap) {
      _buildIriMap(fastCurieMap, key, 1);
    }

    return inverse;
  }

  /**
   * Runs a recursive algorithm to build a lookup map for quickly finding
   * potential CURIEs.
   *
   * @param iriMap the map to build.
   * @param key the current key in the map to work on.
   * @param idx the index into the IRI to compare.
   */
  function _buildIriMap(iriMap, key, idx) {
    const entries = iriMap[key];
    const next = iriMap[key] = {};

    let iri;
    let letter;
    for(const entry of entries) {
      iri = entry.iri;
      if(idx >= iri.length) {
        letter = '';
      } else {
        letter = iri[idx];
      }
      if(letter in next) {
        next[letter].push(entry);
      } else {
        next[letter] = [entry];
      }
    }

    for(const key in next) {
      if(key === '') {
        continue;
      }
      _buildIriMap(next, key, idx + 1);
    }
  }

  /**
   * Adds the term for the given entry if not already added.
   *
   * @param term the term to add.
   * @param entry the inverse context typeOrLanguage entry to add to.
   * @param typeOrLanguageValue the key in the entry to add to.
   */
  function _addPreferredTerm(term, entry, typeOrLanguageValue) {
    if(!entry.hasOwnProperty(typeOrLanguageValue)) {
      entry[typeOrLanguageValue] = term;
    }
  }

  /**
   * Clones an active context, creating a child active context.
   *
   * @return a clone (child) of the active context.
   */
  function _cloneActiveContext() {
    const child = {};
    child['@base'] = this['@base'];
    child.mappings = util.clone(this.mappings);
    child.clone = this.clone;
    child.inverse = null;
    child.getInverse = this.getInverse;
    child.protected = util.clone(this.protected);
    if(this.previousContext) {
      child.isPropertyTermScoped = this.previousContext.isPropertyTermScoped;
      child.previousContext = this.previousContext.clone();
    }
    child.revertTypeScopedContext = this.revertTypeScopedContext;
    if('@language' in this) {
      child['@language'] = this['@language'];
    }
    if('@vocab' in this) {
      child['@vocab'] = this['@vocab'];
    }
    return child;
  }

  /**
   * Reverts any type-scoped context in this active context to the previous
   * context.
   */
  function _revertTypeScopedContext() {
    if(!this.previousContext) {
      return this;
    }
    return this.previousContext.clone();
  }
};

/**
 * Gets the value for the given active context key and type, null if none is
 * set or undefined if none is set and type is '@context'.
 *
 * @param ctx the active context.
 * @param key the context key.
 * @param [type] the type of value to get (eg: '@id', '@type'), if not
 *          specified gets the entire entry for a key, null if not found.
 *
 * @return the value, null, or undefined.
 */
api.getContextValue = (ctx, key, type) => {
  // invalid key
  if(key === null) {
    if(type === '@context') {
      return undefined;
    }
    return null;
  }

  // get specific entry information
  if(ctx.mappings.has(key)) {
    const entry = ctx.mappings.get(key);

    if(_isUndefined(type)) {
      // return whole entry
      return entry;
    }
    if(entry.hasOwnProperty(type)) {
      // return entry value for type
      return entry[type];
    }
  }

  // get default language
  if(type === '@language' && ctx.hasOwnProperty(type)) {
    return ctx[type];
  }

  if(type === '@context') {
    return undefined;
  }
  return null;
};

/**
 * Retrieves external @context URLs using the given document loader. Every
 * instance of @context in the input that refers to a URL will be replaced
 * with the JSON @context found at that URL.
 *
 * @param input the JSON-LD input with possible contexts.
 * @param options the options to use:
 *          documentLoader(url, [callback(err, remoteDoc)]) the document loader.
 * @param callback(err, input) called once the operation completes.
 */
api.getAllContexts = async (input, options) => {
  return _retrieveContextUrls(input, options);
};

/**
 * Processing Mode check.
 *
 * @param activeCtx the current active context.
 * @param version the string or numeric version to check.
 *
 * @return boolean.
 */
api.processingMode = (activeCtx, version) => {
  if(version.toString() >= '1.1') {
    return activeCtx.processingMode &&
      activeCtx.processingMode >= 'json-ld-' + version.toString();
  } else {
    return !activeCtx.processingMode ||
      activeCtx.processingMode === 'json-ld-1.0';
  }
};

/**
 * Returns whether or not the given value is a keyword.
 *
 * @param v the value to check.
 *
 * @return true if the value is a keyword, false if not.
 */
api.isKeyword = v => {
  if(!_isString(v)) {
    return false;
  }
  switch(v) {
    case '@base':
    case '@container':
    case '@context':
    case '@default':
    case '@embed':
    case '@explicit':
    case '@graph':
    case '@id':
    case '@index':
    case '@language':
    case '@list':
    case '@nest':
    case '@none':
    case '@omitDefault':
    case '@prefix':
    case '@preserve':
    case '@protected':
    case '@requireAll':
    case '@reverse':
    case '@set':
    case '@type':
    case '@value':
    case '@version':
    case '@vocab':
      return true;
  }
  return false;
};

async function _retrieveContextUrls(input, options) {
  const documentLoader = util.normalizeDocumentLoader(options.documentLoader);

  // retrieve all @context URLs in input
  await retrieve(input, new Set(), documentLoader);

  return input;

  // recursive function that will retrieve all @context URLs in documents
  async function retrieve(doc, cycles, documentLoader) {
    if(cycles.size > MAX_CONTEXT_URLS) {
      throw new JsonLdError(
        'Maximum number of @context URLs exceeded.',
        'jsonld.ContextUrlError',
        {code: 'loading remote context failed', max: MAX_CONTEXT_URLS});
    }

    // find all URLs in the given document
    const urls = new Map();
    _findContextUrls(doc, urls, false, options.base);
    if(urls.size === 0) {
      return;
    }

    // queue all unretrieved URLs
    const queue = [...urls.keys()].filter(u => urls.get(u) === false);

    // retrieve URLs in queue
    return Promise.all(queue.map(async url => {
      // check for context URL cycle
      if(cycles.has(url)) {
        throw new JsonLdError(
          'Cyclical @context URLs detected.',
          'jsonld.ContextUrlError',
          {code: 'recursive context inclusion', url});
      }

      const _cycles = new Set(cycles);
      _cycles.add(url);
      let remoteDoc;
      let ctx;

      try {
        remoteDoc = await documentLoader(url);
        ctx = remoteDoc.document || null;
        // parse string context as JSON
        if(_isString(ctx)) {
          ctx = JSON.parse(ctx);
        }
      } catch(e) {
        throw new JsonLdError(
          'Dereferencing a URL did not result in a valid JSON-LD object. ' +
          'Possible causes are an inaccessible URL perhaps due to ' +
          'a same-origin policy (ensure the server uses CORS if you are ' +
          'using client-side JavaScript), too many redirects, a ' +
          'non-JSON response, or more than one HTTP Link Header was ' +
          'provided for a remote context.',
          'jsonld.InvalidUrl',
          {code: 'loading remote context failed', url, cause: e});
      }

      // ensure ctx is an object
      if(!_isObject(ctx)) {
        throw new JsonLdError(
          'Dereferencing a URL did not result in a JSON object. The ' +
          'response was valid JSON, but it was not a JSON object.',
          'jsonld.InvalidUrl',
          {code: 'invalid remote context', url});
      }

      // use empty context if no @context key is present
      if(!('@context' in ctx)) {
        ctx = {'@context': {}};
      } else {
        ctx = {'@context': ctx['@context']};
      }

      // append @context URL to context if given
      if(remoteDoc.contextUrl) {
        if(!_isArray(ctx['@context'])) {
          ctx['@context'] = [ctx['@context']];
        }
        ctx['@context'].push(remoteDoc.contextUrl);
      }

      // recurse
      await retrieve(ctx, _cycles, documentLoader);

      // store retrieved context w/replaced @context URLs
      urls.set(url, ctx['@context']);

      // replace all @context URLs in the document
      _findContextUrls(doc, urls, true, options.base);
    }));
  }
}

/**
 * Finds all @context URLs in the given JSON-LD input.
 *
 * @param input the JSON-LD input.
 * @param urls a map of URLs (url => false/@contexts).
 * @param replace true to replace the URLs in the given input with the
 *           @contexts from the urls map, false not to.
 * @param base the base IRI to use to resolve relative IRIs.
 *
 * @return true if new URLs to retrieve were found, false if not.
 */
function _findContextUrls(input, urls, replace, base) {
  if(_isArray(input)) {
    for(const element of input) {
      _findContextUrls(element, urls, replace, base);
    }
    return;
  }

  if(!_isObject(input)) {
    // no @context URLs can be found in non-object input
    return;
  }

  // input is an object
  for(const key in input) {
    if(key !== '@context') {
      _findContextUrls(input[key], urls, replace, base);
      continue;
    }

    // get @context
    const ctx = input[key];

    if(_isArray(ctx)) {
      // array @context
      let length = ctx.length;
      for(let i = 0; i < length; ++i) {
        const _ctx = ctx[i];
        if(_isString(_ctx)) {
          const prepended = prependBase(base, _ctx);
          const resolved = urls.get(prepended);
          // replace w/@context if requested
          if(replace) {
            if(_isArray(resolved)) {
              // add flattened context
              Array.prototype.splice.apply(ctx, [i, 1].concat(resolved));
              i += resolved.length - 1;
              length = ctx.length;
            } else if(resolved !== false) {
              ctx[i] = resolved;
            }
          } else if(resolved === undefined) {
            // @context URL found
            urls.set(prepended, false);
          }
        } else {
          // look for scoped context
          for(const key in _ctx) {
            if(_isObject(_ctx[key])) {
              _findContextUrls(_ctx[key], urls, replace, base);
            }
          }
        }
      }
    } else if(_isString(ctx)) {
      // string @context
      const prepended = prependBase(base, ctx);
      const resolved = urls.get(prepended);
      // replace w/@context if requested
      if(replace) {
        if(resolved !== false) {
          input[key] = resolved;
        }
      } else if(resolved === undefined) {
        // @context URL found
        urls.set(prepended, false);
      }
    } else {
      // look for scoped context
      for(const key in ctx) {
        if(_isObject(ctx[key])) {
          _findContextUrls(ctx[key], urls, replace, base);
        }
      }
    }
  }
}

function _deepCompare(x1, x2) {
  // compare `null` or primitive types directly
  if((!(x1 && typeof x1 === 'object')) ||
     (!(x2 && typeof x2 === 'object'))) {
    return x1 === x2;
  }
  // x1 and x2 are objects (also potentially arrays)
  const x1Array = Array.isArray(x1);
  if(x1Array !== Array.isArray(x2)) {
    return false;
  }
  if(x1Array) {
    if(x1.length !== x2.length) {
      return false;
    }
    for(let i = 0; i < x1.length; ++i) {
      if(!_deepCompare(x1[i], x2[i])) {
        return false;
      }
    }
    return true;
  }
  // x1 and x2 are non-array objects
  const k1s = Object.keys(x1);
  const k2s = Object.keys(x2);
  if(k1s.length !== k2s.length) {
    return false;
  }
  for(const k1 in x1) {
    let v1 = x1[k1];
    let v2 = x2[k1];
    // special case: `@container` can be in any order
    if(k1 === '@container') {
      if(Array.isArray(v1) && Array.isArray(v2)) {
        v1 = v1.slice().sort();
        v2 = v2.slice().sort();
      }
    }
    if(!_deepCompare(v1, v2)) {
      return false;
    }
  }
  return true;
}

},{"./ActiveContextCache":2,"./JsonLdError":3,"./types":21,"./url":22,"./util":23}],11:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {parseLinkHeader, buildHeaders} = require('../util');
const {LINK_HEADER_REL} = require('../constants');
const JsonLdError = require('../JsonLdError');
const RequestQueue = require('../RequestQueue');

/**
 * Creates a built-in node document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          strictSSL: true to require SSL certificates to be valid,
 *            false not to (default: true).
 *          maxRedirects: the maximum number of redirects to permit, none by
 *            default.
 *          request: the object which will make the request, default is
 *            provided by `https://www.npmjs.com/package/request`.
 *          headers: an object (map) of headers which will be passed as request
 *            headers for the requested document. Accept is not allowed.
 *
 * @return the node document loader.
 */
module.exports = ({
  secure,
  strictSSL = true,
  maxRedirects = -1,
  request,
  headers = {}
} = {strictSSL: true, maxRedirects: -1, headers: {}}) => {
  headers = buildHeaders(headers);
  // TODO: use `r2`
  request = request || require('request');
  const http = require('http');
  // TODO: disable cache until HTTP caching implemented
  //const cache = new DocumentCache();

  const queue = new RequestQueue();
  return queue.wrapLoader(function(url) {
    return loadDocument(url, []);
  });

  async function loadDocument(url, redirects) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }
    if(secure && url.indexOf('https') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }
    // TODO: disable cache until HTTP caching implemented
    let doc = null;//cache.get(url);
    if(doc !== null) {
      return doc;
    }

    let result;
    try {
      result = await _request(request, {
        url,
        headers,
        strictSSL,
        followRedirect: false
      });
    } catch(e) {
      throw new JsonLdError(
        'URL could not be dereferenced, an error occurred.',
        'jsonld.LoadDocumentError',
        {code: 'loading document failed', url, cause: e});
    }

    const {res, body} = result;

    doc = {contextUrl: null, documentUrl: url, document: body || null};

    // handle error
    const statusText = http.STATUS_CODES[res.statusCode];
    if(res.statusCode >= 400) {
      throw new JsonLdError(
        'URL could not be dereferenced: ' + statusText,
        'jsonld.InvalidUrl', {
          code: 'loading document failed',
          url,
          httpStatusCode: res.statusCode
        });
    }

    // handle Link Header
    if(res.headers.link &&
      res.headers['content-type'] !== 'application/ld+json') {
      // only 1 related link header permitted
      const linkHeader = parseLinkHeader(res.headers.link)[LINK_HEADER_REL];
      if(Array.isArray(linkHeader)) {
        throw new JsonLdError(
          'URL could not be dereferenced, it has more than one associated ' +
          'HTTP Link Header.',
          'jsonld.InvalidUrl',
          {code: 'multiple context link headers', url});
      }
      if(linkHeader) {
        doc.contextUrl = linkHeader.target;
      }
    }

    // handle redirect
    if(res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      if(redirects.length === maxRedirects) {
        throw new JsonLdError(
          'URL could not be dereferenced; there were too many redirects.',
          'jsonld.TooManyRedirects', {
            code: 'loading document failed',
            url,
            httpStatusCode: res.statusCode,
            redirects
          });
      }
      if(redirects.indexOf(url) !== -1) {
        throw new JsonLdError(
          'URL could not be dereferenced; infinite redirection was detected.',
          'jsonld.InfiniteRedirectDetected', {
            code: 'recursive context inclusion',
            url,
            httpStatusCode: res.statusCode,
            redirects
          });
      }
      redirects.push(url);
      return loadDocument(res.headers.location, redirects);
    }

    // cache for each redirected URL
    redirects.push(url);
    // TODO: disable cache until HTTP caching implemented
    /*
    for(let i = 0; i < redirects.length; ++i) {
      cache.set(
        redirects[i],
        {contextUrl: null, documentUrl: redirects[i], document: body});
    }
    */

    return doc;
  }
};

function _request(request, options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if(err) {
        reject(err);
      } else {
        resolve({res, body});
      }
    });
  });
}

},{"../JsonLdError":3,"../RequestQueue":7,"../constants":9,"../util":23,"http":1,"request":1}],12:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {parseLinkHeader, buildHeaders} = require('../util');
const {LINK_HEADER_REL} = require('../constants');
const JsonLdError = require('../JsonLdError');
const RequestQueue = require('../RequestQueue');

const REGEX_LINK_HEADER = /(^|(\r\n))link:/i;

/**
 * Creates a built-in XMLHttpRequest document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          headers: an object (map) of headers which will be passed as request
 *            headers for the requested document. Accept is not allowed.
 *          [xhr]: the XMLHttpRequest API to use.
 *
 * @return the XMLHttpRequest document loader.
 */
module.exports = ({
  secure,
  headers = {},
  xhr
} = {headers: {}}) => {
  headers = buildHeaders(headers);
  const queue = new RequestQueue();
  return queue.wrapLoader(loader);

  async function loader(url) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }
    if(secure && url.indexOf('https') !== 0) {
      throw new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url});
    }

    let req;
    try {
      req = await _get(xhr, url, headers);
    } catch(e) {
      throw new JsonLdError(
        'URL could not be dereferenced, an error occurred.',
        'jsonld.LoadDocumentError',
        {code: 'loading document failed', url, cause: e});
    }

    if(req.status >= 400) {
      throw new JsonLdError(
        'URL could not be dereferenced: ' + req.statusText,
        'jsonld.LoadDocumentError', {
          code: 'loading document failed',
          url,
          httpStatusCode: req.status
        });
    }

    const doc = {contextUrl: null, documentUrl: url, document: req.response};

    // handle Link Header (avoid unsafe header warning by existence testing)
    const contentType = req.getResponseHeader('Content-Type');
    let linkHeader;
    if(REGEX_LINK_HEADER.test(req.getAllResponseHeaders())) {
      linkHeader = req.getResponseHeader('Link');
    }
    if(linkHeader && contentType !== 'application/ld+json') {
      // only 1 related link header permitted
      linkHeader = parseLinkHeader(linkHeader)[LINK_HEADER_REL];
      if(Array.isArray(linkHeader)) {
        throw new JsonLdError(
          'URL could not be dereferenced, it has more than one ' +
          'associated HTTP Link Header.',
          'jsonld.InvalidUrl',
          {code: 'multiple context link headers', url});
      }
      if(linkHeader) {
        doc.contextUrl = linkHeader.target;
      }
    }

    return doc;
  }
};

function _get(xhr, url, headers) {
  xhr = xhr || XMLHttpRequest;
  const req = new xhr();
  return new Promise((resolve, reject) => {
    req.onload = () => resolve(req);
    req.onerror = err => reject(err);
    req.open('GET', url, true);
    for(const k in headers) {
      req.setRequestHeader(k, headers[k]);
    }
    req.send();
  });
}

},{"../JsonLdError":3,"../RequestQueue":7,"../constants":9,"../util":23}],13:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const JsonLdError = require('./JsonLdError');

const {
  isArray: _isArray,
  isObject: _isObject,
  isEmptyObject: _isEmptyObject,
  isString: _isString,
  isUndefined: _isUndefined
} = require('./types');

const {
  isList: _isList,
  isValue: _isValue,
  isGraph: _isGraph
} = require('./graphTypes');

const {
  expandIri: _expandIri,
  getContextValue: _getContextValue,
  isKeyword: _isKeyword,
  process: _processContext
} = require('./context');

const {
  isAbsolute: _isAbsoluteIri
} = require('./url');

const {
  addValue: _addValue,
  asArray: _asArray,
  getValues: _getValues,
  validateTypeValue: _validateTypeValue
} = require('./util');

const api = {};
module.exports = api;

/**
 * Recursively expands an element using the given context. Any context in
 * the element will be removed. All context URLs must have been retrieved
 * before calling this method.
 *
 * @param activeCtx the context to use.
 * @param activeProperty the property for the element, null for none.
 * @param element the element to expand.
 * @param options the expansion options.
 * @param insideList true if the element is a list, false if not.
 * @param insideIndex true if the element is inside an index container,
 *          false if not.
 * @param typeScopedContext an optional type-scoped active context for
 *          expanding values of nodes that were expressed according to
 *          a type-scoped context.
 * @param expansionMap(info) a function that can be used to custom map
 *          unmappable values (or to throw an error when they are detected);
 *          if this function returns `undefined` then the default behavior
 *          will be used.
 *
 * @return a Promise that resolves to the expanded value.
 */
api.expand = ({
  activeCtx,
  activeProperty = null,
  element,
  options = {},
  insideList = false,
  insideIndex = false,
  typeScopedContext = null,
  expansionMap = () => undefined
}) => {
  // nothing to expand
  if(element === null || element === undefined) {
    return null;
  }

  // disable framing if activeProperty is @default
  if(activeProperty === '@default') {
    options = Object.assign({}, options, {isFrame: false});
  }

  if(!_isArray(element) && !_isObject(element)) {
    // drop free-floating scalars that are not in lists unless custom mapped
    if(!insideList && (activeProperty === null ||
      _expandIri(activeCtx, activeProperty, {vocab: true},
        options) === '@graph')) {
      // TODO: use `await` to support async
      const mapped = expansionMap({
        unmappedValue: element,
        activeCtx,
        activeProperty,
        options,
        insideList
      });
      if(mapped === undefined) {
        return null;
      }
      return mapped;
    }

    // expand element according to value expansion rules
    return _expandValue({activeCtx, activeProperty, value: element, options});
  }

  // recursively expand array
  if(_isArray(element)) {
    let rval = [];
    const container = _getContextValue(
      activeCtx, activeProperty, '@container') || [];
    insideList = insideList || container.includes('@list');
    for(let i = 0; i < element.length; ++i) {
      // expand element
      let e = api.expand({
        activeCtx,
        activeProperty,
        element: element[i],
        options,
        expansionMap,
        insideIndex,
        typeScopedContext
      });
      if(insideList && (_isArray(e) || _isList(e))) {
        // lists of lists are illegal
        throw new JsonLdError(
          'Invalid JSON-LD syntax; lists of lists are not permitted.',
          'jsonld.SyntaxError', {code: 'list of lists'});
      }

      if(e === null) {
        // TODO: add `await` for async support
        e = expansionMap({
          unmappedValue: element[i],
          activeCtx,
          activeProperty,
          parent: element,
          index: i,
          options,
          expandedParent: rval,
          insideList
        });
        if(e === undefined) {
          continue;
        }
      }

      if(_isArray(e)) {
        rval = rval.concat(e);
      } else {
        rval.push(e);
      }
    }
    return rval;
  }

  // recursively expand object:

  // first, expand the active property
  const expandedActiveProperty = _expandIri(
    activeCtx, activeProperty, {vocab: true}, options);

  // second, determine if any type-scoped context should be reverted; it
  // should only be reverted when the following are all true:
  // 1. `element` is not a value or subject reference
  // 2. `insideIndex` is false
  typeScopedContext = typeScopedContext ||
    (activeCtx.previousContext ? activeCtx : null);
  let keys = Object.keys(element).sort();
  let mustRevert = !insideIndex;
  if(mustRevert && typeScopedContext && keys.length <= 2 &&
    !keys.includes('@context')) {
    for(const key of keys) {
      const expandedProperty = _expandIri(
        typeScopedContext, key, {vocab: true}, options);
      if(expandedProperty === '@value') {
        // value found, ensure type-scoped context is used to expand it
        mustRevert = false;
        activeCtx = typeScopedContext;
        break;
      }
      if(expandedProperty === '@id' && keys.length === 1) {
        // subject reference found, do not revert
        mustRevert = false;
        break;
      }
    }
  }

  if(mustRevert) {
    // revert type scoped context
    activeCtx = activeCtx.revertTypeScopedContext();
  }

  // if element has a context, process it
  if('@context' in element) {
    activeCtx = _processContext(
      {activeCtx, localCtx: element['@context'], options});
  }

  // look for scoped contexts on `@type`
  for(const key of keys) {
    const expandedProperty = _expandIri(activeCtx, key, {vocab: true}, options);
    if(expandedProperty === '@type') {
      // set scoped contexts from @type
      // avoid sorting if possible
      const value = element[key];
      const types =
        Array.isArray(value) ?
          (value.length > 1 ? value.slice().sort() : value) : [value];
      for(const type of types) {
        const ctx = _getContextValue(
          activeCtx.previousContext || activeCtx, type, '@context');
        if(!_isUndefined(ctx)) {
          activeCtx = _processContext({
            activeCtx,
            localCtx: ctx,
            options,
            isTypeScopedContext: true
          });
        }
      }
    }
  }

  // process each key and value in element, ignoring @nest content
  let rval = {};
  _expandObject({
    activeCtx,
    activeProperty,
    expandedActiveProperty,
    element,
    expandedParent: rval,
    options,
    insideList,
    typeScopedContext,
    expansionMap});

  // get property count on expanded output
  keys = Object.keys(rval);
  let count = keys.length;

  if('@value' in rval) {
    // @value must only have @language or @type
    if('@type' in rval && '@language' in rval) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may not ' +
        'contain both "@type" and "@language".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    let validCount = count - 1;
    if('@type' in rval) {
      validCount -= 1;
    }
    if('@index' in rval) {
      validCount -= 1;
    }
    if('@language' in rval) {
      validCount -= 1;
    }
    if(validCount !== 0) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may only ' +
        'have an "@index" property and at most one other property ' +
        'which can be "@type" or "@language".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    const values = rval['@value'] === null ? [] : _asArray(rval['@value']);
    const types = _getValues(rval, '@type');

    // drop null @values unless custom mapped
    if(values.length === 0) {
      // TODO: use `await` to support async
      const mapped = expansionMap({
        unmappedValue: rval,
        activeCtx,
        activeProperty,
        element,
        options,
        insideList
      });
      if(mapped !== undefined) {
        rval = mapped;
      } else {
        rval = null;
      }
    } else if(!values.every(v => (_isString(v) || _isEmptyObject(v))) &&
      '@language' in rval) {
      // if @language is present, @value must be a string
      throw new JsonLdError(
        'Invalid JSON-LD syntax; only strings may be language-tagged.',
        'jsonld.SyntaxError',
        {code: 'invalid language-tagged value', element: rval});
    } else if(!types.every(t =>
      (_isAbsoluteIri(t) && !(_isString(t) && t.indexOf('_:') === 0) ||
      _isEmptyObject(t)))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" and "@type" ' +
        'must have an absolute IRI for the value of "@type".',
        'jsonld.SyntaxError', {code: 'invalid typed value', element: rval});
    }
  } else if('@type' in rval && !_isArray(rval['@type'])) {
    // convert @type to an array
    rval['@type'] = [rval['@type']];
  } else if('@set' in rval || '@list' in rval) {
    // handle @set and @list
    if(count > 1 && !(count === 2 && '@index' in rval)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; if an element has the property "@set" ' +
        'or "@list", then it can have at most one other property that is ' +
        '"@index".', 'jsonld.SyntaxError',
        {code: 'invalid set or list object', element: rval});
    }
    // optimize away @set
    if('@set' in rval) {
      rval = rval['@set'];
      keys = Object.keys(rval);
      count = keys.length;
    }
  } else if(count === 1 && '@language' in rval) {
    // drop objects with only @language unless custom mapped
    // TODO: use `await` to support async
    const mapped = expansionMap(rval, {
      unmappedValue: rval,
      activeCtx,
      activeProperty,
      element,
      options,
      insideList
    });
    if(mapped !== undefined) {
      rval = mapped;
    } else {
      rval = null;
    }
  }

  // drop certain top-level objects that do not occur in lists, unless custom
  // mapped
  if(_isObject(rval) &&
    !options.keepFreeFloatingNodes && !insideList &&
    (activeProperty === null || expandedActiveProperty === '@graph')) {
    // drop empty object, top-level @value/@list, or object with only @id
    if(count === 0 || '@value' in rval || '@list' in rval ||
      (count === 1 && '@id' in rval)) {
      // TODO: use `await` to support async
      const mapped = expansionMap({
        unmappedValue: rval,
        activeCtx,
        activeProperty,
        element,
        options,
        insideList
      });
      if(mapped !== undefined) {
        rval = mapped;
      } else {
        rval = null;
      }
    }
  }

  return rval;
};

/**
 * Expand each key and value of element adding to result
 *
 * @param activeCtx the context to use.
 * @param activeProperty the property for the element.
 * @param expandedActiveProperty the expansion of activeProperty
 * @param element the element to expand.
 * @param expandedParent the expanded result into which to add values.
 * @param options the expansion options.
 * @param insideList true if the element is a list, false if not.
 * @param expansionMap(info) a function that can be used to custom map
 *          unmappable values (or to throw an error when they are detected);
 *          if this function returns `undefined` then the default behavior
 *          will be used.
 */
function _expandObject({
  activeCtx,
  activeProperty,
  expandedActiveProperty,
  element,
  expandedParent,
  options = {},
  insideList,
  expansionMap
}) {
  const keys = Object.keys(element).sort();
  const nests = [];
  for(const key of keys) {
    let value = element[key];
    let expandedValue;

    // skip @context
    if(key === '@context') {
      continue;
    }

    // expand property
    let expandedProperty = _expandIri(activeCtx, key, {vocab: true}, options);

    // drop non-absolute IRI keys that aren't keywords unless custom mapped
    if(expandedProperty === null ||
      !(_isAbsoluteIri(expandedProperty) || _isKeyword(expandedProperty))) {
      // TODO: use `await` to support async
      expandedProperty = expansionMap({
        unmappedProperty: key,
        activeCtx,
        activeProperty,
        parent: element,
        options,
        insideList,
        value,
        expandedParent
      });
      if(expandedProperty === undefined) {
        continue;
      }
    }

    if(_isKeyword(expandedProperty)) {
      if(expandedActiveProperty === '@reverse') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a keyword cannot be used as a @reverse ' +
          'property.', 'jsonld.SyntaxError',
          {code: 'invalid reverse property map', value});
      }
      if(expandedProperty in expandedParent) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; colliding keywords detected.',
          'jsonld.SyntaxError',
          {code: 'colliding keywords', keyword: expandedProperty});
      }
    }

    // syntax error if @id is not a string
    if(expandedProperty === '@id') {
      if(!_isString(value)) {
        if(!options.isFrame) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@id" value must a string.',
            'jsonld.SyntaxError', {code: 'invalid @id value', value});
        }
        if(_isObject(value)) {
          // empty object is a wildcard
          if(!_isEmptyObject(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
              'of strings, if framing',
              'jsonld.SyntaxError', {code: 'invalid @id value', value});
          }
        } else if(_isArray(value)) {
          if(!value.every(v => _isString(v))) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
              'of strings, if framing',
              'jsonld.SyntaxError', {code: 'invalid @id value', value});
          }
        } else {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@id" value an empty object or array ' +
            'of strings, if framing',
            'jsonld.SyntaxError', {code: 'invalid @id value', value});
        }
      }

      _addValue(
        expandedParent, '@id',
        _asArray(value).map(v =>
          _isString(v) ? _expandIri(activeCtx, v, {base: true}, options) : v),
        {propertyIsArray: options.isFrame});
      continue;
    }

    if(expandedProperty === '@type') {
      _validateTypeValue(value);
      _addValue(
        expandedParent, '@type',
        _asArray(value).map(v =>
          _isString(v) ?
            _expandIri(activeCtx.previousContext || activeCtx, v,
              {base: true, vocab: true}, options) : v),
        {propertyIsArray: options.isFrame});
      continue;
    }

    // @graph must be an array or an object
    if(expandedProperty === '@graph' &&
      !(_isObject(value) || _isArray(value))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@graph" value must not be an ' +
        'object or an array.',
        'jsonld.SyntaxError', {code: 'invalid @graph value', value});
    }

    // @value must not be an object or an array (unless framing)
    if(expandedProperty === '@value') {
      if((_isObject(value) || _isArray(value)) && !options.isFrame) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@value" value must not be an ' +
          'object or an array.',
          'jsonld.SyntaxError',
          {code: 'invalid value object value', value});
      }

      _addValue(
        expandedParent, '@value', value, {propertyIsArray: options.isFrame});
      continue;
    }

    // @language must be a string
    if(expandedProperty === '@language') {
      if(value === null) {
        // drop null @language values, they expand as if they didn't exist
        continue;
      }
      if(!_isString(value) && !options.isFrame) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@language" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid language-tagged string', value});
      }
      // ensure language value is lowercase
      value = _asArray(value).map(v => _isString(v) ? v.toLowerCase() : v);

      _addValue(
        expandedParent, '@language', value, {propertyIsArray: options.isFrame});
      continue;
    }

    // @index must be a string
    if(expandedProperty === '@index') {
      if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@index" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid @index value', value});
      }
      _addValue(expandedParent, '@index', value);
      continue;
    }

    // @reverse must be an object
    if(expandedProperty === '@reverse') {
      if(!_isObject(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@reverse" value must be an object.',
          'jsonld.SyntaxError', {code: 'invalid @reverse value', value});
      }

      expandedValue = api.expand({
        activeCtx,
        activeProperty:
        '@reverse',
        element: value,
        options,
        expansionMap
      });
      // properties double-reversed
      if('@reverse' in expandedValue) {
        for(const property in expandedValue['@reverse']) {
          _addValue(
            expandedParent, property, expandedValue['@reverse'][property],
            {propertyIsArray: true});
        }
      }

      // FIXME: can this be merged with code below to simplify?
      // merge in all reversed properties
      let reverseMap = expandedParent['@reverse'] || null;
      for(const property in expandedValue) {
        if(property === '@reverse') {
          continue;
        }
        if(reverseMap === null) {
          reverseMap = expandedParent['@reverse'] = {};
        }
        _addValue(reverseMap, property, [], {propertyIsArray: true});
        const items = expandedValue[property];
        for(let ii = 0; ii < items.length; ++ii) {
          const item = items[ii];
          if(_isValue(item) || _isList(item)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
              '@value or an @list.', 'jsonld.SyntaxError',
              {code: 'invalid reverse property value', value: expandedValue});
          }
          _addValue(reverseMap, property, item, {propertyIsArray: true});
        }
      }

      continue;
    }

    // nested keys
    if(expandedProperty === '@nest') {
      nests.push(key);
      continue;
    }

    // use potential scoped context for key
    let termCtx = activeCtx;
    const ctx = _getContextValue(activeCtx, key, '@context');
    if(!_isUndefined(ctx)) {
      // Note: spec's `from term` var is named `isPropertyTermScopedContext`
      termCtx = _processContext({
        activeCtx,
        localCtx: ctx,
        isPropertyTermScopedContext: true,
        options
      });
    }

    const container = _getContextValue(termCtx, key, '@container') || [];

    if(container.includes('@language') && _isObject(value)) {
      // handle language map container (skip if value is not an object)
      expandedValue = _expandLanguageMap(termCtx, value, options);
    } else if(container.includes('@index') && _isObject(value)) {
      // handle index container (skip if value is not an object)
      const asGraph = container.includes('@graph');
      expandedValue = _expandIndexMap({
        activeCtx: termCtx,
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph,
        indexKey: '@index'
      });
    } else if(container.includes('@id') && _isObject(value)) {
      // handle id container (skip if value is not an object)
      const asGraph = container.includes('@graph');
      expandedValue = _expandIndexMap({
        activeCtx: termCtx,
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph,
        indexKey: '@id'
      });
    } else if(container.includes('@type') && _isObject(value)) {
      // handle type container (skip if value is not an object)
      expandedValue = _expandIndexMap({
        // since container is `@type`, revert type scoped context when expanding
        activeCtx: termCtx.revertTypeScopedContext(),
        options,
        activeProperty: key,
        value,
        expansionMap,
        asGraph: false,
        indexKey: '@type'
      });
    } else {
      // recurse into @list or @set
      const isList = (expandedProperty === '@list');
      if(isList || expandedProperty === '@set') {
        let nextActiveProperty = activeProperty;
        if(isList && expandedActiveProperty === '@graph') {
          nextActiveProperty = null;
        }
        expandedValue = api.expand({
          activeCtx: termCtx,
          activeProperty: nextActiveProperty,
          element: value,
          options,
          insideList: isList,
          expansionMap
        });
        if(isList && _isList(expandedValue)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; lists of lists are not permitted.',
            'jsonld.SyntaxError', {code: 'list of lists'});
        }
      } else {
        // recursively expand value with key as new active property
        expandedValue = api.expand({
          activeCtx: termCtx,
          activeProperty: key,
          element: value,
          options,
          insideList: false,
          expansionMap
        });
      }
    }

    // drop null values if property is not @value
    if(expandedValue === null && expandedProperty !== '@value') {
      // TODO: use `await` to support async
      expandedValue = expansionMap({
        unmappedValue: value,
        expandedProperty,
        activeCtx: termCtx,
        activeProperty,
        parent: element,
        options,
        insideList,
        key,
        expandedParent
      });
      if(expandedValue === undefined) {
        continue;
      }
    }

    // convert expanded value to @list if container specifies it
    if(expandedProperty !== '@list' && !_isList(expandedValue) &&
      container.includes('@list')) {
      // ensure expanded value in @list is an array
      expandedValue = {'@list': _asArray(expandedValue)};
    }

    // convert expanded value to @graph if container specifies it
    // and value is not, itself, a graph
    // index cases handled above
    if(container.includes('@graph') &&
      !container.some(key => key === '@id' || key === '@index')) {
      // ensure expanded values are arrays
      expandedValue = _asArray(expandedValue)
        .map(v => _isGraph(v) ? v : {'@graph': _asArray(v)});
    }

    // FIXME: can this be merged with code above to simplify?
    // merge in reverse properties
    if(termCtx.mappings.has(key) && termCtx.mappings.get(key).reverse) {
      const reverseMap =
        expandedParent['@reverse'] = expandedParent['@reverse'] || {};
      expandedValue = _asArray(expandedValue);
      for(let ii = 0; ii < expandedValue.length; ++ii) {
        const item = expandedValue[ii];
        if(_isValue(item) || _isList(item)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
            '@value or an @list.', 'jsonld.SyntaxError',
            {code: 'invalid reverse property value', value: expandedValue});
        }
        _addValue(reverseMap, expandedProperty, item, {propertyIsArray: true});
      }
      continue;
    }

    // add value for property
    // use an array except for certain keywords
    const useArray =
      !['@index', '@id', '@type', '@value', '@language']
        .includes(expandedProperty);
    _addValue(expandedParent, expandedProperty, expandedValue, {
      propertyIsArray: useArray
    });
  }

  // expand each nested key
  for(const key of nests) {
    const nestedValues = _isArray(element[key]) ? element[key] : [element[key]];
    for(const nv of nestedValues) {
      if(!_isObject(nv) || Object.keys(nv).some(k =>
        _expandIri(activeCtx, k, {vocab: true}, options) === '@value')) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; nested value must be a node object.',
          'jsonld.SyntaxError',
          {code: 'invalid @nest value', value: nv});
      }
      _expandObject({
        activeCtx,
        activeProperty,
        expandedActiveProperty,
        element: nv,
        expandedParent,
        options,
        insideList,
        expansionMap});
    }
  }
}

/**
 * Expands the given value by using the coercion and keyword rules in the
 * given context.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the active property the value is associated with.
 * @param value the value to expand.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded value.
 */
function _expandValue({activeCtx, activeProperty, value, options}) {
  // nothing to expand
  if(value === null || value === undefined) {
    return null;
  }

  // special-case expand @id and @type (skips '@id' expansion)
  const expandedProperty = _expandIri(
    activeCtx, activeProperty, {vocab: true}, options);
  if(expandedProperty === '@id') {
    return _expandIri(activeCtx, value, {base: true}, options);
  } else if(expandedProperty === '@type') {
    return _expandIri(activeCtx, value, {vocab: true, base: true}, options);
  }

  // get type definition from context
  const type = _getContextValue(activeCtx, activeProperty, '@type');

  // do @id expansion (automatic for @graph)
  if((type === '@id' || expandedProperty === '@graph') && _isString(value)) {
    return {'@id': _expandIri(activeCtx, value, {base: true}, options)};
  }
  // do @id expansion w/vocab
  if(type === '@vocab' && _isString(value)) {
    return {
      '@id': _expandIri(activeCtx, value, {vocab: true, base: true}, options)
    };
  }

  // do not expand keyword values
  if(_isKeyword(expandedProperty)) {
    return value;
  }

  const rval = {};

  if(type && !['@id', '@vocab'].includes(type)) {
    // other type
    rval['@type'] = type;
  } else if(_isString(value)) {
    // check for language tagging for strings
    const language = _getContextValue(activeCtx, activeProperty, '@language');
    if(language !== null) {
      rval['@language'] = language;
    }
  }
  // do conversion of values that aren't basic JSON types to strings
  if(!['boolean', 'number', 'string'].includes(typeof value)) {
    value = value.toString();
  }
  rval['@value'] = value;

  return rval;
}

/**
 * Expands a language map.
 *
 * @param activeCtx the active context to use.
 * @param languageMap the language map to expand.
 * @param {Object} [options] - processing options.
 *
 * @return the expanded language map.
 */
function _expandLanguageMap(activeCtx, languageMap, options) {
  const rval = [];
  const keys = Object.keys(languageMap).sort();
  for(const key of keys) {
    const expandedKey = _expandIri(activeCtx, key, {vocab: true}, options);
    let val = languageMap[key];
    if(!_isArray(val)) {
      val = [val];
    }
    for(const item of val) {
      if(item === null) {
        // null values are allowed (8.5) but ignored (3.1)
        continue;
      }
      if(!_isString(item)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; language map values must be strings.',
          'jsonld.SyntaxError',
          {code: 'invalid language map value', languageMap});
      }
      const val = {'@value': item};
      if(expandedKey !== '@none') {
        val['@language'] = key.toLowerCase();
      }
      rval.push(val);
    }
  }
  return rval;
}

function _expandIndexMap(
  {activeCtx, options, activeProperty, value, expansionMap, asGraph,
    indexKey}) {
  const rval = [];
  const keys = Object.keys(value).sort();
  const isTypeIndex = indexKey === '@type';
  for(let key of keys) {
    // if indexKey is @type, there may be a context defined for it
    if(isTypeIndex) {
      const ctx = _getContextValue(activeCtx, key, '@context');
      if(!_isUndefined(ctx)) {
        activeCtx = _processContext({
          activeCtx,
          localCtx: ctx,
          isTypeScopedContext: true,
          options
        });
      }
    }

    let val = value[key];
    if(!_isArray(val)) {
      val = [val];
    }

    // expand for @type, but also for @none
    const expandedKey = _expandIri(activeCtx, key, {vocab: true}, options);
    if(indexKey === '@id') {
      // expand document relative
      key = _expandIri(activeCtx, key, {base: true}, options);
    } else if(isTypeIndex) {
      key = expandedKey;
    }

    val = api.expand({
      activeCtx,
      activeProperty,
      element: val,
      options,
      insideList: false,
      insideIndex: true,
      expansionMap
    });
    for(let item of val) {
      // If this is also a @graph container, turn items into graphs
      if(asGraph && !_isGraph(item)) {
        item = {'@graph': [item]};
      }
      if(indexKey === '@type') {
        if(expandedKey === '@none') {
          // ignore @none
        } else if(item['@type']) {
          item['@type'] = [key].concat(item['@type']);
        } else {
          item['@type'] = [key];
        }
      } else if(expandedKey !== '@none' && !(indexKey in item)) {
        item[indexKey] = key;
      }
      rval.push(item);
    }
  }
  return rval;
}

},{"./JsonLdError":3,"./context":10,"./graphTypes":17,"./types":21,"./url":22,"./util":23}],14:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {
  isSubjectReference: _isSubjectReference
} = require('./graphTypes');

const {
  createMergedNodeMap: _createMergedNodeMap
} = require('./nodeMap');

const api = {};
module.exports = api;

/**
 * Performs JSON-LD flattening.
 *
 * @param input the expanded JSON-LD to flatten.
 *
 * @return the flattened output.
 */
api.flatten = input => {
  const defaultGraph = _createMergedNodeMap(input);

  // produce flattened output
  const flattened = [];
  const keys = Object.keys(defaultGraph).sort();
  for(let ki = 0; ki < keys.length; ++ki) {
    const node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }
  return flattened;
};

},{"./graphTypes":17,"./nodeMap":19}],15:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {isKeyword} = require('./context');
const graphTypes = require('./graphTypes');
const types = require('./types');
const util = require('./util');
const JsonLdError = require('./JsonLdError');
const {
  createNodeMap: _createNodeMap,
  mergeNodeMapGraphs: _mergeNodeMapGraphs
} = require('./nodeMap');

const api = {};
module.exports = api;

/**
 * Performs JSON-LD `merged` framing.
 *
 * @param input the expanded JSON-LD to frame.
 * @param frame the expanded JSON-LD frame to use.
 * @param options the framing options.
 *
 * @return the framed output.
 */
api.frameMergedOrDefault = (input, frame, options) => {
  // create framing state
  const state = {
    options,
    graph: '@default',
    graphMap: {'@default': {}},
    graphStack: [],
    subjectStack: [],
    link: {},
    bnodeMap: {}
  };

  // produce a map of all graphs and name each bnode
  // FIXME: currently uses subjects from @merged graph only
  const issuer = new util.IdentifierIssuer('_:b');
  _createNodeMap(input, state.graphMap, '@default', issuer);
  if(options.merged) {
    state.graphMap['@merged'] = _mergeNodeMapGraphs(state.graphMap);
    state.graph = '@merged';
  }
  state.subjects = state.graphMap[state.graph];

  // frame the subjects
  const framed = [];
  api.frame(state, Object.keys(state.subjects).sort(), frame, framed);

  // If pruning blank nodes, find those to prune
  if(options.pruneBlankNodeIdentifiers) {
    // remove all blank nodes appearing only once, done in compaction
    options.bnodesToClear =
      Object.keys(state.bnodeMap).filter(id => state.bnodeMap[id].length === 1);
  }

  return framed;
};

/**
 * Frames subjects according to the given frame.
 *
 * @param state the current framing state.
 * @param subjects the subjects to filter.
 * @param frame the frame.
 * @param parent the parent subject or top-level array.
 * @param property the parent property, initialized to null.
 */
api.frame = (state, subjects, frame, parent, property = null) => {
  // validate the frame
  _validateFrame(frame);
  frame = frame[0];

  // get flags for current frame
  const options = state.options;
  const flags = {
    embed: _getFrameFlag(frame, options, 'embed'),
    explicit: _getFrameFlag(frame, options, 'explicit'),
    requireAll: _getFrameFlag(frame, options, 'requireAll')
  };

  // filter out subjects that match the frame
  const matches = _filterSubjects(state, subjects, frame, flags);

  // add matches to output
  const ids = Object.keys(matches).sort();
  for(const id of ids) {
    const subject = matches[id];

    if(flags.embed === '@link' && id in state.link) {
      // TODO: may want to also match an existing linked subject against
      // the current frame ... so different frames could produce different
      // subjects that are only shared in-memory when the frames are the same

      // add existing linked subject
      _addFrameOutput(parent, property, state.link[id]);
      continue;
    }

    /* Note: In order to treat each top-level match as a compartmentalized
    result, clear the unique embedded subjects map when the property is null,
    which only occurs at the top-level. */
    if(property === null) {
      state.uniqueEmbeds = {[state.graph]: {}};
    } else {
      state.uniqueEmbeds[state.graph] = state.uniqueEmbeds[state.graph] || {};
    }

    // start output for subject
    const output = {};
    output['@id'] = id;
    if(id.indexOf('_:') === 0) {
      util.addValue(state.bnodeMap, id, output, {propertyIsArray: true});
    }
    state.link[id] = output;

    // if embed is @never or if a circular reference would be created by an
    // embed, the subject cannot be embedded, just add the reference;
    // note that a circular reference won't occur when the embed flag is
    // `@link` as the above check will short-circuit before reaching this point
    if(flags.embed === '@never' ||
      _createsCircularReference(subject, state.graph, state.subjectStack)) {
      _addFrameOutput(parent, property, output);
      continue;
    }

    // if only the last match should be embedded
    if(flags.embed === '@last') {
      // remove any existing embed
      if(id in state.uniqueEmbeds[state.graph]) {
        _removeEmbed(state, id);
      }
      state.uniqueEmbeds[state.graph][id] =
        {parent, property};
    }

    // push matching subject onto stack to enable circular embed checks
    state.subjectStack.push({subject, graph: state.graph});

    // subject is also the name of a graph
    if(id in state.graphMap) {
      let recurse = false;
      let subframe = null;
      if(!('@graph' in frame)) {
        recurse = state.graph !== '@merged';
        subframe = {};
      } else {
        subframe = frame['@graph'][0];
        if(!types.isObject(subframe)) {
          subframe = {};
        }
        recurse = !(id === '@merged' || id === '@default');
      }

      if(recurse) {
        state.graphStack.push(state.graph);
        state.graph = id;
        // recurse into graph
        api.frame(
          state,
          Object.keys(state.graphMap[id]).sort(), [subframe], output, '@graph');
        state.graph = state.graphStack.pop;
      }
    }

    // iterate over subject properties
    for(const prop of Object.keys(subject).sort()) {
      // copy keywords to output
      if(isKeyword(prop)) {
        output[prop] = util.clone(subject[prop]);

        if(prop === '@type') {
          // count bnode values of @type
          for(const type of subject['@type']) {
            if(type.indexOf('_:') === 0) {
              util.addValue(
                state.bnodeMap, type, output, {propertyIsArray: true});
            }
          }
        }
        continue;
      }

      // explicit is on and property isn't in the frame, skip processing
      if(flags.explicit && !(prop in frame)) {
        continue;
      }

      // add objects
      for(let o of subject[prop]) {
        const subframe = (prop in frame ?
          frame[prop] : _createImplicitFrame(flags));

        // recurse into list
        if(graphTypes.isList(o)) {
          // add empty list
          const list = {'@list': []};
          _addFrameOutput(output, prop, list);

          // add list objects
          const src = o['@list'];
          for(const n in src) {
            o = src[n];
            if(graphTypes.isSubjectReference(o)) {
              const subframe = (prop in frame ?
                frame[prop][0]['@list'] : _createImplicitFrame(flags));
              // recurse into subject reference
              api.frame(state, [o['@id']], subframe, list, '@list');
            } else {
              // include other values automatically
              _addFrameOutput(list, '@list', util.clone(o));
            }
          }
          continue;
        }

        if(graphTypes.isSubjectReference(o)) {
          // recurse into subject reference
          api.frame(state, [o['@id']], subframe, output, prop);
        } else if(_valueMatch(subframe[0], o)) {
          // include other values, if they match
          _addFrameOutput(output, prop, util.clone(o));
        }
      }
    }

    // handle defaults
    for(const prop of Object.keys(frame).sort()) {
      // skip keywords
      if(isKeyword(prop)) {
        continue;
      }

      // if omit default is off, then include default values for properties
      // that appear in the next frame but are not in the matching subject
      const next = frame[prop][0] || {};
      const omitDefaultOn = _getFrameFlag(next, options, 'omitDefault');
      if(!omitDefaultOn && !(prop in output)) {
        let preserve = '@null';
        if('@default' in next) {
          preserve = util.clone(next['@default']);
        }
        if(!types.isArray(preserve)) {
          preserve = [preserve];
        }
        output[prop] = [{'@preserve': preserve}];
      }
    }

    // if embed reverse values by finding nodes having this subject as a value
    // of the associated property
    if('@reverse' in frame) {
      for(const reverseProp of Object.keys(frame['@reverse']).sort()) {
        const subframe = frame['@reverse'][reverseProp];
        for(const subject of Object.keys(state.subjects)) {
          const nodeValues =
            util.getValues(state.subjects[subject], reverseProp);
          if(nodeValues.some(v => v['@id'] === id)) {
            // node has property referencing this subject, recurse
            output['@reverse'] = output['@reverse'] || {};
            util.addValue(
              output['@reverse'], reverseProp, [], {propertyIsArray: true});
            api.frame(
              state, [subject], subframe, output['@reverse'][reverseProp],
              property);
          }
        }
      }
    }

    // add output to parent
    _addFrameOutput(parent, property, output);

    // pop matching subject from circular ref-checking stack
    state.subjectStack.pop();
  }
};

/**
 * Creates an implicit frame when recursing through subject matches. If
 * a frame doesn't have an explicit frame for a particular property, then
 * a wildcard child frame will be created that uses the same flags that the
 * parent frame used.
 *
 * @param flags the current framing flags.
 *
 * @return the implicit frame.
 */
function _createImplicitFrame(flags) {
  const frame = {};
  for(const key in flags) {
    if(flags[key] !== undefined) {
      frame['@' + key] = [flags[key]];
    }
  }
  return [frame];
}

/**
 * Checks the current subject stack to see if embedding the given subject
 * would cause a circular reference.
 *
 * @param subjectToEmbed the subject to embed.
 * @param graph the graph the subject to embed is in.
 * @param subjectStack the current stack of subjects.
 *
 * @return true if a circular reference would be created, false if not.
 */
function _createsCircularReference(subjectToEmbed, graph, subjectStack) {
  for(let i = subjectStack.length - 1; i >= 0; --i) {
    const subject = subjectStack[i];
    if(subject.graph === graph &&
      subject.subject['@id'] === subjectToEmbed['@id']) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the frame flag value for the given flag name.
 *
 * @param frame the frame.
 * @param options the framing options.
 * @param name the flag name.
 *
 * @return the flag value.
 */
function _getFrameFlag(frame, options, name) {
  const flag = '@' + name;
  let rval = (flag in frame ? frame[flag][0] : options[name]);
  if(name === 'embed') {
    // default is "@last"
    // backwards-compatibility support for "embed" maps:
    // true => "@last"
    // false => "@never"
    if(rval === true) {
      rval = '@last';
    } else if(rval === false) {
      rval = '@never';
    } else if(rval !== '@always' && rval !== '@never' && rval !== '@link') {
      rval = '@last';
    }
  }
  return rval;
}

/**
 * Validates a JSON-LD frame, throwing an exception if the frame is invalid.
 *
 * @param frame the frame to validate.
 */
function _validateFrame(frame) {
  if(!types.isArray(frame) || frame.length !== 1 || !types.isObject(frame[0])) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a JSON-LD frame must be a single object.',
      'jsonld.SyntaxError', {frame});
  }
}

/**
 * Returns a map of all of the subjects that match a parsed frame.
 *
 * @param state the current framing state.
 * @param subjects the set of subjects to filter.
 * @param frame the parsed frame.
 * @param flags the frame flags.
 *
 * @return all of the matched subjects.
 */
function _filterSubjects(state, subjects, frame, flags) {
  // filter subjects in @id order
  const rval = {};
  for(const id of subjects) {
    const subject = state.graphMap[state.graph][id];
    if(_filterSubject(state, subject, frame, flags)) {
      rval[id] = subject;
    }
  }
  return rval;
}

/**
 * Returns true if the given subject matches the given frame.
 *
 * Matches either based on explicit type inclusion where the node has any
 * type listed in the frame. If the frame has empty types defined matches
 * nodes not having a @type. If the frame has a type of {} defined matches
 * nodes having any type defined.
 *
 * Otherwise, does duck typing, where the node must have all of the
 * properties defined in the frame.
 *
 * @param state the current framing state.
 * @param subject the subject to check.
 * @param frame the frame to check.
 * @param flags the frame flags.
 *
 * @return true if the subject matches, false if not.
 */
function _filterSubject(state, subject, frame, flags) {
  // check ducktype
  let wildcard = true;
  let matchesSome = false;

  for(const key in frame) {
    let matchThis = false;
    const nodeValues = util.getValues(subject, key);
    const isEmpty = util.getValues(frame, key).length === 0;

    if(isKeyword(key)) {
      // skip non-@id and non-@type
      if(key !== '@id' && key !== '@type') {
        continue;
      }
      wildcard = false;

      // check @id for a specific @id value
      if(key === '@id') {
        // if @id is not a wildcard and is not empty, then match or not on
        // specific value
        if(frame['@id'].length >= 0 && !types.isEmptyObject(frame['@id'][0])) {
          return frame['@id'].includes(nodeValues[0]);
        }
        matchThis = true;
        continue;
      }

      // check @type (object value means 'any' type, fall through to ducktyping)
      if('@type' in frame) {
        if(isEmpty) {
          if(nodeValues.length > 0) {
            // don't match on no @type
            return false;
          }
          matchThis = true;
        } else if(frame['@type'].length === 1 &&
          types.isEmptyObject(frame['@type'][0])) {
          // match on wildcard @type
          matchThis = nodeValues.length > 0;
        } else {
          // match on a specific @type
          for(const type of frame['@type']) {
            if(nodeValues.some(tt => tt === type)) {
              return true;
            }
          }
          return false;
        }
      }
    }

    // Forc a copy of this frame entry so it can be manipulated
    const thisFrame = util.getValues(frame, key)[0];
    let hasDefault = false;
    if(thisFrame) {
      _validateFrame([thisFrame]);
      hasDefault = '@default' in thisFrame;
    }

    // no longer a wildcard pattern if frame has any non-keyword properties
    wildcard = false;

    // skip, but allow match if node has no value for property, and frame has a
    // default value
    if(nodeValues.length === 0 && hasDefault) {
      continue;
    }

    // if frame value is empty, don't match if subject has any value
    if(nodeValues.length > 0 && isEmpty) {
      return false;
    }

    if(thisFrame === undefined) {
      // node does not match if values is not empty and the value of property
      // in frame is match none.
      if(nodeValues.length > 0) {
        return false;
      }
      matchThis = true;
    } else if(types.isObject(thisFrame)) {
      // node matches if values is not empty and the value of property in frame
      // is wildcard
      matchThis = nodeValues.length > 0;
    } else {
      if(graphTypes.isValue(thisFrame)) {
        // match on any matching value
        matchThis = nodeValues.some(nv => _valueMatch(thisFrame, nv));
      } else if(graphTypes.isSubject(thisFrame) ||
        graphTypes.isSubjectReference(thisFrame)) {
        matchThis =
          nodeValues.some(nv => _nodeMatch(state, thisFrame, nv, flags));
      } else if(graphTypes.isList(thisFrame)) {
        const listValue = thisFrame['@list'][0];
        if(graphTypes.isList(nodeValues[0])) {
          const nodeListValues = nodeValues[0]['@list'];

          if(graphTypes.isValue(listValue)) {
            // match on any matching value
            matchThis = nodeListValues.some(lv => _valueMatch(listValue, lv));
          } else if(graphTypes.isSubject(listValue) ||
            graphTypes.isSubjectReference(listValue)) {
            matchThis = nodeListValues.some(lv => _nodeMatch(
              state, listValue, lv, flags));
          }
        } else {
          // value must be a list to match
          matchThis = false;
        }
      }
    }

    // all non-defaulted values must match if requireAll is set
    if(!matchThis && flags.requireAll) {
      return false;
    }

    matchesSome = matchesSome || matchThis;
  }

  // return true if wildcard or subject matches some properties
  return wildcard || matchesSome;
}

/**
 * Removes an existing embed.
 *
 * @param state the current framing state.
 * @param id the @id of the embed to remove.
 */
function _removeEmbed(state, id) {
  // get existing embed
  const embeds = state.uniqueEmbeds[state.graph];
  const embed = embeds[id];
  const parent = embed.parent;
  const property = embed.property;

  // create reference to replace embed
  const subject = {'@id': id};

  // remove existing embed
  if(types.isArray(parent)) {
    // replace subject with reference
    for(let i = 0; i < parent.length; ++i) {
      if(util.compareValues(parent[i], subject)) {
        parent[i] = subject;
        break;
      }
    }
  } else {
    // replace subject with reference
    const useArray = types.isArray(parent[property]);
    util.removeValue(parent, property, subject, {propertyIsArray: useArray});
    util.addValue(parent, property, subject, {propertyIsArray: useArray});
  }

  // recursively remove dependent dangling embeds
  const removeDependents = id => {
    // get embed keys as a separate array to enable deleting keys in map
    const ids = Object.keys(embeds);
    for(const next of ids) {
      if(next in embeds && types.isObject(embeds[next].parent) &&
        embeds[next].parent['@id'] === id) {
        delete embeds[next];
        removeDependents(next);
      }
    }
  };
  removeDependents(id);
}

/**
 * Adds framing output to the given parent.
 *
 * @param parent the parent to add to.
 * @param property the parent property.
 * @param output the output to add.
 */
function _addFrameOutput(parent, property, output) {
  if(types.isObject(parent)) {
    util.addValue(parent, property, output, {propertyIsArray: true});
  } else {
    parent.push(output);
  }
}

/**
 * Node matches if it is a node, and matches the pattern as a frame.
 *
 * @param state the current framing state.
 * @param pattern used to match value
 * @param value to check
 * @param flags the frame flags.
 */
function _nodeMatch(state, pattern, value, flags) {
  if(!('@id' in value)) {
    return false;
  }
  const nodeObject = state.subjects[value['@id']];
  return nodeObject && _filterSubject(state, nodeObject, pattern, flags);
}

/**
 * Value matches if it is a value and matches the value pattern
 *
 * * `pattern` is empty
 * * @values are the same, or `pattern[@value]` is a wildcard, and
 * * @types are the same or `value[@type]` is not null
 *   and `pattern[@type]` is `{}`, or `value[@type]` is null
 *   and `pattern[@type]` is null or `[]`, and
 * * @languages are the same or `value[@language]` is not null
 *   and `pattern[@language]` is `{}`, or `value[@language]` is null
 *   and `pattern[@language]` is null or `[]`.
 *
 * @param pattern used to match value
 * @param value to check
 */
function _valueMatch(pattern, value) {
  const v1 = value['@value'];
  const t1 = value['@type'];
  const l1 = value['@language'];
  const v2 = pattern['@value'] ?
    (types.isArray(pattern['@value']) ?
      pattern['@value'] : [pattern['@value']]) :
    [];
  const t2 = pattern['@type'] ?
    (types.isArray(pattern['@type']) ?
      pattern['@type'] : [pattern['@type']]) :
    [];
  const l2 = pattern['@language'] ?
    (types.isArray(pattern['@language']) ?
      pattern['@language'] : [pattern['@language']]) :
    [];

  if(v2.length === 0 && t2.length === 0 && l2.length === 0) {
    return true;
  }
  if(!(v2.includes(v1) || types.isEmptyObject(v2[0]))) {
    return false;
  }
  if(!(!t1 && t2.length === 0 || t2.includes(t1) || t1 &&
    types.isEmptyObject(t2[0]))) {
    return false;
  }
  if(!(!l1 && l2.length === 0 || l2.includes(l1) || l1 &&
    types.isEmptyObject(l2[0]))) {
    return false;
  }
  return true;
}

},{"./JsonLdError":3,"./context":10,"./graphTypes":17,"./nodeMap":19,"./types":21,"./util":23}],16:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const graphTypes = require('./graphTypes');
const types = require('./types');
const util = require('./util');

// constants
const {
  // RDF,
  RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  // RDF_PLAIN_LITERAL,
  // RDF_XML_LITERAL,
  // RDF_OBJECT,
  // RDF_LANGSTRING,

  // XSD,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING,
} = require('./constants');

const api = {};
module.exports = api;

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset the RDF dataset.
 * @param options the RDF serialization options.
 *
 * @return a Promise that resolves to the JSON-LD output.
 */
api.fromRDF = async (
  dataset, {useRdfType = false, useNativeTypes = false}) => {
  const defaultGraph = {};
  const graphMap = {'@default': defaultGraph};
  const referencedOnce = {};

  for(const quad of dataset) {
    // TODO: change 'name' to 'graph'
    const name = (quad.graph.termType === 'DefaultGraph') ?
      '@default' : quad.graph.value;
    if(!(name in graphMap)) {
      graphMap[name] = {};
    }
    if(name !== '@default' && !(name in defaultGraph)) {
      defaultGraph[name] = {'@id': name};
    }

    const nodeMap = graphMap[name];

    // get subject, predicate, object
    const s = quad.subject.value;
    const p = quad.predicate.value;
    const o = quad.object;

    if(!(s in nodeMap)) {
      nodeMap[s] = {'@id': s};
    }
    const node = nodeMap[s];

    const objectIsNode = o.termType.endsWith('Node');
    if(objectIsNode && !(o.value in nodeMap)) {
      nodeMap[o.value] = {'@id': o.value};
    }

    if(p === RDF_TYPE && !useRdfType && objectIsNode) {
      util.addValue(node, '@type', o.value, {propertyIsArray: true});
      continue;
    }

    const value = _RDFToObject(o, useNativeTypes);
    util.addValue(node, p, value, {propertyIsArray: true});

    // object may be an RDF list/partial list node but we can't know easily
    // until all triples are read
    if(objectIsNode) {
      if(o.value === RDF_NIL) {
        // track rdf:nil uniquely per graph
        const object = nodeMap[o.value];
        if(!('usages' in object)) {
          object.usages = [];
        }
        object.usages.push({
          node,
          property: p,
          value
        });
      } else if(o.value in referencedOnce) {
        // object referenced more than once
        referencedOnce[o.value] = false;
      } else {
        // keep track of single reference
        referencedOnce[o.value] = {
          node,
          property: p,
          value
        };
      }
    }
  }

  /*
  for(let name in dataset) {
    const graph = dataset[name];
    if(!(name in graphMap)) {
      graphMap[name] = {};
    }
    if(name !== '@default' && !(name in defaultGraph)) {
      defaultGraph[name] = {'@id': name};
    }
    const nodeMap = graphMap[name];
    for(let ti = 0; ti < graph.length; ++ti) {
      const triple = graph[ti];

      // get subject, predicate, object
      const s = triple.subject.value;
      const p = triple.predicate.value;
      const o = triple.object;

      if(!(s in nodeMap)) {
        nodeMap[s] = {'@id': s};
      }
      const node = nodeMap[s];

      const objectIsId = (o.type === 'IRI' || o.type === 'blank node');
      if(objectIsId && !(o.value in nodeMap)) {
        nodeMap[o.value] = {'@id': o.value};
      }

      if(p === RDF_TYPE && !useRdfType && objectIsId) {
        util.addValue(node, '@type', o.value, {propertyIsArray: true});
        continue;
      }

      const value = _RDFToObject(o, useNativeTypes);
      util.addValue(node, p, value, {propertyIsArray: true});

      // object may be an RDF list/partial list node but we can't know easily
      // until all triples are read
      if(objectIsId) {
        if(o.value === RDF_NIL) {
          // track rdf:nil uniquely per graph
          const object = nodeMap[o.value];
          if(!('usages' in object)) {
            object.usages = [];
          }
          object.usages.push({
            node: node,
            property: p,
            value: value
          });
        } else if(o.value in referencedOnce) {
          // object referenced more than once
          referencedOnce[o.value] = false;
        } else {
          // keep track of single reference
          referencedOnce[o.value] = {
            node: node,
            property: p,
            value: value
          };
        }
      }
    }
  }*/

  // convert linked lists to @list arrays
  for(const name in graphMap) {
    const graphObject = graphMap[name];

    // no @lists to be converted, continue
    if(!(RDF_NIL in graphObject)) {
      continue;
    }

    // iterate backwards through each RDF list
    const nil = graphObject[RDF_NIL];
    if(!nil.usages) {
      continue;
    }
    for(let usage of nil.usages) {
      let node = usage.node;
      let property = usage.property;
      let head = usage.value;
      const list = [];
      const listNodes = [];

      // ensure node is a well-formed list node; it must:
      // 1. Be referenced only once.
      // 2. Have an array for rdf:first that has 1 item.
      // 3. Have an array for rdf:rest that has 1 item.
      // 4. Have no keys other than: @id, rdf:first, rdf:rest, and,
      //   optionally, @type where the value is rdf:List.
      let nodeKeyCount = Object.keys(node).length;
      while(property === RDF_REST &&
        types.isObject(referencedOnce[node['@id']]) &&
        types.isArray(node[RDF_FIRST]) && node[RDF_FIRST].length === 1 &&
        types.isArray(node[RDF_REST]) && node[RDF_REST].length === 1 &&
        (nodeKeyCount === 3 ||
          (nodeKeyCount === 4 && types.isArray(node['@type']) &&
          node['@type'].length === 1 && node['@type'][0] === RDF_LIST))) {
        list.push(node[RDF_FIRST][0]);
        listNodes.push(node['@id']);

        // get next node, moving backwards through list
        usage = referencedOnce[node['@id']];
        node = usage.node;
        property = usage.property;
        head = usage.value;
        nodeKeyCount = Object.keys(node).length;

        // if node is not a blank node, then list head found
        if(!graphTypes.isBlankNode(node)) {
          break;
        }
      }

      // the list is nested in another list
      if(property === RDF_FIRST) {
        // empty list
        if(node['@id'] === RDF_NIL) {
          // can't convert rdf:nil to a @list object because it would
          // result in a list of lists which isn't supported
          continue;
        }

        // preserve list head
        if(RDF_REST in graphObject[head['@id']]) {
          head = graphObject[head['@id']][RDF_REST][0];
        }

        list.pop();
        listNodes.pop();
      }

      // transform list into @list object
      delete head['@id'];
      head['@list'] = list.reverse();
      for(const listNode of listNodes) {
        delete graphObject[listNode];
      }
    }

    delete nil.usages;
  }

  const result = [];
  const subjects = Object.keys(defaultGraph).sort();
  for(const subject of subjects) {
    const node = defaultGraph[subject];
    if(subject in graphMap) {
      const graph = node['@graph'] = [];
      const graphObject = graphMap[subject];
      const graphSubjects = Object.keys(graphObject).sort();
      for(const graphSubject of graphSubjects) {
        const node = graphObject[graphSubject];
        // only add full subjects to top-level
        if(!graphTypes.isSubjectReference(node)) {
          graph.push(node);
        }
      }
    }
    // only add full subjects to top-level
    if(!graphTypes.isSubjectReference(node)) {
      result.push(node);
    }
  }

  return result;
};

/**
 * Converts an RDF triple object to a JSON-LD object.
 *
 * @param o the RDF triple object to convert.
 * @param useNativeTypes true to output native types, false not to.
 *
 * @return the JSON-LD object.
 */
function _RDFToObject(o, useNativeTypes) {
  // convert NamedNode/BlankNode object to JSON-LD
  if(o.termType.endsWith('Node')) {
    return {'@id': o.value};
  }

  // convert literal to JSON-LD
  const rval = {'@value': o.value};

  // add language
  if(o.language) {
    rval['@language'] = o.language;
  } else {
    let type = o.datatype.value;
    if(!type) {
      type = XSD_STRING;
    }
    // use native types for certain xsd types
    if(useNativeTypes) {
      if(type === XSD_BOOLEAN) {
        if(rval['@value'] === 'true') {
          rval['@value'] = true;
        } else if(rval['@value'] === 'false') {
          rval['@value'] = false;
        }
      } else if(types.isNumeric(rval['@value'])) {
        if(type === XSD_INTEGER) {
          const i = parseInt(rval['@value'], 10);
          if(i.toFixed(0) === rval['@value']) {
            rval['@value'] = i;
          }
        } else if(type === XSD_DOUBLE) {
          rval['@value'] = parseFloat(rval['@value']);
        }
      }
      // do not add native type
      if(![XSD_BOOLEAN, XSD_INTEGER, XSD_DOUBLE, XSD_STRING].includes(type)) {
        rval['@type'] = type;
      }
    } else if(type !== XSD_STRING) {
      rval['@type'] = type;
    }
  }

  return rval;
}

},{"./constants":9,"./graphTypes":17,"./types":21,"./util":23}],17:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const types = require('./types');

const api = {};
module.exports = api;

/**
 * Returns true if the given value is a subject with properties.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject with properties, false if not.
 */
api.isSubject = v => {
  // Note: A value is a subject if all of these hold true:
  // 1. It is an Object.
  // 2. It is not a @value, @set, or @list.
  // 3. It has more than 1 key OR any existing key is not @id.
  if(types.isObject(v) &&
    !(('@value' in v) || ('@set' in v) || ('@list' in v))) {
    const keyCount = Object.keys(v).length;
    return (keyCount > 1 || !('@id' in v));
  }
  return false;
};

/**
 * Returns true if the given value is a subject reference.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject reference, false if not.
 */
api.isSubjectReference = v =>
  // Note: A value is a subject reference if all of these hold true:
  // 1. It is an Object.
  // 2. It has a single key: @id.
  (types.isObject(v) && Object.keys(v).length === 1 && ('@id' in v));

/**
 * Returns true if the given value is a @value.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @value, false if not.
 */
api.isValue = v =>
  // Note: A value is a @value if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @value property.
  types.isObject(v) && ('@value' in v);

/**
 * Returns true if the given value is a @list.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @list, false if not.
 */
api.isList = v =>
  // Note: A value is a @list if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @list property.
  types.isObject(v) && ('@list' in v);

/**
 * Returns true if the given value is a @graph.
 *
 * @return true if the value is a @graph, false if not.
 */
api.isGraph = v => {
  // Note: A value is a graph if all of these hold true:
  // 1. It is an object.
  // 2. It has an `@graph` key.
  // 3. It may have '@id' or '@index'
  return types.isObject(v) &&
    '@graph' in v &&
    Object.keys(v)
      .filter(key => key !== '@id' && key !== '@index').length === 1;
};

/**
 * Returns true if the given value is a simple @graph.
 *
 * @return true if the value is a simple @graph, false if not.
 */
api.isSimpleGraph = v => {
  // Note: A value is a simple graph if all of these hold true:
  // 1. It is an object.
  // 2. It has an `@graph` key.
  // 3. It has only 1 key or 2 keys where one of them is `@index`.
  return api.isGraph(v) && !('@id' in v);
};

/**
 * Returns true if the given value is a blank node.
 *
 * @param v the value to check.
 *
 * @return true if the value is a blank node, false if not.
 */
api.isBlankNode = v => {
  // Note: A value is a blank node if all of these hold true:
  // 1. It is an Object.
  // 2. If it has an @id key its value begins with '_:'.
  // 3. It has no keys OR is not a @value, @set, or @list.
  if(types.isObject(v)) {
    if('@id' in v) {
      return (v['@id'].indexOf('_:') === 0);
    }
    return (Object.keys(v).length === 0 ||
      !(('@value' in v) || ('@set' in v) || ('@list' in v)));
  }
  return false;
};

},{"./types":21}],18:[function(require,module,exports){
(function (process,global){
/**
 * A JavaScript implementation of the JSON-LD API.
 *
 * @author Dave Longley
 *
 * @license BSD 3-Clause License
 * Copyright (c) 2011-2017 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const canonize = require('rdf-canonize');
const util = require('./util');
const IdentifierIssuer = util.IdentifierIssuer;
const JsonLdError = require('./JsonLdError');
const NQuads = require('./NQuads');
const Rdfa = require('./Rdfa');

const {expand: _expand} = require('./expand');
const {flatten: _flatten} = require('./flatten');
const {fromRDF: _fromRDF} = require('./fromRdf');
const {toRDF: _toRDF} = require('./toRdf');

const {
  frameMergedOrDefault: _frameMergedOrDefault
} = require('./frame');

const {
  isArray: _isArray,
  isObject: _isObject,
  isString: _isString
} = require('./types');

const {
  isSubjectReference: _isSubjectReference,
} = require('./graphTypes');

const {
  getInitialContext: _getInitialContext,
  process: _processContext,
  getAllContexts: _getAllContexts
} = require('./context');

const {
  compact: _compact,
  compactIri: _compactIri,
  removePreserve: _removePreserve
} = require('./compact');

const {
  createNodeMap: _createNodeMap,
  createMergedNodeMap: _createMergedNodeMap,
  mergeNodeMaps: _mergeNodeMaps
} = require('./nodeMap');

// determine if in-browser or using node.js
const _nodejs = (
  typeof process !== 'undefined' && process.versions && process.versions.node);
const _browser = !_nodejs &&
  (typeof window !== 'undefined' || typeof self !== 'undefined');

/* eslint-disable indent */
// attaches jsonld API to the given object
const wrapper = function(jsonld) {

/* Core API */

/**
 * Performs JSON-LD compaction.
 *
 * @param input the JSON-LD input to compact.
 * @param ctx the context to compact with.
 * @param [options] options to use:
 *          [base] the base IRI to use.
 *          [compactArrays] true to compact arrays to single values when
 *            appropriate, false not to (default: true).
 *          [compactToRelative] true to compact IRIs to be relative to document
 *            base, false to keep absolute (default: true)
 *          [graph] true to always output a top-level graph (default: false).
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 *          [expansionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 *          [framing] true if compaction is occuring during a framing operation.
 *          [compactionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 * @param [callback(err, compacted)] called once the operation completes.
 *
 * @return a Promise that resolves to the compacted output.
 */
jsonld.compact = util.callbackify(async function(input, ctx, options) {
  if(arguments.length < 2) {
    throw new TypeError('Could not compact, too few arguments.');
  }

  if(ctx === null) {
    throw new JsonLdError(
      'The compaction context must not be null.',
      'jsonld.CompactError', {code: 'invalid local context'});
  }

  // nothing to compact
  if(input === null) {
    return null;
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    compactArrays: true,
    compactToRelative: true,
    graph: false,
    skipExpansion: false,
    link: false,
    issuer: new IdentifierIssuer('_:b')
  });
  if(options.link) {
    // force skip expansion when linking, "link" is not part of the public
    // API, it should only be called from framing
    options.skipExpansion = true;
  }
  if(!options.compactToRelative) {
    delete options.base;
  }

  // expand input
  let expanded;
  if(options.skipExpansion) {
    expanded = input;
  } else {
    expanded = await jsonld.expand(input, options);
  }

  // process context
  const activeCtx = await jsonld.processContext(
    _getInitialContext(options), ctx, options);

  // do compaction
  let compacted = _compact({
    activeCtx,
    element: expanded,
    options,
    compactionMap: options.compactionMap
  });

  // perform clean up
  if(options.compactArrays && !options.graph && _isArray(compacted)) {
    if(compacted.length === 1) {
      // simplify to a single item
      compacted = compacted[0];
    } else if(compacted.length === 0) {
      // simplify to an empty object
      compacted = {};
    }
  } else if(options.graph && _isObject(compacted)) {
    // always use array if graph option is on
    compacted = [compacted];
  }

  // follow @context key
  if(_isObject(ctx) && '@context' in ctx) {
    ctx = ctx['@context'];
  }

  // build output context
  ctx = util.clone(ctx);
  if(!_isArray(ctx)) {
    ctx = [ctx];
  }
  // remove empty contexts
  const tmp = ctx;
  ctx = [];
  for(let i = 0; i < tmp.length; ++i) {
    if(!_isObject(tmp[i]) || Object.keys(tmp[i]).length > 0) {
      ctx.push(tmp[i]);
    }
  }

  // remove array if only one context
  const hasContext = (ctx.length > 0);
  if(ctx.length === 1) {
    ctx = ctx[0];
  }

  // add context and/or @graph
  if(_isArray(compacted)) {
    // use '@graph' keyword
    const graphAlias = _compactIri({
      activeCtx, iri: '@graph', relativeTo: {vocab: true}
    });
    const graph = compacted;
    compacted = {};
    if(hasContext) {
      compacted['@context'] = ctx;
    }
    compacted[graphAlias] = graph;
  } else if(_isObject(compacted) && hasContext) {
    // reorder keys so @context is first
    const graph = compacted;
    compacted = {'@context': ctx};
    for(const key in graph) {
      compacted[key] = graph[key];
    }
  }

  if(options.framing) {
    // get graph alias
    const graph = _compactIri({
      activeCtx, iri: '@graph', relativeTo: {vocab: true}
    });
    // remove @preserve from results
    options.link = {};
    compacted[graph] = _removePreserve(activeCtx, compacted[graph], options);
  }

  return compacted;
});

/**
 * Performs JSON-LD expansion.
 *
 * @param input the JSON-LD input to expand.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [keepFreeFloatingNodes] true to keep free-floating nodes,
 *            false not to, defaults to false.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 *          [expansionMap(info)] a function that can be used to custom map
 *            unmappable values (or to throw an error when they are detected);
 *            if this function returns `undefined` then the default behavior
 *            will be used.
 * @param [callback(err, expanded)] called once the operation completes.
 *
 * @return a Promise that resolves to the expanded output.
 */
jsonld.expand = util.callbackify(async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not expand, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    keepFreeFloatingNodes: false
  });
  if(options.expansionMap === false) {
    options.expansionMap = undefined;
  }

  // build set of objects that may have @contexts to resolve
  const toResolve = {};

  // build set of contexts to process prior to expansion
  const contextsToProcess = [];

  // if an `expandContext` has been given ensure it gets resolved
  if('expandContext' in options) {
    const expandContext = util.clone(options.expandContext);
    if(_isObject(expandContext) && '@context' in expandContext) {
      toResolve.expandContext = expandContext;
    } else {
      toResolve.expandContext = {'@context': expandContext};
    }
    contextsToProcess.push(toResolve.expandContext);
  }

  // if input is a string, attempt to dereference remote document
  let defaultBase;
  if(!_isString(input)) {
    // input is not a URL, do not need to retrieve it first
    toResolve.input = util.clone(input);
  } else {
    // load remote doc
    const remoteDoc = await jsonld.get(input, options);
    defaultBase = remoteDoc.documentUrl;
    toResolve.input = remoteDoc.document;
    if(remoteDoc.contextUrl) {
      // context included in HTTP link header and must be resolved
      toResolve.remoteContext = {'@context': remoteDoc.contextUrl};
      contextsToProcess.push(toResolve.remoteContext);
    }
  }

  // set default base
  if(!('base' in options)) {
    options.base = defaultBase || '';
  }

  // get all contexts in `toResolve`
  await _getAllContexts(toResolve, options);

  // process any additional contexts
  let activeCtx = _getInitialContext(options);
  contextsToProcess.forEach(localCtx => {
    activeCtx = _processContext({activeCtx, localCtx, options});
  });

  // expand resolved input
  let expanded = _expand({
    activeCtx,
    element: toResolve.input,
    options,
    expansionMap: options.expansionMap
  });

  // optimize away @graph with no other properties
  if(_isObject(expanded) && ('@graph' in expanded) &&
    Object.keys(expanded).length === 1) {
    expanded = expanded['@graph'];
  } else if(expanded === null) {
    expanded = [];
  }

  // normalize to an array
  if(!_isArray(expanded)) {
    expanded = [expanded];
  }

  return expanded;
});

/**
 * Performs JSON-LD flattening.
 *
 * @param input the JSON-LD to flatten.
 * @param ctx the context to use to compact the flattened output, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, flattened)] called once the operation completes.
 *
 * @return a Promise that resolves to the flattened output.
 */
jsonld.flatten = util.callbackify(async function(input, ctx, options) {
  if(arguments.length < 1) {
    return new TypeError('Could not flatten, too few arguments.');
  }

  if(typeof ctx === 'function') {
    ctx = null;
  } else {
    ctx = ctx || null;
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : ''
  });

  // expand input
  const expanded = await jsonld.expand(input, options);

  // do flattening
  const flattened = _flatten(expanded);

  if(ctx === null) {
    // no compaction required
    return flattened;
  }

  // compact result (force @graph option to true, skip expansion)
  options.graph = true;
  options.skipExpansion = true;
  const compacted = await jsonld.compact(flattened, ctx, options);

  return compacted;
});

/**
 * Performs JSON-LD framing.
 *
 * @param input the JSON-LD input to frame.
 * @param frame the JSON-LD frame to use.
 * @param [options] the framing options.
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [embed] default @embed flag: '@last', '@always', '@never', '@link'
 *            (default: '@last').
 *          [explicit] default @explicit flag (default: false).
 *          [requireAll] default @requireAll flag (default: true).
 *          [omitDefault] default @omitDefault flag (default: false).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, framed)] called once the operation completes.
 *
 * @return a Promise that resolves to the framed output.
 */
jsonld.frame = util.callbackify(async function(input, frame, options) {
  if(arguments.length < 2) {
    throw new TypeError('Could not frame, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    embed: '@last',
    explicit: false,
    requireAll: true,
    omitDefault: false,
    pruneBlankNodeIdentifiers: true,
    bnodesToClear: []
  });

  // if frame is a string, attempt to dereference remote document
  if(_isString(frame)) {
    // load remote doc
    const remoteDoc = await jsonld.get(frame, options);
    frame = remoteDoc.document;

    if(remoteDoc.contextUrl) {
      // inject link header @context into frame
      let ctx = frame['@context'];
      if(!ctx) {
        ctx = remoteDoc.contextUrl;
      } else if(_isArray(ctx)) {
        ctx.push(remoteDoc.contextUrl);
      } else {
        ctx = [ctx, remoteDoc.contextUrl];
      }
      frame['@context'] = ctx;
    }
  }

  const frameContext = frame ? frame['@context'] || {} : {};

  // expand input
  const expanded = await jsonld.expand(input, options);

  // expand frame
  const opts = util.clone(options);
  opts.isFrame = true;
  opts.keepFreeFloatingNodes = true;
  const expandedFrame = await jsonld.expand(frame, opts);

  // if the unexpanded frame includes a key expanding to @graph, frame the
  // default graph, otherwise, the merged graph
  let framed;
  // FIXME should look for aliases of @graph
  opts.merged = !('@graph' in frame);
  // do framing
  framed = _frameMergedOrDefault(expanded, expandedFrame, opts);

  // compact result (force @graph option to true, skip expansion,
  // check for linked embeds)
  opts.graph = true;
  opts.skipExpansion = true;
  opts.link = {};
  opts.framing = true;
  const compacted = await jsonld.compact(framed, frameContext, opts);

  return compacted;
});

/**
 * **Experimental**
 *
 * Links a JSON-LD document's nodes in memory.
 *
 * @param input the JSON-LD document to link.
 * @param [ctx] the JSON-LD context to apply.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, linked)] called once the operation completes.
 *
 * @return a Promise that resolves to the linked output.
 */
jsonld.link = util.callbackify(async function(input, ctx, options) {
  // API matches running frame with a wildcard frame and embed: '@link'
  // get arguments
  const frame = {};
  if(ctx) {
    frame['@context'] = ctx;
  }
  frame['@embed'] = '@link';
  return jsonld.frame(input, frame, options);
});

/**
 * Performs RDF dataset normalization on the given input. The input is JSON-LD
 * unless the 'inputFormat' option is used. The output is an RDF dataset
 * unless the 'format' option is used.
 *
 * @param input the input to normalize as JSON-LD or as a format specified by
 *          the 'inputFormat' option.
 * @param [options] the options to use:
 *          [algorithm] the normalization algorithm to use, `URDNA2015` or
 *            `URGNA2012` (default: `URDNA2015`).
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [inputFormat] the format if input is not JSON-LD:
 *            'application/n-quads' for N-Quads.
 *          [format] the format if output is a string:
 *            'application/n-quads' for N-Quads.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 *          [useNative] true to use a native canonize algorithm
 * @param [callback(err, normalized)] called once the operation completes.
 *
 * @return a Promise that resolves to the normalized output.
 */
jsonld.normalize = jsonld.canonize = util.callbackify(async function(
  input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not canonize, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    algorithm: 'URDNA2015',
    skipExpansion: false
  });
  if('inputFormat' in options) {
    if(options.inputFormat !== 'application/n-quads' &&
      options.inputFormat !== 'application/nquads') {
      throw new JsonLdError(
        'Unknown canonicalization input format.',
        'jsonld.CanonizeError');
    }
    // TODO: `await` for async parsers
    const parsedInput = NQuads.parse(input);

    // do canonicalization
    return canonize.canonize(parsedInput, options);
  }

  // convert to RDF dataset then do normalization
  const opts = util.clone(options);
  delete opts.format;
  opts.produceGeneralizedRdf = false;
  const dataset = await jsonld.toRDF(input, opts);

  // do canonicalization
  return canonize.canonize(dataset, options);
});

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset a serialized string of RDF in a format specified by the
 *          format option or an RDF dataset to convert.
 * @param [options] the options to use:
 *          [format] the format if dataset param must first be parsed:
 *            'application/n-quads' for N-Quads (default).
 *          [rdfParser] a custom RDF-parser to use to parse the dataset.
 *          [useRdfType] true to use rdf:type, false to use @type
 *            (default: false).
 *          [useNativeTypes] true to convert XSD types into native types
 *            (boolean, integer, double), false not to (default: false).
 * @param [callback(err, output)] called once the operation completes.
 *
 * @return a Promise that resolves to the JSON-LD document.
 */
jsonld.fromRDF = util.callbackify(async function(dataset, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not convert from RDF, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    format: _isString(dataset) ? 'application/n-quads' : undefined
  });

  let {format, rdfParser} = options;

  // handle special format
  if(format) {
    // check supported formats
    rdfParser = rdfParser || _rdfParsers[format];
    if(!rdfParser) {
      throw new JsonLdError(
        'Unknown input format.',
        'jsonld.UnknownFormat', {format});
    }
  } else {
    // no-op parser, assume dataset already parsed
    rdfParser = () => dataset;
  }

  // TODO: call `normalizeAsyncFn` on parser fn

  // rdfParser can be callback, promise-based, or synchronous
  let parsedDataset;
  if(rdfParser.length > 1) {
    // convert callback-based rdf parser to promise-based
    parsedDataset = new Promise((resolve, reject) => {
      rdfParser(dataset, (err, dataset) => {
        if(err) {
          reject(err);
        } else {
          resolve(dataset);
        }
      });
    });
  } else {
    parsedDataset = Promise.resolve(rdfParser(dataset));
  }

  parsedDataset = await parsedDataset;

  // back-compat with old parsers that produced legacy dataset format
  if(!Array.isArray(parsedDataset)) {
    parsedDataset = NQuads.legacyDatasetToQuads(parsedDataset);
  }

  return _fromRDF(parsedDataset, options);
});

/**
 * Outputs the RDF dataset found in the given JSON-LD object.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [format] the format to use to output a string:
 *            'application/n-quads' for N-Quads.
 *          [produceGeneralizedRdf] true to output generalized RDF, false
 *            to produce only standard RDF (default: false).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, dataset)] called once the operation completes.
 *
 * @return a Promise that resolves to the RDF dataset.
 */
jsonld.toRDF = util.callbackify(async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not convert to RDF, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : '',
    skipExpansion: false
  });

  // TODO: support toRDF custom map?
  let expanded;
  if(options.skipExpansion) {
    expanded = input;
  } else {
    // expand input
    expanded = await jsonld.expand(input, options);
  }

  // output RDF dataset
  const dataset = _toRDF(expanded, options);
  if(options.format) {
    if(options.format === 'application/n-quads' ||
      options.format === 'application/nquads') {
      return await NQuads.serialize(dataset);
    }
    throw new JsonLdError(
      'Unknown output format.',
      'jsonld.UnknownFormat', {format: options.format});
  }

  return dataset;
});

/**
 * **Experimental**
 *
 * Recursively flattens the nodes in the given JSON-LD input into a merged
 * map of node ID => node. All graphs will be merged into the default graph.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, nodeMap)] called once the operation completes.
 *
 * @return a Promise that resolves to the merged node map.
 */
jsonld.createNodeMap = util.callbackify(async function(input, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not create node map, too few arguments.');
  }

  // set default options
  options = _setDefaults(options, {
    base: _isString(input) ? input : ''
  });

  // expand input
  const expanded = await jsonld.expand(input, options);

  return _createMergedNodeMap(expanded, options);
});

/**
 * **Experimental**
 *
 * Merges two or more JSON-LD documents into a single flattened document.
 *
 * @param docs the JSON-LD documents to merge together.
 * @param ctx the context to use to compact the merged result, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [mergeNodes] true to merge properties for nodes with the same ID,
 *            false to ignore new properties for nodes with the same ID once
 *            the ID has been defined; note that this may not prevent merging
 *            new properties where a node is in the `object` position
 *            (default: true).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, merged)] called once the operation completes.
 *
 * @return a Promise that resolves to the merged output.
 */
jsonld.merge = util.callbackify(async function(docs, ctx, options) {
  if(arguments.length < 1) {
    throw new TypeError('Could not merge, too few arguments.');
  }
  if(!_isArray(docs)) {
    throw new TypeError('Could not merge, "docs" must be an array.');
  }

  if(typeof ctx === 'function') {
    ctx = null;
  } else {
    ctx = ctx || null;
  }

  // set default options
  options = _setDefaults(options, {});

  // expand all documents
  const expanded = await Promise.all(docs.map(doc => {
    const opts = Object.assign({}, options);
    return jsonld.expand(doc, opts);
  }));

  let mergeNodes = true;
  if('mergeNodes' in options) {
    mergeNodes = options.mergeNodes;
  }

  const issuer = options.issuer || new IdentifierIssuer('_:b');
  const graphs = {'@default': {}};

  for(let i = 0; i < expanded.length; ++i) {
    // uniquely relabel blank nodes
    const doc = util.relabelBlankNodes(expanded[i], {
      issuer: new IdentifierIssuer('_:b' + i + '-')
    });

    // add nodes to the shared node map graphs if merging nodes, to a
    // separate graph set if not
    const _graphs = (mergeNodes || i === 0) ? graphs : {'@default': {}};
    _createNodeMap(doc, _graphs, '@default', issuer);

    if(_graphs !== graphs) {
      // merge document graphs but don't merge existing nodes
      for(const graphName in _graphs) {
        const _nodeMap = _graphs[graphName];
        if(!(graphName in graphs)) {
          graphs[graphName] = _nodeMap;
          continue;
        }
        const nodeMap = graphs[graphName];
        for(const key in _nodeMap) {
          if(!(key in nodeMap)) {
            nodeMap[key] = _nodeMap[key];
          }
        }
      }
    }
  }

  // add all non-default graphs to default graph
  const defaultGraph = _mergeNodeMaps(graphs);

  // produce flattened output
  const flattened = [];
  const keys = Object.keys(defaultGraph).sort();
  for(let ki = 0; ki < keys.length; ++ki) {
    const node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }

  if(ctx === null) {
    return flattened;
  }

  // compact result (force @graph option to true, skip expansion)
  options.graph = true;
  options.skipExpansion = true;
  const compacted = await jsonld.compact(flattened, ctx, options);

  return compacted;
});

/**
 * The default document loader for external documents. If the environment
 * is node.js, a callback-continuation-style document loader is used; otherwise,
 * a promises-style document loader is used.
 *
 * @param url the URL to load.
 * @param callback(err, remoteDoc) called once the operation completes,
 *          if using a non-promises API.
 *
 * @return a promise, if using a promises API.
 */
Object.defineProperty(jsonld, 'documentLoader', {
  get: () => jsonld._documentLoader,
  set: v => jsonld._documentLoader = util.normalizeDocumentLoader(v)
});
// default document loader not implemented
jsonld.documentLoader = async url => {
  throw new JsonLdError(
    'Could not retrieve a JSON-LD document from the URL. URL ' +
    'dereferencing not implemented.', 'jsonld.LoadDocumentError',
    {code: 'loading document failed', url});
};

/**
 * Deprecated default document loader. Do not use or override.
 */
jsonld.loadDocument = util.callbackify(async function() {
  return jsonld.documentLoader.apply(null, arguments);
});

/**
 * Gets a remote JSON-LD document using the default document loader or
 * one given in the passed options.
 *
 * @param url the URL to fetch.
 * @param [options] the options to use:
 *          [documentLoader] the document loader to use.
 * @param [callback(err, remoteDoc)] called once the operation completes.
 *
 * @return a Promise that resolves to the retrieved remote document.
 */
jsonld.get = util.callbackify(async function(url, options) {
  let load;
  if(typeof options.documentLoader === 'function') {
    load = util.normalizeDocumentLoader(options.documentLoader);
  } else {
    load = jsonld.documentLoader;
  }

  const remoteDoc = await load(url);

  // TODO: can this be moved into `normalizeDocumentLoader`?
  try {
    if(!remoteDoc.document) {
      throw new JsonLdError(
        'No remote document found at the given URL.',
        'jsonld.NullRemoteDocument');
    }
    if(_isString(remoteDoc.document)) {
      remoteDoc.document = JSON.parse(remoteDoc.document);
    }
  } catch(e) {
    throw new JsonLdError(
      'Could not retrieve a JSON-LD document from the URL.',
      'jsonld.LoadDocumentError', {
        code: 'loading document failed',
        cause: e,
        remoteDoc
      });
  }

  return remoteDoc;
});

/**
 * Processes a local context, resolving any URLs as necessary, and returns a
 * new active context in its callback.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param [options] the options to use:
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param [callback(err, activeCtx)] called once the operation completes.
 *
 * @return a Promise that resolves to the new active context.
 */
jsonld.processContext = util.callbackify(async function(
  activeCtx, localCtx, options) {
  // set default options
  options = _setDefaults(options, {
    base: ''
  });

  // return initial context early for null context
  if(localCtx === null) {
    return _getInitialContext(options);
  }

  // get URLs in localCtx
  localCtx = util.clone(localCtx);
  if(!(_isObject(localCtx) && '@context' in localCtx)) {
    localCtx = {'@context': localCtx};
  }
  const ctx = await _getAllContexts(localCtx, options);

  return _processContext({activeCtx, localCtx: ctx, options});
});

// backwards compatibility
jsonld.getContextValue = require('./context').getContextValue;

/**
 * Document loaders.
 */
jsonld.documentLoaders = {};
jsonld.documentLoaders.node = require('./documentLoaders/node');
jsonld.documentLoaders.xhr = require('./documentLoaders/xhr');

/**
 * Assigns the default document loader for external document URLs to a built-in
 * default. Supported types currently include: 'xhr' and 'node'.
 *
 * @param type the type to set.
 * @param [params] the parameters required to use the document loader.
 */
jsonld.useDocumentLoader = function(type) {
  if(!(type in jsonld.documentLoaders)) {
    throw new JsonLdError(
      'Unknown document loader type: "' + type + '"',
      'jsonld.UnknownDocumentLoader',
      {type});
  }

  // set document loader
  jsonld.documentLoader = jsonld.documentLoaders[type].apply(
    jsonld, Array.prototype.slice.call(arguments, 1));
};

/** Registered RDF dataset parsers hashed by content-type. */
const _rdfParsers = {};

/**
 * Registers an RDF dataset parser by content-type, for use with
 * jsonld.fromRDF. An RDF dataset parser will always be given two parameters,
 * a string of input and a callback. An RDF dataset parser can be synchronous
 * or asynchronous.
 *
 * If the parser function returns undefined or null then it will be assumed to
 * be asynchronous w/a continuation-passing style and the callback parameter
 * given to the parser MUST be invoked.
 *
 * If it returns a Promise, then it will be assumed to be asynchronous, but the
 * callback parameter MUST NOT be invoked. It should instead be ignored.
 *
 * If it returns an RDF dataset, it will be assumed to be synchronous and the
 * callback parameter MUST NOT be invoked. It should instead be ignored.
 *
 * @param contentType the content-type for the parser.
 * @param parser(input, callback(err, dataset)) the parser function (takes a
 *          string as a parameter and either returns null/undefined and uses
 *          the given callback, returns a Promise, or returns an RDF dataset).
 */
jsonld.registerRDFParser = function(contentType, parser) {
  _rdfParsers[contentType] = parser;
};

/**
 * Unregisters an RDF dataset parser by content-type.
 *
 * @param contentType the content-type for the parser.
 */
jsonld.unregisterRDFParser = function(contentType) {
  delete _rdfParsers[contentType];
};

// register the N-Quads RDF parser
jsonld.registerRDFParser('application/n-quads', NQuads.parse);
jsonld.registerRDFParser('application/nquads', NQuads.parse);

// register the RDFa API RDF parser
jsonld.registerRDFParser('rdfa-api', Rdfa.parse);

/* URL API */
jsonld.url = require('./url');

/* Utility API */
jsonld.util = util;
// backwards compatibility
Object.assign(jsonld, util);

// reexpose API as jsonld.promises for backwards compatability
jsonld.promises = jsonld;

// backwards compatibility
jsonld.RequestQueue = require('./RequestQueue');

/* WebIDL API */
jsonld.JsonLdProcessor = require('./JsonLdProcessor')(jsonld);

// setup browser global JsonLdProcessor
if(_browser && typeof global.JsonLdProcessor === 'undefined') {
  Object.defineProperty(global, 'JsonLdProcessor', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: jsonld.JsonLdProcessor
  });
}

// set platform-specific defaults/APIs
if(_nodejs) {
  // use node document loader by default
  jsonld.useDocumentLoader('node');
} else if(typeof XMLHttpRequest !== 'undefined') {
  // use xhr document loader by default
  jsonld.useDocumentLoader('xhr');
}

function _setDefaults(options, {
  documentLoader = jsonld.documentLoader,
  ...defaults
}) {
  return Object.assign({}, {documentLoader}, defaults, options);
}

// end of jsonld API `wrapper` factory
return jsonld;
};

// external APIs:

// used to generate a new jsonld API instance
const factory = function() {
  return wrapper(function() {
    return factory();
  });
};

// wrap the main jsonld API instance
wrapper(factory);
// export API
module.exports = factory;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./JsonLdError":3,"./JsonLdProcessor":4,"./NQuads":5,"./Rdfa":6,"./RequestQueue":7,"./compact":8,"./context":10,"./documentLoaders/node":11,"./documentLoaders/xhr":12,"./expand":13,"./flatten":14,"./frame":15,"./fromRdf":16,"./graphTypes":17,"./nodeMap":19,"./toRdf":20,"./types":21,"./url":22,"./util":23,"_process":31,"rdf-canonize":41}],19:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {isKeyword} = require('./context');
const graphTypes = require('./graphTypes');
const types = require('./types');
const util = require('./util');
const JsonLdError = require('./JsonLdError');

const api = {};
module.exports = api;

/**
 * Creates a merged JSON-LD node map (node ID => node).
 *
 * @param input the expanded JSON-LD to create a node map of.
 * @param [options] the options to use:
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *
 * @return the node map.
 */
api.createMergedNodeMap = (input, options) => {
  options = options || {};

  // produce a map of all subjects and name each bnode
  const issuer = options.issuer || new util.IdentifierIssuer('_:b');
  const graphs = {'@default': {}};
  api.createNodeMap(input, graphs, '@default', issuer);

  // add all non-default graphs to default graph
  return api.mergeNodeMaps(graphs);
};

/**
 * Recursively flattens the subjects in the given JSON-LD expanded input
 * into a node map.
 *
 * @param input the JSON-LD expanded input.
 * @param graphs a map of graph name to subject map.
 * @param graph the name of the current graph.
 * @param issuer the blank node identifier issuer.
 * @param name the name assigned to the current input if it is a bnode.
 * @param list the list to append to, null for none.
 */
api.createNodeMap = (input, graphs, graph, issuer, name, list) => {
  // recurse through array
  if(types.isArray(input)) {
    for(let i = 0; i < input.length; ++i) {
      api.createNodeMap(input[i], graphs, graph, issuer, undefined, list);
    }
    return;
  }

  // add non-object to list
  if(!types.isObject(input)) {
    if(list) {
      list.push(input);
    }
    return;
  }

  // add values to list
  if(graphTypes.isValue(input)) {
    if('@type' in input) {
      let type = input['@type'];
      // rename @type blank node
      if(type.indexOf('_:') === 0) {
        input['@type'] = type = issuer.getId(type);
      }
    }
    if(list) {
      list.push(input);
    }
    return;
  }

  // Note: At this point, input must be a subject.

  // spec requires @type to be named first, so assign names early
  if('@type' in input) {
    const types = input['@type'];
    for(let i = 0; i < types.length; ++i) {
      const type = types[i];
      if(type.indexOf('_:') === 0) {
        issuer.getId(type);
      }
    }
  }

  // get name for subject
  if(types.isUndefined(name)) {
    name = graphTypes.isBlankNode(input) ?
      issuer.getId(input['@id']) : input['@id'];
  }

  // add subject reference to list
  if(list) {
    list.push({'@id': name});
  }

  // create new subject or merge into existing one
  const subjects = graphs[graph];
  const subject = subjects[name] = subjects[name] || {};
  subject['@id'] = name;
  const properties = Object.keys(input).sort();
  for(let pi = 0; pi < properties.length; ++pi) {
    let property = properties[pi];

    // skip @id
    if(property === '@id') {
      continue;
    }

    // handle reverse properties
    if(property === '@reverse') {
      const referencedNode = {'@id': name};
      const reverseMap = input['@reverse'];
      for(const reverseProperty in reverseMap) {
        const items = reverseMap[reverseProperty];
        for(let ii = 0; ii < items.length; ++ii) {
          const item = items[ii];
          let itemName = item['@id'];
          if(graphTypes.isBlankNode(item)) {
            itemName = issuer.getId(itemName);
          }
          api.createNodeMap(item, graphs, graph, issuer, itemName);
          util.addValue(
            subjects[itemName], reverseProperty, referencedNode,
            {propertyIsArray: true, allowDuplicate: false});
        }
      }
      continue;
    }

    // recurse into graph
    if(property === '@graph') {
      // add graph subjects map entry
      if(!(name in graphs)) {
        graphs[name] = {};
      }
      api.createNodeMap(input[property], graphs, name, issuer);
      continue;
    }

    // copy non-@type keywords
    if(property !== '@type' && isKeyword(property)) {
      if(property === '@index' && property in subject &&
        (input[property] !== subject[property] ||
        input[property]['@id'] !== subject[property]['@id'])) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; conflicting @index property detected.',
          'jsonld.SyntaxError',
          {code: 'conflicting indexes', subject});
      }
      subject[property] = input[property];
      continue;
    }

    // iterate over objects
    const objects = input[property];

    // if property is a bnode, assign it a new id
    if(property.indexOf('_:') === 0) {
      property = issuer.getId(property);
    }

    // ensure property is added for empty arrays
    if(objects.length === 0) {
      util.addValue(subject, property, [], {propertyIsArray: true});
      continue;
    }
    for(let oi = 0; oi < objects.length; ++oi) {
      let o = objects[oi];

      if(property === '@type') {
        // rename @type blank nodes
        o = (o.indexOf('_:') === 0) ? issuer.getId(o) : o;
      }

      // handle embedded subject or subject reference
      if(graphTypes.isSubject(o) || graphTypes.isSubjectReference(o)) {
        // relabel blank node @id
        const id = graphTypes.isBlankNode(o) ?
          issuer.getId(o['@id']) : o['@id'];

        // add reference and recurse
        util.addValue(
          subject, property, {'@id': id},
          {propertyIsArray: true, allowDuplicate: false});
        api.createNodeMap(o, graphs, graph, issuer, id);
      } else if(graphTypes.isList(o)) {
        // handle @list
        const _list = [];
        api.createNodeMap(o['@list'], graphs, graph, issuer, name, _list);
        o = {'@list': _list};
        util.addValue(
          subject, property, o,
          {propertyIsArray: true, allowDuplicate: false});
      } else {
        // handle @value
        api.createNodeMap(o, graphs, graph, issuer, name);
        util.addValue(
          subject, property, o, {propertyIsArray: true, allowDuplicate: false});
      }
    }
  }
};

/**
 * Merge separate named graphs into a single merged graph including
 * all nodes from the default graph and named graphs.
 *
 * @param graphs a map of graph name to subject map.
 *
 * @return the merged graph map.
 */
api.mergeNodeMapGraphs = graphs => {
  const merged = {};
  for(const name of Object.keys(graphs).sort()) {
    for(const id of Object.keys(graphs[name]).sort()) {
      const node = graphs[name][id];
      if(!(id in merged)) {
        merged[id] = {'@id': id};
      }
      const mergedNode = merged[id];

      for(const property of Object.keys(node).sort()) {
        if(isKeyword(property)) {
          // copy keywords
          mergedNode[property] = util.clone(node[property]);
        } else {
          // merge objects
          for(const value of node[property]) {
            util.addValue(
              mergedNode, property, util.clone(value),
              {propertyIsArray: true, allowDuplicate: false});
          }
        }
      }
    }
  }

  return merged;
};

api.mergeNodeMaps = graphs => {
  // add all non-default graphs to default graph
  const defaultGraph = graphs['@default'];
  const graphNames = Object.keys(graphs).sort();
  for(let i = 0; i < graphNames.length; ++i) {
    const graphName = graphNames[i];
    if(graphName === '@default') {
      continue;
    }
    const nodeMap = graphs[graphName];
    let subject = defaultGraph[graphName];
    if(!subject) {
      defaultGraph[graphName] = subject = {
        '@id': graphName,
        '@graph': []
      };
    } else if(!('@graph' in subject)) {
      subject['@graph'] = [];
    }
    const graph = subject['@graph'];
    const ids = Object.keys(nodeMap).sort();
    for(let ii = 0; ii < ids.length; ++ii) {
      const node = nodeMap[ids[ii]];
      // only add full subjects
      if(!graphTypes.isSubjectReference(node)) {
        graph.push(node);
      }
    }
  }
  return defaultGraph;
};

},{"./JsonLdError":3,"./context":10,"./graphTypes":17,"./types":21,"./util":23}],20:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {createNodeMap} = require('./nodeMap');
const {isKeyword} = require('./context');
const graphTypes = require('./graphTypes');
const types = require('./types');
const util = require('./util');

const {
  // RDF,
  // RDF_LIST,
  RDF_FIRST,
  RDF_REST,
  RDF_NIL,
  RDF_TYPE,
  // RDF_PLAIN_LITERAL,
  // RDF_XML_LITERAL,
  // RDF_OBJECT,
  RDF_LANGSTRING,

  // XSD,
  XSD_BOOLEAN,
  XSD_DOUBLE,
  XSD_INTEGER,
  XSD_STRING,
} = require('./constants');

const {
  isAbsolute: _isAbsoluteIri
} = require('./url');

const api = {};
module.exports = api;

/**
 * Outputs an RDF dataset for the expanded JSON-LD input.
 *
 * @param input the expanded JSON-LD input.
 * @param options the RDF serialization options.
 *
 * @return the RDF dataset.
 */
api.toRDF = (input, options) => {
  // create node map for default graph (and any named graphs)
  const issuer = new util.IdentifierIssuer('_:b');
  const nodeMap = {'@default': {}};
  createNodeMap(input, nodeMap, '@default', issuer);

  const dataset = [];
  const graphNames = Object.keys(nodeMap).sort();
  for(const graphName of graphNames) {
    let graphTerm;
    if(graphName === '@default') {
      graphTerm = {termType: 'DefaultGraph', value: ''};
    } else if(_isAbsoluteIri(graphName)) {
      if(graphName.startsWith('_:')) {
        graphTerm = {termType: 'BlankNode'};
      } else {
        graphTerm = {termType: 'NamedNode'};
      }
      graphTerm.value = graphName;
    } else {
      // skip relative IRIs (not valid RDF)
      continue;
    }
    _graphToRDF(dataset, nodeMap[graphName], graphTerm, issuer, options);
  }

  return dataset;
};

/**
 * Adds RDF quads for a particular graph to the given dataset.
 *
 * @param dataset the dataset to append RDF quads to.
 * @param graph the graph to create RDF quads for.
 * @param graphTerm the graph term for each quad.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param options the RDF serialization options.
 *
 * @return the array of RDF triples for the given graph.
 */
function _graphToRDF(dataset, graph, graphTerm, issuer, options) {
  const ids = Object.keys(graph).sort();
  for(let i = 0; i < ids.length; ++i) {
    const id = ids[i];
    const node = graph[id];
    const properties = Object.keys(node).sort();
    for(let property of properties) {
      const items = node[property];
      if(property === '@type') {
        property = RDF_TYPE;
      } else if(isKeyword(property)) {
        continue;
      }

      for(const item of items) {
        // RDF subject
        const subject = {
          termType: id.startsWith('_:') ? 'BlankNode' : 'NamedNode',
          value: id
        };

        // skip relative IRI subjects (not valid RDF)
        if(!_isAbsoluteIri(id)) {
          continue;
        }

        // RDF predicate
        const predicate = {
          termType: property.startsWith('_:') ? 'BlankNode' : 'NamedNode',
          value: property
        };

        // skip relative IRI predicates (not valid RDF)
        if(!_isAbsoluteIri(property)) {
          continue;
        }

        // skip blank node predicates unless producing generalized RDF
        if(predicate.termType === 'BlankNode' &&
          !options.produceGeneralizedRdf) {
          continue;
        }

        // convert @list to triples
        if(graphTypes.isList(item)) {
          _listToRDF(
            item['@list'], issuer, subject, predicate, dataset, graphTerm);
        } else {
          // convert value or node object to triple
          const object = _objectToRDF(item);
          // skip null objects (they are relative IRIs)
          if(object) {
            dataset.push({
              subject,
              predicate,
              object,
              graph: graphTerm
            });
          }
        }
      }
    }
  }
}

/**
 * Converts a @list value into linked list of blank node RDF quads
 * (an RDF collection).
 *
 * @param list the @list value.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param subject the subject for the head of the list.
 * @param predicate the predicate for the head of the list.
 * @param dataset the array of quads to append to.
 * @param graphTerm the graph term for each quad.
 */
function _listToRDF(list, issuer, subject, predicate, dataset, graphTerm) {
  const first = {termType: 'NamedNode', value: RDF_FIRST};
  const rest = {termType: 'NamedNode', value: RDF_REST};
  const nil = {termType: 'NamedNode', value: RDF_NIL};

  for(const item of list) {
    const blankNode = {termType: 'BlankNode', value: issuer.getId()};
    dataset.push({
      subject,
      predicate,
      object: blankNode,
      graph: graphTerm
    });

    subject = blankNode;
    predicate = first;
    const object = _objectToRDF(item);

    // skip null objects (they are relative IRIs)
    if(object) {
      dataset.push({
        subject,
        predicate,
        object,
        graph: graphTerm
      });
    }

    predicate = rest;
  }

  dataset.push({
    subject,
    predicate,
    object: nil,
    graph: graphTerm
  });
}

/**
 * Converts a JSON-LD value object to an RDF literal or a JSON-LD string or
 * node object to an RDF resource.
 *
 * @param item the JSON-LD value or node object.
 *
 * @return the RDF literal or RDF resource.
 */
function _objectToRDF(item) {
  const object = {};

  // convert value object to RDF
  if(graphTypes.isValue(item)) {
    object.termType = 'Literal';
    object.value = undefined;
    object.datatype = {
      termType: 'NamedNode'
    };
    let value = item['@value'];
    const datatype = item['@type'] || null;

    // convert to XSD datatypes as appropriate
    if(types.isBoolean(value)) {
      object.value = value.toString();
      object.datatype.value = datatype || XSD_BOOLEAN;
    } else if(types.isDouble(value) || datatype === XSD_DOUBLE) {
      if(!types.isDouble(value)) {
        value = parseFloat(value);
      }
      // canonical double representation
      object.value = value.toExponential(15).replace(/(\d)0*e\+?/, '$1E');
      object.datatype.value = datatype || XSD_DOUBLE;
    } else if(types.isNumber(value)) {
      object.value = value.toFixed(0);
      object.datatype.value = datatype || XSD_INTEGER;
    } else if('@language' in item) {
      object.value = value;
      object.datatype.value = datatype || RDF_LANGSTRING;
      object.language = item['@language'];
    } else {
      object.value = value;
      object.datatype.value = datatype || XSD_STRING;
    }
  } else {
    // convert string/node object to RDF
    const id = types.isObject(item) ? item['@id'] : item;
    object.termType = id.startsWith('_:') ? 'BlankNode' : 'NamedNode';
    object.value = id;
  }

  // skip relative IRIs, not valid RDF
  if(object.termType === 'NamedNode' && !_isAbsoluteIri(object.value)) {
    return null;
  }

  return object;
}

},{"./constants":9,"./context":10,"./graphTypes":17,"./nodeMap":19,"./types":21,"./url":22,"./util":23}],21:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const api = {};
module.exports = api;

/**
 * Returns true if the given value is an Array.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Array, false if not.
 */
api.isArray = Array.isArray;

/**
 * Returns true if the given value is a Boolean.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Boolean, false if not.
 */
api.isBoolean = v => (typeof v === 'boolean' ||
  Object.prototype.toString.call(v) === '[object Boolean]');

/**
 * Returns true if the given value is a double.
 *
 * @param v the value to check.
 *
 * @return true if the value is a double, false if not.
 */
api.isDouble = v => api.isNumber(v) && String(v).indexOf('.') !== -1;

/**
 * Returns true if the given value is an empty Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an empty Object, false if not.
 */
api.isEmptyObject = v => api.isObject(v) && Object.keys(v).length === 0;

/**
 * Returns true if the given value is a Number.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Number, false if not.
 */
api.isNumber = v => (typeof v === 'number' ||
  Object.prototype.toString.call(v) === '[object Number]');

/**
 * Returns true if the given value is numeric.
 *
 * @param v the value to check.
 *
 * @return true if the value is numeric, false if not.
 */
api.isNumeric = v => !isNaN(parseFloat(v)) && isFinite(v);

/**
 * Returns true if the given value is an Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Object, false if not.
 */
api.isObject = v => Object.prototype.toString.call(v) === '[object Object]';

/**
 * Returns true if the given value is a String.
 *
 * @param v the value to check.
 *
 * @return true if the value is a String, false if not.
 */
api.isString = v => (typeof v === 'string' ||
  Object.prototype.toString.call(v) === '[object String]');

/**
 * Returns true if the given value is undefined.
 *
 * @param v the value to check.
 *
 * @return true if the value is undefined, false if not.
 */
api.isUndefined = v => typeof v === 'undefined';

},{}],22:[function(require,module,exports){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const types = require('./types');

const api = {};
module.exports = api;

// define URL parser
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// with local jsonld.js modifications
api.parsers = {
  simple: {
    // RFC 3986 basic parts
    keys: [
      'href', 'scheme', 'authority', 'path', 'query', 'fragment'
    ],
    regex: /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  },
  full: {
    keys: [
      'href', 'protocol', 'scheme', 'authority', 'auth', 'user', 'password',
      'hostname', 'port', 'path', 'directory', 'file', 'query', 'fragment'
    ],
    regex: /^(([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:(((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
api.parse = (str, parser) => {
  const parsed = {};
  const o = api.parsers[parser || 'full'];
  const m = o.regex.exec(str);
  let i = o.keys.length;
  while(i--) {
    parsed[o.keys[i]] = (m[i] === undefined) ? null : m[i];
  }

  // remove default ports in found in URLs
  if((parsed.scheme === 'https' && parsed.port === '443') ||
    (parsed.scheme === 'http' && parsed.port === '80')) {
    parsed.href = parsed.href.replace(':' + parsed.port, '');
    parsed.authority = parsed.authority.replace(':' + parsed.port, '');
    parsed.port = null;
  }

  parsed.normalizedPath = api.removeDotSegments(parsed.path);
  return parsed;
};

/**
 * Prepends a base IRI to the given relative IRI.
 *
 * @param base the base IRI.
 * @param iri the relative IRI.
 *
 * @return the absolute IRI.
 */
api.prependBase = (base, iri) => {
  // skip IRI processing
  if(base === null) {
    return iri;
  }
  // already an absolute IRI
  if(iri.indexOf(':') !== -1) {
    return iri;
  }

  // parse base if it is a string
  if(types.isString(base)) {
    base = api.parse(base || '');
  }

  // parse given IRI
  const rel = api.parse(iri);

  // per RFC3986 5.2.2
  const transform = {
    protocol: base.protocol || ''
  };

  if(rel.authority !== null) {
    transform.authority = rel.authority;
    transform.path = rel.path;
    transform.query = rel.query;
  } else {
    transform.authority = base.authority;

    if(rel.path === '') {
      transform.path = base.path;
      if(rel.query !== null) {
        transform.query = rel.query;
      } else {
        transform.query = base.query;
      }
    } else {
      if(rel.path.indexOf('/') === 0) {
        // IRI represents an absolute path
        transform.path = rel.path;
      } else {
        // merge paths
        let path = base.path;

        // append relative path to the end of the last directory from base
        path = path.substr(0, path.lastIndexOf('/') + 1);
        if(path.length > 0 && path.substr(-1) !== '/') {
          path += '/';
        }
        path += rel.path;

        transform.path = path;
      }
      transform.query = rel.query;
    }
  }

  if(rel.path !== '') {
    // remove slashes and dots in path
    transform.path = api.removeDotSegments(transform.path);
  }

  // construct URL
  let rval = transform.protocol;
  if(transform.authority !== null) {
    rval += '//' + transform.authority;
  }
  rval += transform.path;
  if(transform.query !== null) {
    rval += '?' + transform.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
};

/**
 * Removes a base IRI from the given absolute IRI.
 *
 * @param base the base IRI.
 * @param iri the absolute IRI.
 *
 * @return the relative IRI if relative to base, otherwise the absolute IRI.
 */
api.removeBase = (base, iri) => {
  // skip IRI processing
  if(base === null) {
    return iri;
  }

  if(types.isString(base)) {
    base = api.parse(base || '');
  }

  // establish base root
  let root = '';
  if(base.href !== '') {
    root += (base.protocol || '') + '//' + (base.authority || '');
  } else if(iri.indexOf('//')) {
    // support network-path reference with empty base
    root += '//';
  }

  // IRI not relative to base
  if(iri.indexOf(root) !== 0) {
    return iri;
  }

  // remove root from IRI and parse remainder
  const rel = api.parse(iri.substr(root.length));

  // remove path segments that match (do not remove last segment unless there
  // is a hash or query)
  const baseSegments = base.normalizedPath.split('/');
  const iriSegments = rel.normalizedPath.split('/');
  const last = (rel.fragment || rel.query) ? 0 : 1;
  while(baseSegments.length > 0 && iriSegments.length > last) {
    if(baseSegments[0] !== iriSegments[0]) {
      break;
    }
    baseSegments.shift();
    iriSegments.shift();
  }

  // use '../' for each non-matching base segment
  let rval = '';
  if(baseSegments.length > 0) {
    // don't count the last segment (if it ends with '/' last path doesn't
    // count and if it doesn't end with '/' it isn't a path)
    baseSegments.pop();
    for(let i = 0; i < baseSegments.length; ++i) {
      rval += '../';
    }
  }

  // prepend remaining segments
  rval += iriSegments.join('/');

  // add query and hash
  if(rel.query !== null) {
    rval += '?' + rel.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
};

/**
 * Removes dot segments from a URL path.
 *
 * @param path the path to remove dot segments from.
 */
api.removeDotSegments = path => {
  // RFC 3986 5.2.4 (reworked)

  // empty path shortcut
  if(path.length === 0) {
    return '';
  }

  const input = path.split('/');
  const output = [];

  while(input.length > 0) {
    const next = input.shift();
    const done = input.length === 0;

    if(next === '.') {
      if(done) {
        // ensure output has trailing /
        output.push('');
      }
      continue;
    }

    if(next === '..') {
      output.pop();
      if(done) {
        // ensure output has trailing /
        output.push('');
      }
      continue;
    }

    output.push(next);
  }

  // ensure output has leading /
  if(output.length > 0 && output[0] !== '') {
    output.unshift('');
  }
  if(output.length === 1 && output[0] === '') {
    return '/';
  }

  return output.join('/');
};

// TODO: time better isAbsolute/isRelative checks using full regexes:
// http://jmrware.com/articles/2009/uri_regexp/URI_regex.html

// regex to check for absolute IRI (starting scheme and ':') or blank node IRI
const isAbsoluteRegex = /^([A-Za-z][A-Za-z0-9+-.]*|_):/;

/**
 * Returns true if the given value is an absolute IRI or blank node IRI, false
 * if not.
 * Note: This weak check only checks for a correct starting scheme.
 *
 * @param v the value to check.
 *
 * @return true if the value is an absolute IRI, false if not.
 */
api.isAbsolute = v => types.isString(v) && isAbsoluteRegex.test(v);

/**
 * Returns true if the given value is a relative IRI, false if not.
 * Note: this is a weak check.
 *
 * @param v the value to check.
 *
 * @return true if the value is a relative IRI, false if not.
 */
api.isRelative = v => types.isString(v);

},{"./types":21}],23:[function(require,module,exports){
(function (process,setImmediate){
/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const graphTypes = require('./graphTypes');
const types = require('./types');
// TODO: move `IdentifierIssuer` to its own package
const IdentifierIssuer = require('rdf-canonize').IdentifierIssuer;
const JsonLdError = require('./JsonLdError');

// constants
const REGEX_LINK_HEADERS = /(?:<[^>]*?>|"[^"]*?"|[^,])+/g;
const REGEX_LINK_HEADER = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
const REGEX_LINK_HEADER_PARAMS =
  /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;

const DEFAULTS = {
  headers: {
    accept: 'application/ld+json, application/json'
  }
};

const api = {};
module.exports = api;
api.IdentifierIssuer = IdentifierIssuer;

// define setImmediate and nextTick
// // nextTick implementation with browser-compatible fallback // //
// from https://github.com/caolan/async/blob/master/lib/async.js

// capture the global reference to guard against fakeTimer mocks
const _setImmediate = typeof setImmediate === 'function' && setImmediate;

const _delay = _setImmediate ?
  // not a direct alias (for IE10 compatibility)
  fn => _setImmediate(fn) :
  fn => setTimeout(fn, 0);

if(typeof process === 'object' && typeof process.nextTick === 'function') {
  api.nextTick = process.nextTick;
} else {
  api.nextTick = _delay;
}
api.setImmediate = _setImmediate ? _delay : api.nextTick;

/**
 * Clones an object, array, Map, Set, or string/number. If a typed JavaScript
 * object is given, such as a Date, it will be converted to a string.
 *
 * @param value the value to clone.
 *
 * @return the cloned value.
 */
api.clone = function(value) {
  if(value && typeof value === 'object') {
    let rval;
    if(types.isArray(value)) {
      rval = [];
      for(let i = 0; i < value.length; ++i) {
        rval[i] = api.clone(value[i]);
      }
    } else if(value instanceof Map) {
      rval = new Map();
      for(const [k, v] of value) {
        rval.set(k, api.clone(v));
      }
    } else if(value instanceof Set) {
      rval = new Set();
      for(const v of value) {
        rval.add(api.clone(v));
      }
    } else if(types.isObject(value)) {
      rval = {};
      for(const key in value) {
        rval[key] = api.clone(value[key]);
      }
    } else {
      rval = value.toString();
    }
    return rval;
  }
  return value;
};

/**
 * Ensure a value is an array. If the value is an array, it is returned.
 * Otherwise, it is wrapped in an array.
 *
 * @param value the value to return as an array.
 *
 * @return the value as an array.
 */
api.asArray = function(value) {
  return Array.isArray(value) ? value : [value];
};

/**
 * Builds an HTTP headers object for making a JSON-LD request from custom
 * headers and asserts the `accept` header isn't overridden.
 *
 * @param headers an object of headers with keys as header names and values
 *          as header values.
 *
 * @return an object of headers with a valid `accept` header.
 */
api.buildHeaders = (headers = {}) => {
  const hasAccept = Object.keys(headers).some(
    h => h.toLowerCase() === 'accept');

  if(hasAccept) {
    throw new RangeError(
      'Accept header may not be specified; only "' +
      DEFAULTS.headers.accept + '" is supported.');
  }

  return Object.assign({Accept: DEFAULTS.headers.accept}, headers);
};

/**
 * Parses a link header. The results will be key'd by the value of "rel".
 *
 * Link: <http://json-ld.org/contexts/person.jsonld>;
 * rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"
 *
 * Parses as: {
 *   'http://www.w3.org/ns/json-ld#context': {
 *     target: http://json-ld.org/contexts/person.jsonld,
 *     type: 'application/ld+json'
 *   }
 * }
 *
 * If there is more than one "rel" with the same IRI, then entries in the
 * resulting map for that "rel" will be arrays.
 *
 * @param header the link header to parse.
 */
api.parseLinkHeader = header => {
  const rval = {};
  // split on unbracketed/unquoted commas
  const entries = header.match(REGEX_LINK_HEADERS);
  for(let i = 0; i < entries.length; ++i) {
    let match = entries[i].match(REGEX_LINK_HEADER);
    if(!match) {
      continue;
    }
    const result = {target: match[1]};
    const params = match[2];
    while((match = REGEX_LINK_HEADER_PARAMS.exec(params))) {
      result[match[1]] = (match[2] === undefined) ? match[3] : match[2];
    }
    const rel = result['rel'] || '';
    if(Array.isArray(rval[rel])) {
      rval[rel].push(result);
    } else if(rval.hasOwnProperty(rel)) {
      rval[rel] = [rval[rel], result];
    } else {
      rval[rel] = result;
    }
  }
  return rval;
};

/**
 * Throws an exception if the given value is not a valid @type value.
 *
 * @param v the value to check.
 */
api.validateTypeValue = v => {
  // can be a string or an empty object
  if(types.isString(v) || types.isEmptyObject(v)) {
    return;
  }

  // must be an array
  let isValid = false;
  if(types.isArray(v)) {
    // must contain only strings
    isValid = true;
    for(let i = 0; i < v.length; ++i) {
      if(!(types.isString(v[i]))) {
        isValid = false;
        break;
      }
    }
  }

  if(!isValid) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; "@type" value must a string, an array of ' +
      'strings, or an empty object.', 'jsonld.SyntaxError',
      {code: 'invalid type value', value: v});
  }
};

/**
 * Returns true if the given subject has the given property.
 *
 * @param subject the subject to check.
 * @param property the property to look for.
 *
 * @return true if the subject has the given property, false if not.
 */
api.hasProperty = (subject, property) => {
  if(subject.hasOwnProperty(property)) {
    const value = subject[property];
    return (!types.isArray(value) || value.length > 0);
  }
  return false;
};

/**
 * Determines if the given value is a property of the given subject.
 *
 * @param subject the subject to check.
 * @param property the property to check.
 * @param value the value to check.
 *
 * @return true if the value exists, false if not.
 */
api.hasValue = (subject, property, value) => {
  if(api.hasProperty(subject, property)) {
    let val = subject[property];
    const isList = graphTypes.isList(val);
    if(types.isArray(val) || isList) {
      if(isList) {
        val = val['@list'];
      }
      for(let i = 0; i < val.length; ++i) {
        if(api.compareValues(value, val[i])) {
          return true;
        }
      }
    } else if(!types.isArray(value)) {
      // avoid matching the set of values with an array value parameter
      return api.compareValues(value, val);
    }
  }
  return false;
};

/**
 * Adds a value to a subject. If the value is an array, all values in the
 * array will be added.
 *
 * @param subject the subject to add the value to.
 * @param property the property that relates the value to the subject.
 * @param value the value to add.
 * @param [options] the options to use:
 *        [propertyIsArray] true if the property is always an array, false
 *          if not (default: false).
 *        [allowDuplicate] true to allow duplicates, false not to (uses a
 *          simple shallow comparison of subject ID or value) (default: true).
 */
api.addValue = (subject, property, value, options) => {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }
  if(!('allowDuplicate' in options)) {
    options.allowDuplicate = true;
  }

  if(types.isArray(value)) {
    if(value.length === 0 && options.propertyIsArray &&
      !subject.hasOwnProperty(property)) {
      subject[property] = [];
    }
    for(let i = 0; i < value.length; ++i) {
      api.addValue(subject, property, value[i], options);
    }
  } else if(subject.hasOwnProperty(property)) {
    // check if subject already has value if duplicates not allowed
    const hasValue = (!options.allowDuplicate &&
      api.hasValue(subject, property, value));

    // make property an array if value not present or always an array
    if(!types.isArray(subject[property]) &&
      (!hasValue || options.propertyIsArray)) {
      subject[property] = [subject[property]];
    }

    // add new value
    if(!hasValue) {
      subject[property].push(value);
    }
  } else {
    // add new value as set or single value
    subject[property] = options.propertyIsArray ? [value] : value;
  }
};

/**
 * Gets all of the values for a subject's property as an array.
 *
 * @param subject the subject.
 * @param property the property.
 *
 * @return all of the values for a subject's property as an array.
 */
api.getValues = (subject, property) => [].concat(subject[property] || []);

/**
 * Removes a property from a subject.
 *
 * @param subject the subject.
 * @param property the property.
 */
api.removeProperty = (subject, property) => {
  delete subject[property];
};

/**
 * Removes a value from a subject.
 *
 * @param subject the subject.
 * @param property the property that relates the value to the subject.
 * @param value the value to remove.
 * @param [options] the options to use:
 *          [propertyIsArray] true if the property is always an array, false
 *            if not (default: false).
 */
api.removeValue = (subject, property, value, options) => {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }

  // filter out value
  const values = api.getValues(subject, property).filter(
    e => !api.compareValues(e, value));

  if(values.length === 0) {
    api.removeProperty(subject, property);
  } else if(values.length === 1 && !options.propertyIsArray) {
    subject[property] = values[0];
  } else {
    subject[property] = values;
  }
};

/**
 * Relabels all blank nodes in the given JSON-LD input.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [issuer] an IdentifierIssuer to use to label blank nodes.
 */
api.relabelBlankNodes = (input, options) => {
  options = options || {};
  const issuer = options.issuer || new IdentifierIssuer('_:b');
  return _labelBlankNodes(issuer, input);
};

/**
 * Compares two JSON-LD values for equality. Two JSON-LD values will be
 * considered equal if:
 *
 * 1. They are both primitives of the same type and value.
 * 2. They are both @values with the same @value, @type, @language,
 *   and @index, OR
 * 3. They both have @ids they are the same.
 *
 * @param v1 the first value.
 * @param v2 the second value.
 *
 * @return true if v1 and v2 are considered equal, false if not.
 */
api.compareValues = (v1, v2) => {
  // 1. equal primitives
  if(v1 === v2) {
    return true;
  }

  // 2. equal @values
  if(graphTypes.isValue(v1) && graphTypes.isValue(v2) &&
    v1['@value'] === v2['@value'] &&
    v1['@type'] === v2['@type'] &&
    v1['@language'] === v2['@language'] &&
    v1['@index'] === v2['@index']) {
    return true;
  }

  // 3. equal @ids
  if(types.isObject(v1) &&
    ('@id' in v1) &&
    types.isObject(v2) &&
    ('@id' in v2)) {
    return v1['@id'] === v2['@id'];
  }

  return false;
};

/**
 * Compares two strings first based on length and then lexicographically.
 *
 * @param a the first string.
 * @param b the second string.
 *
 * @return -1 if a < b, 1 if a > b, 0 if a === b.
 */
api.compareShortestLeast = (a, b) => {
  if(a.length < b.length) {
    return -1;
  }
  if(b.length < a.length) {
    return 1;
  }
  if(a === b) {
    return 0;
  }
  return (a < b) ? -1 : 1;
};

api.normalizeDocumentLoader = fn => {
  if(fn.length < 2) {
    return api.callbackify(fn);
  }

  return async function(url) {
    const callback = arguments[1];
    return new Promise((resolve, reject) => {
      try {
        fn(url, (err, remoteDoc) => {
          if(typeof callback === 'function') {
            return _invokeCallback(callback, err, remoteDoc);
          } else if(err) {
            reject(err);
          } else {
            resolve(remoteDoc);
          }
        });
      } catch(e) {
        if(typeof callback === 'function') {
          return _invokeCallback(callback, e);
        }
        reject(e);
      }
    });
  };
};

api.callbackify = fn => {
  return async function(...args) {
    const callback = args[args.length - 1];
    if(typeof callback === 'function') {
      args.pop();
    }

    let result;
    try {
      result = await fn.apply(null, args);
    } catch(e) {
      if(typeof callback === 'function') {
        return _invokeCallback(callback, e);
      }
      throw e;
    }

    if(typeof callback === 'function') {
      return _invokeCallback(callback, null, result);
    }

    return result;
  };
};

function _invokeCallback(callback, err, result) {
  // execute on next tick to prevent "unhandled rejected promise"
  // and simulate what would have happened in a promiseless API
  api.nextTick(() => callback(err, result));
}

/**
 * Labels the blank nodes in the given value using the given IdentifierIssuer.
 *
 * @param issuer the IdentifierIssuer to use.
 * @param element the element with blank nodes to rename.
 *
 * @return the element.
 */
function _labelBlankNodes(issuer, element) {
  if(types.isArray(element)) {
    for(let i = 0; i < element.length; ++i) {
      element[i] = _labelBlankNodes(issuer, element[i]);
    }
  } else if(graphTypes.isList(element)) {
    element['@list'] = _labelBlankNodes(issuer, element['@list']);
  } else if(types.isObject(element)) {
    // relabel blank node
    if(graphTypes.isBlankNode(element)) {
      element['@id'] = issuer.getId(element['@id']);
    }

    // recursively apply to all keys
    const keys = Object.keys(element).sort();
    for(let ki = 0; ki < keys.length; ++ki) {
      const key = keys[ki];
      if(key !== '@id') {
        element[key] = _labelBlankNodes(issuer, element[key]);
      }
    }
  }

  return element;
}

}).call(this,require('_process'),require("timers").setImmediate)
},{"./JsonLdError":3,"./graphTypes":17,"./types":21,"_process":31,"rdf-canonize":41,"timers":43}],24:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
(function (Buffer){
/**
 * Base-N/Base-X encoding/decoding functions.
 *
 * Original implementation from base-x:
 * https://github.com/cryptocoinjs/base-x
 *
 * Which is MIT licensed:
 *
 * The MIT License (MIT)
 *
 * Copyright base-x contributors (c) 2016
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
var api = {};
module.exports = api;

// baseN alphabet indexes
var _reverseAlphabets = {};

/**
 * BaseN-encodes a Uint8Array using the given alphabet.
 *
 * @param input the Uint8Array to encode.
 * @param maxline the maximum number of encoded characters per line to use,
 *          defaults to none.
 *
 * @return the baseN-encoded output string.
 */
api.encode = function(input, alphabet, maxline) {
  if(typeof alphabet !== 'string') {
    throw new TypeError('"alphabet" must be a string.');
  }
  if(maxline !== undefined && typeof maxline !== 'number') {
    throw new TypeError('"maxline" must be a number.');
  }

  var output = '';

  if(!(input instanceof Uint8Array)) {
    // assume forge byte buffer
    output = _encodeWithByteBuffer(input, alphabet);
  } else {
    var i = 0;
    var base = alphabet.length;
    var first = alphabet.charAt(0);
    var digits = [0];
    for(i = 0; i < input.length; ++i) {
      for(var j = 0, carry = input[i]; j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % base;
        carry = (carry / base) | 0;
      }

      while(carry > 0) {
        digits.push(carry % base);
        carry = (carry / base) | 0;
      }
    }

    // deal with leading zeros
    for(i = 0; input[i] === 0 && i < input.length - 1; ++i) {
      output += first;
    }
    // convert digits to a string
    for(i = digits.length - 1; i >= 0; --i) {
      output += alphabet[digits[i]];
    }
  }

  if(maxline) {
    var regex = new RegExp('.{1,' + maxline + '}', 'g');
    output = output.match(regex).join('\r\n');
  }

  return output;
};

/**
 * Decodes a baseN-encoded (using the given alphabet) string to a
 * Uint8Array.
 *
 * @param input the baseN-encoded input string.
 *
 * @return the Uint8Array.
 */
api.decode = function(input, alphabet) {
  if(typeof input !== 'string') {
    throw new TypeError('"input" must be a string.');
  }
  if(typeof alphabet !== 'string') {
    throw new TypeError('"alphabet" must be a string.');
  }

  var table = _reverseAlphabets[alphabet];
  if(!table) {
    // compute reverse alphabet
    table = _reverseAlphabets[alphabet] = [];
    for(var i = 0; i < alphabet.length; ++i) {
      table[alphabet.charCodeAt(i)] = i;
    }
  }

  // remove whitespace characters
  input = input.replace(/\s/g, '');

  var base = alphabet.length;
  var first = alphabet.charAt(0);
  var bytes = [0];
  for(var i = 0; i < input.length; i++) {
    var value = table[input.charCodeAt(i)];
    if(value === undefined) {
      return;
    }

    for(var j = 0, carry = value; j < bytes.length; ++j) {
      carry += bytes[j] * base;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }

    while(carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  // deal with leading zeros
  for(var k = 0; input[k] === first && k < input.length - 1; ++k) {
    bytes.push(0);
  }

  if(typeof Buffer !== 'undefined') {
    return Buffer.from(bytes.reverse());
  }

  return new Uint8Array(bytes.reverse());
};

function _encodeWithByteBuffer(input, alphabet) {
  var i = 0;
  var base = alphabet.length;
  var first = alphabet.charAt(0);
  var digits = [0];
  for(i = 0; i < input.length(); ++i) {
    for(var j = 0, carry = input.at(i); j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % base;
      carry = (carry / base) | 0;
    }

    while(carry > 0) {
      digits.push(carry % base);
      carry = (carry / base) | 0;
    }
  }

  var output = '';

  // deal with leading zeros
  for(i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) {
    output += first;
  }
  // convert digits to a string
  for(i = digits.length - 1; i >= 0; --i) {
    output += alphabet[digits[i]];
  }

  return output;
}

}).call(this,require("buffer").Buffer)
},{"buffer":1}],26:[function(require,module,exports){
/**
 * Node.js module for Forge.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2016 Digital Bazaar, Inc.
 */
module.exports = {
  // default options
  options: {
    usePureJavaScript: false
  }
};

},{}],27:[function(require,module,exports){
/**
 * Node.js module for Forge message digests.
 *
 * @author Dave Longley
 *
 * Copyright 2011-2017 Digital Bazaar, Inc.
 */
var forge = require('./forge');

module.exports = forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};

},{"./forge":26}],28:[function(require,module,exports){
/**
 * Secure Hash Algorithm with 160-bit digest (SHA-1) implementation.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2015 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./md');
require('./util');

var sha1 = module.exports = forge.sha1 = forge.sha1 || {};
forge.md.sha1 = forge.md.algorithms.sha1 = sha1;

/**
 * Creates a SHA-1 message digest object.
 *
 * @return a message digest object.
 */
sha1.create = function() {
  // do initialization as necessary
  if(!_initialized) {
    _init();
  }

  // SHA-1 state contains five 32-bit integers
  var _state = null;

  // input buffer
  var _input = forge.util.createBuffer();

  // used for word storage
  var _w = new Array(80);

  // message digest object
  var md = {
    algorithm: 'sha1',
    blockLength: 64,
    digestLength: 20,
    // 56-bit length of message so far (does not including padding)
    messageLength: 0,
    // true message length
    fullMessageLength: null,
    // size of message length in bytes
    messageLengthSize: 8
  };

  /**
   * Starts the digest.
   *
   * @return this digest object.
   */
  md.start = function() {
    // up to 56-bit message length for convenience
    md.messageLength = 0;

    // full message length (set md.messageLength64 for backwards-compatibility)
    md.fullMessageLength = md.messageLength64 = [];
    var int32s = md.messageLengthSize / 4;
    for(var i = 0; i < int32s; ++i) {
      md.fullMessageLength.push(0);
    }
    _input = forge.util.createBuffer();
    _state = {
      h0: 0x67452301,
      h1: 0xEFCDAB89,
      h2: 0x98BADCFE,
      h3: 0x10325476,
      h4: 0xC3D2E1F0
    };
    return md;
  };
  // start digest automatically for first time
  md.start();

  /**
   * Updates the digest with the given message input. The given input can
   * treated as raw input (no encoding will be applied) or an encoding of
   * 'utf8' maybe given to encode the input using UTF-8.
   *
   * @param msg the message input to update with.
   * @param encoding the encoding to use (default: 'raw', other: 'utf8').
   *
   * @return this digest object.
   */
  md.update = function(msg, encoding) {
    if(encoding === 'utf8') {
      msg = forge.util.encodeUtf8(msg);
    }

    // update message length
    var len = msg.length;
    md.messageLength += len;
    len = [(len / 0x100000000) >>> 0, len >>> 0];
    for(var i = md.fullMessageLength.length - 1; i >= 0; --i) {
      md.fullMessageLength[i] += len[1];
      len[1] = len[0] + ((md.fullMessageLength[i] / 0x100000000) >>> 0);
      md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
      len[0] = ((len[1] / 0x100000000) >>> 0);
    }

    // add bytes to input buffer
    _input.putBytes(msg);

    // process bytes
    _update(_state, _w, _input);

    // compact input buffer every 2K or if empty
    if(_input.read > 2048 || _input.length() === 0) {
      _input.compact();
    }

    return md;
  };

  /**
   * Produces the digest.
   *
   * @return a byte buffer containing the digest value.
   */
  md.digest = function() {
    /* Note: Here we copy the remaining bytes in the input buffer and
    add the appropriate SHA-1 padding. Then we do the final update
    on a copy of the state so that if the user wants to get
    intermediate digests they can do so. */

    /* Determine the number of bytes that must be added to the message
    to ensure its length is congruent to 448 mod 512. In other words,
    the data to be digested must be a multiple of 512 bits (or 128 bytes).
    This data includes the message, some padding, and the length of the
    message. Since the length of the message will be encoded as 8 bytes (64
    bits), that means that the last segment of the data must have 56 bytes
    (448 bits) of message and padding. Therefore, the length of the message
    plus the padding must be congruent to 448 mod 512 because
    512 - 128 = 448.

    In order to fill up the message length it must be filled with
    padding that begins with 1 bit followed by all 0 bits. Padding
    must *always* be present, so if the message length is already
    congruent to 448 mod 512, then 512 padding bits must be added. */

    var finalBlock = forge.util.createBuffer();
    finalBlock.putBytes(_input.bytes());

    // compute remaining size to be digested (include message length size)
    var remaining = (
      md.fullMessageLength[md.fullMessageLength.length - 1] +
      md.messageLengthSize);

    // add padding for overflow blockSize - overflow
    // _padding starts with 1 byte with first bit is set (byte value 128), then
    // there may be up to (blockSize - 1) other pad bytes
    var overflow = remaining & (md.blockLength - 1);
    finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));

    // serialize message length in bits in big-endian order; since length
    // is stored in bytes we multiply by 8 and add carry from next int
    var next, carry;
    var bits = md.fullMessageLength[0] * 8;
    for(var i = 0; i < md.fullMessageLength.length - 1; ++i) {
      next = md.fullMessageLength[i + 1] * 8;
      carry = (next / 0x100000000) >>> 0;
      bits += carry;
      finalBlock.putInt32(bits >>> 0);
      bits = next >>> 0;
    }
    finalBlock.putInt32(bits);

    var s2 = {
      h0: _state.h0,
      h1: _state.h1,
      h2: _state.h2,
      h3: _state.h3,
      h4: _state.h4
    };
    _update(s2, _w, finalBlock);
    var rval = forge.util.createBuffer();
    rval.putInt32(s2.h0);
    rval.putInt32(s2.h1);
    rval.putInt32(s2.h2);
    rval.putInt32(s2.h3);
    rval.putInt32(s2.h4);
    return rval;
  };

  return md;
};

// sha-1 padding bytes not initialized yet
var _padding = null;
var _initialized = false;

/**
 * Initializes the constant tables.
 */
function _init() {
  // create padding
  _padding = String.fromCharCode(128);
  _padding += forge.util.fillString(String.fromCharCode(0x00), 64);

  // now initialized
  _initialized = true;
}

/**
 * Updates a SHA-1 state with the given byte buffer.
 *
 * @param s the SHA-1 state to update.
 * @param w the array to use to store words.
 * @param bytes the byte buffer to update with.
 */
function _update(s, w, bytes) {
  // consume 512 bit (64 byte) chunks
  var t, a, b, c, d, e, f, i;
  var len = bytes.length();
  while(len >= 64) {
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 80 32-bit words according to SHA-1 algorithm
    // and for 32-79 using Max Locktyukhin's optimization

    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;
    e = s.h4;

    // round 1
    for(i = 0; i < 16; ++i) {
      t = bytes.getInt32();
      w[i] = t;
      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    for(; i < 20; ++i) {
      t = (w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
      t = (t << 1) | (t >>> 31);
      w[i] = t;
      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    // round 2
    for(; i < 32; ++i) {
      t = (w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
      t = (t << 1) | (t >>> 31);
      w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    for(; i < 40; ++i) {
      t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
      t = (t << 2) | (t >>> 30);
      w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    // round 3
    for(; i < 60; ++i) {
      t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
      t = (t << 2) | (t >>> 30);
      w[i] = t;
      f = (b & c) | (d & (b ^ c));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x8F1BBCDC + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }
    // round 4
    for(; i < 80; ++i) {
      t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
      t = (t << 2) | (t >>> 30);
      w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0xCA62C1D6 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;
    s.h4 = (s.h4 + e) | 0;

    len -= 64;
  }
}

},{"./forge":26,"./md":27,"./util":30}],29:[function(require,module,exports){
/**
 * Secure Hash Algorithm with 256-bit digest (SHA-256) implementation.
 *
 * See FIPS 180-2 for details.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2015 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./md');
require('./util');

var sha256 = module.exports = forge.sha256 = forge.sha256 || {};
forge.md.sha256 = forge.md.algorithms.sha256 = sha256;

/**
 * Creates a SHA-256 message digest object.
 *
 * @return a message digest object.
 */
sha256.create = function() {
  // do initialization as necessary
  if(!_initialized) {
    _init();
  }

  // SHA-256 state contains eight 32-bit integers
  var _state = null;

  // input buffer
  var _input = forge.util.createBuffer();

  // used for word storage
  var _w = new Array(64);

  // message digest object
  var md = {
    algorithm: 'sha256',
    blockLength: 64,
    digestLength: 32,
    // 56-bit length of message so far (does not including padding)
    messageLength: 0,
    // true message length
    fullMessageLength: null,
    // size of message length in bytes
    messageLengthSize: 8
  };

  /**
   * Starts the digest.
   *
   * @return this digest object.
   */
  md.start = function() {
    // up to 56-bit message length for convenience
    md.messageLength = 0;

    // full message length (set md.messageLength64 for backwards-compatibility)
    md.fullMessageLength = md.messageLength64 = [];
    var int32s = md.messageLengthSize / 4;
    for(var i = 0; i < int32s; ++i) {
      md.fullMessageLength.push(0);
    }
    _input = forge.util.createBuffer();
    _state = {
      h0: 0x6A09E667,
      h1: 0xBB67AE85,
      h2: 0x3C6EF372,
      h3: 0xA54FF53A,
      h4: 0x510E527F,
      h5: 0x9B05688C,
      h6: 0x1F83D9AB,
      h7: 0x5BE0CD19
    };
    return md;
  };
  // start digest automatically for first time
  md.start();

  /**
   * Updates the digest with the given message input. The given input can
   * treated as raw input (no encoding will be applied) or an encoding of
   * 'utf8' maybe given to encode the input using UTF-8.
   *
   * @param msg the message input to update with.
   * @param encoding the encoding to use (default: 'raw', other: 'utf8').
   *
   * @return this digest object.
   */
  md.update = function(msg, encoding) {
    if(encoding === 'utf8') {
      msg = forge.util.encodeUtf8(msg);
    }

    // update message length
    var len = msg.length;
    md.messageLength += len;
    len = [(len / 0x100000000) >>> 0, len >>> 0];
    for(var i = md.fullMessageLength.length - 1; i >= 0; --i) {
      md.fullMessageLength[i] += len[1];
      len[1] = len[0] + ((md.fullMessageLength[i] / 0x100000000) >>> 0);
      md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
      len[0] = ((len[1] / 0x100000000) >>> 0);
    }

    // add bytes to input buffer
    _input.putBytes(msg);

    // process bytes
    _update(_state, _w, _input);

    // compact input buffer every 2K or if empty
    if(_input.read > 2048 || _input.length() === 0) {
      _input.compact();
    }

    return md;
  };

  /**
   * Produces the digest.
   *
   * @return a byte buffer containing the digest value.
   */
  md.digest = function() {
    /* Note: Here we copy the remaining bytes in the input buffer and
    add the appropriate SHA-256 padding. Then we do the final update
    on a copy of the state so that if the user wants to get
    intermediate digests they can do so. */

    /* Determine the number of bytes that must be added to the message
    to ensure its length is congruent to 448 mod 512. In other words,
    the data to be digested must be a multiple of 512 bits (or 128 bytes).
    This data includes the message, some padding, and the length of the
    message. Since the length of the message will be encoded as 8 bytes (64
    bits), that means that the last segment of the data must have 56 bytes
    (448 bits) of message and padding. Therefore, the length of the message
    plus the padding must be congruent to 448 mod 512 because
    512 - 128 = 448.

    In order to fill up the message length it must be filled with
    padding that begins with 1 bit followed by all 0 bits. Padding
    must *always* be present, so if the message length is already
    congruent to 448 mod 512, then 512 padding bits must be added. */

    var finalBlock = forge.util.createBuffer();
    finalBlock.putBytes(_input.bytes());

    // compute remaining size to be digested (include message length size)
    var remaining = (
      md.fullMessageLength[md.fullMessageLength.length - 1] +
      md.messageLengthSize);

    // add padding for overflow blockSize - overflow
    // _padding starts with 1 byte with first bit is set (byte value 128), then
    // there may be up to (blockSize - 1) other pad bytes
    var overflow = remaining & (md.blockLength - 1);
    finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));

    // serialize message length in bits in big-endian order; since length
    // is stored in bytes we multiply by 8 and add carry from next int
    var next, carry;
    var bits = md.fullMessageLength[0] * 8;
    for(var i = 0; i < md.fullMessageLength.length - 1; ++i) {
      next = md.fullMessageLength[i + 1] * 8;
      carry = (next / 0x100000000) >>> 0;
      bits += carry;
      finalBlock.putInt32(bits >>> 0);
      bits = next >>> 0;
    }
    finalBlock.putInt32(bits);

    var s2 = {
      h0: _state.h0,
      h1: _state.h1,
      h2: _state.h2,
      h3: _state.h3,
      h4: _state.h4,
      h5: _state.h5,
      h6: _state.h6,
      h7: _state.h7
    };
    _update(s2, _w, finalBlock);
    var rval = forge.util.createBuffer();
    rval.putInt32(s2.h0);
    rval.putInt32(s2.h1);
    rval.putInt32(s2.h2);
    rval.putInt32(s2.h3);
    rval.putInt32(s2.h4);
    rval.putInt32(s2.h5);
    rval.putInt32(s2.h6);
    rval.putInt32(s2.h7);
    return rval;
  };

  return md;
};

// sha-256 padding bytes not initialized yet
var _padding = null;
var _initialized = false;

// table of constants
var _k = null;

/**
 * Initializes the constant tables.
 */
function _init() {
  // create padding
  _padding = String.fromCharCode(128);
  _padding += forge.util.fillString(String.fromCharCode(0x00), 64);

  // create K table for SHA-256
  _k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  // now initialized
  _initialized = true;
}

/**
 * Updates a SHA-256 state with the given byte buffer.
 *
 * @param s the SHA-256 state to update.
 * @param w the array to use to store words.
 * @param bytes the byte buffer to update with.
 */
function _update(s, w, bytes) {
  // consume 512 bit (64 byte) chunks
  var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
  var len = bytes.length();
  while(len >= 64) {
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 64 32-bit words according to SHA-256
    for(i = 0; i < 16; ++i) {
      w[i] = bytes.getInt32();
    }
    for(; i < 64; ++i) {
      // XOR word 2 words ago rot right 17, rot right 19, shft right 10
      t1 = w[i - 2];
      t1 =
        ((t1 >>> 17) | (t1 << 15)) ^
        ((t1 >>> 19) | (t1 << 13)) ^
        (t1 >>> 10);
      // XOR word 15 words ago rot right 7, rot right 18, shft right 3
      t2 = w[i - 15];
      t2 =
        ((t2 >>> 7) | (t2 << 25)) ^
        ((t2 >>> 18) | (t2 << 14)) ^
        (t2 >>> 3);
      // sum(t1, word 7 ago, t2, word 16 ago) modulo 2^32
      w[i] = (t1 + w[i - 7] + t2 + w[i - 16]) | 0;
    }

    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;
    e = s.h4;
    f = s.h5;
    g = s.h6;
    h = s.h7;

    // round function
    for(i = 0; i < 64; ++i) {
      // Sum1(e)
      s1 =
        ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      // Ch(e, f, g) (optimized the same way as SHA-1)
      ch = g ^ (e & (f ^ g));
      // Sum0(a)
      s0 =
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      // Maj(a, b, c) (optimized the same way as SHA-1)
      maj = (a & b) | (c & (a ^ b));

      // main algorithm
      t1 = h + s1 + ch + _k[i] + w[i];
      t2 = s0 + maj;
      h = g;
      g = f;
      f = e;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      // can't truncate with `| 0`
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      // can't truncate with `| 0`
      a = (t1 + t2) >>> 0;
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;
    s.h4 = (s.h4 + e) | 0;
    s.h5 = (s.h5 + f) | 0;
    s.h6 = (s.h6 + g) | 0;
    s.h7 = (s.h7 + h) | 0;
    len -= 64;
  }
}

},{"./forge":26,"./md":27,"./util":30}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,setImmediate){
/**
 * Utility functions for web applications.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2018 Digital Bazaar, Inc.
 */
var forge = require('./forge');
var baseN = require('./baseN');

/* Utilities API */
var util = module.exports = forge.util = forge.util || {};

// define setImmediate and nextTick
(function() {
  // use native nextTick (unless we're in webpack)
  // webpack (or better node-libs-browser polyfill) sets process.browser.
  // this way we can detect webpack properly
  if(typeof process !== 'undefined' && process.nextTick && !process.browser) {
    util.nextTick = process.nextTick;
    if(typeof setImmediate === 'function') {
      util.setImmediate = setImmediate;
    } else {
      // polyfill setImmediate with nextTick, older versions of node
      // (those w/o setImmediate) won't totally starve IO
      util.setImmediate = util.nextTick;
    }
    return;
  }

  // polyfill nextTick with native setImmediate
  if(typeof setImmediate === 'function') {
    util.setImmediate = function() { return setImmediate.apply(undefined, arguments); };
    util.nextTick = function(callback) {
      return setImmediate(callback);
    };
    return;
  }

  /* Note: A polyfill upgrade pattern is used here to allow combining
  polyfills. For example, MutationObserver is fast, but blocks UI updates,
  so it needs to allow UI updates periodically, so it falls back on
  postMessage or setTimeout. */

  // polyfill with setTimeout
  util.setImmediate = function(callback) {
    setTimeout(callback, 0);
  };

  // upgrade polyfill to use postMessage
  if(typeof window !== 'undefined' &&
    typeof window.postMessage === 'function') {
    var msg = 'forge.setImmediate';
    var callbacks = [];
    util.setImmediate = function(callback) {
      callbacks.push(callback);
      // only send message when one hasn't been sent in
      // the current turn of the event loop
      if(callbacks.length === 1) {
        window.postMessage(msg, '*');
      }
    };
    function handler(event) {
      if(event.source === window && event.data === msg) {
        event.stopPropagation();
        var copy = callbacks.slice();
        callbacks.length = 0;
        copy.forEach(function(callback) {
          callback();
        });
      }
    }
    window.addEventListener('message', handler, true);
  }

  // upgrade polyfill to use MutationObserver
  if(typeof MutationObserver !== 'undefined') {
    // polyfill with MutationObserver
    var now = Date.now();
    var attr = true;
    var div = document.createElement('div');
    var callbacks = [];
    new MutationObserver(function() {
      var copy = callbacks.slice();
      callbacks.length = 0;
      copy.forEach(function(callback) {
        callback();
      });
    }).observe(div, {attributes: true});
    var oldSetImmediate = util.setImmediate;
    util.setImmediate = function(callback) {
      if(Date.now() - now > 15) {
        now = Date.now();
        oldSetImmediate(callback);
      } else {
        callbacks.push(callback);
        // only trigger observer when it hasn't been triggered in
        // the current turn of the event loop
        if(callbacks.length === 1) {
          div.setAttribute('a', attr = !attr);
        }
      }
    };
  }

  util.nextTick = util.setImmediate;
})();

// check if running under Node.js
util.isNodejs =
  typeof process !== 'undefined' && process.versions && process.versions.node;


// 'self' will also work in Web Workers (instance of WorkerGlobalScope) while
// it will point to `window` in the main thread.
// To remain compatible with older browsers, we fall back to 'window' if 'self'
// is not available.
util.globalScope = (function() {
  if(util.isNodejs || global) {
    return global;
  }

  return typeof self === 'undefined' ? window : self;
})();

// define isArray
util.isArray = Array.isArray || function(x) {
  return Object.prototype.toString.call(x) === '[object Array]';
};

// define isArrayBuffer
util.isArrayBuffer = function(x) {
  return typeof ArrayBuffer !== 'undefined' && x instanceof ArrayBuffer;
};

// define isArrayBufferView
util.isArrayBufferView = function(x) {
  return x && util.isArrayBuffer(x.buffer) && x.byteLength !== undefined;
};

/**
 * Ensure a bits param is 8, 16, 24, or 32. Used to validate input for
 * algorithms where bit manipulation, JavaScript limitations, and/or algorithm
 * design only allow for byte operations of a limited size.
 *
 * @param n number of bits.
 *
 * Throw Error if n invalid.
 */
function _checkBitsParam(n) {
  if(!(n === 8 || n === 16 || n === 24 || n === 32)) {
    throw new Error('Only 8, 16, 24, or 32 bits supported: ' + n);
  }
}

// TODO: set ByteBuffer to best available backing
util.ByteBuffer = ByteStringBuffer;

/** Buffer w/BinaryString backing */

/**
 * Constructor for a binary string backed byte buffer.
 *
 * @param [b] the bytes to wrap (either encoded as string, one byte per
 *          character, or as an ArrayBuffer or Typed Array).
 */
function ByteStringBuffer(b) {
  // TODO: update to match DataBuffer API

  // the data in this buffer
  this.data = '';
  // the pointer for reading from this buffer
  this.read = 0;

  if(typeof b === 'string') {
    this.data = b;
  } else if(util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
    if(typeof Buffer !== 'undefined' && b instanceof Buffer) {
      this.data = b.toString('binary');
    } else {
      // convert native buffer to forge buffer
      // FIXME: support native buffers internally instead
      var arr = new Uint8Array(b);
      try {
        this.data = String.fromCharCode.apply(null, arr);
      } catch(e) {
        for(var i = 0; i < arr.length; ++i) {
          this.putByte(arr[i]);
        }
      }
    }
  } else if(b instanceof ByteStringBuffer ||
    (typeof b === 'object' && typeof b.data === 'string' &&
    typeof b.read === 'number')) {
    // copy existing buffer
    this.data = b.data;
    this.read = b.read;
  }

  // used for v8 optimization
  this._constructedStringLength = 0;
}
util.ByteStringBuffer = ByteStringBuffer;

/* Note: This is an optimization for V8-based browsers. When V8 concatenates
  a string, the strings are only joined logically using a "cons string" or
  "constructed/concatenated string". These containers keep references to one
  another and can result in very large memory usage. For example, if a 2MB
  string is constructed by concatenating 4 bytes together at a time, the
  memory usage will be ~44MB; so ~22x increase. The strings are only joined
  together when an operation requiring their joining takes place, such as
  substr(). This function is called when adding data to this buffer to ensure
  these types of strings are periodically joined to reduce the memory
  footprint. */
var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
  this._constructedStringLength += x;
  if(this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
    // this substr() should cause the constructed string to join
    this.data.substr(0, 1);
    this._constructedStringLength = 0;
  }
};

/**
 * Gets the number of bytes in this buffer.
 *
 * @return the number of bytes in this buffer.
 */
util.ByteStringBuffer.prototype.length = function() {
  return this.data.length - this.read;
};

/**
 * Gets whether or not this buffer is empty.
 *
 * @return true if this buffer is empty, false if not.
 */
util.ByteStringBuffer.prototype.isEmpty = function() {
  return this.length() <= 0;
};

/**
 * Puts a byte in this buffer.
 *
 * @param b the byte to put.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putByte = function(b) {
  return this.putBytes(String.fromCharCode(b));
};

/**
 * Puts a byte in this buffer N times.
 *
 * @param b the byte to put.
 * @param n the number of bytes of value b to put.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
  b = String.fromCharCode(b);
  var d = this.data;
  while(n > 0) {
    if(n & 1) {
      d += b;
    }
    n >>>= 1;
    if(n > 0) {
      b += b;
    }
  }
  this.data = d;
  this._optimizeConstructedString(n);
  return this;
};

/**
 * Puts bytes in this buffer.
 *
 * @param bytes the bytes (as a UTF-8 encoded string) to put.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putBytes = function(bytes) {
  this.data += bytes;
  this._optimizeConstructedString(bytes.length);
  return this;
};

/**
 * Puts a UTF-16 encoded string into this buffer.
 *
 * @param str the string to put.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putString = function(str) {
  return this.putBytes(util.encodeUtf8(str));
};

/**
 * Puts a 16-bit integer in this buffer in big-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt16 = function(i) {
  return this.putBytes(
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i & 0xFF));
};

/**
 * Puts a 24-bit integer in this buffer in big-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt24 = function(i) {
  return this.putBytes(
    String.fromCharCode(i >> 16 & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i & 0xFF));
};

/**
 * Puts a 32-bit integer in this buffer in big-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt32 = function(i) {
  return this.putBytes(
    String.fromCharCode(i >> 24 & 0xFF) +
    String.fromCharCode(i >> 16 & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i & 0xFF));
};

/**
 * Puts a 16-bit integer in this buffer in little-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt16Le = function(i) {
  return this.putBytes(
    String.fromCharCode(i & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF));
};

/**
 * Puts a 24-bit integer in this buffer in little-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt24Le = function(i) {
  return this.putBytes(
    String.fromCharCode(i & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i >> 16 & 0xFF));
};

/**
 * Puts a 32-bit integer in this buffer in little-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt32Le = function(i) {
  return this.putBytes(
    String.fromCharCode(i & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i >> 16 & 0xFF) +
    String.fromCharCode(i >> 24 & 0xFF));
};

/**
 * Puts an n-bit integer in this buffer in big-endian order.
 *
 * @param i the n-bit integer.
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putInt = function(i, n) {
  _checkBitsParam(n);
  var bytes = '';
  do {
    n -= 8;
    bytes += String.fromCharCode((i >> n) & 0xFF);
  } while(n > 0);
  return this.putBytes(bytes);
};

/**
 * Puts a signed n-bit integer in this buffer in big-endian order. Two's
 * complement representation is used.
 *
 * @param i the n-bit integer.
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
  // putInt checks n
  if(i < 0) {
    i += 2 << (n - 1);
  }
  return this.putInt(i, n);
};

/**
 * Puts the given buffer into this buffer.
 *
 * @param buffer the buffer to put into this one.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.putBuffer = function(buffer) {
  return this.putBytes(buffer.getBytes());
};

/**
 * Gets a byte from this buffer and advances the read pointer by 1.
 *
 * @return the byte.
 */
util.ByteStringBuffer.prototype.getByte = function() {
  return this.data.charCodeAt(this.read++);
};

/**
 * Gets a uint16 from this buffer in big-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
util.ByteStringBuffer.prototype.getInt16 = function() {
  var rval = (
    this.data.charCodeAt(this.read) << 8 ^
    this.data.charCodeAt(this.read + 1));
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in big-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
util.ByteStringBuffer.prototype.getInt24 = function() {
  var rval = (
    this.data.charCodeAt(this.read) << 16 ^
    this.data.charCodeAt(this.read + 1) << 8 ^
    this.data.charCodeAt(this.read + 2));
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in big-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
util.ByteStringBuffer.prototype.getInt32 = function() {
  var rval = (
    this.data.charCodeAt(this.read) << 24 ^
    this.data.charCodeAt(this.read + 1) << 16 ^
    this.data.charCodeAt(this.read + 2) << 8 ^
    this.data.charCodeAt(this.read + 3));
  this.read += 4;
  return rval;
};

/**
 * Gets a uint16 from this buffer in little-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
util.ByteStringBuffer.prototype.getInt16Le = function() {
  var rval = (
    this.data.charCodeAt(this.read) ^
    this.data.charCodeAt(this.read + 1) << 8);
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in little-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
util.ByteStringBuffer.prototype.getInt24Le = function() {
  var rval = (
    this.data.charCodeAt(this.read) ^
    this.data.charCodeAt(this.read + 1) << 8 ^
    this.data.charCodeAt(this.read + 2) << 16);
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in little-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
util.ByteStringBuffer.prototype.getInt32Le = function() {
  var rval = (
    this.data.charCodeAt(this.read) ^
    this.data.charCodeAt(this.read + 1) << 8 ^
    this.data.charCodeAt(this.read + 2) << 16 ^
    this.data.charCodeAt(this.read + 3) << 24);
  this.read += 4;
  return rval;
};

/**
 * Gets an n-bit integer from this buffer in big-endian order and advances the
 * read pointer by ceil(n/8).
 *
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return the integer.
 */
util.ByteStringBuffer.prototype.getInt = function(n) {
  _checkBitsParam(n);
  var rval = 0;
  do {
    // TODO: Use (rval * 0x100) if adding support for 33 to 53 bits.
    rval = (rval << 8) + this.data.charCodeAt(this.read++);
    n -= 8;
  } while(n > 0);
  return rval;
};

/**
 * Gets a signed n-bit integer from this buffer in big-endian order, using
 * two's complement, and advances the read pointer by n/8.
 *
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return the integer.
 */
util.ByteStringBuffer.prototype.getSignedInt = function(n) {
  // getInt checks n
  var x = this.getInt(n);
  var max = 2 << (n - 2);
  if(x >= max) {
    x -= max << 1;
  }
  return x;
};

/**
 * Reads bytes out into a UTF-8 string and clears them from the buffer.
 *
 * @param count the number of bytes to read, undefined or null for all.
 *
 * @return a UTF-8 string of bytes.
 */
util.ByteStringBuffer.prototype.getBytes = function(count) {
  var rval;
  if(count) {
    // read count bytes
    count = Math.min(this.length(), count);
    rval = this.data.slice(this.read, this.read + count);
    this.read += count;
  } else if(count === 0) {
    rval = '';
  } else {
    // read all bytes, optimize to only copy when needed
    rval = (this.read === 0) ? this.data : this.data.slice(this.read);
    this.clear();
  }
  return rval;
};

/**
 * Gets a UTF-8 encoded string of the bytes from this buffer without modifying
 * the read pointer.
 *
 * @param count the number of bytes to get, omit to get all.
 *
 * @return a string full of UTF-8 encoded characters.
 */
util.ByteStringBuffer.prototype.bytes = function(count) {
  return (typeof(count) === 'undefined' ?
    this.data.slice(this.read) :
    this.data.slice(this.read, this.read + count));
};

/**
 * Gets a byte at the given index without modifying the read pointer.
 *
 * @param i the byte index.
 *
 * @return the byte.
 */
util.ByteStringBuffer.prototype.at = function(i) {
  return this.data.charCodeAt(this.read + i);
};

/**
 * Puts a byte at the given index without modifying the read pointer.
 *
 * @param i the byte index.
 * @param b the byte to put.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.setAt = function(i, b) {
  this.data = this.data.substr(0, this.read + i) +
    String.fromCharCode(b) +
    this.data.substr(this.read + i + 1);
  return this;
};

/**
 * Gets the last byte without modifying the read pointer.
 *
 * @return the last byte.
 */
util.ByteStringBuffer.prototype.last = function() {
  return this.data.charCodeAt(this.data.length - 1);
};

/**
 * Creates a copy of this buffer.
 *
 * @return the copy.
 */
util.ByteStringBuffer.prototype.copy = function() {
  var c = util.createBuffer(this.data);
  c.read = this.read;
  return c;
};

/**
 * Compacts this buffer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.compact = function() {
  if(this.read > 0) {
    this.data = this.data.slice(this.read);
    this.read = 0;
  }
  return this;
};

/**
 * Clears this buffer.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.clear = function() {
  this.data = '';
  this.read = 0;
  return this;
};

/**
 * Shortens this buffer by triming bytes off of the end of this buffer.
 *
 * @param count the number of bytes to trim off.
 *
 * @return this buffer.
 */
util.ByteStringBuffer.prototype.truncate = function(count) {
  var len = Math.max(0, this.length() - count);
  this.data = this.data.substr(this.read, len);
  this.read = 0;
  return this;
};

/**
 * Converts this buffer to a hexadecimal string.
 *
 * @return a hexadecimal string.
 */
util.ByteStringBuffer.prototype.toHex = function() {
  var rval = '';
  for(var i = this.read; i < this.data.length; ++i) {
    var b = this.data.charCodeAt(i);
    if(b < 16) {
      rval += '0';
    }
    rval += b.toString(16);
  }
  return rval;
};

/**
 * Converts this buffer to a UTF-16 string (standard JavaScript string).
 *
 * @return a UTF-16 string.
 */
util.ByteStringBuffer.prototype.toString = function() {
  return util.decodeUtf8(this.bytes());
};

/** End Buffer w/BinaryString backing */

/** Buffer w/UInt8Array backing */

/**
 * FIXME: Experimental. Do not use yet.
 *
 * Constructor for an ArrayBuffer-backed byte buffer.
 *
 * The buffer may be constructed from a string, an ArrayBuffer, DataView, or a
 * TypedArray.
 *
 * If a string is given, its encoding should be provided as an option,
 * otherwise it will default to 'binary'. A 'binary' string is encoded such
 * that each character is one byte in length and size.
 *
 * If an ArrayBuffer, DataView, or TypedArray is given, it will be used
 * *directly* without any copying. Note that, if a write to the buffer requires
 * more space, the buffer will allocate a new backing ArrayBuffer to
 * accommodate. The starting read and write offsets for the buffer may be
 * given as options.
 *
 * @param [b] the initial bytes for this buffer.
 * @param options the options to use:
 *          [readOffset] the starting read offset to use (default: 0).
 *          [writeOffset] the starting write offset to use (default: the
 *            length of the first parameter).
 *          [growSize] the minimum amount, in bytes, to grow the buffer by to
 *            accommodate writes (default: 1024).
 *          [encoding] the encoding ('binary', 'utf8', 'utf16', 'hex') for the
 *            first parameter, if it is a string (default: 'binary').
 */
function DataBuffer(b, options) {
  // default options
  options = options || {};

  // pointers for read from/write to buffer
  this.read = options.readOffset || 0;
  this.growSize = options.growSize || 1024;

  var isArrayBuffer = util.isArrayBuffer(b);
  var isArrayBufferView = util.isArrayBufferView(b);
  if(isArrayBuffer || isArrayBufferView) {
    // use ArrayBuffer directly
    if(isArrayBuffer) {
      this.data = new DataView(b);
    } else {
      // TODO: adjust read/write offset based on the type of view
      // or specify that this must be done in the options ... that the
      // offsets are byte-based
      this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
    }
    this.write = ('writeOffset' in options ?
      options.writeOffset : this.data.byteLength);
    return;
  }

  // initialize to empty array buffer and add any given bytes using putBytes
  this.data = new DataView(new ArrayBuffer(0));
  this.write = 0;

  if(b !== null && b !== undefined) {
    this.putBytes(b);
  }

  if('writeOffset' in options) {
    this.write = options.writeOffset;
  }
}
util.DataBuffer = DataBuffer;

/**
 * Gets the number of bytes in this buffer.
 *
 * @return the number of bytes in this buffer.
 */
util.DataBuffer.prototype.length = function() {
  return this.write - this.read;
};

/**
 * Gets whether or not this buffer is empty.
 *
 * @return true if this buffer is empty, false if not.
 */
util.DataBuffer.prototype.isEmpty = function() {
  return this.length() <= 0;
};

/**
 * Ensures this buffer has enough empty space to accommodate the given number
 * of bytes. An optional parameter may be given that indicates a minimum
 * amount to grow the buffer if necessary. If the parameter is not given,
 * the buffer will be grown by some previously-specified default amount
 * or heuristic.
 *
 * @param amount the number of bytes to accommodate.
 * @param [growSize] the minimum amount, in bytes, to grow the buffer by if
 *          necessary.
 */
util.DataBuffer.prototype.accommodate = function(amount, growSize) {
  if(this.length() >= amount) {
    return this;
  }
  growSize = Math.max(growSize || this.growSize, amount);

  // grow buffer
  var src = new Uint8Array(
    this.data.buffer, this.data.byteOffset, this.data.byteLength);
  var dst = new Uint8Array(this.length() + growSize);
  dst.set(src);
  this.data = new DataView(dst.buffer);

  return this;
};

/**
 * Puts a byte in this buffer.
 *
 * @param b the byte to put.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putByte = function(b) {
  this.accommodate(1);
  this.data.setUint8(this.write++, b);
  return this;
};

/**
 * Puts a byte in this buffer N times.
 *
 * @param b the byte to put.
 * @param n the number of bytes of value b to put.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.fillWithByte = function(b, n) {
  this.accommodate(n);
  for(var i = 0; i < n; ++i) {
    this.data.setUint8(b);
  }
  return this;
};

/**
 * Puts bytes in this buffer. The bytes may be given as a string, an
 * ArrayBuffer, a DataView, or a TypedArray.
 *
 * @param bytes the bytes to put.
 * @param [encoding] the encoding for the first parameter ('binary', 'utf8',
 *          'utf16', 'hex'), if it is a string (default: 'binary').
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
  if(util.isArrayBufferView(bytes)) {
    var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var len = src.byteLength - src.byteOffset;
    this.accommodate(len);
    var dst = new Uint8Array(this.data.buffer, this.write);
    dst.set(src);
    this.write += len;
    return this;
  }

  if(util.isArrayBuffer(bytes)) {
    var src = new Uint8Array(bytes);
    this.accommodate(src.byteLength);
    var dst = new Uint8Array(this.data.buffer);
    dst.set(src, this.write);
    this.write += src.byteLength;
    return this;
  }

  // bytes is a util.DataBuffer or equivalent
  if(bytes instanceof util.DataBuffer ||
    (typeof bytes === 'object' &&
    typeof bytes.read === 'number' && typeof bytes.write === 'number' &&
    util.isArrayBufferView(bytes.data))) {
    var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
    this.accommodate(src.byteLength);
    var dst = new Uint8Array(bytes.data.byteLength, this.write);
    dst.set(src);
    this.write += src.byteLength;
    return this;
  }

  if(bytes instanceof util.ByteStringBuffer) {
    // copy binary string and process as the same as a string parameter below
    bytes = bytes.data;
    encoding = 'binary';
  }

  // string conversion
  encoding = encoding || 'binary';
  if(typeof bytes === 'string') {
    var view;

    // decode from string
    if(encoding === 'hex') {
      this.accommodate(Math.ceil(bytes.length / 2));
      view = new Uint8Array(this.data.buffer, this.write);
      this.write += util.binary.hex.decode(bytes, view, this.write);
      return this;
    }
    if(encoding === 'base64') {
      this.accommodate(Math.ceil(bytes.length / 4) * 3);
      view = new Uint8Array(this.data.buffer, this.write);
      this.write += util.binary.base64.decode(bytes, view, this.write);
      return this;
    }

    // encode text as UTF-8 bytes
    if(encoding === 'utf8') {
      // encode as UTF-8 then decode string as raw binary
      bytes = util.encodeUtf8(bytes);
      encoding = 'binary';
    }

    // decode string as raw binary
    if(encoding === 'binary' || encoding === 'raw') {
      // one byte per character
      this.accommodate(bytes.length);
      view = new Uint8Array(this.data.buffer, this.write);
      this.write += util.binary.raw.decode(view);
      return this;
    }

    // encode text as UTF-16 bytes
    if(encoding === 'utf16') {
      // two bytes per character
      this.accommodate(bytes.length * 2);
      view = new Uint16Array(this.data.buffer, this.write);
      this.write += util.text.utf16.encode(view);
      return this;
    }

    throw new Error('Invalid encoding: ' + encoding);
  }

  throw Error('Invalid parameter: ' + bytes);
};

/**
 * Puts the given buffer into this buffer.
 *
 * @param buffer the buffer to put into this one.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putBuffer = function(buffer) {
  this.putBytes(buffer);
  buffer.clear();
  return this;
};

/**
 * Puts a string into this buffer.
 *
 * @param str the string to put.
 * @param [encoding] the encoding for the string (default: 'utf16').
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putString = function(str) {
  return this.putBytes(str, 'utf16');
};

/**
 * Puts a 16-bit integer in this buffer in big-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt16 = function(i) {
  this.accommodate(2);
  this.data.setInt16(this.write, i);
  this.write += 2;
  return this;
};

/**
 * Puts a 24-bit integer in this buffer in big-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt24 = function(i) {
  this.accommodate(3);
  this.data.setInt16(this.write, i >> 8 & 0xFFFF);
  this.data.setInt8(this.write, i >> 16 & 0xFF);
  this.write += 3;
  return this;
};

/**
 * Puts a 32-bit integer in this buffer in big-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt32 = function(i) {
  this.accommodate(4);
  this.data.setInt32(this.write, i);
  this.write += 4;
  return this;
};

/**
 * Puts a 16-bit integer in this buffer in little-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt16Le = function(i) {
  this.accommodate(2);
  this.data.setInt16(this.write, i, true);
  this.write += 2;
  return this;
};

/**
 * Puts a 24-bit integer in this buffer in little-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt24Le = function(i) {
  this.accommodate(3);
  this.data.setInt8(this.write, i >> 16 & 0xFF);
  this.data.setInt16(this.write, i >> 8 & 0xFFFF, true);
  this.write += 3;
  return this;
};

/**
 * Puts a 32-bit integer in this buffer in little-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt32Le = function(i) {
  this.accommodate(4);
  this.data.setInt32(this.write, i, true);
  this.write += 4;
  return this;
};

/**
 * Puts an n-bit integer in this buffer in big-endian order.
 *
 * @param i the n-bit integer.
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putInt = function(i, n) {
  _checkBitsParam(n);
  this.accommodate(n / 8);
  do {
    n -= 8;
    this.data.setInt8(this.write++, (i >> n) & 0xFF);
  } while(n > 0);
  return this;
};

/**
 * Puts a signed n-bit integer in this buffer in big-endian order. Two's
 * complement representation is used.
 *
 * @param i the n-bit integer.
 * @param n the number of bits in the integer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.putSignedInt = function(i, n) {
  _checkBitsParam(n);
  this.accommodate(n / 8);
  if(i < 0) {
    i += 2 << (n - 1);
  }
  return this.putInt(i, n);
};

/**
 * Gets a byte from this buffer and advances the read pointer by 1.
 *
 * @return the byte.
 */
util.DataBuffer.prototype.getByte = function() {
  return this.data.getInt8(this.read++);
};

/**
 * Gets a uint16 from this buffer in big-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
util.DataBuffer.prototype.getInt16 = function() {
  var rval = this.data.getInt16(this.read);
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in big-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
util.DataBuffer.prototype.getInt24 = function() {
  var rval = (
    this.data.getInt16(this.read) << 8 ^
    this.data.getInt8(this.read + 2));
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in big-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
util.DataBuffer.prototype.getInt32 = function() {
  var rval = this.data.getInt32(this.read);
  this.read += 4;
  return rval;
};

/**
 * Gets a uint16 from this buffer in little-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
util.DataBuffer.prototype.getInt16Le = function() {
  var rval = this.data.getInt16(this.read, true);
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in little-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
util.DataBuffer.prototype.getInt24Le = function() {
  var rval = (
    this.data.getInt8(this.read) ^
    this.data.getInt16(this.read + 1, true) << 8);
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in little-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
util.DataBuffer.prototype.getInt32Le = function() {
  var rval = this.data.getInt32(this.read, true);
  this.read += 4;
  return rval;
};

/**
 * Gets an n-bit integer from this buffer in big-endian order and advances the
 * read pointer by n/8.
 *
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return the integer.
 */
util.DataBuffer.prototype.getInt = function(n) {
  _checkBitsParam(n);
  var rval = 0;
  do {
    // TODO: Use (rval * 0x100) if adding support for 33 to 53 bits.
    rval = (rval << 8) + this.data.getInt8(this.read++);
    n -= 8;
  } while(n > 0);
  return rval;
};

/**
 * Gets a signed n-bit integer from this buffer in big-endian order, using
 * two's complement, and advances the read pointer by n/8.
 *
 * @param n the number of bits in the integer (8, 16, 24, or 32).
 *
 * @return the integer.
 */
util.DataBuffer.prototype.getSignedInt = function(n) {
  // getInt checks n
  var x = this.getInt(n);
  var max = 2 << (n - 2);
  if(x >= max) {
    x -= max << 1;
  }
  return x;
};

/**
 * Reads bytes out into a UTF-8 string and clears them from the buffer.
 *
 * @param count the number of bytes to read, undefined or null for all.
 *
 * @return a UTF-8 string of bytes.
 */
util.DataBuffer.prototype.getBytes = function(count) {
  // TODO: deprecate this method, it is poorly named and
  // this.toString('binary') replaces it
  // add a toTypedArray()/toArrayBuffer() function
  var rval;
  if(count) {
    // read count bytes
    count = Math.min(this.length(), count);
    rval = this.data.slice(this.read, this.read + count);
    this.read += count;
  } else if(count === 0) {
    rval = '';
  } else {
    // read all bytes, optimize to only copy when needed
    rval = (this.read === 0) ? this.data : this.data.slice(this.read);
    this.clear();
  }
  return rval;
};

/**
 * Gets a UTF-8 encoded string of the bytes from this buffer without modifying
 * the read pointer.
 *
 * @param count the number of bytes to get, omit to get all.
 *
 * @return a string full of UTF-8 encoded characters.
 */
util.DataBuffer.prototype.bytes = function(count) {
  // TODO: deprecate this method, it is poorly named, add "getString()"
  return (typeof(count) === 'undefined' ?
    this.data.slice(this.read) :
    this.data.slice(this.read, this.read + count));
};

/**
 * Gets a byte at the given index without modifying the read pointer.
 *
 * @param i the byte index.
 *
 * @return the byte.
 */
util.DataBuffer.prototype.at = function(i) {
  return this.data.getUint8(this.read + i);
};

/**
 * Puts a byte at the given index without modifying the read pointer.
 *
 * @param i the byte index.
 * @param b the byte to put.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.setAt = function(i, b) {
  this.data.setUint8(i, b);
  return this;
};

/**
 * Gets the last byte without modifying the read pointer.
 *
 * @return the last byte.
 */
util.DataBuffer.prototype.last = function() {
  return this.data.getUint8(this.write - 1);
};

/**
 * Creates a copy of this buffer.
 *
 * @return the copy.
 */
util.DataBuffer.prototype.copy = function() {
  return new util.DataBuffer(this);
};

/**
 * Compacts this buffer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.compact = function() {
  if(this.read > 0) {
    var src = new Uint8Array(this.data.buffer, this.read);
    var dst = new Uint8Array(src.byteLength);
    dst.set(src);
    this.data = new DataView(dst);
    this.write -= this.read;
    this.read = 0;
  }
  return this;
};

/**
 * Clears this buffer.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.clear = function() {
  this.data = new DataView(new ArrayBuffer(0));
  this.read = this.write = 0;
  return this;
};

/**
 * Shortens this buffer by triming bytes off of the end of this buffer.
 *
 * @param count the number of bytes to trim off.
 *
 * @return this buffer.
 */
util.DataBuffer.prototype.truncate = function(count) {
  this.write = Math.max(0, this.length() - count);
  this.read = Math.min(this.read, this.write);
  return this;
};

/**
 * Converts this buffer to a hexadecimal string.
 *
 * @return a hexadecimal string.
 */
util.DataBuffer.prototype.toHex = function() {
  var rval = '';
  for(var i = this.read; i < this.data.byteLength; ++i) {
    var b = this.data.getUint8(i);
    if(b < 16) {
      rval += '0';
    }
    rval += b.toString(16);
  }
  return rval;
};

/**
 * Converts this buffer to a string, using the given encoding. If no
 * encoding is given, 'utf8' (UTF-8) is used.
 *
 * @param [encoding] the encoding to use: 'binary', 'utf8', 'utf16', 'hex',
 *          'base64' (default: 'utf8').
 *
 * @return a string representation of the bytes in this buffer.
 */
util.DataBuffer.prototype.toString = function(encoding) {
  var view = new Uint8Array(this.data, this.read, this.length());
  encoding = encoding || 'utf8';

  // encode to string
  if(encoding === 'binary' || encoding === 'raw') {
    return util.binary.raw.encode(view);
  }
  if(encoding === 'hex') {
    return util.binary.hex.encode(view);
  }
  if(encoding === 'base64') {
    return util.binary.base64.encode(view);
  }

  // decode to text
  if(encoding === 'utf8') {
    return util.text.utf8.decode(view);
  }
  if(encoding === 'utf16') {
    return util.text.utf16.decode(view);
  }

  throw new Error('Invalid encoding: ' + encoding);
};

/** End Buffer w/UInt8Array backing */

/**
 * Creates a buffer that stores bytes. A value may be given to put into the
 * buffer that is either a string of bytes or a UTF-16 string that will
 * be encoded using UTF-8 (to do the latter, specify 'utf8' as the encoding).
 *
 * @param [input] the bytes to wrap (as a string) or a UTF-16 string to encode
 *          as UTF-8.
 * @param [encoding] (default: 'raw', other: 'utf8').
 */
util.createBuffer = function(input, encoding) {
  // TODO: deprecate, use new ByteBuffer() instead
  encoding = encoding || 'raw';
  if(input !== undefined && encoding === 'utf8') {
    input = util.encodeUtf8(input);
  }
  return new util.ByteBuffer(input);
};

/**
 * Fills a string with a particular value. If you want the string to be a byte
 * string, pass in String.fromCharCode(theByte).
 *
 * @param c the character to fill the string with, use String.fromCharCode
 *          to fill the string with a byte value.
 * @param n the number of characters of value c to fill with.
 *
 * @return the filled string.
 */
util.fillString = function(c, n) {
  var s = '';
  while(n > 0) {
    if(n & 1) {
      s += c;
    }
    n >>>= 1;
    if(n > 0) {
      c += c;
    }
  }
  return s;
};

/**
 * Performs a per byte XOR between two byte strings and returns the result as a
 * string of bytes.
 *
 * @param s1 first string of bytes.
 * @param s2 second string of bytes.
 * @param n the number of bytes to XOR.
 *
 * @return the XOR'd result.
 */
util.xorBytes = function(s1, s2, n) {
  var s3 = '';
  var b = '';
  var t = '';
  var i = 0;
  var c = 0;
  for(; n > 0; --n, ++i) {
    b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
    if(c >= 10) {
      s3 += t;
      t = '';
      c = 0;
    }
    t += String.fromCharCode(b);
    ++c;
  }
  s3 += t;
  return s3;
};

/**
 * Converts a hex string into a 'binary' encoded string of bytes.
 *
 * @param hex the hexadecimal string to convert.
 *
 * @return the binary-encoded string of bytes.
 */
util.hexToBytes = function(hex) {
  // TODO: deprecate: "Deprecated. Use util.binary.hex.decode instead."
  var rval = '';
  var i = 0;
  if(hex.length & 1 == 1) {
    // odd number of characters, convert first character alone
    i = 1;
    rval += String.fromCharCode(parseInt(hex[0], 16));
  }
  // convert 2 characters (1 byte) at a time
  for(; i < hex.length; i += 2) {
    rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return rval;
};

/**
 * Converts a 'binary' encoded string of bytes to hex.
 *
 * @param bytes the byte string to convert.
 *
 * @return the string of hexadecimal characters.
 */
util.bytesToHex = function(bytes) {
  // TODO: deprecate: "Deprecated. Use util.binary.hex.encode instead."
  return util.createBuffer(bytes).toHex();
};

/**
 * Converts an 32-bit integer to 4-big-endian byte string.
 *
 * @param i the integer.
 *
 * @return the byte string.
 */
util.int32ToBytes = function(i) {
  return (
    String.fromCharCode(i >> 24 & 0xFF) +
    String.fromCharCode(i >> 16 & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i & 0xFF));
};

// base64 characters, reverse mapping
var _base64 =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var _base64Idx = [
/*43 -43 = 0*/
/*'+',  1,  2,  3,'/' */
   62, -1, -1, -1, 63,

/*'0','1','2','3','4','5','6','7','8','9' */
   52, 53, 54, 55, 56, 57, 58, 59, 60, 61,

/*15, 16, 17,'=', 19, 20, 21 */
  -1, -1, -1, 64, -1, -1, -1,

/*65 - 43 = 22*/
/*'A','B','C','D','E','F','G','H','I','J','K','L','M', */
   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,

/*'N','O','P','Q','R','S','T','U','V','W','X','Y','Z' */
   13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,

/*91 - 43 = 48 */
/*48, 49, 50, 51, 52, 53 */
  -1, -1, -1, -1, -1, -1,

/*97 - 43 = 54*/
/*'a','b','c','d','e','f','g','h','i','j','k','l','m' */
   26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,

/*'n','o','p','q','r','s','t','u','v','w','x','y','z' */
   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

// base58 characters (Bitcoin alphabet)
var _base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Base64 encodes a 'binary' encoded string of bytes.
 *
 * @param input the binary encoded string of bytes to base64-encode.
 * @param maxline the maximum number of encoded characters per line to use,
 *          defaults to none.
 *
 * @return the base64-encoded output.
 */
util.encode64 = function(input, maxline) {
  // TODO: deprecate: "Deprecated. Use util.binary.base64.encode instead."
  var line = '';
  var output = '';
  var chr1, chr2, chr3;
  var i = 0;
  while(i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    // encode 4 character group
    line += _base64.charAt(chr1 >> 2);
    line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
    if(isNaN(chr2)) {
      line += '==';
    } else {
      line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
      line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
    }

    if(maxline && line.length > maxline) {
      output += line.substr(0, maxline) + '\r\n';
      line = line.substr(maxline);
    }
  }
  output += line;
  return output;
};

/**
 * Base64 decodes a string into a 'binary' encoded string of bytes.
 *
 * @param input the base64-encoded input.
 *
 * @return the binary encoded string.
 */
util.decode64 = function(input) {
  // TODO: deprecate: "Deprecated. Use util.binary.base64.decode instead."

  // remove all non-base64 characters
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  var output = '';
  var enc1, enc2, enc3, enc4;
  var i = 0;

  while(i < input.length) {
    enc1 = _base64Idx[input.charCodeAt(i++) - 43];
    enc2 = _base64Idx[input.charCodeAt(i++) - 43];
    enc3 = _base64Idx[input.charCodeAt(i++) - 43];
    enc4 = _base64Idx[input.charCodeAt(i++) - 43];

    output += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
    if(enc3 !== 64) {
      // decoded at least 2 bytes
      output += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2));
      if(enc4 !== 64) {
        // decoded 3 bytes
        output += String.fromCharCode(((enc3 & 3) << 6) | enc4);
      }
    }
  }

  return output;
};

/**
 * UTF-8 encodes the given UTF-16 encoded string (a standard JavaScript
 * string). Non-ASCII characters will be encoded as multiple bytes according
 * to UTF-8.
 *
 * @param str the string to encode.
 *
 * @return the UTF-8 encoded string.
 */
util.encodeUtf8 = function(str) {
  return unescape(encodeURIComponent(str));
};

/**
 * Decodes a UTF-8 encoded string into a UTF-16 string.
 *
 * @param str the string to decode.
 *
 * @return the UTF-16 encoded string (standard JavaScript string).
 */
util.decodeUtf8 = function(str) {
  return decodeURIComponent(escape(str));
};

// binary encoding/decoding tools
// FIXME: Experimental. Do not use yet.
util.binary = {
  raw: {},
  hex: {},
  base64: {},
  base58: {},
  baseN : {
    encode: baseN.encode,
    decode: baseN.decode
  }
};

/**
 * Encodes a Uint8Array as a binary-encoded string. This encoding uses
 * a value between 0 and 255 for each character.
 *
 * @param bytes the Uint8Array to encode.
 *
 * @return the binary-encoded string.
 */
util.binary.raw.encode = function(bytes) {
  return String.fromCharCode.apply(null, bytes);
};

/**
 * Decodes a binary-encoded string to a Uint8Array. This encoding uses
 * a value between 0 and 255 for each character.
 *
 * @param str the binary-encoded string to decode.
 * @param [output] an optional Uint8Array to write the output to; if it
 *          is too small, an exception will be thrown.
 * @param [offset] the start offset for writing to the output (default: 0).
 *
 * @return the Uint8Array or the number of bytes written if output was given.
 */
util.binary.raw.decode = function(str, output, offset) {
  var out = output;
  if(!out) {
    out = new Uint8Array(str.length);
  }
  offset = offset || 0;
  var j = offset;
  for(var i = 0; i < str.length; ++i) {
    out[j++] = str.charCodeAt(i);
  }
  return output ? (j - offset) : out;
};

/**
 * Encodes a 'binary' string, ArrayBuffer, DataView, TypedArray, or
 * ByteBuffer as a string of hexadecimal characters.
 *
 * @param bytes the bytes to convert.
 *
 * @return the string of hexadecimal characters.
 */
util.binary.hex.encode = util.bytesToHex;

/**
 * Decodes a hex-encoded string to a Uint8Array.
 *
 * @param hex the hexadecimal string to convert.
 * @param [output] an optional Uint8Array to write the output to; if it
 *          is too small, an exception will be thrown.
 * @param [offset] the start offset for writing to the output (default: 0).
 *
 * @return the Uint8Array or the number of bytes written if output was given.
 */
util.binary.hex.decode = function(hex, output, offset) {
  var out = output;
  if(!out) {
    out = new Uint8Array(Math.ceil(hex.length / 2));
  }
  offset = offset || 0;
  var i = 0, j = offset;
  if(hex.length & 1) {
    // odd number of characters, convert first character alone
    i = 1;
    out[j++] = parseInt(hex[0], 16);
  }
  // convert 2 characters (1 byte) at a time
  for(; i < hex.length; i += 2) {
    out[j++] = parseInt(hex.substr(i, 2), 16);
  }
  return output ? (j - offset) : out;
};

/**
 * Base64-encodes a Uint8Array.
 *
 * @param input the Uint8Array to encode.
 * @param maxline the maximum number of encoded characters per line to use,
 *          defaults to none.
 *
 * @return the base64-encoded output string.
 */
util.binary.base64.encode = function(input, maxline) {
  var line = '';
  var output = '';
  var chr1, chr2, chr3;
  var i = 0;
  while(i < input.byteLength) {
    chr1 = input[i++];
    chr2 = input[i++];
    chr3 = input[i++];

    // encode 4 character group
    line += _base64.charAt(chr1 >> 2);
    line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
    if(isNaN(chr2)) {
      line += '==';
    } else {
      line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
      line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
    }

    if(maxline && line.length > maxline) {
      output += line.substr(0, maxline) + '\r\n';
      line = line.substr(maxline);
    }
  }
  output += line;
  return output;
};

/**
 * Decodes a base64-encoded string to a Uint8Array.
 *
 * @param input the base64-encoded input string.
 * @param [output] an optional Uint8Array to write the output to; if it
 *          is too small, an exception will be thrown.
 * @param [offset] the start offset for writing to the output (default: 0).
 *
 * @return the Uint8Array or the number of bytes written if output was given.
 */
util.binary.base64.decode = function(input, output, offset) {
  var out = output;
  if(!out) {
    out = new Uint8Array(Math.ceil(input.length / 4) * 3);
  }

  // remove all non-base64 characters
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  offset = offset || 0;
  var enc1, enc2, enc3, enc4;
  var i = 0, j = offset;

  while(i < input.length) {
    enc1 = _base64Idx[input.charCodeAt(i++) - 43];
    enc2 = _base64Idx[input.charCodeAt(i++) - 43];
    enc3 = _base64Idx[input.charCodeAt(i++) - 43];
    enc4 = _base64Idx[input.charCodeAt(i++) - 43];

    out[j++] = (enc1 << 2) | (enc2 >> 4);
    if(enc3 !== 64) {
      // decoded at least 2 bytes
      out[j++] = ((enc2 & 15) << 4) | (enc3 >> 2);
      if(enc4 !== 64) {
        // decoded 3 bytes
        out[j++] = ((enc3 & 3) << 6) | enc4;
      }
    }
  }

  // make sure result is the exact decoded length
  return output ? (j - offset) : out.subarray(0, j);
};

// add support for base58 encoding/decoding with Bitcoin alphabet
util.binary.base58.encode = function(input, maxline) {
  return util.binary.baseN.encode(input, _base58, maxline);
};
util.binary.base58.decode = function(input, maxline) {
  return util.binary.baseN.decode(input, _base58, maxline);
};

// text encoding/decoding tools
// FIXME: Experimental. Do not use yet.
util.text = {
  utf8: {},
  utf16: {}
};

/**
 * Encodes the given string as UTF-8 in a Uint8Array.
 *
 * @param str the string to encode.
 * @param [output] an optional Uint8Array to write the output to; if it
 *          is too small, an exception will be thrown.
 * @param [offset] the start offset for writing to the output (default: 0).
 *
 * @return the Uint8Array or the number of bytes written if output was given.
 */
util.text.utf8.encode = function(str, output, offset) {
  str = util.encodeUtf8(str);
  var out = output;
  if(!out) {
    out = new Uint8Array(str.length);
  }
  offset = offset || 0;
  var j = offset;
  for(var i = 0; i < str.length; ++i) {
    out[j++] = str.charCodeAt(i);
  }
  return output ? (j - offset) : out;
};

/**
 * Decodes the UTF-8 contents from a Uint8Array.
 *
 * @param bytes the Uint8Array to decode.
 *
 * @return the resulting string.
 */
util.text.utf8.decode = function(bytes) {
  return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
};

/**
 * Encodes the given string as UTF-16 in a Uint8Array.
 *
 * @param str the string to encode.
 * @param [output] an optional Uint8Array to write the output to; if it
 *          is too small, an exception will be thrown.
 * @param [offset] the start offset for writing to the output (default: 0).
 *
 * @return the Uint8Array or the number of bytes written if output was given.
 */
util.text.utf16.encode = function(str, output, offset) {
  var out = output;
  if(!out) {
    out = new Uint8Array(str.length * 2);
  }
  var view = new Uint16Array(out.buffer);
  offset = offset || 0;
  var j = offset;
  var k = offset;
  for(var i = 0; i < str.length; ++i) {
    view[k++] = str.charCodeAt(i);
    j += 2;
  }
  return output ? (j - offset) : out;
};

/**
 * Decodes the UTF-16 contents from a Uint8Array.
 *
 * @param bytes the Uint8Array to decode.
 *
 * @return the resulting string.
 */
util.text.utf16.decode = function(bytes) {
  return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
};

/**
 * Deflates the given data using a flash interface.
 *
 * @param api the flash interface.
 * @param bytes the data.
 * @param raw true to return only raw deflate data, false to include zlib
 *          header and trailer.
 *
 * @return the deflated data as a string.
 */
util.deflate = function(api, bytes, raw) {
  bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);

  // strip zlib header and trailer if necessary
  if(raw) {
    // zlib header is 2 bytes (CMF,FLG) where FLG indicates that
    // there is a 4-byte DICT (alder-32) block before the data if
    // its 5th bit is set
    var start = 2;
    var flg = bytes.charCodeAt(1);
    if(flg & 0x20) {
      start = 6;
    }
    // zlib trailer is 4 bytes of adler-32
    bytes = bytes.substring(start, bytes.length - 4);
  }

  return bytes;
};

/**
 * Inflates the given data using a flash interface.
 *
 * @param api the flash interface.
 * @param bytes the data.
 * @param raw true if the incoming data has no zlib header or trailer and is
 *          raw DEFLATE data.
 *
 * @return the inflated data as a string, null on error.
 */
util.inflate = function(api, bytes, raw) {
  // TODO: add zlib header and trailer if necessary/possible
  var rval = api.inflate(util.encode64(bytes)).rval;
  return (rval === null) ? null : util.decode64(rval);
};

/**
 * Sets a storage object.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 * @param obj the storage object, null to remove.
 */
var _setStorageObject = function(api, id, obj) {
  if(!api) {
    throw new Error('WebStorage not available.');
  }

  var rval;
  if(obj === null) {
    rval = api.removeItem(id);
  } else {
    // json-encode and base64-encode object
    obj = util.encode64(JSON.stringify(obj));
    rval = api.setItem(id, obj);
  }

  // handle potential flash error
  if(typeof(rval) !== 'undefined' && rval.rval !== true) {
    var error = new Error(rval.error.message);
    error.id = rval.error.id;
    error.name = rval.error.name;
    throw error;
  }
};

/**
 * Gets a storage object.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 *
 * @return the storage object entry or null if none exists.
 */
var _getStorageObject = function(api, id) {
  if(!api) {
    throw new Error('WebStorage not available.');
  }

  // get the existing entry
  var rval = api.getItem(id);

  /* Note: We check api.init because we can't do (api == localStorage)
    on IE because of "Class doesn't support Automation" exception. Only
    the flash api has an init method so this works too, but we need a
    better solution in the future. */

  // flash returns item wrapped in an object, handle special case
  if(api.init) {
    if(rval.rval === null) {
      if(rval.error) {
        var error = new Error(rval.error.message);
        error.id = rval.error.id;
        error.name = rval.error.name;
        throw error;
      }
      // no error, but also no item
      rval = null;
    } else {
      rval = rval.rval;
    }
  }

  // handle decoding
  if(rval !== null) {
    // base64-decode and json-decode data
    rval = JSON.parse(util.decode64(rval));
  }

  return rval;
};

/**
 * Stores an item in local storage.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 * @param key the key for the item.
 * @param data the data for the item (any javascript object/primitive).
 */
var _setItem = function(api, id, key, data) {
  // get storage object
  var obj = _getStorageObject(api, id);
  if(obj === null) {
    // create a new storage object
    obj = {};
  }
  // update key
  obj[key] = data;

  // set storage object
  _setStorageObject(api, id, obj);
};

/**
 * Gets an item from local storage.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 * @param key the key for the item.
 *
 * @return the item.
 */
var _getItem = function(api, id, key) {
  // get storage object
  var rval = _getStorageObject(api, id);
  if(rval !== null) {
    // return data at key
    rval = (key in rval) ? rval[key] : null;
  }

  return rval;
};

/**
 * Removes an item from local storage.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 * @param key the key for the item.
 */
var _removeItem = function(api, id, key) {
  // get storage object
  var obj = _getStorageObject(api, id);
  if(obj !== null && key in obj) {
    // remove key
    delete obj[key];

    // see if entry has no keys remaining
    var empty = true;
    for(var prop in obj) {
      empty = false;
      break;
    }
    if(empty) {
      // remove entry entirely if no keys are left
      obj = null;
    }

    // set storage object
    _setStorageObject(api, id, obj);
  }
};

/**
 * Clears the local disk storage identified by the given ID.
 *
 * @param api the storage interface.
 * @param id the storage ID to use.
 */
var _clearItems = function(api, id) {
  _setStorageObject(api, id, null);
};

/**
 * Calls a storage function.
 *
 * @param func the function to call.
 * @param args the arguments for the function.
 * @param location the location argument.
 *
 * @return the return value from the function.
 */
var _callStorageFunction = function(func, args, location) {
  var rval = null;

  // default storage types
  if(typeof(location) === 'undefined') {
    location = ['web', 'flash'];
  }

  // apply storage types in order of preference
  var type;
  var done = false;
  var exception = null;
  for(var idx in location) {
    type = location[idx];
    try {
      if(type === 'flash' || type === 'both') {
        if(args[0] === null) {
          throw new Error('Flash local storage not available.');
        }
        rval = func.apply(this, args);
        done = (type === 'flash');
      }
      if(type === 'web' || type === 'both') {
        args[0] = localStorage;
        rval = func.apply(this, args);
        done = true;
      }
    } catch(ex) {
      exception = ex;
    }
    if(done) {
      break;
    }
  }

  if(!done) {
    throw exception;
  }

  return rval;
};

/**
 * Stores an item on local disk.
 *
 * The available types of local storage include 'flash', 'web', and 'both'.
 *
 * The type 'flash' refers to flash local storage (SharedObject). In order
 * to use flash local storage, the 'api' parameter must be valid. The type
 * 'web' refers to WebStorage, if supported by the browser. The type 'both'
 * refers to storing using both 'flash' and 'web', not just one or the
 * other.
 *
 * The location array should list the storage types to use in order of
 * preference:
 *
 * ['flash']: flash only storage
 * ['web']: web only storage
 * ['both']: try to store in both
 * ['flash','web']: store in flash first, but if not available, 'web'
 * ['web','flash']: store in web first, but if not available, 'flash'
 *
 * The location array defaults to: ['web', 'flash']
 *
 * @param api the flash interface, null to use only WebStorage.
 * @param id the storage ID to use.
 * @param key the key for the item.
 * @param data the data for the item (any javascript object/primitive).
 * @param location an array with the preferred types of storage to use.
 */
util.setItem = function(api, id, key, data, location) {
  _callStorageFunction(_setItem, arguments, location);
};

/**
 * Gets an item on local disk.
 *
 * Set setItem() for details on storage types.
 *
 * @param api the flash interface, null to use only WebStorage.
 * @param id the storage ID to use.
 * @param key the key for the item.
 * @param location an array with the preferred types of storage to use.
 *
 * @return the item.
 */
util.getItem = function(api, id, key, location) {
  return _callStorageFunction(_getItem, arguments, location);
};

/**
 * Removes an item on local disk.
 *
 * Set setItem() for details on storage types.
 *
 * @param api the flash interface.
 * @param id the storage ID to use.
 * @param key the key for the item.
 * @param location an array with the preferred types of storage to use.
 */
util.removeItem = function(api, id, key, location) {
  _callStorageFunction(_removeItem, arguments, location);
};

/**
 * Clears the local disk storage identified by the given ID.
 *
 * Set setItem() for details on storage types.
 *
 * @param api the flash interface if flash is available.
 * @param id the storage ID to use.
 * @param location an array with the preferred types of storage to use.
 */
util.clearItems = function(api, id, location) {
  _callStorageFunction(_clearItems, arguments, location);
};

/**
 * Parses the scheme, host, and port from an http(s) url.
 *
 * @param str the url string.
 *
 * @return the parsed url object or null if the url is invalid.
 */
util.parseUrl = function(str) {
  // FIXME: this regex looks a bit broken
  var regex = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g;
  regex.lastIndex = 0;
  var m = regex.exec(str);
  var url = (m === null) ? null : {
    full: str,
    scheme: m[1],
    host: m[2],
    port: m[3],
    path: m[4]
  };
  if(url) {
    url.fullHost = url.host;
    if(url.port) {
      if(url.port !== 80 && url.scheme === 'http') {
        url.fullHost += ':' + url.port;
      } else if(url.port !== 443 && url.scheme === 'https') {
        url.fullHost += ':' + url.port;
      }
    } else if(url.scheme === 'http') {
      url.port = 80;
    } else if(url.scheme === 'https') {
      url.port = 443;
    }
    url.full = url.scheme + '://' + url.fullHost;
  }
  return url;
};

/* Storage for query variables */
var _queryVariables = null;

/**
 * Returns the window location query variables. Query is parsed on the first
 * call and the same object is returned on subsequent calls. The mapping
 * is from keys to an array of values. Parameters without values will have
 * an object key set but no value added to the value array. Values are
 * unescaped.
 *
 * ...?k1=v1&k2=v2:
 * {
 *   "k1": ["v1"],
 *   "k2": ["v2"]
 * }
 *
 * ...?k1=v1&k1=v2:
 * {
 *   "k1": ["v1", "v2"]
 * }
 *
 * ...?k1=v1&k2:
 * {
 *   "k1": ["v1"],
 *   "k2": []
 * }
 *
 * ...?k1=v1&k1:
 * {
 *   "k1": ["v1"]
 * }
 *
 * ...?k1&k1:
 * {
 *   "k1": []
 * }
 *
 * @param query the query string to parse (optional, default to cached
 *          results from parsing window location search query).
 *
 * @return object mapping keys to variables.
 */
util.getQueryVariables = function(query) {
  var parse = function(q) {
    var rval = {};
    var kvpairs = q.split('&');
    for(var i = 0; i < kvpairs.length; i++) {
      var pos = kvpairs[i].indexOf('=');
      var key;
      var val;
      if(pos > 0) {
        key = kvpairs[i].substring(0, pos);
        val = kvpairs[i].substring(pos + 1);
      } else {
        key = kvpairs[i];
        val = null;
      }
      if(!(key in rval)) {
        rval[key] = [];
      }
      // disallow overriding object prototype keys
      if(!(key in Object.prototype) && val !== null) {
        rval[key].push(unescape(val));
      }
    }
    return rval;
  };

   var rval;
   if(typeof(query) === 'undefined') {
     // set cached variables if needed
     if(_queryVariables === null) {
       if(typeof(window) !== 'undefined' && window.location && window.location.search) {
          // parse window search query
          _queryVariables = parse(window.location.search.substring(1));
       } else {
          // no query variables available
          _queryVariables = {};
       }
     }
     rval = _queryVariables;
   } else {
     // parse given query
     rval = parse(query);
   }
   return rval;
};

/**
 * Parses a fragment into a path and query. This method will take a URI
 * fragment and break it up as if it were the main URI. For example:
 *    /bar/baz?a=1&b=2
 * results in:
 *    {
 *       path: ["bar", "baz"],
 *       query: {"k1": ["v1"], "k2": ["v2"]}
 *    }
 *
 * @return object with a path array and query object.
 */
util.parseFragment = function(fragment) {
  // default to whole fragment
  var fp = fragment;
  var fq = '';
  // split into path and query if possible at the first '?'
  var pos = fragment.indexOf('?');
  if(pos > 0) {
    fp = fragment.substring(0, pos);
    fq = fragment.substring(pos + 1);
  }
  // split path based on '/' and ignore first element if empty
  var path = fp.split('/');
  if(path.length > 0 && path[0] === '') {
    path.shift();
  }
  // convert query into object
  var query = (fq === '') ? {} : util.getQueryVariables(fq);

  return {
    pathString: fp,
    queryString: fq,
    path: path,
    query: query
  };
};

/**
 * Makes a request out of a URI-like request string. This is intended to
 * be used where a fragment id (after a URI '#') is parsed as a URI with
 * path and query parts. The string should have a path beginning and
 * delimited by '/' and optional query parameters following a '?'. The
 * query should be a standard URL set of key value pairs delimited by
 * '&'. For backwards compatibility the initial '/' on the path is not
 * required. The request object has the following API, (fully described
 * in the method code):
 *    {
 *       path: <the path string part>.
 *       query: <the query string part>,
 *       getPath(i): get part or all of the split path array,
 *       getQuery(k, i): get part or all of a query key array,
 *       getQueryLast(k, _default): get last element of a query key array.
 *    }
 *
 * @return object with request parameters.
 */
util.makeRequest = function(reqString) {
  var frag = util.parseFragment(reqString);
  var req = {
    // full path string
    path: frag.pathString,
    // full query string
    query: frag.queryString,
    /**
     * Get path or element in path.
     *
     * @param i optional path index.
     *
     * @return path or part of path if i provided.
     */
    getPath: function(i) {
      return (typeof(i) === 'undefined') ? frag.path : frag.path[i];
    },
    /**
     * Get query, values for a key, or value for a key index.
     *
     * @param k optional query key.
     * @param i optional query key index.
     *
     * @return query, values for a key, or value for a key index.
     */
    getQuery: function(k, i) {
      var rval;
      if(typeof(k) === 'undefined') {
        rval = frag.query;
      } else {
        rval = frag.query[k];
        if(rval && typeof(i) !== 'undefined') {
           rval = rval[i];
        }
      }
      return rval;
    },
    getQueryLast: function(k, _default) {
      var rval;
      var vals = req.getQuery(k);
      if(vals) {
        rval = vals[vals.length - 1];
      } else {
        rval = _default;
      }
      return rval;
    }
  };
  return req;
};

/**
 * Makes a URI out of a path, an object with query parameters, and a
 * fragment. Uses jQuery.param() internally for query string creation.
 * If the path is an array, it will be joined with '/'.
 *
 * @param path string path or array of strings.
 * @param query object with query parameters. (optional)
 * @param fragment fragment string. (optional)
 *
 * @return string object with request parameters.
 */
util.makeLink = function(path, query, fragment) {
  // join path parts if needed
  path = jQuery.isArray(path) ? path.join('/') : path;

  var qstr = jQuery.param(query || {});
  fragment = fragment || '';
  return path +
    ((qstr.length > 0) ? ('?' + qstr) : '') +
    ((fragment.length > 0) ? ('#' + fragment) : '');
};

/**
 * Follows a path of keys deep into an object hierarchy and set a value.
 * If a key does not exist or it's value is not an object, create an
 * object in it's place. This can be destructive to a object tree if
 * leaf nodes are given as non-final path keys.
 * Used to avoid exceptions from missing parts of the path.
 *
 * @param object the starting object.
 * @param keys an array of string keys.
 * @param value the value to set.
 */
util.setPath = function(object, keys, value) {
  // need to start at an object
  if(typeof(object) === 'object' && object !== null) {
    var i = 0;
    var len = keys.length;
    while(i < len) {
      var next = keys[i++];
      if(i == len) {
        // last
        object[next] = value;
      } else {
        // more
        var hasNext = (next in object);
        if(!hasNext ||
          (hasNext && typeof(object[next]) !== 'object') ||
          (hasNext && object[next] === null)) {
          object[next] = {};
        }
        object = object[next];
      }
    }
  }
};

/**
 * Follows a path of keys deep into an object hierarchy and return a value.
 * If a key does not exist, create an object in it's place.
 * Used to avoid exceptions from missing parts of the path.
 *
 * @param object the starting object.
 * @param keys an array of string keys.
 * @param _default value to return if path not found.
 *
 * @return the value at the path if found, else default if given, else
 *         undefined.
 */
util.getPath = function(object, keys, _default) {
  var i = 0;
  var len = keys.length;
  var hasNext = true;
  while(hasNext && i < len &&
    typeof(object) === 'object' && object !== null) {
    var next = keys[i++];
    hasNext = next in object;
    if(hasNext) {
      object = object[next];
    }
  }
  return (hasNext ? object : _default);
};

/**
 * Follow a path of keys deep into an object hierarchy and delete the
 * last one. If a key does not exist, do nothing.
 * Used to avoid exceptions from missing parts of the path.
 *
 * @param object the starting object.
 * @param keys an array of string keys.
 */
util.deletePath = function(object, keys) {
  // need to start at an object
  if(typeof(object) === 'object' && object !== null) {
    var i = 0;
    var len = keys.length;
    while(i < len) {
      var next = keys[i++];
      if(i == len) {
        // last
        delete object[next];
      } else {
        // more
        if(!(next in object) ||
          (typeof(object[next]) !== 'object') ||
          (object[next] === null)) {
           break;
        }
        object = object[next];
      }
    }
  }
};

/**
 * Check if an object is empty.
 *
 * Taken from:
 * http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object-from-json/679937#679937
 *
 * @param object the object to check.
 */
util.isEmpty = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

/**
 * Format with simple printf-style interpolation.
 *
 * %%: literal '%'
 * %s,%o: convert next argument into a string.
 *
 * @param format the string to format.
 * @param ... arguments to interpolate into the format string.
 */
util.format = function(format) {
  var re = /%./g;
  // current match
  var match;
  // current part
  var part;
  // current arg index
  var argi = 0;
  // collected parts to recombine later
  var parts = [];
  // last index found
  var last = 0;
  // loop while matches remain
  while((match = re.exec(format))) {
    part = format.substring(last, re.lastIndex - 2);
    // don't add empty strings (ie, parts between %s%s)
    if(part.length > 0) {
      parts.push(part);
    }
    last = re.lastIndex;
    // switch on % code
    var code = match[0][1];
    switch(code) {
    case 's':
    case 'o':
      // check if enough arguments were given
      if(argi < arguments.length) {
        parts.push(arguments[argi++ + 1]);
      } else {
        parts.push('<?>');
      }
      break;
    // FIXME: do proper formating for numbers, etc
    //case 'f':
    //case 'd':
    case '%':
      parts.push('%');
      break;
    default:
      parts.push('<%' + code + '?>');
    }
  }
  // add trailing part of format string
  parts.push(format.substring(last));
  return parts.join('');
};

/**
 * Formats a number.
 *
 * http://snipplr.com/view/5945/javascript-numberformat--ported-from-php/
 */
util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://crestidg.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // *     example 1: number_format(1234.5678, 2, '.', '');
  // *     returns 1: 1234.57

  var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
  var d = dec_point === undefined ? ',' : dec_point;
  var t = thousands_sep === undefined ?
   '.' : thousands_sep, s = n < 0 ? '-' : '';
  var i = parseInt((n = Math.abs(+n || 0).toFixed(c)), 10) + '';
  var j = (i.length > 3) ? i.length % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

/**
 * Formats a byte size.
 *
 * http://snipplr.com/view/5949/format-humanize-file-byte-size-presentation-in-javascript/
 */
util.formatSize = function(size) {
  if(size >= 1073741824) {
    size = util.formatNumber(size / 1073741824, 2, '.', '') + ' GiB';
  } else if(size >= 1048576) {
    size = util.formatNumber(size / 1048576, 2, '.', '') + ' MiB';
  } else if(size >= 1024) {
    size = util.formatNumber(size / 1024, 0) + ' KiB';
  } else {
    size = util.formatNumber(size, 0) + ' bytes';
  }
  return size;
};

/**
 * Converts an IPv4 or IPv6 string representation into bytes (in network order).
 *
 * @param ip the IPv4 or IPv6 address to convert.
 *
 * @return the 4-byte IPv6 or 16-byte IPv6 address or null if the address can't
 *         be parsed.
 */
util.bytesFromIP = function(ip) {
  if(ip.indexOf('.') !== -1) {
    return util.bytesFromIPv4(ip);
  }
  if(ip.indexOf(':') !== -1) {
    return util.bytesFromIPv6(ip);
  }
  return null;
};

/**
 * Converts an IPv4 string representation into bytes (in network order).
 *
 * @param ip the IPv4 address to convert.
 *
 * @return the 4-byte address or null if the address can't be parsed.
 */
util.bytesFromIPv4 = function(ip) {
  ip = ip.split('.');
  if(ip.length !== 4) {
    return null;
  }
  var b = util.createBuffer();
  for(var i = 0; i < ip.length; ++i) {
    var num = parseInt(ip[i], 10);
    if(isNaN(num)) {
      return null;
    }
    b.putByte(num);
  }
  return b.getBytes();
};

/**
 * Converts an IPv6 string representation into bytes (in network order).
 *
 * @param ip the IPv6 address to convert.
 *
 * @return the 16-byte address or null if the address can't be parsed.
 */
util.bytesFromIPv6 = function(ip) {
  var blanks = 0;
  ip = ip.split(':').filter(function(e) {
    if(e.length === 0) ++blanks;
    return true;
  });
  var zeros = (8 - ip.length + blanks) * 2;
  var b = util.createBuffer();
  for(var i = 0; i < 8; ++i) {
    if(!ip[i] || ip[i].length === 0) {
      b.fillWithByte(0, zeros);
      zeros = 0;
      continue;
    }
    var bytes = util.hexToBytes(ip[i]);
    if(bytes.length < 2) {
      b.putByte(0);
    }
    b.putBytes(bytes);
  }
  return b.getBytes();
};

/**
 * Converts 4-bytes into an IPv4 string representation or 16-bytes into
 * an IPv6 string representation. The bytes must be in network order.
 *
 * @param bytes the bytes to convert.
 *
 * @return the IPv4 or IPv6 string representation if 4 or 16 bytes,
 *         respectively, are given, otherwise null.
 */
util.bytesToIP = function(bytes) {
  if(bytes.length === 4) {
    return util.bytesToIPv4(bytes);
  }
  if(bytes.length === 16) {
    return util.bytesToIPv6(bytes);
  }
  return null;
};

/**
 * Converts 4-bytes into an IPv4 string representation. The bytes must be
 * in network order.
 *
 * @param bytes the bytes to convert.
 *
 * @return the IPv4 string representation or null for an invalid # of bytes.
 */
util.bytesToIPv4 = function(bytes) {
  if(bytes.length !== 4) {
    return null;
  }
  var ip = [];
  for(var i = 0; i < bytes.length; ++i) {
    ip.push(bytes.charCodeAt(i));
  }
  return ip.join('.');
};

/**
 * Converts 16-bytes into an IPv16 string representation. The bytes must be
 * in network order.
 *
 * @param bytes the bytes to convert.
 *
 * @return the IPv16 string representation or null for an invalid # of bytes.
 */
util.bytesToIPv6 = function(bytes) {
  if(bytes.length !== 16) {
    return null;
  }
  var ip = [];
  var zeroGroups = [];
  var zeroMaxGroup = 0;
  for(var i = 0; i < bytes.length; i += 2) {
    var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
    // canonicalize zero representation
    while(hex[0] === '0' && hex !== '0') {
      hex = hex.substr(1);
    }
    if(hex === '0') {
      var last = zeroGroups[zeroGroups.length - 1];
      var idx = ip.length;
      if(!last || idx !== last.end + 1) {
        zeroGroups.push({start: idx, end: idx});
      } else {
        last.end = idx;
        if((last.end - last.start) >
          (zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start)) {
          zeroMaxGroup = zeroGroups.length - 1;
        }
      }
    }
    ip.push(hex);
  }
  if(zeroGroups.length > 0) {
    var group = zeroGroups[zeroMaxGroup];
    // only shorten group of length > 0
    if(group.end - group.start > 0) {
      ip.splice(group.start, group.end - group.start + 1, '');
      if(group.start === 0) {
        ip.unshift('');
      }
      if(group.end === 7) {
        ip.push('');
      }
    }
  }
  return ip.join(':');
};

/**
 * Estimates the number of processes that can be run concurrently. If
 * creating Web Workers, keep in mind that the main JavaScript process needs
 * its own core.
 *
 * @param options the options to use:
 *          update true to force an update (not use the cached value).
 * @param callback(err, max) called once the operation completes.
 */
util.estimateCores = function(options, callback) {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  if('cores' in util && !options.update) {
    return callback(null, util.cores);
  }
  if(typeof navigator !== 'undefined' &&
    'hardwareConcurrency' in navigator &&
    navigator.hardwareConcurrency > 0) {
    util.cores = navigator.hardwareConcurrency;
    return callback(null, util.cores);
  }
  if(typeof Worker === 'undefined') {
    // workers not available
    util.cores = 1;
    return callback(null, util.cores);
  }
  if(typeof Blob === 'undefined') {
    // can't estimate, default to 2
    util.cores = 2;
    return callback(null, util.cores);
  }

  // create worker concurrency estimation code as blob
  var blobUrl = URL.createObjectURL(new Blob(['(',
    function() {
      self.addEventListener('message', function(e) {
        // run worker for 4 ms
        var st = Date.now();
        var et = st + 4;
        while(Date.now() < et);
        self.postMessage({st: st, et: et});
      });
    }.toString(),
  ')()'], {type: 'application/javascript'}));

  // take 5 samples using 16 workers
  sample([], 5, 16);

  function sample(max, samples, numWorkers) {
    if(samples === 0) {
      // get overlap average
      var avg = Math.floor(max.reduce(function(avg, x) {
        return avg + x;
      }, 0) / max.length);
      util.cores = Math.max(1, avg);
      URL.revokeObjectURL(blobUrl);
      return callback(null, util.cores);
    }
    map(numWorkers, function(err, results) {
      max.push(reduce(numWorkers, results));
      sample(max, samples - 1, numWorkers);
    });
  }

  function map(numWorkers, callback) {
    var workers = [];
    var results = [];
    for(var i = 0; i < numWorkers; ++i) {
      var worker = new Worker(blobUrl);
      worker.addEventListener('message', function(e) {
        results.push(e.data);
        if(results.length === numWorkers) {
          for(var i = 0; i < numWorkers; ++i) {
            workers[i].terminate();
          }
          callback(null, results);
        }
      });
      workers.push(worker);
    }
    for(var i = 0; i < numWorkers; ++i) {
      workers[i].postMessage(i);
    }
  }

  function reduce(numWorkers, results) {
    // find overlapping time windows
    var overlaps = [];
    for(var n = 0; n < numWorkers; ++n) {
      var r1 = results[n];
      var overlap = overlaps[n] = [];
      for(var i = 0; i < numWorkers; ++i) {
        if(n === i) {
          continue;
        }
        var r2 = results[i];
        if((r1.st > r2.st && r1.st < r2.et) ||
          (r2.st > r1.st && r2.st < r1.et)) {
          overlap.push(i);
        }
      }
    }
    // get maximum overlaps ... don't include overlapping worker itself
    // as the main JS process was also being scheduled during the work and
    // would have to be subtracted from the estimate anyway
    return overlaps.reduce(function(max, overlap) {
      return Math.max(max, overlap.length);
    }, 0);
  }
};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],require("timers").setImmediate)
},{"./baseN":25,"./forge":26,"_process":31,"buffer":1,"timers":43}],31:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
/**
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = require('./util');

module.exports = class AsyncAlgorithm {
  constructor({
    maxCallStackDepth = 500,
    maxTotalCallStackDepth = 0xFFFFFFFF,
    // milliseconds
    timeSlice = 10
  } = {}) {
    this.schedule = {};
    this.schedule.MAX_DEPTH = maxCallStackDepth;
    this.schedule.MAX_TOTAL_DEPTH = maxTotalCallStackDepth;
    this.schedule.depth = 0;
    this.schedule.totalDepth = 0;
    this.schedule.timeSlice = timeSlice;
  }

  // do some work in a time slice, but in serial
  doWork(fn, callback) {
    const schedule = this.schedule;

    if(schedule.totalDepth >= schedule.MAX_TOTAL_DEPTH) {
      return callback(new Error(
        'Maximum total call stack depth exceeded; canonicalization aborting.'));
    }

    (function work() {
      if(schedule.depth === schedule.MAX_DEPTH) {
        // stack too deep, run on next tick
        schedule.depth = 0;
        schedule.running = false;
        return util.nextTick(work);
      }

      // if not yet running, force run
      const now = Date.now();
      if(!schedule.running) {
        schedule.start = Date.now();
        schedule.deadline = schedule.start + schedule.timeSlice;
      }

      // TODO: should also include an estimate of expectedWorkTime
      if(now < schedule.deadline) {
        schedule.running = true;
        schedule.depth++;
        schedule.totalDepth++;
        return fn((err, result) => {
          schedule.depth--;
          schedule.totalDepth--;
          callback(err, result);
        });
      }

      // not enough time left in this slice, run after letting browser
      // do some other things
      schedule.depth = 0;
      schedule.running = false;
      util.setImmediate(work);
    })();
  }

  // asynchronously loop
  forEach(iterable, fn, callback) {
    const self = this;
    let iterator;
    let idx = 0;
    let length;
    if(Array.isArray(iterable)) {
      length = iterable.length;
      iterator = () => {
        if(idx === length) {
          return false;
        }
        iterator.value = iterable[idx++];
        iterator.key = idx;
        return true;
      };
    } else {
      const keys = Object.keys(iterable);
      length = keys.length;
      iterator = () => {
        if(idx === length) {
          return false;
        }
        iterator.key = keys[idx++];
        iterator.value = iterable[iterator.key];
        return true;
      };
    }

    (function iterate(err) {
      if(err) {
        return callback(err);
      }
      if(iterator()) {
        return self.doWork(() => fn(iterator.value, iterator.key, iterate));
      }
      callback();
    })();
  }

  // asynchronous waterfall
  waterfall(fns, callback) {
    const self = this;
    self.forEach(
      fns, (fn, idx, callback) => self.doWork(fn, callback), callback);
  }

  // asynchronous while
  whilst(condition, fn, callback) {
    const self = this;
    (function loop(err) {
      if(err) {
        return callback(err);
      }
      if(!condition()) {
        return callback();
      }
      self.doWork(fn, loop);
    })();
  }
};

},{"./util":42}],33:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const util = require('./util');

module.exports = class IdentifierIssuer {
  /**
   * Creates a new IdentifierIssuer. A IdentifierIssuer issues unique
   * identifiers, keeping track of any previously issued identifiers.
   *
   * @param prefix the prefix to use ('<prefix><counter>').
   */
  constructor(prefix) {
    this.prefix = prefix;
    this.counter = 0;
    this.existing = {};
  }

  /**
   * Copies this IdentifierIssuer.
   *
   * @return a copy of this IdentifierIssuer.
   */
  clone() {
    const copy = new IdentifierIssuer(this.prefix);
    copy.counter = this.counter;
    copy.existing = util.clone(this.existing);
    return copy;
  }

  /**
   * Gets the new identifier for the given old identifier, where if no old
   * identifier is given a new identifier will be generated.
   *
   * @param [old] the old identifier to get the new identifier for.
   *
   * @return the new identifier.
   */
  getId(old) {
    // return existing old identifier
    if(old && old in this.existing) {
      return this.existing[old];
    }

    // get next identifier
    const identifier = this.prefix + this.counter;
    this.counter += 1;

    // save mapping
    if(old) {
      this.existing[old] = identifier;
    }

    return identifier;
  }

  /**
   * Returns true if the given old identifer has already been assigned a new
   * identifier.
   *
   * @param old the old identifier to check.
   *
   * @return true if the old identifier has been assigned a new identifier,
   *   false if not.
   */
  hasId(old) {
    return (old in this.existing);
  }
};

},{"./util":42}],34:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const forge = require('node-forge/lib/forge');
require('node-forge/lib/md');
require('node-forge/lib/sha1');
require('node-forge/lib/sha256');

module.exports = class MessageDigest {
  /**
   * Creates a new MessageDigest.
   *
   * @param algorithm the algorithm to use.
   */
  constructor(algorithm) {
    this.md = forge.md[algorithm].create();
  }

  update(msg) {
    this.md.update(msg, 'utf8');
  }

  digest() {
    return this.md.digest().toHex();
  }
};

},{"node-forge/lib/forge":26,"node-forge/lib/md":27,"node-forge/lib/sha1":28,"node-forge/lib/sha256":29}],35:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const TERMS = ['subject', 'predicate', 'object', 'graph'];
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDF_LANGSTRING = RDF + 'langString';
const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';

// build regexes
const REGEX = {};
(() => {
  const iri = '(?:<([^:]+:[^>]*)>)';
  // https://www.w3.org/TR/turtle/#grammar-production-BLANK_NODE_LABEL
  const PN_CHARS_BASE =
    'A-Z' + 'a-z' +
    '\u00C0-\u00D6' +
    '\u00D8-\u00F6' +
    '\u00F8-\u02FF' +
    '\u0370-\u037D' +
    '\u037F-\u1FFF' +
    '\u200C-\u200D' +
    '\u2070-\u218F' +
    '\u2C00-\u2FEF' +
    '\u3001-\uD7FF' +
    '\uF900-\uFDCF' +
    '\uFDF0-\uFFFD';
    // TODO:
    //'\u10000-\uEFFFF';
  const PN_CHARS_U =
    PN_CHARS_BASE +
    '_';
  const PN_CHARS =
    PN_CHARS_U +
    '0-9' +
    '-' +
    '\u00B7' +
    '\u0300-\u036F' +
    '\u203F-\u2040';
  const BLANK_NODE_LABEL =
    '(_:' +
      '(?:[' + PN_CHARS_U + '0-9])' +
      '(?:(?:[' + PN_CHARS + '.])*(?:[' + PN_CHARS + ']))?' +
    ')';
  const bnode = BLANK_NODE_LABEL;
  const plain = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
  const datatype = '(?:\\^\\^' + iri + ')';
  const language = '(?:@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*))';
  const literal = '(?:' + plain + '(?:' + datatype + '|' + language + ')?)';
  const ws = '[ \\t]+';
  const wso = '[ \\t]*';

  // define quad part regexes
  const subject = '(?:' + iri + '|' + bnode + ')' + ws;
  const property = iri + ws;
  const object = '(?:' + iri + '|' + bnode + '|' + literal + ')' + wso;
  const graphName = '(?:\\.|(?:(?:' + iri + '|' + bnode + ')' + wso + '\\.))';

  // end of line and empty regexes
  REGEX.eoln = /(?:\r\n)|(?:\n)|(?:\r)/g;
  REGEX.empty = new RegExp('^' + wso + '$');

  // full quad regex
  REGEX.quad = new RegExp(
    '^' + wso + subject + property + object + graphName + wso + '$');
})();

module.exports = class NQuads {
  /**
   * Parses RDF in the form of N-Quads.
   *
   * @param input the N-Quads input to parse.
   *
   * @return an RDF dataset (an array of quads per http://rdf.js.org/).
   */
  static parse(input) {
    // build RDF dataset
    const dataset = [];

    const graphs = {};

    // split N-Quad input into lines
    const lines = input.split(REGEX.eoln);
    let lineNumber = 0;
    for(const line of lines) {
      lineNumber++;

      // skip empty lines
      if(REGEX.empty.test(line)) {
        continue;
      }

      // parse quad
      const match = line.match(REGEX.quad);
      if(match === null) {
        throw new Error('N-Quads parse error on line ' + lineNumber + '.');
      }

      // create RDF quad
      const quad = {};

      // get subject
      if(match[1] !== undefined) {
        quad.subject = {termType: 'NamedNode', value: match[1]};
      } else {
        quad.subject = {termType: 'BlankNode', value: match[2]};
      }

      // get predicate
      quad.predicate = {termType: 'NamedNode', value: match[3]};

      // get object
      if(match[4] !== undefined) {
        quad.object = {termType: 'NamedNode', value: match[4]};
      } else if(match[5] !== undefined) {
        quad.object = {termType: 'BlankNode', value: match[5]};
      } else {
        quad.object = {
          termType: 'Literal',
          value: undefined,
          datatype: {
            termType: 'NamedNode'
          }
        };
        if(match[7] !== undefined) {
          quad.object.datatype.value = match[7];
        } else if(match[8] !== undefined) {
          quad.object.datatype.value = RDF_LANGSTRING;
          quad.object.language = match[8];
        } else {
          quad.object.datatype.value = XSD_STRING;
        }
        quad.object.value = _unescape(match[6]);
      }

      // get graph
      if(match[9] !== undefined) {
        quad.graph = {
          termType: 'NamedNode',
          value: match[9]
        };
      } else if(match[10] !== undefined) {
        quad.graph = {
          termType: 'BlankNode',
          value: match[10]
        };
      } else {
        quad.graph = {
          termType: 'DefaultGraph',
          value: ''
        };
      }

      // only add quad if it is unique in its graph
      if(!(quad.graph.value in graphs)) {
        graphs[quad.graph.value] = [quad];
        dataset.push(quad);
      } else {
        let unique = true;
        const quads = graphs[quad.graph.value];
        for(const q of quads) {
          if(_compareTriples(q, quad)) {
            unique = false;
            break;
          }
        }
        if(unique) {
          quads.push(quad);
          dataset.push(quad);
        }
      }
    }

    return dataset;
  }

  /**
   * Converts an RDF dataset to N-Quads.
   *
   * @param dataset (array of quads) the RDF dataset to convert.
   *
   * @return the N-Quads string.
   */
  static serialize(dataset) {
    if(!Array.isArray(dataset)) {
      dataset = NQuads.legacyDatasetToQuads(dataset);
    }
    const quads = [];
    for(const quad of dataset) {
      quads.push(NQuads.serializeQuad(quad));
    }
    return quads.sort().join('');
  }

  /**
   * Converts an RDF quad to an N-Quad string (a single quad).
   *
   * @param quad the RDF quad convert.
   *
   * @return the N-Quad string.
   */
  static serializeQuad(quad) {
    const s = quad.subject;
    const p = quad.predicate;
    const o = quad.object;
    const g = quad.graph;

    let nquad = '';

    // subject and predicate can only be NamedNode or BlankNode
    [s, p].forEach(term => {
      if(term.termType === 'NamedNode') {
        nquad += '<' + term.value + '>';
      } else {
        nquad += term.value;
      }
      nquad += ' ';
    });

    // object is NamedNode, BlankNode, or Literal
    if(o.termType === 'NamedNode') {
      nquad += '<' + o.value + '>';
    } else if(o.termType === 'BlankNode') {
      nquad += o.value;
    } else {
      nquad += '"' + _escape(o.value) + '"';
      if(o.datatype.value === RDF_LANGSTRING) {
        if(o.language) {
          nquad += '@' + o.language;
        }
      } else if(o.datatype.value !== XSD_STRING) {
        nquad += '^^<' + o.datatype.value + '>';
      }
    }

    // graph can only be NamedNode or BlankNode (or DefaultGraph, but that
    // does not add to `nquad`)
    if(g.termType === 'NamedNode') {
      nquad += ' <' + g.value + '>';
    } else if(g.termType === 'BlankNode') {
      nquad += ' ' + g.value;
    }

    nquad += ' .\n';
    return nquad;
  }

  /**
   * Converts a legacy-formatted dataset to an array of quads dataset per
   * http://rdf.js.org/.
   *
   * @param dataset the legacy dataset to convert.
   *
   * @return the array of quads dataset.
   */
  static legacyDatasetToQuads(dataset) {
    const quads = [];

    const termTypeMap = {
      'blank node': 'BlankNode',
      'IRI': 'NamedNode',
      'literal': 'Literal'
    };

    for(const graphName in dataset) {
      const triples = dataset[graphName];
      triples.forEach(triple => {
        const quad = {};
        for(const componentName in triple) {
          const oldComponent = triple[componentName];
          const newComponent = {
            termType: termTypeMap[oldComponent.type],
            value: oldComponent.value
          };
          if(newComponent.termType === 'Literal') {
            newComponent.datatype = {
              termType: 'NamedNode'
            };
            if('datatype' in oldComponent) {
              newComponent.datatype.value = oldComponent.datatype;
            }
            if('language' in oldComponent) {
              if(!('datatype' in oldComponent)) {
                newComponent.datatype.value = RDF_LANGSTRING;
              }
              newComponent.language = oldComponent.language;
            } else if(!('datatype' in oldComponent)) {
              newComponent.datatype.value = XSD_STRING;
            }
          }
          quad[componentName] = newComponent;
        }
        if(graphName === '@default') {
          quad.graph = {
            termType: 'DefaultGraph',
            value: ''
          };
        } else {
          quad.graph = {
            termType: graphName.startsWith('_:') ? 'BlankNode' : 'NamedNode',
            value: graphName
          };
        }
        quads.push(quad);
      });
    }

    return quads;
  }
};

/**
 * Compares two RDF triples for equality.
 *
 * @param t1 the first triple.
 * @param t2 the second triple.
 *
 * @return true if the triples are the same, false if not.
 */
function _compareTriples(t1, t2) {
  for(const k in t1) {
    if(t1[k].termType !== t2[k].termType || t1[k].value !== t2[k].value) {
      return false;
    }
  }
  if(t1.object.termType !== 'Literal') {
    return true;
  }
  return (
    (t1.object.datatype.termType === t2.object.datatype.termType) &&
    (t1.object.datatype.value === t2.object.datatype.value) &&
    (t1.object.language === t2.object.language)
  );
}

const _escapeRegex = /["\\\n\r]/g;
/**
 * Escape string to N-Quads literal
 */
function _escape(s) {
  return s.replace(_escapeRegex, function(match) {
    switch(match) {
      case '"': return '\\"';
      case '\\': return '\\\\';
      case '\n': return '\\n';
      case '\r': return '\\r';
    }
  });
}

const _unescapeRegex =
  /(?:\\([tbnrf"'\\]))|(?:\\u([0-9A-Fa-f]{4}))|(?:\\U([0-9A-Fa-f]{8}))/g;
/**
 * Unescape N-Quads literal to string
 */
function _unescape(s) {
  return s.replace(_unescapeRegex, function(match, code, u, U) {
    if(code) {
      switch(code) {
        case 't': return '\t';
        case 'b': return '\b';
        case 'n': return '\n';
        case 'r': return '\r';
        case 'f': return '\f';
        case '"': return '"';
        case '\'': return '\'';
        case '\\': return '\\';
      }
    }
    if(u) {
      return String.fromCharCode(parseInt(u, 16));
    }
    if(U) {
      // FIXME: support larger values
      throw new Error('Unsupported U escape');
    }
  });
}

},{}],36:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// TODO: convert to ES6 iterable

module.exports = class Permutator {
  /**
   * A Permutator iterates over all possible permutations of the given array
   * of elements.
   *
   * @param list the array of elements to iterate over.
   */
  constructor(list) {
    // original array
    this.list = list.sort();
    // indicates whether there are more permutations
    this.done = false;
    // directional info for permutation algorithm
    this.left = {};
    for(let i = 0; i < list.length; ++i) {
      this.left[list[i]] = true;
    }
  }

  /**
   * Returns true if there is another permutation.
   *
   * @return true if there is another permutation, false if not.
   */
  hasNext() {
    return !this.done;
  }

  /**
   * Gets the next permutation. Call hasNext() to ensure there is another one
   * first.
   *
   * @return the next permutation.
   */
  next() {
    // copy current permutation
    const rval = this.list.slice();

    /* Calculate the next permutation using the Steinhaus-Johnson-Trotter
     permutation algorithm. */

    // get largest mobile element k
    // (mobile: element is greater than the one it is looking at)
    let k = null;
    let pos = 0;
    const length = this.list.length;
    for(let i = 0; i < length; ++i) {
      const element = this.list[i];
      const left = this.left[element];
      if((k === null || element > k) &&
        ((left && i > 0 && element > this.list[i - 1]) ||
        (!left && i < (length - 1) && element > this.list[i + 1]))) {
        k = element;
        pos = i;
      }
    }

    // no more permutations
    if(k === null) {
      this.done = true;
    } else {
      // swap k and the element it is looking at
      const swap = this.left[k] ? pos - 1 : pos + 1;
      this.list[pos] = this.list[swap];
      this.list[swap] = k;

      // reverse the direction of all elements larger than k
      for(let i = 0; i < length; ++i) {
        if(this.list[i] > k) {
          this.left[this.list[i]] = !this.left[this.list[i]];
        }
      }
    }

    return rval;
  }
};


},{}],37:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const AsyncAlgorithm = require('./AsyncAlgorithm');
const IdentifierIssuer = require('./IdentifierIssuer');
const MessageDigest = require('./MessageDigest');
const Permutator = require('./Permutator');
const NQuads = require('./NQuads');
const util = require('./util');

const POSITIONS = {subject: 's', object: 'o', graph: 'g'};

module.exports = class URDNA2015 extends AsyncAlgorithm {
  constructor(options) {
    options = options || {};
    super(options);
    this.name = 'URDNA2015';
    this.options = Object.assign({}, options);
    this.blankNodeInfo = {};
    this.hashToBlankNodes = {};
    this.canonicalIssuer = new IdentifierIssuer('_:c14n');
    this.hashAlgorithm = 'sha256';
    this.quads;
  }

  // 4.4) Normalization Algorithm
  main(dataset, callback) {
    const self = this;
    self.schedule.start = Date.now();
    let result;
    self.quads = dataset;

    // 1) Create the normalization state.

    // Note: Optimize by generating non-normalized blank node map concurrently.
    const nonNormalized = {};

    self.waterfall([
      callback => {
        // 2) For every quad in input dataset:
        self.forEach(dataset, (quad, idx, callback) => {
          // 2.1) For each blank node that occurs in the quad, add a reference
          // to the quad using the blank node identifier in the blank node to
          // quads map, creating a new entry if necessary.
          self.forEachComponent(quad, component => {
            if(component.termType !== 'BlankNode') {
              return;
            }
            const id = component.value;
            if(id in self.blankNodeInfo) {
              self.blankNodeInfo[id].quads.push(quad);
            } else {
              nonNormalized[id] = true;
              self.blankNodeInfo[id] = {quads: [quad]};
            }
          });

          callback();
        }, callback);
      },
      callback => {
        // 3) Create a list of non-normalized blank node identifiers
        // non-normalized identifiers and populate it using the keys from the
        // blank node to quads map.
        // Note: We use a map here and it was generated during step 2.

        // 4) Initialize simple, a boolean flag, to true.
        let simple = true;

        // 5) While simple is true, issue canonical identifiers for blank nodes:
        self.whilst(() => simple, callback => {
          // 5.1) Set simple to false.
          simple = false;

          // 5.2) Clear hash to blank nodes map.
          self.hashToBlankNodes = {};

          self.waterfall([
            callback => {
              // 5.3) For each blank node identifier identifier in
              // non-normalized identifiers:
              self.forEach(nonNormalized, (value, id, callback) => {
                // 5.3.1) Create a hash, hash, according to the Hash First
                // Degree Quads algorithm.
                self.hashFirstDegreeQuads(id, (err, hash) => {
                  if(err) {
                    return callback(err);
                  }
                  // 5.3.2) Add hash and identifier to hash to blank nodes map,
                  // creating a new entry if necessary.
                  if(hash in self.hashToBlankNodes) {
                    self.hashToBlankNodes[hash].push(id);
                  } else {
                    self.hashToBlankNodes[hash] = [id];
                  }
                  callback();
                });
              }, callback);
            },
            callback => {
              // 5.4) For each hash to identifier list mapping in hash to blank
              // nodes map, lexicographically-sorted by hash:
              const hashes = Object.keys(self.hashToBlankNodes).sort();
              self.forEach(hashes, (hash, i, callback) => {
                // 5.4.1) If the length of identifier list is greater than 1,
                // continue to the next mapping.
                const idList = self.hashToBlankNodes[hash];
                if(idList.length > 1) {
                  return callback();
                }

                // 5.4.2) Use the Issue Identifier algorithm, passing canonical
                // issuer and the single blank node identifier in identifier
                // list, identifier, to issue a canonical replacement identifier
                // for identifier.
                // TODO: consider changing `getId` to `issue`
                const id = idList[0];
                self.canonicalIssuer.getId(id);

                // 5.4.3) Remove identifier from non-normalized identifiers.
                delete nonNormalized[id];

                // 5.4.4) Remove hash from the hash to blank nodes map.
                delete self.hashToBlankNodes[hash];

                // 5.4.5) Set simple to true.
                simple = true;
                callback();
              }, callback);
            }
          ], callback);
        }, callback);
      },
      callback => {
        // 6) For each hash to identifier list mapping in hash to blank nodes
        // map, lexicographically-sorted by hash:
        const hashes = Object.keys(self.hashToBlankNodes).sort();
        self.forEach(hashes, (hash, idx, callback) => {
          // 6.1) Create hash path list where each item will be a result of
          // running the Hash N-Degree Quads algorithm.
          const hashPathList = [];

          // 6.2) For each blank node identifier identifier in identifier list:
          const idList = self.hashToBlankNodes[hash];
          self.waterfall([
            callback => {
              self.forEach(idList, (id, idx, callback) => {
                // 6.2.1) If a canonical identifier has already been issued for
                // identifier, continue to the next identifier.
                if(self.canonicalIssuer.hasId(id)) {
                  return callback();
                }

                // 6.2.2) Create temporary issuer, an identifier issuer
                // initialized with the prefix _:b.
                const issuer = new IdentifierIssuer('_:b');

                // 6.2.3) Use the Issue Identifier algorithm, passing temporary
                // issuer and identifier, to issue a new temporary blank node
                // identifier for identifier.
                issuer.getId(id);

                // 6.2.4) Run the Hash N-Degree Quads algorithm, passing
                // temporary issuer, and append the result to the hash path
                // list.
                self.hashNDegreeQuads(id, issuer, (err, result) => {
                  if(err) {
                    return callback(err);
                  }
                  hashPathList.push(result);
                  callback();
                });
              }, callback);
            },
            callback => {
              // 6.3) For each result in the hash path list,
              // lexicographically-sorted by the hash in result:
              // TODO: use `String.localeCompare`?
              hashPathList.sort((a, b) =>
                (a.hash < b.hash) ? -1 : ((a.hash > b.hash) ? 1 : 0));
              self.forEach(hashPathList, (result, idx, callback) => {
                // 6.3.1) For each blank node identifier, existing identifier,
                // that was issued a temporary identifier by identifier issuer
                // in result, issue a canonical identifier, in the same order,
                // using the Issue Identifier algorithm, passing canonical
                // issuer and existing identifier.
                for(const existing in result.issuer.existing) {
                  self.canonicalIssuer.getId(existing);
                }
                callback();
              }, callback);
            }
          ], callback);
        }, callback);
      }, callback => {
        /* Note: At this point all blank nodes in the set of RDF quads have been
        assigned canonical identifiers, which have been stored in the canonical
        issuer. Here each quad is updated by assigning each of its blank nodes
        its new identifier. */

        // 7) For each quad, quad, in input dataset:
        const normalized = [];
        self.waterfall([
          callback => {
            self.forEach(self.quads, (quad, idx, callback) => {
              // 7.1) Create a copy, quad copy, of quad and replace any existing
              // blank node identifiers using the canonical identifiers
              // previously issued by canonical issuer.
              // Note: We optimize away the copy here.
              self.forEachComponent(quad, component => {
                if(component.termType === 'BlankNode' &&
                  !component.value.startsWith(self.canonicalIssuer.prefix)) {
                  component.value = self.canonicalIssuer.getId(component.value);
                }
              });
              // 7.2) Add quad copy to the normalized dataset.
              normalized.push(NQuads.serializeQuad(quad));
              callback();
            }, callback);
          },
          callback => {
            // sort normalized output
            normalized.sort();

            // 8) Return the normalized dataset.
            result = normalized.join('');
            return callback();
          }
        ], callback);
      }
    ], err => callback(err, result));
  }

  // 4.6) Hash First Degree Quads
  hashFirstDegreeQuads(id, callback) {
    const self = this;

    // return cached hash
    const info = self.blankNodeInfo[id];
    if('hash' in info) {
      return callback(null, info.hash);
    }

    // 1) Initialize nquads to an empty list. It will be used to store quads in
    // N-Quads format.
    const nquads = [];

    // 2) Get the list of quads quads associated with the reference blank node
    // identifier in the blank node to quads map.
    const quads = info.quads;

    // 3) For each quad quad in quads:
    self.forEach(quads, (quad, idx, callback) => {
      // 3.1) Serialize the quad in N-Quads format with the following special
      // rule:

      // 3.1.1) If any component in quad is an blank node, then serialize it
      // using a special identifier as follows:
      const copy = {predicate: quad.predicate};
      self.forEachComponent(quad, (component, key) => {
        // 3.1.2) If the blank node's existing blank node identifier matches the
        // reference blank node identifier then use the blank node identifier
        // _:a, otherwise, use the blank node identifier _:z.
        copy[key] = self.modifyFirstDegreeComponent(id, component, key);
      });
      nquads.push(NQuads.serializeQuad(copy));
      callback();
    }, err => {
      if(err) {
        return callback(err);
      }
      // 4) Sort nquads in lexicographical order.
      nquads.sort();

      // 5) Return the hash that results from passing the sorted, joined nquads
      // through the hash algorithm.
      const md = new MessageDigest(self.hashAlgorithm);
      for(let i = 0; i < nquads.length; ++i) {
        md.update(nquads[i]);
      }
      // TODO: represent as byte buffer instead to cut memory usage in half
      info.hash = md.digest();
      callback(null, info.hash);
    });
  }

  // 4.7) Hash Related Blank Node
  hashRelatedBlankNode(related, quad, issuer, position, callback) {
    const self = this;

    // 1) Set the identifier to use for related, preferring first the canonical
    // identifier for related if issued, second the identifier issued by issuer
    // if issued, and last, if necessary, the result of the Hash First Degree
    // Quads algorithm, passing related.
    let id;
    self.waterfall([
      callback => {
        if(self.canonicalIssuer.hasId(related)) {
          id = self.canonicalIssuer.getId(related);
          return callback();
        }
        if(issuer.hasId(related)) {
          id = issuer.getId(related);
          return callback();
        }
        self.hashFirstDegreeQuads(related, (err, hash) => {
          if(err) {
            return callback(err);
          }
          id = hash;
          callback();
        });
      }
    ], err => {
      if(err) {
        return callback(err);
      }

      // 2) Initialize a string input to the value of position.
      // Note: We use a hash object instead.
      const md = new MessageDigest(self.hashAlgorithm);
      md.update(position);

      // 3) If position is not g, append <, the value of the predicate in quad,
      // and > to input.
      if(position !== 'g') {
        md.update(self.getRelatedPredicate(quad));
      }

      // 4) Append identifier to input.
      md.update(id);

      // 5) Return the hash that results from passing input through the hash
      // algorithm.
      // TODO: represent as byte buffer instead to cut memory usage in half
      return callback(null, md.digest());
    });
  }

  // 4.8) Hash N-Degree Quads
  hashNDegreeQuads(id, issuer, callback) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    // Note: 2) and 3) handled within `createHashToRelated`
    let hashToRelated;
    const md = new MessageDigest(self.hashAlgorithm);
    self.waterfall([
      callback => self.createHashToRelated(id, issuer, (err, result) => {
        if(err) {
          return callback(err);
        }
        hashToRelated = result;
        callback();
      }),
      callback => {
        // 4) Create an empty string, data to hash.
        // Note: We created a hash object `md` above instead.

        // 5) For each related hash to blank node list mapping in hash to
        // related blank nodes map, sorted lexicographically by related hash:
        const hashes = Object.keys(hashToRelated).sort();
        self.forEach(hashes, (hash, idx, callback) => {
          // 5.1) Append the related hash to the data to hash.
          md.update(hash);

          // 5.2) Create a string chosen path.
          let chosenPath = '';

          // 5.3) Create an unset chosen issuer variable.
          let chosenIssuer;

          // 5.4) For each permutation of blank node list:
          const permutator = new Permutator(hashToRelated[hash]);
          self.whilst(() => permutator.hasNext(), nextPermutation => {
            const permutation = permutator.next();

            // 5.4.1) Create a copy of issuer, issuer copy.
            let issuerCopy = issuer.clone();

            // 5.4.2) Create a string path.
            let path = '';

            // 5.4.3) Create a recursion list, to store blank node identifiers
            // that must be recursively processed by this algorithm.
            const recursionList = [];

            self.waterfall([
              callback => {
                // 5.4.4) For each related in permutation:
                self.forEach(permutation, (related, idx, callback) => {
                  // 5.4.4.1) If a canonical identifier has been issued for
                  // related, append it to path.
                  if(self.canonicalIssuer.hasId(related)) {
                    path += self.canonicalIssuer.getId(related);
                  } else {
                    // 5.4.4.2) Otherwise:
                    // 5.4.4.2.1) If issuer copy has not issued an identifier
                    // for related, append related to recursion list.
                    if(!issuerCopy.hasId(related)) {
                      recursionList.push(related);
                    }
                    // 5.4.4.2.2) Use the Issue Identifier algorithm, passing
                    // issuer copy and related and append the result to path.
                    path += issuerCopy.getId(related);
                  }

                  // 5.4.4.3) If chosen path is not empty and the length of path
                  // is greater than or equal to the length of chosen path and
                  // path is lexicographically greater than chosen path, then
                  // skip to the next permutation.
                  if(chosenPath.length !== 0 &&
                    path.length >= chosenPath.length && path > chosenPath) {
                    // FIXME: may cause inaccurate total depth calculation
                    return nextPermutation();
                  }
                  callback();
                }, callback);
              },
              callback => {
                // 5.4.5) For each related in recursion list:
                self.forEach(recursionList, (related, idx, callback) => {
                  // 5.4.5.1) Set result to the result of recursively executing
                  // the Hash N-Degree Quads algorithm, passing related for
                  // identifier and issuer copy for path identifier issuer.
                  self.hashNDegreeQuads(related, issuerCopy, (err, result) => {
                    if(err) {
                      return callback(err);
                    }

                    // 5.4.5.2) Use the Issue Identifier algorithm, passing
                    // issuer copy and related and append the result to path.
                    path += issuerCopy.getId(related);

                    // 5.4.5.3) Append <, the hash in result, and > to path.
                    path += '<' + result.hash + '>';

                    // 5.4.5.4) Set issuer copy to the identifier issuer in
                    // result.
                    issuerCopy = result.issuer;

                    // 5.4.5.5) If chosen path is not empty and the length of
                    // path is greater than or equal to the length of chosen
                    // path and path is lexicographically greater than chosen
                    // path, then skip to the next permutation.
                    if(chosenPath.length !== 0 &&
                      path.length >= chosenPath.length && path > chosenPath) {
                      // FIXME: may cause inaccurate total depth calculation
                      return nextPermutation();
                    }
                    callback();
                  });
                }, callback);
              },
              callback => {
                // 5.4.6) If chosen path is empty or path is lexicographically
                // less than chosen path, set chosen path to path and chosen
                // issuer to issuer copy.
                if(chosenPath.length === 0 || path < chosenPath) {
                  chosenPath = path;
                  chosenIssuer = issuerCopy;
                }
                callback();
              }
            ], nextPermutation);
          }, err => {
            if(err) {
              return callback(err);
            }

            // 5.5) Append chosen path to data to hash.
            md.update(chosenPath);

            // 5.6) Replace issuer, by reference, with chosen issuer.
            issuer = chosenIssuer;
            callback();
          });
        }, callback);
      }
    ], err => {
      // 6) Return issuer and the hash that results from passing data to hash
      // through the hash algorithm.
      callback(err, {hash: md.digest(), issuer});
    });
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    component = util.clone(component);
    component.value = (component.value === id ? '_:a' : '_:z');
    return component;
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return '<' + quad.predicate.value + '>';
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer, callback) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = {};

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = self.blankNodeInfo[id].quads;

    // 3) For each quad in quads:
    self.forEach(quads, (quad, idx, callback) => {
      // 3.1) For each component in quad, if component is the subject, object,
      // and graph name and it is a blank node that is not identified by
      // identifier:
      self.forEach(quad, (component, key, callback) => {
        if(key === 'predicate' ||
          !(component.termType === 'BlankNode' && component.value !== id)) {
          return callback();
        }
        // 3.1.1) Set hash to the result of the Hash Related Blank Node
        // algorithm, passing the blank node identifier for component as
        // related, quad, path identifier issuer as issuer, and position as
        // either s, o, or g based on whether component is a subject, object,
        // graph name, respectively.
        const related = component.value;
        const position = POSITIONS[key];
        self.hashRelatedBlankNode(
          related, quad, issuer, position, (err, hash) => {
          if(err) {
            return callback(err);
          }
          // 3.1.2) Add a mapping of hash to the blank node identifier for
          // component to hash to related blank nodes map, adding an entry as
          // necessary.
          if(hash in hashToRelated) {
            hashToRelated[hash].push(related);
          } else {
            hashToRelated[hash] = [related];
          }
          callback();
        });
      }, callback);
    }, err => callback(err, hashToRelated));
  }

  // helper that iterates over quad components (skips predicate)
  forEachComponent(quad, op) {
    for(const key in quad) {
      // skip `predicate`
      if(key === 'predicate') {
        continue;
      }
      op(quad[key], key, quad);
    }
  }
};

},{"./AsyncAlgorithm":32,"./IdentifierIssuer":33,"./MessageDigest":34,"./NQuads":35,"./Permutator":36,"./util":42}],38:[function(require,module,exports){
/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const IdentifierIssuer = require('./IdentifierIssuer');
const MessageDigest = require('./MessageDigest');
const Permutator = require('./Permutator');
const NQuads = require('./NQuads');
const util = require('./util');

const POSITIONS = {subject: 's', object: 'o', graph: 'g'};

module.exports = class URDNA2015Sync {
  constructor() {
    this.name = 'URDNA2015';
    this.blankNodeInfo = {};
    this.hashToBlankNodes = {};
    this.canonicalIssuer = new IdentifierIssuer('_:c14n');
    this.hashAlgorithm = 'sha256';
    this.quads;
  }

  // 4.4) Normalization Algorithm
  main(dataset) {
    const self = this;
    self.quads = dataset;

    // 1) Create the normalization state.

    // Note: Optimize by generating non-normalized blank node map concurrently.
    const nonNormalized = {};

    // 2) For every quad in input dataset:
    for(const quad of dataset) {
      // 2.1) For each blank node that occurs in the quad, add a reference
      // to the quad using the blank node identifier in the blank node to
      // quads map, creating a new entry if necessary.
      self.forEachComponent(quad, component => {
        if(component.termType !== 'BlankNode') {
          return;
        }
        const id = component.value;
        if(id in self.blankNodeInfo) {
          self.blankNodeInfo[id].quads.push(quad);
        } else {
          nonNormalized[id] = true;
          self.blankNodeInfo[id] = {quads: [quad]};
        }
      });
    }

    // 3) Create a list of non-normalized blank node identifiers
    // non-normalized identifiers and populate it using the keys from the
    // blank node to quads map.
    // Note: We use a map here and it was generated during step 2.

    // 4) Initialize simple, a boolean flag, to true.
    let simple = true;

    // 5) While simple is true, issue canonical identifiers for blank nodes:
    while(simple) {
      // 5.1) Set simple to false.
      simple = false;

      // 5.2) Clear hash to blank nodes map.
      self.hashToBlankNodes = {};

      // 5.3) For each blank node identifier identifier in non-normalized
      // identifiers:
      for(const id in nonNormalized) {
        // 5.3.1) Create a hash, hash, according to the Hash First Degree
        // Quads algorithm.
        const hash = self.hashFirstDegreeQuads(id);

        // 5.3.2) Add hash and identifier to hash to blank nodes map,
        // creating a new entry if necessary.
        if(hash in self.hashToBlankNodes) {
          self.hashToBlankNodes[hash].push(id);
        } else {
          self.hashToBlankNodes[hash] = [id];
        }
      }

      // 5.4) For each hash to identifier list mapping in hash to blank
      // nodes map, lexicographically-sorted by hash:
      const hashes = Object.keys(self.hashToBlankNodes).sort();
      for(let i = 0; i < hashes.length; ++i) {
        // 5.4.1) If the length of identifier list is greater than 1,
        // continue to the next mapping.
        const hash = hashes[i];
        const idList = self.hashToBlankNodes[hash];
        if(idList.length > 1) {
          continue;
        }

        // 5.4.2) Use the Issue Identifier algorithm, passing canonical
        // issuer and the single blank node identifier in identifier
        // list, identifier, to issue a canonical replacement identifier
        // for identifier.
        // TODO: consider changing `getId` to `issue`
        const id = idList[0];
        self.canonicalIssuer.getId(id);

        // 5.4.3) Remove identifier from non-normalized identifiers.
        delete nonNormalized[id];

        // 5.4.4) Remove hash from the hash to blank nodes map.
        delete self.hashToBlankNodes[hash];

        // 5.4.5) Set simple to true.
        simple = true;
      }
    }

    // 6) For each hash to identifier list mapping in hash to blank nodes map,
    // lexicographically-sorted by hash:
    const hashes = Object.keys(self.hashToBlankNodes).sort();
    for(let i = 0; i < hashes.length; ++i) {
      // 6.1) Create hash path list where each item will be a result of
      // running the Hash N-Degree Quads algorithm.
      const hashPathList = [];

      // 6.2) For each blank node identifier identifier in identifier list:
      const hash = hashes[i];
      const idList = self.hashToBlankNodes[hash];
      for(let j = 0; j < idList.length; ++j) {
        // 6.2.1) If a canonical identifier has already been issued for
        // identifier, continue to the next identifier.
        const id = idList[j];
        if(self.canonicalIssuer.hasId(id)) {
          continue;
        }

        // 6.2.2) Create temporary issuer, an identifier issuer
        // initialized with the prefix _:b.
        const issuer = new IdentifierIssuer('_:b');

        // 6.2.3) Use the Issue Identifier algorithm, passing temporary
        // issuer and identifier, to issue a new temporary blank node
        // identifier for identifier.
        issuer.getId(id);

        // 6.2.4) Run the Hash N-Degree Quads algorithm, passing
        // temporary issuer, and append the result to the hash path list.
        const result = self.hashNDegreeQuads(id, issuer);
        hashPathList.push(result);
      }

      // 6.3) For each result in the hash path list,
      // lexicographically-sorted by the hash in result:
      // TODO: use `String.localeCompare`?
      hashPathList.sort((a, b) =>
        (a.hash < b.hash) ? -1 : ((a.hash > b.hash) ? 1 : 0));
      for(let j = 0; j < hashPathList.length; ++j) {
        // 6.3.1) For each blank node identifier, existing identifier,
        // that was issued a temporary identifier by identifier issuer
        // in result, issue a canonical identifier, in the same order,
        // using the Issue Identifier algorithm, passing canonical
        // issuer and existing identifier.
        const result = hashPathList[j];
        for(const existing in result.issuer.existing) {
          self.canonicalIssuer.getId(existing);
        }
      }
    }

    /* Note: At this point all blank nodes in the set of RDF quads have been
    assigned canonical identifiers, which have been stored in the canonical
    issuer. Here each quad is updated by assigning each of its blank nodes
    its new identifier. */

    // 7) For each quad, quad, in input dataset:
    const normalized = [];
    for(let i = 0; i < self.quads.length; ++i) {
      // 7.1) Create a copy, quad copy, of quad and replace any existing
      // blank node identifiers using the canonical identifiers
      // previously issued by canonical issuer.
      // Note: We optimize away the copy here.
      const quad = self.quads[i];
      self.forEachComponent(quad, component => {
        if(component.termType === 'BlankNode' &&
          !component.value.startsWith(self.canonicalIssuer.prefix)) {
          component.value = self.canonicalIssuer.getId(component.value);
        }
      });
      // 7.2) Add quad copy to the normalized dataset.
      normalized.push(NQuads.serializeQuad(quad));
    }

    // sort normalized output
    normalized.sort();

    // 8) Return the normalized dataset.
    return normalized.join('');
  }

  // 4.6) Hash First Degree Quads
  hashFirstDegreeQuads(id) {
    const self = this;

    // return cached hash
    const info = self.blankNodeInfo[id];
    if('hash' in info) {
      return info.hash;
    }

    // 1) Initialize nquads to an empty list. It will be used to store quads in
    // N-Quads format.
    const nquads = [];

    // 2) Get the list of quads `quads` associated with the reference blank node
    // identifier in the blank node to quads map.
    const quads = info.quads;

    // 3) For each quad `quad` in `quads`:
    for(let i = 0; i < quads.length; ++i) {
      const quad = quads[i];

      // 3.1) Serialize the quad in N-Quads format with the following special
      // rule:

      // 3.1.1) If any component in quad is an blank node, then serialize it
      // using a special identifier as follows:
      const copy = {predicate: quad.predicate};
      self.forEachComponent(quad, (component, key) => {
        // 3.1.2) If the blank node's existing blank node identifier matches
        // the reference blank node identifier then use the blank node
        // identifier _:a, otherwise, use the blank node identifier _:z.
        copy[key] = self.modifyFirstDegreeComponent(id, component, key);
      });
      nquads.push(NQuads.serializeQuad(copy));
    }

    // 4) Sort nquads in lexicographical order.
    nquads.sort();

    // 5) Return the hash that results from passing the sorted, joined nquads
    // through the hash algorithm.
    const md = new MessageDigest(self.hashAlgorithm);
    for(let i = 0; i < nquads.length; ++i) {
      md.update(nquads[i]);
    }
    // TODO: represent as byte buffer instead to cut memory usage in half
    info.hash = md.digest();
    return info.hash;
  }

  // 4.7) Hash Related Blank Node
  hashRelatedBlankNode(related, quad, issuer, position) {
    const self = this;

    // 1) Set the identifier to use for related, preferring first the canonical
    // identifier for related if issued, second the identifier issued by issuer
    // if issued, and last, if necessary, the result of the Hash First Degree
    // Quads algorithm, passing related.
    let id;
    if(self.canonicalIssuer.hasId(related)) {
      id = self.canonicalIssuer.getId(related);
    } else if(issuer.hasId(related)) {
      id = issuer.getId(related);
    } else {
      id = self.hashFirstDegreeQuads(related);
    }

    // 2) Initialize a string input to the value of position.
    // Note: We use a hash object instead.
    const md = new MessageDigest(self.hashAlgorithm);
    md.update(position);

    // 3) If position is not g, append <, the value of the predicate in quad,
    // and > to input.
    if(position !== 'g') {
      md.update(self.getRelatedPredicate(quad));
    }

    // 4) Append identifier to input.
    md.update(id);

    // 5) Return the hash that results from passing input through the hash
    // algorithm.
    // TODO: represent as byte buffer instead to cut memory usage in half
    return md.digest();
  }

  // 4.8) Hash N-Degree Quads
  hashNDegreeQuads(id, issuer) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    // Note: 2) and 3) handled within `createHashToRelated`
    const md = new MessageDigest(self.hashAlgorithm);
    const hashToRelated = self.createHashToRelated(id, issuer);

    // 4) Create an empty string, data to hash.
    // Note: We created a hash object `md` above instead.

    // 5) For each related hash to blank node list mapping in hash to related
    // blank nodes map, sorted lexicographically by related hash:
    const hashes = Object.keys(hashToRelated).sort();
    for(let i = 0; i < hashes.length; ++i) {
      // 5.1) Append the related hash to the data to hash.
      const hash = hashes[i];
      md.update(hash);

      // 5.2) Create a string chosen path.
      let chosenPath = '';

      // 5.3) Create an unset chosen issuer variable.
      let chosenIssuer;

      // 5.4) For each permutation of blank node list:
      const permutator = new Permutator(hashToRelated[hash]);
      while(permutator.hasNext()) {
        const permutation = permutator.next();

        // 5.4.1) Create a copy of issuer, issuer copy.
        let issuerCopy = issuer.clone();

        // 5.4.2) Create a string path.
        let path = '';

        // 5.4.3) Create a recursion list, to store blank node identifiers
        // that must be recursively processed by this algorithm.
        const recursionList = [];

        // 5.4.4) For each related in permutation:
        let nextPermutation = false;
        for(let j = 0; j < permutation.length; ++j) {
          // 5.4.4.1) If a canonical identifier has been issued for
          // related, append it to path.
          const related = permutation[j];
          if(self.canonicalIssuer.hasId(related)) {
            path += self.canonicalIssuer.getId(related);
          } else {
            // 5.4.4.2) Otherwise:
            // 5.4.4.2.1) If issuer copy has not issued an identifier for
            // related, append related to recursion list.
            if(!issuerCopy.hasId(related)) {
              recursionList.push(related);
            }
            // 5.4.4.2.2) Use the Issue Identifier algorithm, passing
            // issuer copy and related and append the result to path.
            path += issuerCopy.getId(related);
          }

          // 5.4.4.3) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          if(chosenPath.length !== 0 &&
            path.length >= chosenPath.length && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.5) For each related in recursion list:
        for(let j = 0; j < recursionList.length; ++j) {
          // 5.4.5.1) Set result to the result of recursively executing
          // the Hash N-Degree Quads algorithm, passing related for
          // identifier and issuer copy for path identifier issuer.
          const related = recursionList[j];
          const result = self.hashNDegreeQuads(related, issuerCopy);

          // 5.4.5.2) Use the Issue Identifier algorithm, passing issuer
          // copy and related and append the result to path.
          path += issuerCopy.getId(related);

          // 5.4.5.3) Append <, the hash in result, and > to path.
          path += '<' + result.hash + '>';

          // 5.4.5.4) Set issuer copy to the identifier issuer in
          // result.
          issuerCopy = result.issuer;

          // 5.4.5.5) If chosen path is not empty and the length of path
          // is greater than or equal to the length of chosen path and
          // path is lexicographically greater than chosen path, then
          // skip to the next permutation.
          if(chosenPath.length !== 0 &&
            path.length >= chosenPath.length && path > chosenPath) {
            nextPermutation = true;
            break;
          }
        }

        if(nextPermutation) {
          continue;
        }

        // 5.4.6) If chosen path is empty or path is lexicographically
        // less than chosen path, set chosen path to path and chosen
        // issuer to issuer copy.
        if(chosenPath.length === 0 || path < chosenPath) {
          chosenPath = path;
          chosenIssuer = issuerCopy;
        }
      }

      // 5.5) Append chosen path to data to hash.
      md.update(chosenPath);

      // 5.6) Replace issuer, by reference, with chosen issuer.
      issuer = chosenIssuer;
    }

    // 6) Return issuer and the hash that results from passing data to hash
    // through the hash algorithm.
    return {hash: md.digest(), issuer};
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    component = util.clone(component);
    component.value = (component.value === id ? '_:a' : '_:z');
    return component;
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return '<' + quad.predicate.value + '>';
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = {};

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = self.blankNodeInfo[id].quads;

    // 3) For each quad in quads:
    for(let i = 0; i < quads.length; ++i) {
      // 3.1) For each component in quad, if component is the subject, object,
      // and graph name and it is a blank node that is not identified by
      // identifier:
      const quad = quads[i];
      for(const key in quad) {
        const component = quad[key];
        if(key === 'predicate' ||
          !(component.termType === 'BlankNode' && component.value !== id)) {
          continue;
        }
        // 3.1.1) Set hash to the result of the Hash Related Blank Node
        // algorithm, passing the blank node identifier for component as
        // related, quad, path identifier issuer as issuer, and position as
        // either s, o, or g based on whether component is a subject, object,
        // graph name, respectively.
        const related = component.value;
        const position = POSITIONS[key];
        const hash = self.hashRelatedBlankNode(related, quad, issuer, position);

        // 3.1.2) Add a mapping of hash to the blank node identifier for
        // component to hash to related blank nodes map, adding an entry as
        // necessary.
        if(hash in hashToRelated) {
          hashToRelated[hash].push(related);
        } else {
          hashToRelated[hash] = [related];
        }
      }
    }

    return hashToRelated;
  }

  // helper that iterates over quad components (skips predicate)
  forEachComponent(quad, op) {
    for(const key in quad) {
      // skip `predicate`
      if(key === 'predicate') {
        continue;
      }
      op(quad[key], key, quad);
    }
  }
};

},{"./IdentifierIssuer":33,"./MessageDigest":34,"./NQuads":35,"./Permutator":36,"./util":42}],39:[function(require,module,exports){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const URDNA2015 = require('./URDNA2015');
const util = require('./util');

module.exports = class URDNA2012 extends URDNA2015 {
  constructor(options) {
    super(options);
    this.name = 'URGNA2012';
    this.hashAlgorithm = 'sha1';
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component, key) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    component = util.clone(component);
    if(key === 'name') {
      component.value = '_:g';
    } else {
      component.value = (component.value === id ? '_:a' : '_:z');
    }
    return component;
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return quad.predicate.value;
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer, callback) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = {};

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = self.blankNodeInfo[id].quads;

    // 3) For each quad in quads:
    self.forEach(quads, (quad, idx, callback) => {
      // 3.1) If the quad's subject is a blank node that does not match
      // identifier, set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for subject as related,
      // quad, path identifier issuer as issuer, and p as position.
      let position;
      let related;
      if(quad.subject.termType === 'BlankNode' && quad.subject.value !== id) {
        related = quad.subject.value;
        position = 'p';
      } else if(
        quad.object.termType === 'BlankNode' && quad.object.value !== id) {
        // 3.2) Otherwise, if quad's object is a blank node that does not match
        // identifier, to the result of the Hash Related Blank Node algorithm,
        // passing the blank node identifier for object as related, quad, path
        // identifier issuer as issuer, and r as position.
        related = quad.object.value;
        position = 'r';
      } else {
        // 3.3) Otherwise, continue to the next quad.
        return callback();
      }
      // 3.4) Add a mapping of hash to the blank node identifier for the
      // component that matched (subject or object) to hash to related blank
      // nodes map, adding an entry as necessary.
      self.hashRelatedBlankNode(
        related, quad, issuer, position, (err, hash) => {
        if(err) {
          return callback(err);
        }
        if(hash in hashToRelated) {
          hashToRelated[hash].push(related);
        } else {
          hashToRelated[hash] = [related];
        }
        callback();
      });
    }, err => callback(err, hashToRelated));
  }
};

},{"./URDNA2015":37,"./util":42}],40:[function(require,module,exports){
/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const URDNA2015Sync = require('./URDNA2015Sync');
const util = require('./util');

module.exports = class URDNA2012Sync extends URDNA2015Sync {
  constructor() {
    super();
    this.name = 'URGNA2012';
    this.hashAlgorithm = 'sha1';
  }

  // helper for modifying component during Hash First Degree Quads
  modifyFirstDegreeComponent(id, component, key) {
    if(component.termType !== 'BlankNode') {
      return component;
    }
    component = util.clone(component);
    if(key === 'name') {
      component.value = '_:g';
    } else {
      component.value = (component.value === id ? '_:a' : '_:z');
    }
    return component;
  }

  // helper for getting a related predicate
  getRelatedPredicate(quad) {
    return quad.predicate.value;
  }

  // helper for creating hash to related blank nodes map
  createHashToRelated(id, issuer) {
    const self = this;

    // 1) Create a hash to related blank nodes map for storing hashes that
    // identify related blank nodes.
    const hashToRelated = {};

    // 2) Get a reference, quads, to the list of quads in the blank node to
    // quads map for the key identifier.
    const quads = self.blankNodeInfo[id].quads;

    // 3) For each quad in quads:
    for(let i = 0; i < quads.length; ++i) {
      // 3.1) If the quad's subject is a blank node that does not match
      // identifier, set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for subject as related,
      // quad, path identifier issuer as issuer, and p as position.
      const quad = quads[i];
      let position;
      let related;
      if(quad.subject.termType === 'BlankNode' && quad.subject.value !== id) {
        related = quad.subject.value;
        position = 'p';
      } else if(
        quad.object.termType === 'BlankNode' && quad.object.value !== id) {
        // 3.2) Otherwise, if quad's object is a blank node that does not match
        // identifier, to the result of the Hash Related Blank Node algorithm,
        // passing the blank node identifier for object as related, quad, path
        // identifier issuer as issuer, and r as position.
        related = quad.object.value;
        position = 'r';
      } else {
        // 3.3) Otherwise, continue to the next quad.
        continue;
      }
      // 3.4) Add a mapping of hash to the blank node identifier for the
      // component that matched (subject or object) to hash to related blank
      // nodes map, adding an entry as necessary.
      const hash = self.hashRelatedBlankNode(related, quad, issuer, position);
      if(hash in hashToRelated) {
        hashToRelated[hash].push(related);
      } else {
        hashToRelated[hash] = [related];
      }
    }

    return hashToRelated;
  }
};

},{"./URDNA2015Sync":38,"./util":42}],41:[function(require,module,exports){
/**
 * An implementation of the RDF Dataset Normalization specification.
 * This library works in the browser and node.js.
 *
 * BSD 3-Clause License
 * Copyright (c) 2016-2017 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

const util = require('./util');
const URDNA2015 = require('./URDNA2015');
const URGNA2012 = require('./URGNA2012');
const URDNA2015Sync = require('./URDNA2015Sync');
const URGNA2012Sync = require('./URGNA2012Sync');

// optional native support
let rdfCanonizeNative;
try {
  rdfCanonizeNative = require('rdf-canonize-native');
} catch(e) {}

const api = {};
module.exports = api;

// expose helpers
api.NQuads = require('./NQuads');
api.IdentifierIssuer = require('./IdentifierIssuer');

/**
 * Get or set native API.
 *
 * @param api the native API.
 *
 * @return the currently set native API.
 */
api._rdfCanonizeNative = function(api) {
  if(api) {
    rdfCanonizeNative = api;
  }
  return rdfCanonizeNative;
};

/**
 * Asynchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 * @param [callback(err, canonical)] called once the operation completes.
 *
 * @return a Promise that resolves to the canonicalized RDF Dataset.
 */
api.canonize = util.callbackify(async function(dataset, options) {
  let callback;
  const promise = new Promise((resolve, reject) => {
    callback = (err, canonical) => {
      if(err) {
        return reject(err);
      }

      /*if(options.format === 'application/n-quads') {
        canonical = canonical.join('');
      }
      canonical = _parseNQuads(canonical.join(''));*/

      resolve(canonical);
    };
  });

  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  // TODO: convert algorithms to Promise-based async
  if(options.useNative) {
    if(rdfCanonizeNative) {
      rdfCanonizeNative.canonize(dataset, options, callback);
    } else {
      throw new Error('rdf-canonize-native not available');
    }
  } else {
    if(options.algorithm === 'URDNA2015') {
      new URDNA2015(options).main(dataset, callback);
    } else if(options.algorithm === 'URGNA2012') {
      new URGNA2012(options).main(dataset, callback);
    } else if(!('algorithm' in options)) {
      throw new Error('No RDF Dataset Canonicalization algorithm specified.');
    } else {
      throw new Error(
        'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
    }
  }

  return promise;
});

/**
 * Synchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param options the options to use:
 *          algorithm the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012`.
 *          [useNative] use native implementation (default: false).
 *
 * @return the RDF dataset in canonical form.
 */
api.canonizeSync = function(dataset, options) {
  // back-compat with legacy dataset
  if(!Array.isArray(dataset)) {
    dataset = api.NQuads.legacyDatasetToQuads(dataset);
  }

  if(options.useNative) {
    if(rdfCanonizeNative) {
      return rdfCanonizeNative.canonizeSync(dataset, options);
    }
    throw new Error('rdf-canonize-native not available');
  }
  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015Sync(options).main(dataset);
  } else if(options.algorithm === 'URGNA2012') {
    return new URGNA2012Sync(options).main(dataset);
  }
  if(!('algorithm' in options)) {
    throw new Error('No RDF Dataset Canonicalization algorithm specified.');
  }
  throw new Error(
    'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
};

},{"./IdentifierIssuer":33,"./NQuads":35,"./URDNA2015":37,"./URDNA2015Sync":38,"./URGNA2012":39,"./URGNA2012Sync":40,"./util":42,"rdf-canonize-native":1}],42:[function(require,module,exports){
(function (process,setImmediate){
/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const api = {};
module.exports = api;

// define setImmediate and nextTick
//// nextTick implementation with browser-compatible fallback ////
// from https://github.com/caolan/async/blob/master/lib/async.js

// capture the global reference to guard against fakeTimer mocks
const _setImmediate = typeof setImmediate === 'function' && setImmediate;

const _delay = _setImmediate ?
  // not a direct alias (for IE10 compatibility)
  fn => _setImmediate(fn) :
  fn => setTimeout(fn, 0);

if(typeof process === 'object' && typeof process.nextTick === 'function') {
  api.nextTick = process.nextTick;
} else {
  api.nextTick = _delay;
}
api.setImmediate = _setImmediate ? _delay : api.nextTick;

/**
 * Clones an object, array, or string/number. If a typed JavaScript object
 * is given, such as a Date, it will be converted to a string.
 *
 * @param value the value to clone.
 *
 * @return the cloned value.
 */
api.clone = function(value) {
  if(value && typeof value === 'object') {
    let rval;
    if(Array.isArray(value)) {
      rval = [];
      for(let i = 0; i < value.length; ++i) {
        rval[i] = api.clone(value[i]);
      }
    } else if(api.isObject(value)) {
      rval = {};
      for(const key in value) {
        rval[key] = api.clone(value[key]);
      }
    } else {
      rval = value.toString();
    }
    return rval;
  }
  return value;
};

/**
 * Returns true if the given value is an Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Object, false if not.
 */
api.isObject = v => Object.prototype.toString.call(v) === '[object Object]';

/**
 * Returns true if the given value is undefined.
 *
 * @param v the value to check.
 *
 * @return true if the value is undefined, false if not.
 */
api.isUndefined = v => typeof v === 'undefined';

api.callbackify = fn => {
  return async function(...args) {
    const callback = args[args.length - 1];
    if(typeof callback === 'function') {
      args.pop();
    }

    let result;
    try {
      result = await fn.apply(null, args);
    } catch(e) {
      if(typeof callback === 'function') {
        return _invokeCallback(callback, e);
      }
      throw e;
    }

    if(typeof callback === 'function') {
      return _invokeCallback(callback, null, result);
    }

    return result;
  };
};

function _invokeCallback(callback, err, result) {
  try {
    return callback(err, result);
  } catch(unhandledError) {
    // throw unhandled errors to prevent "unhandled rejected promise"
    // and simulate what would have happened in a promiseless API
    process.nextTick(() => {
      throw unhandledError;
    });
  }
}

}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":31,"timers":43}],43:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":31,"timers":43}],44:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//the functions for a class Object
var util = require("./utilities");

var Class = function () {
    /**
     * A Class represents an rdfs:Class. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this Class, e.g. "schema:Book"
     * @param {object} graph - The underlying data graph to enable the methods of this Class
     */
    function Class(IRI, graph) {
        _classCallCheck(this, Class);

        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Class in compact/absolute form
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Book", if false -> return absolute IRI -> "http://schema.org/Book"
     * @returns {string} The IRI (@id) of this Class
     */


    _createClass(Class, [{
        key: "getIRI",
        value: function getIRI() {
            var compactForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (compactForm) {
                return this.IRI;
            } else {
                return util.toAbsoluteIRI(this.IRI, this.graph.context);
            }
        }

        /**
         * Retrieves the term type (@type) of this Class (is always "rdfs:Class")
         * @returns {string} The term type of this Class -> "rdfs:Class"
         */

    }, {
        key: "getTermType",
        value: function getTermType() {
            return "rdfs:Class";
        }

        /**
         * Retrieves the original vocabulary (schema:isPartOf) of this Class
         * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Class
         */

    }, {
        key: "getVocabulary",
        value: function getVocabulary() {
            var classObj = this.graph.classes[this.IRI];
            if (classObj["schema:isPartOf"] !== undefined) {
                return classObj["schema:isPartOf"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the source (dc:source) of this Class
         * @returns {string|null} The source IRI given by the "dc:source" of this Class (null if none)
         */

    }, {
        key: "getSource",
        value: function getSource() {
            var classObj = this.graph.classes[this.IRI];
            if (classObj["dc:source"] !== undefined) {
                return classObj["dc:source"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the class superseding (schema:supersededBy) this Class
         * @returns {string|null} The Class superseding this Class (null if none)
         */

    }, {
        key: "isSupersededBy",
        value: function isSupersededBy() {
            var classObj = this.graph.classes[this.IRI];
            if (util.isString(classObj["schema:supersededBy"])) {
                return classObj["schema:supersededBy"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the name (rdfs:label) of this Class in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the name
         * @returns {string|null} The name of this Class (null if not given for specified language)
         */

    }, {
        key: "getName",
        value: function getName() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var nameObj = this.graph.classes[this.IRI]["rdfs:label"];
            if (nameObj === null || nameObj[language] === undefined) {
                return null;
            }
            return nameObj[language];
        }

        /**
         * Retrieves the description (rdfs:comment) of this Class in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the description
         * @returns {string|null} The description of this Class (null if not given for specified language)
         */

    }, {
        key: "getDescription",
        value: function getDescription() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var descriptionObj = this.graph.classes[this.IRI]["rdfs:comment"];
            if (descriptionObj === null || descriptionObj[language] === undefined) {
                return null;
            }
            return descriptionObj[language];
        }

        /**
         * Retrieves the explicit/implicit properties (soa:hasProperty) of this Class
         * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
         * @param {object|null} filter - (default = null) an optional filter for the properties
         * @returns {array} The properties of this Class
         */

    }, {
        key: "getProperties",
        value: function getProperties() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var classObj = this.graph.classes[this.IRI];
            var result = [];
            result.push.apply(result, _toConsumableArray(classObj["soa:hasProperty"]));
            if (implicit === true) {
                //add properties from super-classes
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferPropertiesFromSuperClasses(classObj["rdfs:subClassOf"])));
                //add sub-properties ?
                // for (let p = 0; p < result.length; p++) {
                //     result.push(... this.graph.reasoner.inferSubProperties(result[p]));
                // }
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class
         * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
         * @param {object|null} filter - (default = null) an optional filter for the super-classes
         * @returns {array} The super-classes of this Class
         */

    }, {
        key: "getSuperClasses",
        value: function getSuperClasses() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var classObj = this.graph.classes[this.IRI];
            var result = [];

            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSuperClasses(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(classObj["rdfs:subClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class
         * @param {boolean} implicit - (default = true) retrieves also implicit sub-classes (recursive from sub-classes)
         * @param {object|null} filter - (default = null) an optional filter for the sub-classes
         * @returns {array} The sub-classes of this Class
         */

    }, {
        key: "getSubClasses",
        value: function getSubClasses() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var classObj = this.graph.classes[this.IRI];
            var result = [];
            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSubClasses(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(classObj["soa:superClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Generates a string representation of this Class (Based on its JSON representation)
         * @returns {string} The string representation of this Class
         */

    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJSON(false, null), null, 2);
        }

        /**
         * Generates an explicit/implicit JSON representation of this Class.
         * @param {boolean} implicit - (default = true) includes also implicit data (e.g. sub-Classes, super-Classes, properties, etc.)
         * @param {object|null} filter - (default = null) an optional filter for the generated data
         * @returns {object} The JSON representation of this Class
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            // (implicit === true) ->
            // properties of all parent classes
            // sub-properties of all properties ??
            // sub-classes and their subclasses
            // super-classes and their superclasses
            var result = {};
            result["id"] = this.getIRI(true);
            result["IRI"] = this.getIRI();
            result["type"] = this.getTermType();
            result["vocabulary"] = this.getVocabulary();
            result["source"] = this.getSource();
            result["supersededBy"] = this.isSupersededBy();
            result["name"] = this.getName();
            result["description"] = this.getDescription();
            result["superClasses"] = this.getSuperClasses(implicit, filter);
            result["subClasses"] = this.getSubClasses(implicit, filter);
            result["properties"] = this.getProperties(implicit, filter);
            return result;
        }
    }]);

    return Class;
}();

module.exports = Class;

},{"./utilities":52}],45:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//the functions for a data type Object
var util = require("./utilities");

var DataType = function () {
    /**
     * A DataType represents an schema:DataType. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this DataType, e.g. "schema:Number"
     * @param {object} graph - The underlying data graph to enable the methods of this DataType
     */
    function DataType(IRI, graph) {
        _classCallCheck(this, DataType);

        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this DataType in compact/absolute form
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Number", if false -> return absolute IRI -> "http://schema.org/Number"
     * @returns {string} The IRI (@id) of this DataType
     */


    _createClass(DataType, [{
        key: "getIRI",
        value: function getIRI() {
            var compactForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (compactForm) {
                return this.IRI;
            } else {
                return util.toAbsoluteIRI(this.IRI, this.graph.context);
            }
        }

        /**
         * Retrieves the term type (@type) of this DataType (is always "schema:DataType")
         * @returns {string} The term type of this DataType -> "schema:DataType"
         */

    }, {
        key: "getTermType",
        value: function getTermType() {
            return "schema:DataType";
        }

        /**
         * Retrieves the original vocabulary (schema:isPartOf) of this DataType
         * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this DataType
         */

    }, {
        key: "getVocabulary",
        value: function getVocabulary() {
            var dataTypeObj = this.graph.dataTypes[this.IRI];
            if (dataTypeObj["schema:isPartOf"] !== undefined) {
                return dataTypeObj["schema:isPartOf"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the source (dc:source) of this DataType
         * @returns {string|null} The source IRI given by the "dc:source" of this DataType (null if none)
         */

    }, {
        key: "getSource",
        value: function getSource() {
            var dataTypeObj = this.graph.dataTypes[this.IRI];
            if (dataTypeObj["dc:source"] !== undefined) {
                return dataTypeObj["dc:source"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the DataType superseding (schema:supersededBy) this DataType
         * @returns {string|null} The DataType superseding this DataType (null if none)
         */

    }, {
        key: "isSupersededBy",
        value: function isSupersededBy() {
            var dataTypeObj = this.graph.dataTypes[this.IRI];
            if (util.isString(dataTypeObj["schema:supersededBy"])) {
                return dataTypeObj["schema:supersededBy"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the name (rdfs:label) of this DataType in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the name
         * @returns {string|null} The name of this DataType (null if not given for specified language)
         */

    }, {
        key: "getName",
        value: function getName() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var nameObj = this.graph.dataTypes[this.IRI]["rdfs:label"];
            if (nameObj === null || nameObj[language] === undefined) {
                return null;
            }
            return nameObj[language];
        }

        /**
         * Retrieves the description (rdfs:comment) of this DataType in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the description
         * @returns {string|null} The description of this DataType (null if not given for specified language)
         */

    }, {
        key: "getDescription",
        value: function getDescription() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var descriptionObj = this.graph.dataTypes[this.IRI]["rdfs:comment"];
            if (descriptionObj === null || descriptionObj[language] === undefined) {
                return null;
            }
            return descriptionObj[language];
        }

        /**
         * Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType
         * @param {boolean} implicit - (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes)
         * @param {object|null} filter - (default = null) an optional filter for the super-DataTypes
         * @returns {array} The super-DataTypes of this DataType
         */

    }, {
        key: "getSuperDataTypes",
        value: function getSuperDataTypes() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var dataTypeObj = this.graph.dataTypes[this.IRI];
            var result = [];
            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSuperDataTypes(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(dataTypeObj["rdfs:subClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType
         * @param {boolean} implicit - (default = true) retrieves also implicit sub-DataTypes (recursive from sub-DataTypes)
         * @param {object|null} filter - (default = null) an optional filter for the sub-DataTypes
         * @returns {array} The sub-DataTypes of this DataType
         */

    }, {
        key: "getSubDataTypes",
        value: function getSubDataTypes() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var dataTypeObj = this.graph.dataTypes[this.IRI];
            var result = [];
            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSubDataTypes(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(dataTypeObj["soa:superClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Generates a string representation of this DataType (Based on its JSON representation)
         * @returns {string} The string representation of this DataType
         */

    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJSON(false, null), null, 2);
        }

        /**
         * Generates an explicit/implicit JSON representation of this DataType.
         * @param {boolean} implicit - (default = true) includes also implicit data (e.g. sub-DataTypes, super-DataTypes)
         * @param {object|null} filter - (default = null) an optional filter for the generated data
         * @returns {object} The JSON representation of this DataType
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var result = {};
            result["id"] = this.getIRI(true);
            result["IRI"] = this.getIRI();
            result["type"] = this.getTermType();
            result["vocabulary"] = this.getVocabulary();
            result["source"] = this.getSource();
            result["supersededBy"] = this.isSupersededBy();
            result["name"] = this.getName();
            result["description"] = this.getDescription();
            result["superDataTypes"] = this.getSuperDataTypes(implicit, filter);
            result["subDataTypes"] = this.getSubDataTypes(implicit, filter);
            return result;
        }
    }]);

    return DataType;
}();

module.exports = DataType;

},{"./utilities":52}],46:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//the functions for a enumeration Object
var util = require("./utilities");

var Enumeration = function () {
    /**
     * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek"
     * @param {object} graph - The underlying data graph to enable the methods of this Enumeration
     */
    function Enumeration(IRI, graph) {
        _classCallCheck(this, Enumeration);

        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Enumeration in compact/absolute form
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:DayOfWeek", if false -> return absolute IRI -> "http://schema.org/DayOfWeek"
     * @returns {string} The IRI (@id) of this Enumeration
     */


    _createClass(Enumeration, [{
        key: "getIRI",
        value: function getIRI() {
            var compactForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (compactForm) {
                return this.IRI;
            } else {
                return util.toAbsoluteIRI(this.IRI, this.graph.context);
            }
        }

        /**
         * Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")
         * @returns {string} The term type of this Enumeration -> "schema:Enumeration"
         */

    }, {
        key: "getTermType",
        value: function getTermType() {
            return "schema:Enumeration";
        }

        /**
         * Retrieves the original vocabulary (schema:isPartOf) of this Enumeration
         * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Enumeration
         */

    }, {
        key: "getVocabulary",
        value: function getVocabulary() {
            var enumObj = this.graph.enumerations[this.IRI];
            if (enumObj["schema:isPartOf"] !== undefined) {
                return enumObj["schema:isPartOf"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the source (dc:source) of this Enumeration
         * @returns {string|null} The source IRI given by the "dc:source" of this Enumeration (null if none)
         */

    }, {
        key: "getSource",
        value: function getSource() {
            var enumObj = this.graph.enumerations[this.IRI];
            if (enumObj["dc:source"] !== undefined) {
                return enumObj["dc:source"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the Enumeration superseding (schema:supersededBy) this Enumeration
         * @returns {string|null} The Enumeration superseding this Enumeration (null if none)
         */

    }, {
        key: "isSupersededBy",
        value: function isSupersededBy() {
            var enumObj = this.graph.enumerations[this.IRI];
            if (util.isString(enumObj["schema:supersededBy"])) {
                return enumObj["schema:supersededBy"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the name (rdfs:label) of this Enumeration in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the name
         * @returns {string|null} The name of this Enumeration (null if not given for specified language)
         */

    }, {
        key: "getName",
        value: function getName() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var nameObj = this.graph.enumerations[this.IRI]["rdfs:label"];
            if (nameObj === null || nameObj[language] === undefined) {
                return null;
            }
            return nameObj[language];
        }

        /**
         * Retrieves the description (rdfs:comment) of this Enumeration in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the description
         * @returns {string|null} The description of this Enumeration (null if not given for specified language)
         */

    }, {
        key: "getDescription",
        value: function getDescription() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var descriptionObj = this.graph.enumerations[this.IRI]["rdfs:comment"];
            if (descriptionObj === null || descriptionObj[language] === undefined) {
                return null;
            }
            return descriptionObj[language];
        }

        /**
         * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
          * @returns {array} The enumeration members of this Enumeration
         */

    }, {
        key: "getEnumerationMembers",
        value: function getEnumerationMembers() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var enumObj = this.graph.enumerations[this.IRI];
            var result = enumObj["soa:hasEnumerationMember"];
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit properties (soa:hasProperty) of this Enumeration
         * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
         * @param {object|null} filter - (default = null) an optional filter for the properties
         * @returns {array} The properties of this Enumeration
         */

    }, {
        key: "getProperties",
        value: function getProperties() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var enumObj = this.graph.enumerations[this.IRI];
            var result = [];
            result.push.apply(result, _toConsumableArray(enumObj["soa:hasProperty"]));
            if (implicit === true) {
                //add properties from super-classes
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferPropertiesFromSuperClasses(enumObj["rdfs:subClassOf"])));
                //add sub-properties ?
                // for (let p = 0; p < result.length; p++) {
                //     result.push(... this.graph.reasoner.inferSubProperties(result[p]));
                // }
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Enumeration
         * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
         * @param {object|null} filter - (default = null) an optional filter for the super-classes
         * @returns {array} The super-classes of this Enumeration
         */

    }, {
        key: "getSuperClasses",
        value: function getSuperClasses() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var enumObj = this.graph.enumerations[this.IRI];
            var result = [];
            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSuperClasses(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(enumObj["rdfs:subClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Enumeration
         * @param {boolean} implicit - (default = true) retrieves also implicit sub-classes (recursive from sub-classes)
         * @param {object|null} filter - (default = null) an optional filter for the sub-classes
         * @returns {array} The sub-classes of this Enumeration
         */

    }, {
        key: "getSubClasses",
        value: function getSubClasses() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var enumObj = this.graph.enumerations[this.IRI];
            var result = [];
            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSubClasses(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(enumObj["soa:superClassOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Generates a string representation of this Enumeration (Based on its JSON representation)
         * @returns {string} The string representation of this Enumeration
         */

    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJSON(false, null), null, 2);
        }

        /**
         * Generates an explicit/implicit JSON representation of this Enumeration
         * @param {boolean} implicit - (default = true) includes also implicit data
         * @param {object|null} filter - (default = null) an optional filter for the generated data
         * @returns {object} The JSON representation of this Enumeration
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var result = {};
            result["id"] = this.getIRI(true);
            result["IRI"] = this.getIRI();
            result["type"] = this.getTermType();
            result["vocabulary"] = this.getVocabulary();
            result["source"] = this.getSource();
            result["supersededBy"] = this.isSupersededBy();
            result["name"] = this.getName();
            result["description"] = this.getDescription();
            result["enumerationMembers"] = this.getEnumerationMembers(filter);
            result["superClasses"] = this.getSuperClasses(implicit, filter);
            result["subClasses"] = this.getSubClasses(implicit, filter);
            result["properties"] = this.getProperties(implicit, filter);
            return result;
        }
    }]);

    return Enumeration;
}();

module.exports = Enumeration;

},{"./utilities":52}],47:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//the functions for a enumeration member Object
var util = require("./utilities");

var EnumerationMember = function () {
    /**
     * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
     * @param {object} graph - The underlying data graph to enable the methods of this EnumerationMember
     */
    function EnumerationMember(IRI, graph) {
        _classCallCheck(this, EnumerationMember);

        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this EnumerationMember in compact/absolute form
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday"
     * @returns {string} The IRI (@id) of this EnumerationMember
     */


    _createClass(EnumerationMember, [{
        key: "getIRI",
        value: function getIRI() {
            var compactForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (compactForm) {
                return this.IRI;
            } else {
                return util.toAbsoluteIRI(this.IRI, this.graph.context);
            }
        }

        /**
         * Retrieves the term type (@type) of this EnumerationMember (is always "schema:Enumeration")
         * @returns {string} The term type of this EnumerationMember -> "soa:EnumerationMember" //there is no explicit type for enumeration members in the Schema.org Meta, so we use our own definition
         */

    }, {
        key: "getTermType",
        value: function getTermType() {
            return "soa:EnumerationMember";
        }

        /**
         * Retrieves the original vocabulary (schema:isPartOf) of this EnumerationMember
         * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this EnumerationMember
         */

    }, {
        key: "getVocabulary",
        value: function getVocabulary() {
            var enumObj = this.graph.enumerationMembers[this.IRI];
            if (enumObj["schema:isPartOf"] !== undefined) {
                return enumObj["schema:isPartOf"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the source (dc:source) of this EnumerationMember
         * @returns {string|Array|null} The source IRI given by the "dc:source" of this EnumerationMember (null if none)
         */

    }, {
        key: "getSource",
        value: function getSource() {
            var enumObj = this.graph.enumerationMembers[this.IRI];
            if (enumObj["dc:source"] !== undefined) {
                return enumObj["dc:source"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the EnumerationMember superseding (schema:supersededBy) this EnumerationMember
         * @returns {string|null} The EnumerationMember superseding this EnumerationMember (null if none)
         */

    }, {
        key: "isSupersededBy",
        value: function isSupersededBy() {
            var enumObj = this.graph.enumerationMembers[this.IRI];
            if (util.isString(enumObj["schema:supersededBy"])) {
                return enumObj["schema:supersededBy"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the name (rdfs:label) of this EnumerationMember in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the name
         * @returns {string|null} The name of this EnumerationMember (null if not given for specified language)
         */

    }, {
        key: "getName",
        value: function getName() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var nameObj = this.graph.enumerationMembers[this.IRI]["rdfs:label"];
            if (nameObj === null || nameObj[language] === undefined) {
                return null;
            }
            return nameObj[language];
        }

        /**
         * Retrieves the description (rdfs:comment) of this EnumerationMember in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the description
         * @returns {string|null} The description of this EnumerationMember (null if not given for specified language)
         */

    }, {
        key: "getDescription",
        value: function getDescription() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var descriptionObj = this.graph.enumerationMembers[this.IRI]["rdfs:comment"];
            if (descriptionObj === null || descriptionObj[language] === undefined) {
                return null;
            }
            return descriptionObj[language];
        }

        /**
         * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
         * @param {object|null} filter - (default = null) an optional filter for the domain enumerations
         * @returns {array} The domain enumerations of this EnumerationMember
         */

    }, {
        key: "getDomainEnumerations",
        value: function getDomainEnumerations() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var enumObj = this.graph.enumerationMembers[this.IRI];
            var result = enumObj["soa:enumerationDomainIncludes"];
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Generates a string representation of this EnumerationMember (Based on its JSON representation)
         * @returns {string} The string representation of this EnumerationMember
         */

    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJSON(false, null), null, 2);
        }

        /**
         * Generates a JSON representation of this EnumerationMember
         * @param {object|null} filter - (default = null) an optional filter for the generated data
         * @returns {object} The JSON representation of this EnumerationMember
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var result = {};
            result["id"] = this.getIRI(true);
            result["IRI"] = this.getIRI();
            result["type"] = this.getTermType();
            result["vocabulary"] = this.getVocabulary();
            result["source"] = this.getSource();
            result["supersededBy"] = this.isSupersededBy();
            result["name"] = this.getName();
            result["description"] = this.getDescription();
            result["domainEnumerations"] = this.getDomainEnumerations(filter);
            return result;
        }
    }]);

    return EnumerationMember;
}();

module.exports = EnumerationMember;

},{"./utilities":52}],48:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require("./utilities");
var Class = require("./Class");
var Property = require("./Property");
var Enumeration = require("./Enumeration");
var EnumerationMember = require("./EnumerationMember");
var DataType = require("./DataType");
var ReasoningEngine = require("./ReasoningEngine");

var Graph = function () {
    /**
     * @constructor
     * @param {object} sdoAdapter - The parent sdoAdapter-class to which this Graph belongs
     */
    function Graph(sdoAdapter) {
        _classCallCheck(this, Graph);

        this.sdoAdapter = sdoAdapter;
        this.reasoner = new ReasoningEngine(this);
        // Simply speaking, a context is used to map terms to IRIs. Terms are case sensitive and any valid string that is not a reserved JSON-LD keyword can be used as a term.
        // soa:superClassOf is an inverse of rdfs:subClassOf that should help us
        // soa:superPropertyOf is an inverse of rdfs:subPropertyOf that should help us
        // soa:hasProperty is an inverse of schema:domainIncludes
        // soa:isRangeOf is an inverse of schema:rangeIncludes
        // soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
        // soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember
        // soa:EnumerationMember is introduced as meta type for the members of an schema:Enumeration
        this.context = {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "dc": "http://purl.org/dc/terms/",
            "schema": "http://schema.org/",
            "soa": "http://schema-org-adapter.at/vocabTerms/",
            "soa:superClassOf": {
                "@id": "soa:superClassOf",
                "@type": "@id"
            },
            "soa:superPropertyOf": {
                "@id": "soa:superPropertyOf",
                "@type": "@id"
            },
            "soa:hasProperty": {
                "@id": "soa:hasProperty",
                "@type": "@id"
            },
            "soa:isRangeOf": {
                "@id": "soa:isRangeOf",
                "@type": "@id"
            },
            "soa:hasEnumerationMember": {
                "@id": "soa:hasEnumerationMember",
                "@type": "@id"
            },
            "soa:enumerationDomainIncludes": {
                "@id": "soa:enumerationDomainIncludes",
                "@type": "@id"
            },
            "rdfs:subClassOf": {
                "@id": "rdfs:subClassOf",
                "@type": "@id"
            },
            "rdfs:subPropertyOf": {
                "@id": "rdfs:subPropertyOf",
                "@type": "@id"
            },
            "schema:isPartOf": {
                "@id": "schema:isPartOf",
                "@type": "@id"
            },
            "schema:domainIncludes": {
                "@id": "schema:domainIncludes",
                "@type": "@id"
            },
            "schema:rangeIncludes": {
                "@id": "schema:rangeIncludes",
                "@type": "@id"
            },
            "schema:supersededBy": {
                "@id": "schema:supersededBy",
                "@type": "@id"
            },
            "schema:inverseOf": {
                "@id": "schema:inverseOf",
                "@type": "@id"
            },
            "dc:source": {
                "@id": "dc:source",
                "@type": "@id"
            }
        };
        this.classes = {}; //keys are the compacted IRI
        this.properties = {}; //keys are the compacted IRI
        this.dataTypes = {}; //keys are the compacted IRI
        this.enumerations = {}; //keys are the compacted IRI
        this.enumerationMembers = {}; //keys are the compacted IRI
    }

    /**
     * Adds a new vocabulary (in JSON-LD format) to the graph data
     * @param {object} vocab - The vocabulary to add the graph, in JSON-LD format
     * @return {boolean} returns true on success
     */


    _createClass(Graph, [{
        key: "addVocabulary",
        value: async function addVocabulary(vocab) {
            //this algorithm is well-documented in /docu/algorithm.md
            try {
                //A) Pre-process Vocabulary
                //create new context
                this.context = util.generateContext(this.context, vocab["@context"]);
                //pre-process new vocab
                vocab = await util.preProcessVocab(vocab, this.context); //adapt @graph to new context
                var vocabularies = this.sdoAdapter.getVocabularies();
                for (var i = 0; i < vocab["@graph"].length; i++) {
                    vocab["@graph"][i] = util.curateNode(vocab["@graph"][i], vocabularies); //curate nodes
                }
                //B) Classify Input
                /**
                 Classify every @graph node based on its @type. The node is transformed to another data-model based on the @type and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the @type is not enough for a correct classification. The mapping of our data model and the @type(s) of the corresponding @graph nodes are as follows:
                 classes ("@type" = "rdfs:Class")
                 properties ("@type" = "rdf:Property")
                 dataTypes ("@type" = "rdfs:Class" + "http://schema.org/DataType")
                 enumerations ("@type" = "rdfs:Class", has "http://schema.org/Enumeration" as implicit super-class)
                 enumerationMembers ("@type" = @id(s) of enumeration(s))
                 */
                for (var _i = 0; _i < vocab["@graph"].length; _i++) {
                    var curNode = JSON.parse(JSON.stringify(vocab["@graph"][_i]));
                    if (util.isString(curNode["@type"])) {
                        switch (curNode["@type"]) {
                            case "rdfs:Class":
                                this.addGraphNode(this.classes, curNode);
                                break;
                            case "rdf:Property":
                                this.addGraphNode(this.properties, curNode);
                                break;
                            default:
                                //@type is not something expected -> enumerationMember
                                this.addGraphNode(this.enumerationMembers, curNode);
                                break;
                        }
                    } else if (util.isArray(curNode["@type"])) {
                        //@type is not a string -> datatype or enumeration
                        // [
                        //     "rdfs:Class",
                        //     "schema:DataType"
                        // ]
                        //[
                        //   "schema:MedicalImagingTechnique",
                        //   "schema:MedicalSpecialty"
                        // ]
                        if (curNode["@type"].indexOf("rdfs:Class") !== -1 && curNode["@type"].indexOf("schema:DataType") !== -1) {
                            //datatype
                            this.addGraphNode(this.dataTypes, curNode);
                        } else {
                            //enumeration member
                            this.addGraphNode(this.enumerationMembers, curNode);
                        }
                    } else {
                        console.log("unexpected @type format for the following node:");
                        console.log(JSON.stringify(curNode, null, 2));
                    }
                }
                //C) Classification cleaning
                /* To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:
                 Enumerations which are handled as Classes.
                 DataTypes which are handled as Classes.
                 */

                //C.1)  Extract enumerations from classes memory
                // For each entry in the classes memory check if its superClasses contain Enumeration or another Enumeration. If this is the case, it is known that this class is an enumeration.
                var newEnum = void 0;
                do {
                    newEnum = false;
                    var _classesKeys = Object.keys(this.classes);
                    var _enumKeys = Object.keys(this.enumerations);
                    for (var _i2 = 0; _i2 < _classesKeys.length; _i2++) {
                        if (this.classes[_classesKeys[_i2]]["rdfs:subClassOf"] !== undefined) {
                            var subClassArray = this.classes[_classesKeys[_i2]]["rdfs:subClassOf"];
                            for (var j = 0; j < subClassArray.length; j++) {
                                if (_enumKeys.indexOf(subClassArray[j]) !== -1 || subClassArray[j] === "schema:Enumeration") {
                                    if (this.classes[_classesKeys[_i2]] !== undefined && this.enumerations[_classesKeys[_i2]] === undefined) {
                                        newEnum = true;
                                        this.enumerations[_classesKeys[_i2]] = JSON.parse(JSON.stringify(this.classes[_classesKeys[_i2]]));
                                        delete this.classes[_classesKeys[_i2]];
                                    }
                                }
                            }
                        }
                    }
                } while (newEnum);
                //C.2) check if there are subclasses of dataTypes which are in the classes data, put them in dataType data
                var newDatatype = void 0;
                do {
                    newDatatype = false;
                    var _classesKeys2 = Object.keys(this.classes);
                    var _dtKeys = Object.keys(this.dataTypes);
                    for (var _i3 = 0; _i3 < _classesKeys2.length; _i3++) {
                        if (this.classes[_classesKeys2[_i3]]["rdfs:subClassOf"] !== undefined) {
                            var _subClassArray = this.classes[_classesKeys2[_i3]]["rdfs:subClassOf"];
                            for (var _j = 0; _j < _subClassArray.length; _j++) {
                                if (_dtKeys.indexOf(_subClassArray[_j]) !== -1 || _subClassArray[_j] === "schema:DataType") {
                                    if (this.classes[_classesKeys2[_i3]] !== undefined && this.dataTypes[_classesKeys2[_i3]] === undefined) {
                                        newDatatype = true;
                                        this.dataTypes[_classesKeys2[_i3]] = JSON.parse(JSON.stringify(this.classes[_classesKeys2[_i3]]));
                                        delete this.classes[_classesKeys2[_i3]];
                                    }
                                }
                            }
                        }
                    }
                } while (newDatatype);
                //C.3) change the @type of data-types to a single value, which is "schema:DataType"
                var dtKeys = Object.keys(this.dataTypes);
                for (var _i4 = 0; _i4 < dtKeys.length; _i4++) {
                    this.dataTypes[dtKeys[_i4]]["@type"] = "schema:DataType";
                }

                //D) Inheritance
                /*    Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated.*/
                // D.1) Add subClasses for Classes and Enumerations
                //check superclasses for all classes and enumerations. Add these classes/enumerations as subclasses (soa:superClassOf) for the parent class/enumeration
                var classesKeys = Object.keys(this.classes);
                for (var c = 0; c < classesKeys.length; c++) {
                    var superClasses = this.classes[classesKeys[c]]["rdfs:subClassOf"];
                    //add empty superClassOf if not defined
                    if (this.classes[classesKeys[c]]["soa:superClassOf"] === undefined) {
                        this.classes[classesKeys[c]]["soa:superClassOf"] = [];
                    }
                    for (var s = 0; s < superClasses.length; s++) {
                        var superClass = this.classes[superClasses[s]];
                        if (superClass === undefined) {
                            superClass = this.enumerations[superClasses[s]];
                        }
                        if (superClass !== undefined) {
                            if (superClass["soa:superClassOf"] !== undefined) {
                                if (superClass["soa:superClassOf"].indexOf(classesKeys[c]) === -1) {
                                    superClass["soa:superClassOf"].push(classesKeys[c]);
                                }
                            } else {
                                superClass["soa:superClassOf"] = [classesKeys[c]];
                            }
                        }
                    }
                }
                var enumKeys = Object.keys(this.enumerations);
                for (var e = 0; e < enumKeys.length; e++) {
                    var _superClasses = this.enumerations[enumKeys[e]]["rdfs:subClassOf"];
                    //add empty superClassOf if not defined
                    if (this.enumerations[enumKeys[e]]["soa:superClassOf"] === undefined) {
                        this.enumerations[enumKeys[e]]["soa:superClassOf"] = [];
                    }
                    for (var _s = 0; _s < _superClasses.length; _s++) {
                        var _superClass = this.classes[_superClasses[_s]];
                        if (_superClass === undefined) {
                            _superClass = this.enumerations[_superClasses[_s]];
                        }
                        if (_superClass !== undefined) {
                            if (_superClass["soa:superClassOf"] !== undefined) {
                                if (_superClass["soa:superClassOf"].indexOf(enumKeys[e]) === -1) {
                                    _superClass["soa:superClassOf"].push(enumKeys[e]);
                                }
                            } else {
                                _superClass["soa:superClassOf"] = [enumKeys[e]];
                            }
                        }
                    }
                }
                // D.2) Add subClasses for DataTypes
                //For each entry in the dataTypes memory the superClasses are checked (if they are in dataTypes memory) and those super types add the actual entry in their subClasses.
                var dataTypeKeys = Object.keys(this.dataTypes);
                for (var d = 0; d < dataTypeKeys.length; d++) {
                    var _superClasses2 = this.dataTypes[dataTypeKeys[d]]["rdfs:subClassOf"];
                    //add empty superClassOf if not defined
                    if (this.dataTypes[dataTypeKeys[d]]["soa:superClassOf"] === undefined) {
                        this.dataTypes[dataTypeKeys[d]]["soa:superClassOf"] = [];
                    }
                    //add empty subClassOf if not defined
                    if (_superClasses2 === undefined) {
                        this.dataTypes[dataTypeKeys[d]]["rdfs:subClassOf"] = [];
                    } else {
                        for (var _s2 = 0; _s2 < _superClasses2.length; _s2++) {
                            var _superClass2 = this.dataTypes[_superClasses2[_s2]];
                            if (_superClass2 !== undefined) {
                                if (_superClass2["soa:superClassOf"] !== undefined) {
                                    if (_superClass2["soa:superClassOf"].indexOf(dataTypeKeys[d]) === -1) {
                                        _superClass2["soa:superClassOf"].push(dataTypeKeys[d]);
                                    }
                                } else {
                                    _superClass2["soa:superClassOf"] = [dataTypeKeys[d]];
                                }
                            }
                        }
                    }
                }
                // D.3) Add subProperties for Properties
                //For each entry in the properties memory the superProperties are checked (if they are in properties memory) and those super properties add the actual entry in their subProperties. (soa:superPropertyOf)
                var propertyKeys = Object.keys(this.properties);
                for (var p = 0; p < propertyKeys.length; p++) {
                    var superProperties = this.properties[propertyKeys[p]]["rdfs:subPropertyOf"];
                    //add empty superPropertyOf if not defined
                    if (this.properties[propertyKeys[p]]["soa:superPropertyOf"] === undefined) {
                        this.properties[propertyKeys[p]]["soa:superPropertyOf"] = [];
                    }
                    //add empty subPropertyOf if not defined
                    if (superProperties === undefined) {
                        this.properties[propertyKeys[p]]["rdfs:subPropertyOf"] = [];
                    } else {
                        for (var _s3 = 0; _s3 < superProperties.length; _s3++) {
                            var _superClass3 = this.properties[superProperties[_s3]];
                            if (_superClass3 !== undefined) {
                                if (_superClass3["soa:superPropertyOf"] !== undefined) {
                                    if (_superClass3["soa:superPropertyOf"].indexOf(propertyKeys[p]) === -1) {
                                        _superClass3["soa:superPropertyOf"].push(propertyKeys[p]);
                                    }
                                } else {
                                    _superClass3["soa:superPropertyOf"] = [propertyKeys[p]];
                                }
                            }
                        }
                    }
                }
                //E) Relationships
                /*  In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set.#
                soa:hasProperty is an inverse of schema:domainIncludes
                soa:isRangeOf is an inverse of schema:rangeIncludes
                soa:hasEnumerationMember is used for enumerations to list all its enumeration members (their @type includes the @id of the enumeration)
                soa:enumerationDomainIncludes is an inverse of soa:hasEnumerationMember */
                //E.0) add empty arrays for the relationships
                classesKeys = Object.keys(this.classes);
                for (var _c = 0; _c < classesKeys.length; _c++) {
                    if (this.classes[classesKeys[_c]]["soa:hasProperty"] === undefined) {
                        this.classes[classesKeys[_c]]["soa:hasProperty"] = [];
                    }
                    if (this.classes[classesKeys[_c]]["soa:isRangeOf"] === undefined) {
                        this.classes[classesKeys[_c]]["soa:isRangeOf"] = [];
                    }
                }
                enumKeys = Object.keys(this.enumerations);
                for (var _e = 0; _e < enumKeys.length; _e++) {
                    if (this.enumerations[enumKeys[_e]]["soa:hasEnumerationMember"] === undefined) {
                        this.enumerations[enumKeys[_e]]["soa:hasEnumerationMember"] = [];
                    }
                    if (this.enumerations[enumKeys[_e]]["soa:isRangeOf"] === undefined) {
                        this.enumerations[enumKeys[_e]]["soa:isRangeOf"] = [];
                    }
                    if (this.enumerations[enumKeys[_e]]["soa:hasProperty"] === undefined) {
                        this.enumerations[enumKeys[_e]]["soa:hasProperty"] = [];
                    }
                }
                var enumMemKeys = Object.keys(this.enumerationMembers);
                for (var _e2 = 0; _e2 < enumMemKeys.length; _e2++) {
                    if (this.enumerationMembers[enumMemKeys[_e2]]["soa:enumerationDomainIncludes"] === undefined) {
                        this.enumerationMembers[enumMemKeys[_e2]]["soa:enumerationDomainIncludes"] = [];
                    }
                }
                /* E.1) Add explicit hasProperty and isRangeOf to classes and enumerations
                For each entry in the classes/enumeration memory, the properties field is added. This data field holds all properties which belong to this class (class/enumeration is domain for property). */
                propertyKeys = Object.keys(this.properties);
                for (var _p = 0; _p < propertyKeys.length; _p++) {
                    var domainIncludesArray = this.properties[propertyKeys[_p]]["schema:domainIncludes"];
                    if (util.isArray(domainIncludesArray)) {
                        for (var di = 0; di < domainIncludesArray.length; di++) {
                            var target = this.classes[domainIncludesArray[di]];
                            if (target === undefined) {
                                target = this.enumerations[domainIncludesArray[di]];
                            }
                            if (target !== undefined && util.isArray(target["soa:hasProperty"]) && target["soa:hasProperty"].indexOf(propertyKeys[_p]) === -1) {
                                target["soa:hasProperty"].push(propertyKeys[_p]);
                            }
                        }
                    }
                    var rangeIncludesArray = this.properties[propertyKeys[_p]]["schema:rangeIncludes"];
                    if (util.isArray(rangeIncludesArray)) {
                        for (var ri = 0; ri < rangeIncludesArray.length; ri++) {
                            var _target = this.classes[rangeIncludesArray[ri]];
                            if (_target === undefined) {
                                _target = this.enumerations[rangeIncludesArray[ri]];
                            }
                            if (_target !== undefined && util.isArray(_target["soa:isRangeOf"]) && _target["soa:isRangeOf"].indexOf(propertyKeys[_p]) === -1) {
                                _target["soa:isRangeOf"].push(propertyKeys[_p]);
                            }
                        }
                    }
                }
                /* E.2) Add soa:hasEnumerationMember to enumerations and soa:enumerationDomainIncludes to enumerationMembers
                For each entry in the enumeration memory the soa:hasEnumerationMember field is added, this data field holds all enumeration members which belong to this enumeration.
                For each entry in the enumerationMembers memory the soa:enumerationDomainIncludes field is added, this data field holds all enumerations that are a domain for this enumerationMember
                */
                enumMemKeys = Object.keys(this.enumerationMembers);
                for (var _e3 = 0; _e3 < enumMemKeys.length; _e3++) {
                    var enumMem = this.enumerationMembers[enumMemKeys[_e3]];
                    var enumMemTypeArray = enumMem["@type"];
                    if (!util.isArray(enumMemTypeArray)) {
                        enumMemTypeArray = [enumMemTypeArray];
                    }
                    for (var t = 0; t < enumMemTypeArray.length; t++) {
                        var _target2 = this.enumerations[enumMemTypeArray[t]];
                        if (_target2 !== undefined && util.isArray(_target2["soa:hasEnumerationMember"]) && _target2["soa:hasEnumerationMember"].indexOf(enumMemKeys[_e3]) === -1) {
                            _target2["soa:hasEnumerationMember"].push(enumMemKeys[_e3]);
                            if (util.isArray(enumMem["soa:enumerationDomainIncludes"])) {
                                enumMem["soa:enumerationDomainIncludes"].push(enumMemTypeArray[t]);
                            } else {
                                enumMem["soa:enumerationDomainIncludes"] = [enumMemTypeArray[t]];
                            }
                        }
                    }
                }
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }

        /**
         * Creates/Updates a node in the graph
         * @param {object} memory - The memory object where the new node should be added (Classes, Properties, Enumerations, EnumerationMembers, DataTypes)
         * @param {object} newNode - The node in JSON-LD format to be added
         * @return {boolean} returns true on success
         */

    }, {
        key: "addGraphNode",
        value: function addGraphNode(memory, newNode) {
            try {
                if (memory[newNode["@id"]] === undefined) {
                    memory[newNode["@id"]] = newNode;
                } else {
                    //merging algorithm
                    var oldNode = memory[newNode["@id"]];
                    //@id stays the same
                    //@type should stay the same (we already defined the memory to save it)
                    //schema:isPartOf -> overwrite
                    if (newNode["schema:isPartOf"] !== undefined && newNode["schema:isPartOf"] !== null) {
                        oldNode["schema:isPartOf"] = newNode["schema:isPartOf"];
                    }
                    //dc:source -> overwrite
                    if (newNode["dc:source"] !== undefined && newNode["dc:source"] !== null) {
                        oldNode["dc:source"] = newNode["dc:source"];
                    }
                    //schema:category -> overwrite
                    if (newNode["schema:category"] !== undefined && newNode["schema:category"] !== null) {
                        oldNode["schema:category"] = newNode["schema:category"];
                    }
                    //schema:supersededBy -> overwrite
                    if (newNode["schema:supersededBy"] !== undefined && newNode["schema:supersededBy"] !== null) {
                        oldNode["schema:supersededBy"] = newNode["schema:supersededBy"];
                    }
                    //rdfs:label -> add new languages, overwrite old ones if needed
                    if (newNode["rdfs:label"] !== undefined && newNode["rdfs:label"] !== null) {
                        var labelKeysNew = Object.keys(newNode["rdfs:label"]);
                        for (var i = 0; i < labelKeysNew.length; i++) {
                            oldNode["rdfs:label"][labelKeysNew[i]] = newNode["rdfs:label"][labelKeysNew[i]];
                        }
                    }
                    //rdfs:comment -> add new languages, overwrite old ones if needed
                    if (newNode["rdfs:comment"] !== undefined && newNode["rdfs:comment"] !== null) {
                        var commentKeysNew = Object.keys(newNode["rdfs:comment"]);
                        for (var _i5 = 0; _i5 < commentKeysNew.length; _i5++) {
                            oldNode["rdfs:comment"][commentKeysNew[_i5]] = newNode["rdfs:comment"][commentKeysNew[_i5]];
                        }
                    }
                    //rdfs:subClassOf -> add new ids
                    if (newNode["rdfs:subClassOf"] !== undefined && newNode["rdfs:subClassOf"] !== null) {
                        for (var _i6 = 0; _i6 < newNode["rdfs:subClassOf"].length; _i6++) {
                            if (oldNode["rdfs:subClassOf"].indexOf(newNode["rdfs:subClassOf"][_i6]) === -1) {
                                //add new entry
                                oldNode["rdfs:subClassOf"].push(newNode["rdfs:subClassOf"][_i6]);
                            }
                        }
                    }
                    //soa:superClassOf -> add new ids
                    if (newNode["soa:superClassOf"] !== undefined && newNode["soa:superClassOf"] !== null) {
                        for (var _i7 = 0; _i7 < newNode["soa:superClassOf"].length; _i7++) {
                            if (oldNode["soa:superClassOf"].indexOf(newNode["soa:superClassOf"][_i7]) === -1) {
                                //add new entry
                                oldNode["soa:superClassOf"].push(newNode["soa:superClassOf"][_i7]);
                            }
                        }
                    }
                    //soa:hasProperty -> add new ids
                    if (newNode["soa:hasProperty"] !== undefined && newNode["soa:hasProperty"] !== null) {
                        for (var _i8 = 0; _i8 < newNode["soa:hasProperty"].length; _i8++) {
                            if (oldNode["soa:hasProperty"].indexOf(newNode["soa:hasProperty"][_i8]) === -1) {
                                //add new entry
                                oldNode["soa:hasProperty"].push(newNode["soa:hasProperty"][_i8]);
                            }
                        }
                    }
                    //soa:isRangeOf -> add new ids
                    if (newNode["soa:isRangeOf"] !== undefined && newNode["soa:isRangeOf"] !== null) {
                        for (var _i9 = 0; _i9 < newNode["soa:isRangeOf"].length; _i9++) {
                            if (oldNode["soa:isRangeOf"].indexOf(newNode["soa:isRangeOf"][_i9]) === -1) {
                                //add new entry
                                oldNode["soa:isRangeOf"].push(newNode["soa:isRangeOf"][_i9]);
                            }
                        }
                    }
                    //soa:enumerationDomainIncludes -> add new ids
                    if (newNode["soa:enumerationDomainIncludes"] !== undefined && newNode["soa:enumerationDomainIncludes"] !== null) {
                        for (var _i10 = 0; _i10 < newNode["soa:enumerationDomainIncludes"].length; _i10++) {
                            if (oldNode["soa:enumerationDomainIncludes"].indexOf(newNode["soa:enumerationDomainIncludes"][_i10]) === -1) {
                                //add new entry
                                oldNode["soa:enumerationDomainIncludes"].push(newNode["soa:enumerationDomainIncludes"][_i10]);
                            }
                        }
                    }
                    //soa:hasEnumerationMember -> add new ids
                    if (newNode["soa:hasEnumerationMember"] !== undefined && newNode["soa:hasEnumerationMember"] !== null) {
                        for (var _i11 = 0; _i11 < newNode["soa:hasEnumerationMember"].length; _i11++) {
                            if (oldNode["soa:hasEnumerationMember"].indexOf(newNode["soa:hasEnumerationMember"][_i11]) === -1) {
                                //add new entry
                                oldNode["soa:hasEnumerationMember"].push(newNode["soa:hasEnumerationMember"][_i11]);
                            }
                        }
                    }
                    //rdfs:subPropertyOf -> add new ids
                    if (newNode["rdfs:subPropertyOf"] !== undefined && newNode["rdfs:subPropertyOf"] !== null) {
                        for (var _i12 = 0; _i12 < newNode["rdfs:subPropertyOf"].length; _i12++) {
                            if (oldNode["rdfs:subPropertyOf"].indexOf(newNode["rdfs:subPropertyOf"][_i12]) === -1) {
                                //add new entry
                                oldNode["rdfs:subPropertyOf"].push(newNode["rdfs:subPropertyOf"][_i12]);
                            }
                        }
                    }
                    //schema:domainIncludes -> add new ids
                    if (newNode["schema:domainIncludes"] !== undefined && newNode["schema:domainIncludes"] !== null) {
                        for (var _i13 = 0; _i13 < newNode["schema:domainIncludes"].length; _i13++) {
                            if (oldNode["schema:domainIncludes"].indexOf(newNode["schema:domainIncludes"][_i13]) === -1) {
                                //add new entry
                                oldNode["schema:domainIncludes"].push(newNode["schema:domainIncludes"][_i13]);
                            }
                        }
                    }
                    //schema:rangeIncludes -> add new ids
                    if (newNode["schema:rangeIncludes"] !== undefined && newNode["schema:rangeIncludes"] !== null) {
                        for (var _i14 = 0; _i14 < newNode["schema:rangeIncludes"].length; _i14++) {
                            if (oldNode["schema:rangeIncludes"].indexOf(newNode["schema:rangeIncludes"][_i14]) === -1) {
                                //add new entry
                                oldNode["schema:rangeIncludes"].push(newNode["schema:rangeIncludes"][_i14]);
                            }
                        }
                    }
                    //soa:superPropertyOf-> add new ids
                    if (newNode["schema:superPropertyOf"] !== undefined && newNode["schema:superPropertyOf"] !== null) {
                        for (var _i15 = 0; _i15 < newNode["schema:superPropertyOf"].length; _i15++) {
                            if (oldNode["schema:superPropertyOf"].indexOf(newNode["schema:superPropertyOf"][_i15]) === -1) {
                                //add new entry
                                oldNode["schema:superPropertyOf"].push(newNode["schema:superPropertyOf"][_i15]);
                            }
                        }
                    }
                }
                return true;
            } catch (e) {
                console.log(e);
                console.log("memory[newNode[@id]]:");
                console.log(JSON.stringify(memory[newNode["@id"]], null, 2));
                console.log("newNode:");
                console.log(JSON.stringify(newNode, null, 2));
                return false;
            }
        }

        /**
         * Creates a corresponding JS-Class for the given IRI, depending on its category in the Graph
         * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {Class|Property|Enumeration|EnumerationMember|DataType} the JS-Class for the given IRI
         */

    }, {
        key: "getTerm",
        value: function getTerm(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            var targetObj = void 0;
            var targetType = void 0;
            var tryCounter = 0;
            do {
                switch (tryCounter) {
                    case 0:
                        targetObj = this.classes[compactIRI];
                        targetType = "Class";
                        break;
                    case 1:
                        targetObj = this.properties[compactIRI];
                        targetType = "Property";
                        break;
                    case 2:
                        targetObj = this.dataTypes[compactIRI];
                        targetType = "DataType";
                        break;
                    case 3:
                        targetObj = this.enumerations[compactIRI];
                        targetType = "Enumeration";
                        break;
                    case 4:
                        targetObj = this.enumerationMembers[compactIRI];
                        targetType = "EnumerationMember";
                        break;
                }
                tryCounter++;
            } while (targetObj === undefined && tryCounter < 6);

            if (targetObj !== undefined) {
                targetObj = util.applyFilter([targetObj["@id"]], filter, this);
                if (targetObj.length === 0) {
                    throw new Error("There is no term with that IRI and filter settings.");
                } else {
                    switch (targetType) {
                        case "Class":
                            return new Class(compactIRI, this);
                        case "Property":
                            return new Property(compactIRI, this);
                        case "Enumeration":
                            return new Enumeration(compactIRI, this);
                        case "EnumerationMember":
                            return new EnumerationMember(compactIRI, this);
                        case "DataType":
                            return new DataType(compactIRI, this);
                    }
                }
            } else {
                throw new Error("There is no term with the IRI " + id);
            }
        }

        /**
         * Creates a JS-Class for a Class of the Graph
         * @param {string} id - The id of the wished Class-node, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {Class|Enumeration} the JS-Class for the given IRI
         */

    }, {
        key: "getClass",
        value: function getClass(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            if (compactIRI !== null) {
                var classObj = this.classes[compactIRI];
                if (classObj !== undefined) {
                    classObj = util.applyFilter([compactIRI], filter, this);
                    if (classObj.length === 0) {
                        throw new Error("There is no class with that IRI and filter settings.");
                    } else {
                        return new Class(compactIRI, this);
                    }
                } else {
                    //enumerations can also be counted as classes
                    classObj = this.enumerations[compactIRI];
                    if (classObj !== undefined) {
                        try {
                            return this.getEnumeration(compactIRI);
                        } catch (e) {}
                    }
                }
            }
            throw new Error("There is no class with the IRI " + id);
        }

        /**
         * Creates a JS-Class for a Property of the Graph
         * @param {string} id - The id of the wished Property-node, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {Property} the JS-Class for the given IRI
         */

    }, {
        key: "getProperty",
        value: function getProperty(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            if (compactIRI !== null) {
                var propertyObj = this.properties[compactIRI];
                if (propertyObj !== undefined) {
                    propertyObj = util.applyFilter([compactIRI], filter, this);
                    if (propertyObj.length === 0) {
                        throw new Error("There is no property with that URI and filter settings.");
                    } else {
                        return new Property(compactIRI, this);
                    }
                }
            }
            throw new Error("There is no property with that URI.");
        }

        /**
         * Creates a JS-Class for a DataType of the Graph
         * @param {string} id - The id of the wished DataType-node, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {DataType} the JS-Class for the given IRI
         */

    }, {
        key: "getDataType",
        value: function getDataType(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            if (compactIRI !== null) {
                var dataTypeObj = this.dataTypes[compactIRI];
                if (dataTypeObj !== undefined) {
                    dataTypeObj = util.applyFilter([compactIRI], filter, this);
                    if (dataTypeObj.length === 0) {
                        throw new Error("There is no data-type with that IRI and filter settings.");
                    } else {
                        return new DataType(compactIRI, this);
                    }
                }
            }
            throw new Error("There is no data-type with the IRI " + id);
        }

        /**
         * Creates a JS-Class for an Enumeration of the Graph
         * @param {string} id - The id of the wished Enumeration-node, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {Enumeration} the JS-Class for the given IRI
         */

    }, {
        key: "getEnumeration",
        value: function getEnumeration(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            if (compactIRI !== null) {
                var enumObj = this.enumerations[compactIRI];
                if (enumObj !== undefined) {
                    enumObj = util.applyFilter([compactIRI], filter, this);
                    if (enumObj.length === 0) {
                        throw new Error("There is no enumeration with that IRI and filter settings.");
                    } else {
                        return new Enumeration(compactIRI, this);
                    }
                }
            }
            throw new Error("There is no enumeration with the IRI " + id);
        }

        /**
         * Creates a JS-Class for an EnumerationMember of the Graph
         * @param {string} id - The id of the wished EnumerationMember-node, can be an IRI (absolute or compact) or a label
         * @param {object} filter - (optional) The filter settings to be applied on the result
         * @return {EnumerationMember} the JS-Class for the given IRI
         */

    }, {
        key: "getEnumerationMember",
        value: function getEnumerationMember(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var compactIRI = this.discoverCompactIRI(id);
            if (compactIRI !== null) {
                var enumObj = this.enumerationMembers[compactIRI];
                if (enumObj !== undefined) {
                    enumObj = util.applyFilter([compactIRI], filter, this);
                    if (enumObj.length === 0) {
                        throw new Error("There is no EnumerationMember with that IRI and filter settings.");
                    } else {
                        return new EnumerationMember(compactIRI, this);
                    }
                }
            }
            throw new Error("There is no EnumerationMember with the IRI " + id);
        }

        /**
         * Transforms/Discovers the right compact IRI for a given input, which may be a already a compact IRI, or an absolute IRI, or a term label for a vocabulary member
         * @param {string} input - The input string to discover (if label) or transform (if absolute IRI)
         * @return {string|null} the corresponding compact IRI (null if input is not valid)
         */

    }, {
        key: "discoverCompactIRI",
        value: function discoverCompactIRI(input) {
            if (input.indexOf(":") !== -1) {
                //is iri
                var terms = Object.keys(this.context);
                for (var i = 0; i < terms.length; i++) {
                    var absoluteIRI = this.context[terms[i]];
                    if (util.isString(absoluteIRI)) {
                        if (input.startsWith(terms[i])) {
                            //is compactIRI
                            return input;
                        } else if (input.startsWith(absoluteIRI)) {
                            //is absoluteIRI
                            return util.toCompactIRI(input, this.context);
                        }
                    }
                }
            } else {
                //is label
                var classesKeys = Object.keys(this.classes);
                for (var _i16 = 0; _i16 < classesKeys.length; _i16++) {
                    if (this.containsLabel(this.classes[classesKeys[_i16]], input) === true) {
                        return classesKeys[_i16];
                    }
                }
                var propertiesKeys = Object.keys(this.properties);
                for (var _i17 = 0; _i17 < propertiesKeys.length; _i17++) {
                    if (this.containsLabel(this.properties[propertiesKeys[_i17]], input) === true) {
                        return propertiesKeys[_i17];
                    }
                }
                var dataTypeKeys = Object.keys(this.dataTypes);
                for (var _i18 = 0; _i18 < dataTypeKeys.length; _i18++) {
                    if (this.containsLabel(this.dataTypes[dataTypeKeys[_i18]], input) === true) {
                        return dataTypeKeys[_i18];
                    }
                }
                var enumerationKeys = Object.keys(this.enumerations);
                for (var _i19 = 0; _i19 < enumerationKeys.length; _i19++) {
                    if (this.containsLabel(this.enumerations[enumerationKeys[_i19]], input) === true) {
                        return enumerationKeys[_i19];
                    }
                }
                var enumerationMemberKeys = Object.keys(this.enumerationMembers);
                for (var _i20 = 0; _i20 < enumerationMemberKeys.length; _i20++) {
                    if (this.containsLabel(this.enumerationMembers[enumerationMemberKeys[_i20]], input) === true) {
                        return enumerationMemberKeys[_i20];
                    }
                }
            }
            //if nothing was found yet, the input is invalid
            return null;
        }

        //helper function for discoverCompactIRI()
        //returns true, if the termObj uses the given label (in any language)

    }, {
        key: "containsLabel",
        value: function containsLabel(termObj, label) {
            if (termObj !== undefined && util.isObject(termObj["rdfs:label"])) {
                var langKeys = Object.keys(termObj["rdfs:label"]);
                for (var i = 0; i < langKeys.length; i++) {
                    if (termObj["rdfs:label"][langKeys[i]] === label) {
                        return true;
                    }
                }
            }
            return false;
        }
    }]);

    return Graph;
}();

module.exports = Graph;

},{"./Class":44,"./DataType":45,"./Enumeration":46,"./EnumerationMember":47,"./Property":49,"./ReasoningEngine":50,"./utilities":52}],49:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//the functions for a property Object
var util = require("./utilities");

var Property = function () {
    /**
     * A Property represents an rdf:Property. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this Property, e.g. "schema:address"
     * @param {object} graph - The underlying data graph to enable the methods of this Property
     */
    function Property(IRI, graph) {
        _classCallCheck(this, Property);

        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Property in compact/absolute form
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:address", if false -> return absolute IRI -> "http://schema.org/address"
     * @returns {string} The IRI (@id) of this Property
     */


    _createClass(Property, [{
        key: "getIRI",
        value: function getIRI() {
            var compactForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (compactForm) {
                return this.IRI;
            } else {
                return util.toAbsoluteIRI(this.IRI, this.graph.context);
            }
        }

        /**
         * Retrieves the term type of this Property (is always "rdf:Property")
         * @returns {string} The term type of this Property -> "rdf:Property"
         */

    }, {
        key: "getTermType",
        value: function getTermType() {
            return "rdf:Property";
        }

        /**
         * Retrieves the original vocabulary (schema:isPartOf) of this Property
         * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Property
         */

    }, {
        key: "getVocabulary",
        value: function getVocabulary() {
            var propertyObj = this.graph.properties[this.IRI];
            if (propertyObj["schema:isPartOf"] !== undefined) {
                return propertyObj["schema:isPartOf"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the source (dc:source) of this Property
         * @returns {string|null} The source IRI given by the "dc:source" of this Property (null if none)
         */

    }, {
        key: "getSource",
        value: function getSource() {
            var propertyObj = this.graph.properties[this.IRI];
            if (propertyObj["dc:source"] !== undefined) {
                return propertyObj["dc:source"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the Property superseding (schema:supersededBy) this Property
         * @returns {string|null} The Property superseding this Property (null if none)
         */

    }, {
        key: "isSupersededBy",
        value: function isSupersededBy() {
            var propertyObj = this.graph.properties[this.IRI];
            if (util.isString(propertyObj["schema:supersededBy"])) {
                return propertyObj["schema:supersededBy"];
            } else {
                return null;
            }
        }

        /**
         * Retrieves the name (rdfs:label) of this Property in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the name
         * @returns {string|null} The name of this Property (null if not given for specified language)
         */

    }, {
        key: "getName",
        value: function getName() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var nameObj = this.graph.properties[this.IRI]["rdfs:label"];
            if (nameObj === null || nameObj[language] === undefined) {
                return null;
            }
            return nameObj[language];
        }

        /**
         * Retrieves the description (rdfs:comment) of this Property in a wished language (optional)
         * @param {string} language - (default = "en") the wished language for the description
         * @returns {string|null} The description of this Property (null if not given for specified language)
         */

    }, {
        key: "getDescription",
        value: function getDescription() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";

            var descriptionObj = this.graph.properties[this.IRI]["rdfs:comment"];
            if (descriptionObj === null || descriptionObj[language] === undefined) {
                return null;
            }
            return descriptionObj[language];
        }

        /**
         * Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property
         * @param {boolean} implicit - (default = true) retrieves also implicit ranges (inheritance from sub-classes of the ranges)
         * @param {object|null} filter - (default = null) an optional filter for the ranges
         * @returns {array} The ranges of this Property
         */

    }, {
        key: "getRanges",
        value: function getRanges() {
            var _result;

            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var propertyObj = this.graph.properties[this.IRI];
            var result = [];
            (_result = result).push.apply(_result, _toConsumableArray(propertyObj["schema:rangeIncludes"]));
            if (implicit === true) {
                var _result2;

                //add sub-classes from ranges
                (_result2 = result).push.apply(_result2, _toConsumableArray(this.graph.reasoner.inferImplicitSubClasses(result)));
                //remove "null" values from array (if range included data types)
                result = result.filter(function (el) {
                    return el !== null;
                });
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property
         * @param {boolean} implicit - (default = true) retrieves also implicit domains (inheritance from sub-classes of the domains)
         * @param {object|null} filter - (default = null) an optional filter for the domains
         * @returns {array} The domains of this Property
         */

    }, {
        key: "getDomains",
        value: function getDomains() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var propertyObj = this.graph.properties[this.IRI];
            var result = [];
            result.push.apply(result, _toConsumableArray(propertyObj["schema:domainIncludes"]));
            if (implicit === true) {
                //add sub-classes from ranges
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferImplicitSubClasses(result)));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property
         * @param {boolean} implicit - (default = true) retrieves also implicit super-properties (recursive from super-properties)
         * @param {object|null} filter - (default = null) an optional filter for the super-properties
         * @returns {array} The super-properties of this Property
         */

    }, {
        key: "getSuperProperties",
        value: function getSuperProperties() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var propertyObj = this.graph.properties[this.IRI];
            var result = [];

            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferSuperProperties(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(propertyObj["rdfs:subPropertyOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property
         * @param {boolean} implicit - (default = true) retrieves also implicit sub-properties (recursive from sub-properties)
         * @param {object|null} filter - (default = null) an optional filter for the sub-properties
         * @returns {array} The sub-properties of this Property
         */

    }, {
        key: "getSubProperties",
        value: function getSubProperties() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var propertyObj = this.graph.properties[this.IRI];
            var result = [];

            if (implicit === true) {
                result.push.apply(result, _toConsumableArray(this.graph.reasoner.inferSubProperties(this.IRI)));
            } else {
                result.push.apply(result, _toConsumableArray(propertyObj["soa:superPropertyOf"]));
            }
            return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
        }

        /**
         * Generates a string representation of this Property (Based on its JSON representation)
         * @returns {string} The string representation of this Property
         */

    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJSON(false, null), null, 2);
        }

        /**
         * Generates an explicit/implicit JSON representation of this Property.
         * @param {boolean} implicit - (default = true) includes also implicit data (e.g. domains, ranges, etc.)
         * @param {object|null} filter - (default = null) an optional filter for the generated data
         * @returns {object} The JSON representation of this Class
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            var implicit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var result = {};
            result["id"] = this.getIRI(true);
            result["IRI"] = this.getIRI();
            result["type"] = this.getTermType();
            result["vocabulary"] = this.getVocabulary();
            result["source"] = this.getSource();
            result["supersededBy"] = this.isSupersededBy();
            result["name"] = this.getName();
            result["description"] = this.getDescription();
            result["ranges"] = this.getRanges(implicit, filter);
            result["domains"] = this.getDomains(implicit, filter);
            result["superProperties"] = this.getSuperProperties(implicit, filter);
            result["subProperties"] = this.getSubProperties(implicit, filter);
            return result;
        }
    }]);

    return Property;
}();

module.exports = Property;

},{"./utilities":52}],50:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('./utilities');

var ReasoningEngine = function () {
    /**
     * @constructor
     * @param {object} graph The parent Graph-class to which this ReasoningEngine belongs
     */
    function ReasoningEngine(graph) {
        _classCallCheck(this, ReasoningEngine);

        this.graph = graph;
    }

    _createClass(ReasoningEngine, [{
        key: "inferPropertiesFromSuperClasses",
        value: function inferPropertiesFromSuperClasses(superClasses) {
            var result = [];
            for (var s = 0; s < superClasses.length; s++) {
                var superClassObj = this.graph.classes[superClasses[s]];
                if (superClassObj === undefined) {
                    superClassObj = this.graph.enumerations[superClasses[s]];
                }
                if (superClassObj !== undefined) {
                    result.push.apply(result, _toConsumableArray(superClassObj["soa:hasProperty"]));
                    if (superClassObj["rdfs:subClassOf"].length !== 0) {
                        result.push.apply(result, _toConsumableArray(this.inferPropertiesFromSuperClasses(superClassObj["rdfs:subClassOf"])));
                    }
                }
            }
            return util.uniquifyArray(result);
        }
    }, {
        key: "inferImplicitSuperClasses",
        value: function inferImplicitSuperClasses(classIRI) {
            var classObj = this.graph.classes[classIRI];
            var result = [];
            if (classObj === undefined) {
                classObj = this.graph.enumerations[classIRI];
            }
            if (classObj !== undefined) {
                var _result;

                (_result = result).push.apply(_result, _toConsumableArray(classObj["rdfs:subClassOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result2;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var parentClassObj = this.graph.classes[addition[i]];
                        if (parentClassObj === undefined) {
                            parentClassObj = this.graph.enumerations[addition[i]];
                        }
                        if (parentClassObj !== undefined) {
                            var _newAddition;

                            (_newAddition = newAddition).push.apply(_newAddition, _toConsumableArray(parentClassObj["rdfs:subClassOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result2 = result).push.apply(_result2, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
            }
            return result;
        }
    }, {
        key: "inferImplicitSubClasses",
        value: function inferImplicitSubClasses(classIRI) {
            var classObj = this.graph.classes[classIRI];
            var result = [];
            if (classObj === undefined) {
                classObj = this.graph.enumerations[classIRI];
            }
            if (classObj !== undefined) {
                var _result3;

                (_result3 = result).push.apply(_result3, _toConsumableArray(classObj["soa:superClassOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result4;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var parentClassObj = this.graph.classes[addition[i]];
                        if (parentClassObj === undefined) {
                            parentClassObj = this.graph.enumerations[addition[i]];
                        }
                        if (parentClassObj !== undefined) {
                            var _newAddition2;

                            (_newAddition2 = newAddition).push.apply(_newAddition2, _toConsumableArray(parentClassObj["soa:superClassOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result4 = result).push.apply(_result4, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
                return result;
            }
            return result;
        }
    }, {
        key: "inferImplicitSuperDataTypes",
        value: function inferImplicitSuperDataTypes(dataTypeIRI) {
            var dataTypeObj = this.graph.dataTypes[dataTypeIRI];
            var result = [];
            if (dataTypeObj !== undefined) {
                var _result5;

                (_result5 = result).push.apply(_result5, _toConsumableArray(dataTypeObj["rdfs:subClassOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result6;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var parentDataTypeObj = this.graph.dataTypes[addition[i]];
                        if (parentDataTypeObj !== undefined) {
                            var _newAddition3;

                            (_newAddition3 = newAddition).push.apply(_newAddition3, _toConsumableArray(parentDataTypeObj["rdfs:subClassOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result6 = result).push.apply(_result6, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
            }
            return result;
        }
    }, {
        key: "inferImplicitSubDataTypes",
        value: function inferImplicitSubDataTypes(dataTypeIRI) {
            var dataTypeObj = this.graph.dataTypes[dataTypeIRI];
            var result = [];
            if (dataTypeObj !== undefined) {
                var _result7;

                (_result7 = result).push.apply(_result7, _toConsumableArray(dataTypeObj["soa:superClassOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result8;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var childDataTypeObj = this.graph.dataTypes[addition[i]];
                        if (childDataTypeObj !== undefined) {
                            var _newAddition4;

                            (_newAddition4 = newAddition).push.apply(_newAddition4, _toConsumableArray(childDataTypeObj["soa:superClassOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result8 = result).push.apply(_result8, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
            }
            return result;
        }
    }, {
        key: "inferSubProperties",
        value: function inferSubProperties(propertyIRI) {
            var propertyObj = this.graph.properties[propertyIRI];
            var result = [];
            if (propertyObj !== undefined) {
                var _result9;

                (_result9 = result).push.apply(_result9, _toConsumableArray(propertyObj["soa:superPropertyOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result10;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var parentPropertyObj = this.graph.properties[addition[i]];
                        if (parentPropertyObj !== undefined) {
                            var _newAddition5;

                            (_newAddition5 = newAddition).push.apply(_newAddition5, _toConsumableArray(parentPropertyObj["soa:superPropertyOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result10 = result).push.apply(_result10, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
            }
            return result;
        }
    }, {
        key: "inferSuperProperties",
        value: function inferSuperProperties(propertyIRI) {
            var propertyObj = this.graph.properties[propertyIRI];
            var result = [];
            if (propertyObj !== undefined) {
                var _result11;

                (_result11 = result).push.apply(_result11, _toConsumableArray(propertyObj["rdfs:subPropertyOf"]));
                var addition = util.copByVal(result); //make a copy
                do {
                    var _result12;

                    var newAddition = [];
                    for (var i = 0; i < addition.length; i++) {
                        var parentPropertyObj = this.graph.properties[addition[i]];
                        if (parentPropertyObj !== undefined) {
                            var _newAddition6;

                            (_newAddition6 = newAddition).push.apply(_newAddition6, _toConsumableArray(parentPropertyObj["rdfs:subPropertyOf"]));
                        }
                    }
                    newAddition = util.uniquifyArray(newAddition);
                    addition = util.copByVal(newAddition);
                    (_result12 = result).push.apply(_result12, _toConsumableArray(newAddition));
                } while (addition.length !== 0);
                result = util.uniquifyArray(result);
            }
            return result;
        }
    }]);

    return ReasoningEngine;
}();

module.exports = ReasoningEngine;

},{"./utilities":52}],51:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = require("./Graph");
var util = require("./utilities");
var nodeFetch = require("node-fetch");

var SDOAdapter = function () {
    /**
     * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
     * @constructor
     */
    function SDOAdapter() {
        _classCallCheck(this, SDOAdapter);

        this.graph = new Graph(this);
    }

    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter
     * @param {object} vocabArray - The vocabularies to add the graph, in JSON-LD format
     * @param {function|null} callback - The callback function executed at the end of the loading process
     */


    _createClass(SDOAdapter, [{
        key: "addVocabularies",
        value: async function addVocabularies(vocabArray, callback) {
            if (util.isArray(vocabArray)) {
                //check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
                for (var i = 0; i < vocabArray.length; i++) {
                    if (util.isString(vocabArray[i])) {
                        if (vocabArray[i].startsWith("www") || vocabArray[i].startsWith("http")) {
                            //assume it is a URL
                            var fetchedVocab = await this.fetchVocabularyFromURL(vocabArray[i]);
                            try {
                                await this.graph.addVocabulary(fetchedVocab);
                            } catch (e) {
                                console.log("The given URL " + vocabArray[i] + " did not contain a valid JSON-LD vocabulary.");
                            }
                        } else {
                            //assume it is a string-version of a JSON-LD
                            try {
                                await this.graph.addVocabulary(JSON.parse(vocabArray[i]));
                            } catch (e) {
                                console.log("Parsing of vocabulary string produced an invalid JSON-LD.");
                            }
                        }
                    } else if (util.isObject(vocabArray[i])) {
                        await this.graph.addVocabulary(vocabArray[i]);
                    } else {
                        //invalid argument type!
                        throw new Error("The first argument of the function must be an Array of vocabularies (JSON-LD as Object/String)");
                    }
                }
                if (callback !== null) {
                    callback();
                }
            } else {
                throw new Error("The first argument of the function must be an Array of vocabularies (JSON-LD)");
            }
        }
    }, {
        key: "fetchVocabularyFromURL",
        value: async function fetchVocabularyFromURL(url) {
            var response = await nodeFetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            var json = await response.json();
            //console.log(json);
            return json;
        }

        /**
         * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
         * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
         * @param {object|null} filter - (default = null) an optional filter for the Class creation
         * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
         */

    }, {
        key: "getClass",
        value: function getClass(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            //returns also enumerations
            return this.graph.getClass(id, filter);
        }

        /**
         * Creates an array of JS-Classes for all vocabulary Classes
         * @param {object|null} filter - (default = null) an optional filter for the Class creation
         * @returns {array} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
         */

    }, {
        key: "getAllClasses",
        value: function getAllClasses() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var classesIRIList = this.getListOfClasses(filter);
            var result = [];
            for (var i = 0; i < classesIRIList.length; i++) {
                try {
                    result.push(this.getClass(classesIRIList[i]));
                } catch (e) {}
            }
            return result;
        }

        /**
         * Creates an array of IRIs for all vocabulary Classes
         * @param {object|null} filter - (default = null) an optional filter for the List creation
         * @returns {array} An array of IRIs representing all vocabulary Classes, does not include Enumerations
         */

    }, {
        key: "getListOfClasses",
        value: function getListOfClasses() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            //do not include enumerations
            return util.applyFilter(Object.keys(this.graph.classes), filter, this.graph);
        }

        /**
         * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
         * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
         * @param {object|null} filter - (default = null) an optional filter for the Property creation
         * @returns {Property} The JS-Class representing a Property
         */

    }, {
        key: "getProperty",
        value: function getProperty(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.graph.getProperty(id, filter);
        }

        /**
         * Creates an array of JS-Classes for all vocabulary Properties
         * @param {object|null} filter - (default = null) an optional filter for the Property creation
         * @returns {array} An array of JS-Classes representing all vocabulary Properties
         */

    }, {
        key: "getAllProperties",
        value: function getAllProperties() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var propertiesIRIList = this.getListOfProperties(filter);
            var result = [];
            for (var i = 0; i < propertiesIRIList.length; i++) {
                try {
                    result.push(this.getProperty(propertiesIRIList[i]));
                } catch (e) {}
            }
            return result;
        }

        /**
         * Creates an array of IRIs for all vocabulary Properties
         * @param {object|null} filter - (default = null) an optional filter for the List creation
         * @returns {array} An array of IRIs representing all vocabulary Properties
         */

    }, {
        key: "getListOfProperties",
        value: function getListOfProperties() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return util.applyFilter(Object.keys(this.graph.properties), filter, this.graph);
        }

        /**
         * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
         * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
         * @param {object|null} filter - (default = null) an optional filter for the DataType creation
         * @returns {DataType} The JS-Class representing a DataType
         */

    }, {
        key: "getDataType",
        value: function getDataType(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.graph.getDataType(id, filter);
        }

        /**
         * Creates an array of JS-Classes for all vocabulary DataTypes
         * @param {object|null} filter - (default = null) an optional filter for the DataType creation
         * @returns {array} An array of JS-Classes representing all vocabulary DataTypes
         */

    }, {
        key: "getAllDataTypes",
        value: function getAllDataTypes() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var dataTypesIRIList = this.getListOfDataTypes(filter);
            var result = [];
            for (var i = 0; i < dataTypesIRIList.length; i++) {
                try {
                    result.push(this.getDataType(dataTypesIRIList[i]));
                } catch (e) {}
            }
            return result;
        }

        /**
         * Creates an array of IRIs for all vocabulary DataTypes
         * @param {object|null} filter - (default = null) an optional filter for the List creation
         * @returns {array} An array of IRIs representing all vocabulary DataTypes
         */

    }, {
        key: "getListOfDataTypes",
        value: function getListOfDataTypes() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return util.applyFilter(Object.keys(this.graph.dataTypes), filter, this.graph);
        }

        /**
         * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
         * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
         * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
         * @returns {Enumeration} The JS-Class representing an Enumeration
         */

    }, {
        key: "getEnumeration",
        value: function getEnumeration(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.graph.getEnumeration(id, filter);
        }

        /**
         * Creates an array of JS-Classes for all vocabulary Enumerations
         * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
         * @returns {array} An array of JS-Classes representing all vocabulary Enumerations
         */

    }, {
        key: "getAllEnumerations",
        value: function getAllEnumerations() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var enumerationsIRIList = this.getListOfEnumerations(filter);
            var result = [];
            for (var i = 0; i < enumerationsIRIList.length; i++) {
                try {
                    result.push(this.getEnumeration(enumerationsIRIList[i]));
                } catch (e) {}
            }
            return result;
        }

        /**
         * Creates an array of IRIs for all vocabulary Enumerations
         * @param {object|null} filter - (default = null) an optional filter for the List creation
         * @returns {array} An array of IRIs representing all vocabulary Enumerations
         */

    }, {
        key: "getListOfEnumerations",
        value: function getListOfEnumerations() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return util.applyFilter(Object.keys(this.graph.enumerations), filter, this.graph);
        }

        /**
         * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
         * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
         * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
         * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
         */

    }, {
        key: "getEnumerationMember",
        value: function getEnumerationMember(id) {
            var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.graph.getEnumerationMember(id, filter);
        }

        /**
         * Creates an array of JS-Classes for all vocabulary EnumerationMember
         * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
         * @returns {array} An array of JS-Classes representing all vocabulary EnumerationMember
         */

    }, {
        key: "getAllEnumerationMembers",
        value: function getAllEnumerationMembers() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
            var result = [];
            for (var i = 0; i < enumerationMembersIRIList.length; i++) {
                try {
                    result.push(this.getEnumerationMember(enumerationMembersIRIList[i]));
                } catch (e) {}
            }
            return result;
        }

        /**
         * Creates an array of IRIs for all vocabulary EnumerationMember
         * @param {object|null} filter - (default = null) an optional filter for the List creation
         * @returns {array} An array of IRIs representing all vocabulary EnumerationMember
         */

    }, {
        key: "getListOfEnumerationMembers",
        value: function getListOfEnumerationMembers() {
            var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return util.applyFilter(Object.keys(this.graph.enumerationMembers), filter, this.graph);
        }

        /**
         * Returns key-value pairs of the vocabularies used in this SDOAdapter
         * @returns {object} An object containing the key-value pairs representing the used vocabularies
         */

    }, {
        key: "getVocabularies",
        value: function getVocabularies() {
            var vocabKeys = Object.keys(this.graph.context);
            var result = {};
            var blacklist = ["soa", "xsd", "rdf", "rdfa", "rdfs", "dc"]; //standard vocabs that should not be exposed
            for (var i = 0; i < vocabKeys.length; i++) {
                if (util.isString(this.graph.context[vocabKeys[i]])) {
                    if (blacklist.indexOf(vocabKeys[i]) === -1) {
                        result[vocabKeys[i]] = this.graph.context[vocabKeys[i]];
                    }
                }
            }
            return result;
        }
    }]);

    return SDOAdapter;
}();

module.exports = SDOAdapter;

},{"./Graph":48,"./utilities":52,"node-fetch":24}],52:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var jsonld = require("jsonld");

/**
 * Applies a filter to the IRIs in the given Array
 * @param {array} dataArray - Array of IRIs that should be filtered
 * @param {object} filter - The filter options, which can be: "isSuperseded": T/F, "hasTermType": string/Array, "isFromVocabulary": string/Array
 * @returns {array} Array of IRIs that are in compliance with the given filter options
 */
function applyFilter(dataArray, filter, graph) {
    if (!Array.isArray(dataArray) || dataArray.length === 0 || filter === null || Object.keys(filter).length === 0) {
        return dataArray;
    }
    var result = [];
    for (var i = 0; i < dataArray.length; i++) {
        var actualTerm = graph.getTerm(dataArray[i]);
        //superseded
        if (filter.isSuperseded !== undefined) {
            if (filter.isSuperseded === false && actualTerm.isSupersededBy() !== null) {
                continue; //skip this element
            } else if (filter.isSuperseded === true && actualTerm.isSupersededBy() === null) {
                continue; //skip this element
            }
        }
        //partOf - vocabularies are given as indicators (e.g. "schema")
        if (filter.fromVocabulary !== undefined) {
            var matchFound = false;
            if (isString(filter.fromVocabulary)) {
                if (actualTerm.getIRI(true).startsWith(filter.fromVocabulary)) {
                    matchFound = true;
                }
            } else if (isArray(filter.fromVocabulary)) {
                for (var v = 0; v < filter.fromVocabulary.length; v++) {
                    if (actualTerm.getIRI(true).startsWith(filter.fromVocabulary[v])) {
                        matchFound = true;
                    }
                }
            }
            if (!matchFound) {
                continue; //skip this element
            }
        }
        //termType
        if (filter.termType !== undefined) {
            var _matchFound = false;
            var toCheck = [];
            if (isString(filter.termType)) {
                toCheck.push(filter.termType);
            } else if (isArray(filter.termType)) {
                toCheck = filter.termType;
            }
            for (var t = 0; t < toCheck.length; t++) {
                var typeIRI = void 0;
                switch (toCheck[t]) {
                    case "Class":
                        typeIRI = "rdfs:Class";
                        break;
                    case "Property":
                        typeIRI = "rdf:Property";
                        break;
                    case "Enumeration":
                        typeIRI = "schema:Enumeration";
                        break;
                    case "EnumerationMember":
                        typeIRI = "soa:EnumerationMember";
                        break;
                    case "DataType":
                        typeIRI = "schema:DataType";
                        break;
                    default:
                        console.log("Invalid filter.termType " + toCheck[t]);
                }
                if (typeIRI === actualTerm.getTermType()) {
                    _matchFound = true;
                    break;
                }
            }
            if (!_matchFound) {
                continue; //skip this element
            }
        }

        result.push(dataArray[i]);
    }
    return result;
}

function copByVal(obj) {
    if (obj === undefined) {
        return undefined; //causes error for JSON functions
    }
    return JSON.parse(JSON.stringify(obj));
}

function isObject(value) {
    if (Array.isArray(value)) {
        return false;
    }
    if (value === undefined || value === null) {
        return false;
    }
    return (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object';
}

function isString(value) {
    if (value === undefined || value === null) {
        return false;
    }
    return typeof value === 'string' || value instanceof String;
}

function isArray(value) {
    return Array.isArray(value);
}

//make sure each string is only 1 time in the array
function uniquifyArray(array) {
    var seen = {};
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            result.push(item);
        }
    }
    return result;
}

function generateContext(currentContext, newContext) {
    var keysCurrentContext = Object.keys(currentContext);
    var keysNewContext = Object.keys(newContext);
    //add all of the old context
    var resultContext = JSON.parse(JSON.stringify(currentContext));
    //add vocabs of new context that are not already used (value is URI)
    for (var i = 0; i < keysNewContext.length; i++) {
        var actKey = keysNewContext[i];
        if (isString(newContext[actKey])) {
            //first: check if the URI is already used, with any indicator
            var foundMatch = false;
            for (var k = 0; k < keysCurrentContext.length; k++) {
                if (isString(resultContext[keysCurrentContext[k]])) {
                    if (resultContext[keysCurrentContext[k]] === newContext[actKey]) {
                        //found match, the URI is already covered
                        foundMatch = true;
                        break;
                    }
                }
            }
            if (foundMatch) {
                continue; //URI is already covered, continue with next
            }
            if (resultContext[actKey] === undefined) {
                //add new vocab indicator
                resultContext[actKey] = newContext[actKey];
            } else {
                //check if the URI is the same, if not: add new uri under new vocab indicator
                if (resultContext[actKey] !== newContext[actKey]) {
                    var foundFreeName = false;
                    var counter = 1;
                    while (foundFreeName === false) {
                        var newVocabIndicator = actKey + counter++;
                        if (resultContext[newVocabIndicator] === undefined) {
                            foundFreeName = true;
                            resultContext[newVocabIndicator] = newContext[actKey];
                        }
                    }
                }
            }
        }
    }
    //sort vocab URIs by alphabet
    var ordered = {};
    Object.keys(resultContext).sort().forEach(function (key) {
        ordered[key] = resultContext[key];
    });
    //reorder context: Vocab Indicators first (value = string), then term handlers (value = object)
    resultContext = ordered;
    var keysResultContext = Object.keys(resultContext);
    var orderedResultContext = {};
    //add the Vocab Indicators (value = string)
    for (var _i = 0; _i < keysResultContext.length; _i++) {
        if (isString(resultContext[keysResultContext[_i]])) {
            orderedResultContext[keysResultContext[_i]] = resultContext[keysResultContext[_i]];
        }
    }
    //add the term handlers (value = object)
    for (var _i2 = 0; _i2 < keysResultContext.length; _i2++) {
        if (isObject(resultContext[keysResultContext[_i2]])) {
            orderedResultContext[keysResultContext[_i2]] = resultContext[keysResultContext[_i2]];
        }
    }
    return orderedResultContext;
}

async function preProcessVocab(vocab, newContext) {
    //recursively put all nodes from inner @graphs to the outermost @graph (is the case for older schema.jsonld versions)
    var foundInnerGraph = false;
    do {
        var newGraph = [];
        foundInnerGraph = false;
        for (var i = 0; i < vocab["@graph"].length; i++) {
            if (vocab["@graph"][i]["@graph"] !== undefined) {
                newGraph.push.apply(newGraph, _toConsumableArray(copByVal(vocab["@graph"][i]["@graph"]))); //copy all elements of the inner @graph into the outer @graph
                foundInnerGraph = true;
            } else {
                newGraph.push(copByVal(vocab["@graph"][i])); //copy this element to the outer @graph
            }
        }
        vocab["@graph"] = copByVal(newGraph);
    } while (foundInnerGraph === true);
    //expand to remove the old context
    //compact to apply the new context (which is supposed to have been merged before with the old context through the function generateContext())
    return await jsonld.compact((await jsonld.expand(vocab)), newContext);
}

function curateNode(vocabNode, vocabularies) {
    if (vocabNode["rdfs:comment"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:comment"])) {
            //standard -> "en"
            vocabNode["rdfs:comment"] = {
                "en": vocabNode["rdfs:comment"]
            };
        } else if (isObject(vocabNode["rdfs:comment"])) {

            var newVal = {};
            newVal[vocabNode["rdfs:comment"]["@language"]] = vocabNode["rdfs:comment"]["@value"];
            vocabNode["rdfs:comment"] = copByVal(newVal);
        } else if (isArray(vocabNode["rdfs:comment"])) {
            var _newVal = {};
            for (var i = 0; i < vocabNode["rdfs:comment"].length; i++) {
                if (isObject(vocabNode["rdfs:comment"][i])) {
                    _newVal[vocabNode["rdfs:comment"][i]["@language"]] = vocabNode["rdfs:comment"][i]["@value"];
                }
            }
            vocabNode["rdfs:comment"] = copByVal(_newVal);
        }
    } else {
        vocabNode["rdfs:comment"] = {};
    }
    if (vocabNode["rdfs:label"] !== undefined) {
        //make a vocab object with "en" as the standard value
        if (isString(vocabNode["rdfs:label"])) {
            //"rdfs:label": "transcript"
            //standard -> "en"
            vocabNode["rdfs:label"] = {
                "en": vocabNode["rdfs:label"]
            };
        } else if (isObject(vocabNode["rdfs:label"])) {
            //"rdfs:label": {
            //   "@language": "en",
            //   "@value": "translationOfWork"
            // }
            var _newVal2 = {};
            _newVal2[vocabNode["rdfs:label"]["@language"]] = vocabNode["rdfs:label"]["@value"];
            vocabNode["rdfs:label"] = copByVal(_newVal2);
        } else if (isArray(vocabNode["rdfs:label"])) {
            //"rdfs:label": [{
            //   "@language": "en",
            //   "@value": "translationOfWork"
            // },
            // {
            //   "@language": "de",
            //   "@value": "UebersetzungsArbeit"
            // }
            // ]
            var _newVal3 = {};
            for (var _i3 = 0; _i3 < vocabNode["rdfs:label"].length; _i3++) {
                if (isObject(vocabNode["rdfs:label"][_i3])) {
                    _newVal3[vocabNode["rdfs:label"][_i3]["@language"]] = vocabNode["rdfs:label"][_i3]["@value"];
                }
            }
            vocabNode["rdfs:label"] = copByVal(_newVal3);
        }
    } else {
        vocabNode["rdfs:label"] = {};
    }
    //make arrays for some terms in any case
    if (isString(vocabNode["rdfs:subClassOf"])) {
        vocabNode["rdfs:subClassOf"] = [vocabNode["rdfs:subClassOf"]];
    } else if (vocabNode["rdfs:subClassOf"] === undefined && vocabNode["@type"] === "rdfs:Class") {
        vocabNode["rdfs:subClassOf"] = [];
    }
    if (isString(vocabNode["rdfs:subPropertyOf"])) {
        vocabNode["rdfs:subPropertyOf"] = [vocabNode["rdfs:subPropertyOf"]];
    } else if (vocabNode["rdfs:subPropertyOf"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["rdfs:subPropertyOf"] = [];
    }
    if (isString(vocabNode["schema:domainIncludes"])) {
        vocabNode["schema:domainIncludes"] = [vocabNode["schema:domainIncludes"]];
    } else if (vocabNode["schema:domainIncludes"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["schema:domainIncludes"] = [];
    }
    if (isString(vocabNode["schema:rangeIncludes"])) {
        vocabNode["schema:rangeIncludes"] = [vocabNode["schema:rangeIncludes"]];
    } else if (vocabNode["schema:rangeIncludes"] === undefined && vocabNode["@type"] === "rdf:Property") {
        vocabNode["schema:rangeIncludes"] = [];
    }
    if (!isString(vocabNode["schema:isPartOf"])) {
        var vocabKeys = Object.keys(vocabularies);
        var vocab = void 0;
        for (var _i4 = 0; _i4 < vocabKeys.length; _i4++) {
            if (vocabNode["@id"].substring(0, vocabNode["@id"].indexOf(":")) === vocabKeys[_i4]) {
                vocab = vocabularies[vocabKeys[_i4]];
                break;
            }
        }
        if (vocab !== undefined) {
            var newChange = void 0;
            do {
                newChange = false;
                if (vocab.endsWith("/") || vocab.endsWith("#")) {
                    vocab = vocab.substring(0, vocab.length - 1);
                    newChange = true;
                }
            } while (newChange === true);
            vocabNode["schema:isPartOf"] = vocab;
        }
    }
    return vocabNode;
}

/*
term - A term is a short word defined in a context that MAY be expanded to an IRI
compact IRI - A compact IRI is has the form of prefix:suffix and is used as a way of expressing an IRI without needing to define separate term definitions for each IRI contained within a common vocabulary identified by prefix.
prefix - A prefix is the first component of a compact IRI which comes from a term that maps to a string that, when prepended to the suffix of the compact IRI results in an absolute IRI.*/

function toCompactIRI(absoluteIRI, context) {
    var terms = Object.keys(context);
    for (var i = 0; i < terms.length; i++) {
        var vocabIRI = context[terms[i]];
        if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI)) {
            return terms[i] + ":" + absoluteIRI.substring(vocabIRI.length);
        }
    }
    return null;
}

function toAbsoluteIRI(compactIRI, context) {
    var terms = Object.keys(context);
    for (var i = 0; i < terms.length; i++) {
        var vocabIRI = context[terms[i]];
        if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
            return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
        }
    }
    return null;
}

module.exports = {
    applyFilter: applyFilter,
    copByVal: copByVal,
    isArray: isArray,
    isString: isString,
    isObject: isObject,
    uniquifyArray: uniquifyArray,
    preProcessVocab: preProcessVocab,
    generateContext: generateContext,
    curateNode: curateNode,
    toCompactIRI: toCompactIRI,
    toAbsoluteIRI: toAbsoluteIRI
};

},{"jsonld":18}]},{},[51])(51)
});
