import { Graph } from "./Graph";
import { cloneJson, toArray, uniquifyArray } from "./utilities";
import { RDFS, SOA, TermTypeLabel, TermTypeLabelValue } from "./namespaces";
import { FilterParamObj } from "./types";

// This file offers reasoning-related functions that can be used by the other js-classes of this library

/** @ignore
 * Applies a filter to the IRIs in the given Array
 *
 * @param paramObj - A parameter object holding: data, filter, and graph
 * @returns Array of IRIs that are in compliance with the given filter options
 */
export function applyFilter(paramObj: FilterParamObj): string[] {
  const { data, filter, graph } = paramObj;
  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !filter ||
    Object.keys(filter).length === 0
  ) {
    return data;
  }
  const unifiedDataArray = uniquifyArray(data);
  const result = [];
  // check if given value is absolute IRI, if yes, get the vocab indicator for it
  const context = graph.context;
  let namespaces;
  if (filter.fromVocabulary) {
    namespaces = toArray(filter.fromVocabulary);
    // replace the namespace URLs with their compact IRIs
    for (let v = 0; v < namespaces.length; v++) {
      for (let vi = 0; vi < Object.keys(context).length; vi++) {
        if (context[Object.keys(context)[vi]] === namespaces[v]) {
          namespaces[v] = Object.keys(context)[vi];
          break;
        }
      }
    }
  }
  // check for every term, if it passes the filter conditions
  for (let i = 0; i < unifiedDataArray.length; i++) {
    const actualTerm = graph.getTerm(unifiedDataArray[i]);
    if (!actualTerm) {
      continue; // skip this term if it is not known
    }

    // superseded
    if (filter.isSuperseded !== undefined) {
      if (!filter.isSuperseded && actualTerm.isSupersededBy() != null) {
        continue; // skip this element
      } else if (filter.isSuperseded && actualTerm.isSupersededBy() == null) {
        continue; // skip this element
      }
    }
    // partOf - vocabularies are given as indicators (e.g. "schema")
    if (namespaces) {
      let matchFound = false;
      for (let v = 0; v < namespaces.length; v++) {
        if (actualTerm.getIRI(true).startsWith(namespaces[v])) {
          matchFound = true;
          break;
        }
      }
      if (!matchFound) {
        continue; // skip this element
      }
    }
    // termType
    if (filter.termType) {
      const toCheck = toArray(filter.termType);
      // check if an invalid term type has been given in the filter
      const invalidTermType = toCheck.find(
        (el) => !Object.values(TermTypeLabel).includes(el as TermTypeLabelValue)
      );
      if (invalidTermType) {
        throw new Error("Invalid filter.termType " + invalidTermType);
      }
      // check if the type of the term matches any of the filtered types
      const foundMatch = toCheck.find(
        (el) => el === actualTerm.getTermTypeLabel()
      );
      if (!foundMatch) {
        continue; // skip this element
      }
    }

    result.push(unifiedDataArray[i]);
  }
  return result;
}

/** @ignore
 * Infers all properties that can be used by the given classes and all their implicit and explicit superClasses
 *
 * @param superClasses - Array with IRIs of classes/enumerations
 * @param  graph - the graph
 * @returns {string[]} Array of IRIs of all properties from the given classes and their implicit and explicit superClasses
 */
export function inferPropertiesFromSuperClasses(
  superClasses: string[],
  graph: Graph
): string[] {
  const result = [];
  for (const superClass of superClasses) {
    const superClassObj =
      graph.classes[superClass] || graph.enumerations[superClass];
    if (superClassObj) {
      result.push(...superClassObj[SOA.hasProperty]);
      if (superClassObj[RDFS.subClassOf].length !== 0) {
        result.push(
          ...inferPropertiesFromSuperClasses(
            superClassObj[RDFS.subClassOf],
            graph
          )
        );
      }
    }
  }
  return uniquifyArray(result);
}

/** @ignore
 * Infers all implicit and explicit superClasses of a given Class/Enumeration
 *
 * @param classIRI - IRI of a Class/Enumeration
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit superClasses
 */
