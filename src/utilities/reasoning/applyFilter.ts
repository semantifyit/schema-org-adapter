import { FilterParamObj } from "../../types/types";
import { uniquifyArray } from "../general/uniquifyArray";
import { toArray } from "../general/toArray";
import { isTermTypeLabelValue, TermTypeLabelValue } from "../../data/namespaces";
import { Term } from "../../classes/Term";
import { FilterObject } from "../../types/FilterObject.type";
import { Graph } from "../../classes/Graph";
import { getSchemaModuleMatch, isSchemaModule, SchemaModule } from "../../data/schemaModules";
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

  let terms = createTermInstances(uniquifyArray(data), graph);
  terms = filterTermType(terms, usedFilter.termType, false);
  terms = filterTermType(terms, usedFilter.termTypeExclude, true);
  terms = filterFromVocabulary(terms, usedFilter.fromVocabulary, graph, false);
  terms = filterFromVocabulary(terms, usedFilter.fromVocabularyExclude, graph, true);
  terms = filterSuperseded(terms, usedFilter);
  terms = filterSchemaModule(terms, usedFilter.schemaModule, false);
  terms = filterSchemaModule(terms, usedFilter.schemaModuleExclude, true);
  return terms.map(t => t.getIRI("Compact"));
}

// removes all IRIs from terms that are not present in the current graph and returns term instances for those valid
// (in order to apply most of the filters, we need the actual instances of the terms)
function createTermInstances(data: string[], graph: Graph) {
  const result: Term[] = [];
  for (const termIri of data) {
    try {
      result.push(graph.getTerm(termIri,{})); // empty filter to avoid recursion
    } catch (e) {
      // term doesn't exist, we filter them out
    }
  }
  return result;
}

// filters the given terms based on their vocabulary namespace
// parameter "fromVocabularyFilter" is the value of the filter "fromVocabulary" or "fromVocabularyExclude"
function filterFromVocabulary(terms: Term[], fromVocabularyFilter: undefined | string | string[], graph: Graph, excludeCheck: boolean) {
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
  const result: Term[] = [];
  for (const term of terms) {
    const termIri = term.getIRI("Compact");
    const matchFound = namespaces.some(ns => termIri.startsWith(ns + ":"));
    if (matchFound && !excludeCheck) {
      result.push(term);
    } else if (!matchFound && excludeCheck) {
      result.push(term);
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
  // check if an invalid term type has been given in the filter
  const invalidTermType = termTypeArray.find(
    (el) => !isTermTypeLabelValue(el)
  );
  if (invalidTermType) {
    throw new Error("Invalid filter.termType " + invalidTermType);
  }

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
  // check if an invalid schema module has been given in the filter
  const invalidSchemaModule = schemaModuleArray.find(
    (el) => !isSchemaModule(el)
  );
  if (invalidSchemaModule) {
    throw new Error("Invalid filter.schemaModule " + invalidSchemaModule);
  }

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
