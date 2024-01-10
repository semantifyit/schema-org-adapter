// the functions for an enumeration member Object
import { Term } from "./Term";
import { Graph } from "./Graph";
import { ToJsonEnumerationMember, VocabularyNode } from "../types/types";
import { NS, TermTypeIRI, TermTypeLabel } from "../data/namespaces";
import { cloneJson } from "../utilities/general/cloneJson";
import { inferSuperClasses } from "../utilities/reasoning/inferSuperClasses";
import { applyFilter } from "../utilities/reasoning/applyFilter";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";

/**
 * An **EnumerationMember** represents an enumeration instance term. The understanding of SDO-Adapter for Classes, Enumerations and Enumeration Members is described in the {@link Enumeration | Enumeration page}. An EnumerationMember is created with {@link SDOAdapter.getEnumerationMember | SDOAdapter.getEnumerationMember()} and offers the methods described below.
 * ```JS
 * // following EnumerationMember instance is used in the code examples below
 * const mondayEM = mySdoAdapter.getEnumerationMember("schema:Monday");
 * // it is also possible to create an EnumerationMember instance with an absolute IRI or a label
 * const mondayEM2 = mySdoAdapter.getEnumerationMember("https://schema.org/Monday");
 * const mondayEM3 = mySdoAdapter.getEnumerationMember("Monday");
 * ```
 */
export class EnumerationMember extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.enumerationMember;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.enumerationMember;

  /** @ignore
   * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its compact IRI
   *
   * @param IRI - The compact IRI of this EnumerationMember, e.g. "schema:Friday"
   * @param graph - The underlying data graph to enable the methods of this EnumerationMember
   */
  constructor(IRI: string, graph: Graph) {
    super(IRI, graph);
  }

  /** @ignore
   * Retrieves the term object of this Enumeration Member
   *
   * @returns The term object of this Enumeration Member
   */
  getTermObj(): VocabularyNode {
    return this.graph.enumerationMembers[this.IRI];
  }

  /**
   * Retrieves the Enumerations for which this EnumerationMember is a valid instance - typically there is only one domain Enumeration
   *
   * @example
   * ```JS
   * mondayEM.getDomainEnumerations();
   * // returns the Enumerations for which "schema:Monday" is a valid Enumeration Member
   * [
   *   "schema:DayOfWeek",
   * ]
   * ```
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit domain enumerations inherited from super-enumerations
   * @returns  The domain enumerations of this EnumerationMember
   */
  getDomainEnumerations(paramObj?: ParamObjIRIListInference): string[] {
    const enumObj = this.getTermObj();
    let result = [];
    result.push(...enumObj[NS.soa.enumerationDomainIncludes]);
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      const domainEnumerationsToCheck = cloneJson(result);
      for (const actDE of domainEnumerationsToCheck) {
        result.push(...inferSuperClasses(actDE, this.graph));
      }
      // filter results by taking only enumerations (Thing is also a superclass, but we don't want it in the list of super-enumerations)
      result = applyFilter({
        data: result,
        filter: { termType: TermTypeLabel.enumeration },
        graph: this.graph
      });
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Generates a JSON representation of this EnumerationMember (as string)
   *
   * Check {@link toJSON | .toJSON()} for an example output
   *
   * @example
   * ```JS
   * mondayEM.toString();
   * ```
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. domain enumerations)
   * @returns The JSON representation of this EnumerationMember as string
   */
  toString(paramObj?: ParamObjIRIListInference): string {
    return JSON.stringify(this.toJSON(paramObj), null, 2);
  }

  /**
   * Generates a JSON representation of this EnumerationMember (as JavaScript Object)
   *
   * @example
   * ```JS
   * mondayEM.toJSON();
   * // returns a JSON representing the EnumerationMember "schema:Monday"
   * {
   *  "id": "schema:Monday",
   *  "IRI": "https://schema.org/Monday",
   *  "typeLabel": "EnumerationMember",
   *  "typeIRI": "soa:EnumerationMember",
   *  "vocabURLs": [ "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/12.0/schemaorg-all-https.jsonld" ],
   *  "vocabulary": "https://schema.org",
   *  "source": null,
   *  "supersededBy": null,
   *  "name": "Monday",
   *  "description": "The day of the week between Sunday and Tuesday.",
   *  "domainEnumerations": [ "schema:DayOfWeek" ]
   * }
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. domain enumerations)
   * @returns The JSON representation of this EnumerationMember as JavaScript Object
   */
  toJSON(paramObj?: ParamObjIRIListInference): ToJsonEnumerationMember {
    const result = super.toJSON() as ToJsonEnumerationMember;
    result["domainEnumerations"] = this.getDomainEnumerations(paramObj);
    return result;
  }

  /**
   * Returns true, if this Enumeration Member is a valid instance for the given Enumeration. The implicit parameter (default: true) allows to include super-enumerations of domain enumerations
   * @example
   * ```JS
   * eventPostponedEM.isValidEnumerationMemberOf("schema:name"); // true
   * eventPostponedEM.isValidEnumerationMemberOf("schema:StatusEnumeration", true); // true
   * eventPostponedEM.isValidEnumerationMemberOf("schema:StatusEnumeration", false); // false, since only direct members are considered
   * ```
   *
   * @param enumerationId - The identification string of the domain enumeration in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, include super-enumerations of domain enumerations
   * @returns if this Enumeration Member is a valid instance of the given Enumeration
   */
  isValidEnumerationMemberOf(enumerationId: string, implicit = true): boolean {
    const e = this.graph.getEnumeration(enumerationId);
    return this.getDomainEnumerations({ implicit, outputFormat: "Compact" }).includes(e.getIRI("Compact"));
  }
}
