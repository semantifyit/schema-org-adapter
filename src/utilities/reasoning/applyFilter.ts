import { FilterParamObj } from "../../types/types";
import { uniquifyArray } from "../general/uniquifyArray";
import { toArray } from "../general/toArray";
import { TermTypeLabel, TermTypeLabelValue } from "../../data/namespaces";
import { Term } from "../../classes/Term";

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
    let actualTerm: Term;
    try {
      actualTerm = graph.getTerm(unifiedDataArray[i]);
    } catch (e) {
      continue; // skip this term if it is not known
    }
    if(!actualTerm){
      console.log("ALAAAAAAAAAAAAARM")
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
        if (actualTerm.getIRI("Compact").startsWith(namespaces[v])) {
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