export function inferSuperClasses(classIRI: string, graph: Graph): string[] {
  let result = [];
  const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
  if (classObj) {
    result.push(...classObj[RDFS.subClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentClassObj =
          graph.classes[curAdd] || graph.enumerations[curAdd];
        if (parentClassObj) {
          newAddition.push(...parentClassObj[RDFS.subClassOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit subClasses of a given Class/Enumeration
 *
 * @param classIRI - IRI of a Class/Enumeration
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit subClasses
 */
export function inferSubClasses(classIRI: string, graph: Graph): string[] {
  let result = [];
  const classObj = graph.classes[classIRI] || graph.enumerations[classIRI];
  if (classObj) {
    result.push(...classObj[SOA.superClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentClassObj =
          graph.classes[curAdd] || graph.enumerations[curAdd];
        if (parentClassObj) {
          newAddition.push(...parentClassObj[SOA.superClassOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit superDataTypes of a given DataType
 *
 * @param dataTypeIRI - IRI of a DataType
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit superDataTypes
 */
export function inferSuperDataTypes(
  dataTypeIRI: string,
  graph: Graph
): string[] {
  let result = [];
  const dataTypeObj = graph.dataTypes[dataTypeIRI];
  if (dataTypeObj) {
    result.push(...dataTypeObj[RDFS.subClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentDataTypeObj = graph.dataTypes[curAdd];
        if (parentDataTypeObj) {
          newAddition.push(...parentDataTypeObj[RDFS.subClassOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit subDataTypes of a given DataType
 *
 * @param dataTypeIRI - IRI of a DataType
 * @param graph - the graph
 * @returns Array of IRI of all implicit and explicit subDataTypes
 */
export function inferSubDataTypes(dataTypeIRI: string, graph: Graph): string[] {
  let result = [];
  const dataTypeObj = graph.dataTypes[dataTypeIRI];
  if (dataTypeObj) {
    result.push(...dataTypeObj[SOA.superClassOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const childDataTypeObj = graph.dataTypes[curAdd];
        if (childDataTypeObj) {
          newAddition.push(...childDataTypeObj[SOA.superClassOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit superProperties of a given Property
 *
 * @param {string} propertyIRI - IRI of a Property
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit superProperties
 */
export function inferSuperProperties(
  propertyIRI: string,
  graph: Graph
): string[] {
  let result = [];
  const propertyObj = graph.properties[propertyIRI];
  if (propertyObj) {
    result.push(...propertyObj[RDFS.subPropertyOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentPropertyObj = graph.properties[curAdd];
        if (parentPropertyObj) {
          newAddition.push(...parentPropertyObj[RDFS.subPropertyOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit subProperties of a given Property
 *
 * @param {string} propertyIRI - IRI of a Property
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit subProperties
 */
export function inferSubProperties(
  propertyIRI: string,
  graph: Graph
): string[] {
  let result = [];
  const propertyObj = graph.properties[propertyIRI];
  if (propertyObj) {
    result.push(...propertyObj[SOA.superPropertyOf]);
    let addition = cloneJson(result); // make a copy
    do {
      let newAddition = [];
      for (const curAdd of addition) {
        const parentPropertyObj = graph.properties[curAdd];
        if (parentPropertyObj) {
          newAddition.push(...parentPropertyObj[SOA.superPropertyOf]);
        }
      }
      newAddition = uniquifyArray(newAddition);
      addition = cloneJson(newAddition);
      result.push(...newAddition);
    } while (addition.length !== 0);
    result = uniquifyArray(result);
  }
  return result;
}

/** @ignore
 * Infers all implicit and explicit properties that can have the given Class/Enumeration/DataType as range
 *
 * @param {string} rangeIRI - IRI of the range (Class/Enumeration/DataType)
 * @param graph - the graph
 * @returns {string[]} Array of IRI of all implicit and explicit properties that can use the given range
 */
export function inferRangeOf(rangeIRI: string, graph: Graph): string[] {
  const classObj = graph.classes[rangeIRI] || graph.enumerations[rangeIRI];
  const result = [];
  if (classObj) {
    result.push(...classObj[SOA.isRangeOf]);
    const superClasses = inferSuperClasses(rangeIRI, graph);
    for (const superClass of superClasses) {
      const superClassObj =
        graph.classes[superClass] || graph.enumerations[superClass];
      if (superClassObj) {
        result.push(...superClassObj[SOA.isRangeOf]);
      }
    }
  } else {
    const dataTypeObj = graph.dataTypes[rangeIRI];
    if (dataTypeObj) {
      result.push(...dataTypeObj[SOA.isRangeOf]);
      const superDataTypes = inferSuperDataTypes(rangeIRI, graph);
      for (const superDataType of superDataTypes) {
        const superDataTypeObj = graph.dataTypes[superDataType];
        if (superDataTypeObj) {
          result.push(...superDataTypeObj[SOA.isRangeOf]);
        }
      }
    }
  }
  return uniquifyArray(result);
}
