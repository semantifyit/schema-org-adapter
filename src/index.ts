// reexport as named-object for Node
export * as SOA from "./dist";
// reexport all types and interfaces that could be used by the user
export * from "./types/types";
export type { FilterObject } from "./types/FilterObject.type";
export type { ParamObjCreateSdoAdapter } from "./types/ParamObjCreateSdoAdapter.type";
export type { ParamObjIRIList } from "./types/ParamObjIRIList.type";
export type { OutputIRIType } from "./types/OutputIRIType.type";
export { TermTypeLabel, TermTypeIRI, TermType, TermTypeIRIValue, TermTypeLabelValue } from "./data/namespaces";
// export types for the classes provided for this library
export type { Class } from "./classes/Class";
export type { DataType } from "./classes/DataType";
export type { Property } from "./classes/Property";
export type { Enumeration } from "./classes/Enumeration";
export type { EnumerationMember } from "./classes/EnumerationMember";
export type { Term } from "./classes/Term";
export type { SDOAdapter } from "./classes/SDOAdapter";
