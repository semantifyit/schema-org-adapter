import { FilterObject } from "../../types/FilterObject.type";
import { isString } from "../general/isString";
import { isArrayOfStrings } from "../general/isArrayOfStrings";
import { toArray } from "../general/toArray";
import { isTermTypeLabelValue } from "../../data/namespaces";
import { isSchemaModule } from "../../data/schemaModules";
import { isBoolean } from "../general/isBoolean";

// checks if the input filter has a valid format (syntax) and values (semantic)
export function checkFilterValidity(filter?: FilterObject) {
  if (!filter) {
    return;
  }
  if (filter.schemaModule !== undefined && filter.schemaModuleExclude !== undefined) {
    throw new Error("The filters schemaModule and schemaModuleExclude must not be used at the same time!");
  }
  if (filter.termType !== undefined && filter.termTypeExclude !== undefined) {
    throw new Error("The filters termType and termTypeExclude must not be used at the same time!");
  }
  if (filter.fromVocabulary !== undefined && filter.fromVocabularyExclude !== undefined) {
    throw new Error("The filters fromVocabulary and fromVocabularyExclude must not be used at the same time!");
  }
  valOrArrayOfValCheck(filter.termType, "termType", isTermTypeLabelValue);
  valOrArrayOfValCheck(filter.termTypeExclude, "termTypeExclude", isTermTypeLabelValue);
  valOrArrayOfValCheck(filter.schemaModule, "schemaModule", isSchemaModule);
  valOrArrayOfValCheck(filter.schemaModuleExclude, "schemaModuleExclude", isSchemaModule);
  valOrArrayOfValCheck(filter.fromVocabulary, "fromVocabulary");
  valOrArrayOfValCheck(filter.fromVocabularyExclude, "fromVocabularyExclude");
  if (filter.isSuperseded !== undefined && !isBoolean(filter.isSuperseded)) {
    throw new Error("The filter isSuperseded must have true or false as value");
  }
}


// checks if the given filter has a string or array of strings as value, also checks if those strings belong to a specific type
function valOrArrayOfValCheck(filterValue: unknown, filterLabel: string, valueFunction?: (s: string) => boolean) {
  if (filterValue) {
    // invalid datatype (syntax)
    if (!isString(filterValue) && !isArrayOfStrings(filterValue)) {
      throw new Error("The filter " + filterLabel + " must have a string or an array of strings as value");
    }
    // invalid value type (semantic)
    if (valueFunction) {
      const invalidValue = toArray(filterValue).find(
        (el) => !valueFunction(el)
      );
      if (invalidValue) {
        throw new Error("Invalid value for filter " + filterLabel + ":" + invalidValue);
      }
    }
  }
}
