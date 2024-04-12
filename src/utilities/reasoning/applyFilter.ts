import { FilterParamObj } from "../../types/types";
import { uniquifyArray } from "../general/uniquifyArray";
import { toArray } from "../general/toArray";
import { TermTypeLabelValue } from "../../data/namespaces";
import { Term } from "../../classes/Term";
import { FilterObject } from "../../types/FilterObject.type";
import { Graph } from "../../classes/Graph";
import { getSchemaModuleMatch, SchemaModule } from "../../data/schemaModules";
import { checkFilterValidity } from "./checkFilterValidity";

/** @ignore
 * Applies a filter to the compact IRIs in the given Array
 *
 * @param paramObj - A parameter object holding: data, filter, and graph
 * @returns Array of IRIs that are in compliance with the given filter options
 */
export function applyFilter(paramObj: FilterParamObj): string[] {
  const { data, filter, graph } = paramObj;
  let usedFilter = filter;
  if (!usedFilter && graph.defaultFilter) {
    usedFilter = graph.defaultFilter;
  }
  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !usedFilter ||
    Object.keys(usedFilter).length === 0
  ) {
    return uniquifyArray(data);
  }
  checkFilterValidity(usedFilter);
  let result = uniquifyArray(data);

  // can be filtered only with compact IRI
  result = filterFromVocabulary(result, usedFilter.fromVocabulary, graph, false);
  result = filterFromVocabulary(result, usedFilter.fromVocabularyExclude, graph, true);

  const { createdTerms, unavailableTerms } = createTermInstances(result, graph);

  // must be filtered with Term instance
  let filteredTerms = filterTermType(createdTerms, usedFilter.termType, false);
  filteredTerms = filterTermType(filteredTerms, usedFilter.termTypeExclude, true);
  filteredTerms = filterSuperseded(filteredTerms, usedFilter);
  filteredTerms = filterSchemaModule(filteredTerms, usedFilter.schemaModule, false);
  filteredTerms = filterSchemaModule(filteredTerms, usedFilter.schemaModuleExclude, true);
  const filteredTermIRIs = filteredTerms.map(t => t.getIRI("Compact"));

  // final filter depends on the strict mode (keep the original order of IRIs !!)
  // strict -> allow only terms where we can ensure that the filters apply (term instance needed)
  const strictFilter = (iris: string []) => iris.filter(iri => filteredTermIRIs.includes(iri));
  // non-strict -> allow also terms where we can't know if they match (no term instances available)
  const nonStrictFilter = (iris: string []) => iris.filter(iri => filteredTermIRIs.includes(iri) || unavailableTerms.includes(iri));

  if (usedFilter.strictMode === false) {
    return nonStrictFilter(result);
  } else {
    // default is strict
    return strictFilter(result);
  }
}

// creates term instances for the compact IRIs given that are present in the vocabulary
// returns unavailable terms as a string array
function createTermInstances(data: string[], graph: Graph) {
  const createdTerms: Term[] = [];
  const unavailableTerms: string[] = [];
  for (const termIri of data) {
    try {
      createdTerms.push(graph.getTerm(termIri, {})); // empty filter to avoid recursion
    } catch (e) {
      // term doesn't exist, -> unavailable
      unavailableTerms.push(termIri);
    }
  }
  return { createdTerms, unavailableTerms };
}

// filters the given compact IRIs based on their vocabulary namespace
// parameter "fromVocabularyFilter" is the value of the filter "fromVocabulary" or "fromVocabularyExclude"
function filterFromVocabulary(terms: string[], fromVocabularyFilter: undefined | string | string[], graph: Graph, excludeCheck: boolean) {
  if (!fromVocabularyFilter) {
    return terms;
  }
  const context = graph.context;
  const namespaces = toArray(fromVocabularyFilter);
  // check if given value is absolute IRI, if yes, get the vocab indicator for it
  // replace the namespace URLs with their compact IRIs (according to the context)
  for (let v = 0; v < namespaces.length; v++) {
    for (let vi = 0; vi < Object.keys(context).length; vi++) {
      if (context[Object.keys(context)[vi]] === namespaces[v]) {
        namespaces[v] = Object.keys(context)[vi];
        break;
      }
    }
  }
  // namespaces are given as vocabulary indicators at this point (e.g. "schema")
  const result: string[] = [];
  for (const termIri of terms) {
    const matchFound = namespaces.some(ns => termIri.startsWith(ns + ":"));
    if (matchFound && !excludeCheck) {
      result.push(termIri);
    } else if (!matchFound && excludeCheck) {
      result.push(termIri);
    }
  }
  return result;
}

// filters the given terms based on their superseded status
function filterSuperseded(terms: Term[], filter: FilterObject) {
  if (filter.isSuperseded === undefined) {
    return terms;
  }
  const result: Term[] = [];
  for (const term of terms) {
    if (!filter.isSuperseded && term.isSupersededBy() === null) {
      result.push(term);
    } else if (filter.isSuperseded && term.isSupersededBy() !== null) {
      result.push(term);
    }
  }
  return result;
}

// filters the given terms based on their term-types
// parameter "termTypeFilter" is the value of the filter "termType" or "termTypeExclude"
function filterTermType(terms: Term[], termTypeFilter: undefined | TermTypeLabelValue | TermTypeLabelValue[], excludeCheck: boolean) {
  if (termTypeFilter === undefined) {
    return terms;
  }
  const termTypeArray = toArray(termTypeFilter);
  const result: Term[] = [];
  for (const term of terms) {
    // check if the type of the term matches any of the filtered types
    if (
      (termTypeArray.includes(term.getTermTypeLabel()) && !excludeCheck) ||
      (!termTypeArray.includes(term.getTermTypeLabel()) && excludeCheck)
    ) {
      result.push(term);
    }
  }
  return result;
}

// filters the given terms based on their schema module (only terms from schema.org are filtered here)
// parameter "schemaModuleFilter" is the value of the filter "schemaModule" or "schemaModuleExclude"
function filterSchemaModule(terms: Term[], schemaModuleFilter: undefined | SchemaModule | SchemaModule[], excludeCheck: boolean) {
  if (schemaModuleFilter === undefined) {
    return terms;
  }
  const schemaModuleArray = toArray(schemaModuleFilter);
  const result: Term[] = [];
  for (const term of terms) {
    const schemaModuleMatch = getSchemaModuleMatch(term.getVocabulary());
    // if no schema Module is present (e.g. external vocabularies) then the term is NOT filtered out
    // else check if the schema module of the term matches any of the filtered schema modules
    if (
      !schemaModuleMatch ||
      (schemaModuleArray.includes(schemaModuleMatch) && !excludeCheck) ||
      (!schemaModuleArray.includes(schemaModuleMatch) && excludeCheck)
    ) {
      result.push(term);
    }
  }
  return result;
}
