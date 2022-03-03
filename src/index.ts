// reexport as named-object for Node
export * as SOA from "./dist";
// reexport all types and interfaces that could be used by the user
export * from "./types";
export {
  TermTypeLabel,
  TermTypeIRI,
  TermType,
  TermTypeIRIValue,
  TermTypeLabelValue,
} from "./namespaces";
