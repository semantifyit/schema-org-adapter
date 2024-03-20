import { TermTypeIRI, TermTypeLabel, TermTypeLabelValue } from "../../data/namespaces";
import { isString } from "../general/isString";
import { isArray } from "../general/isArray";

// returns the identified type for the given vocabulary node (expected in the input vocabulary)
// classes ("@type" = "rdfs:Class")
// properties ("@type" = "rdf:Property")
// dataTypes ("@type" = "rdfs:Class" + "schema:DataType")
// enumerations ("@type" = "rdfs:Class", has "schema:Enumeration" as implicit superclass)
// enumerationMembers ("@type" = @id(s) of enumeration(s))
export function checkVocabNodeType(types: unknown): TermTypeLabelValue {
  if (isString(types)) {
    if (types === TermTypeIRI.class) {
      return TermTypeLabel.class;
    }
    if (types === TermTypeIRI.property) {
      return TermTypeLabel.property;
    }
    // @type is not something expected -> assume enumerationMember
    return TermTypeLabel.enumerationMember;
  } else if (isArray(types)) {
    // @type is not a string -> datatype or enumeration member
    // [
    //     "rdfs:Class",
    //     "schema:DataType"
    // ]
    // [
    //   "schema:MedicalImagingTechnique",
    //   "schema:MedicalSpecialty"
    // ]
    if (types.length === 2 && types.includes(TermTypeIRI.class) && types.includes(TermTypeIRI.dataType)) {
      return TermTypeLabel.dataType;
    } else {
      // @type is not something expected -> assume enumerationMember
      return TermTypeLabel.enumerationMember;
    }
  }
  throw new Error("Unexpected @type format: " + types);
}
