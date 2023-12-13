// reexport as named-object for Node
export * as SOA from "./dist";
// reexport all types and interfaces that could be used by the user
export * from "./types/types";
export type { FilterObject } from "./types/FilterObject.type";
export type { ParamObjCreateSdoAdapter } from "./types/ParamObjCreateSdoAdapter.type";
export {
  TermTypeLabel,
  TermTypeIRI,
  TermType,
  TermTypeIRIValue,
  TermTypeLabelValue
} from "./data/namespaces";
// export types for the classes provided for this library
export type { Class } from "./Class";
export type { DataType } from "./DataType";
export type { Property } from "./Property";
export type { Enumeration } from "./Enumeration";
export type { EnumerationMember } from "./EnumerationMember";
export type { Term } from "./Term";
export type { SDOAdapter } from "./SDOAdapter";
