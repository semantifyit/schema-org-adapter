import { Context, Vocabulary } from "../../types/types";
import { isString } from "../general/isString";
import { switchIRIProtocol } from "../general/switchIRIProtocol";
import { NS } from "../../data/namespaces";
import { checkIfNamespaceFromListIsUsed } from "./checkIfNamespaceFromListIsUsed";

/** @ignore
 * Checks if the given vocabulary uses terms (in context or content) that are present in the current given context but with another protocol (http/https), and returns those in a list
 *
 * @param currentContext - the current context
 * @param vocabulary - the vocabulary to be analyzed
 * @returns an array with the found equate namespaces
 */
export function discoverEquateNamespaces(
  currentContext: Context,
  vocabulary: Vocabulary
): string[] {
  const result: Set<string> = new Set();
  // 1. Make List of protocol switched namespaces from the current context
  const protocolSwitchedNamespaces: string[] = [];
  Object.values(currentContext).forEach(function (el) {
    if (isString(el)) {
      protocolSwitchedNamespaces.push(switchIRIProtocol(el));
    }
  });
  // 2. Look in vocabulary context if any protocol switched namespaces are present
  if (vocabulary["@context"]) {
    Object.values(vocabulary["@context"]).forEach(function (el) {
      if (isString(el) && protocolSwitchedNamespaces.includes(el)) {
        result.add(el);
      }
    });
  }
  // 3. Look in vocabulary content if any protocol switched namespaces are present (everywhere, where @ids are expected)
  if (Array.isArray(vocabulary["@graph"])) {
    vocabulary["@graph"].forEach(function (vocabNode) {
      checkIfNamespaceFromListIsUsed(
        vocabNode["@id"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["@type"],
        protocolSwitchedNamespaces,
        result
      );
      // super class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.rdfs.subClassOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://www.w3.org/2000/01/rdf-schema#subClassOf"],
        protocolSwitchedNamespaces,
        result
      );
      // domain class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.domainIncludes],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/domainIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/domainIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      // range class
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.rangeIncludes],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/rangeIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/rangeIncludes"],
        protocolSwitchedNamespaces,
        result
      );
      // super property
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.rdfs.subPropertyOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://www.w3.org/2000/01/rdf-schema#subPropertyOf"],
        protocolSwitchedNamespaces,
        result
      );
      // inverse property
      checkIfNamespaceFromListIsUsed(
        vocabNode[NS.schema.inverseOf],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["http://schema.org/inverseOf"],
        protocolSwitchedNamespaces,
        result
      );
      checkIfNamespaceFromListIsUsed(
        vocabNode["https://schema.org/inverseOf"],
        protocolSwitchedNamespaces,
        result
      );
    });
  }
  return Array.from(result);
}
