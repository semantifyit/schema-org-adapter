// the functions for a enumeration member Object
import { Term } from "./Term";
import { Graph } from "./Graph";
import { cloneJson } from "./utilities";
import { FilterObject, ToJsonEnumerationMember, VocabularyNode } from "./types";
import { applyFilter, inferSuperClasses } from "./reasoning";
import { SOA, TermTypeIRI, TermTypeLabel } from "./namespaces";

/**
 * An **EnumerationMember** represents an enumeration instance term. The understanding of SDO-Adapter for Classes, Enumerations and Enumeration Members is described in the {@link Enumeration | Enumeration page}. An EnumerationMember is created with {@link SDOAdapter.getEnumerationMember | SDOAdapter.getEnumerationMember()} and offers the methods described below.
 * ```JS
 * // following getEnumerationMember instance is used in the code examples below
 * const mondayEM = mySdoAdapter.getEnumerationMember("schema:Monday");
 * ```
 */
export class EnumerationMember extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.enumerationMember;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.enumerationMember;

  /** @ignore
   * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
   *
   * @param IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
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
   *
   * @param implicit - If true, includes also implicit data (inheritance from super-enumerations)
   * @param filter - The filter to be applied on the result
   * @returns  The domain enumerations of this EnumerationMember
   */
  getDomainEnumerations(implicit = true, filter?: FilterObject): string[] {
    const enumObj = this.getTermObj();
    let result = [];
    result.push(...enumObj[SOA.enumerationDomainIncludes]);
    if (implicit) {
      const domainEnumerationsToCheck = cloneJson(result);
      for (const actDE of domainEnumerationsToCheck) {
        result.push(...inferSuperClasses(actDE, this.graph));
      }
      result = applyFilter({
        data: result,
        filter: { termType: TermTypeLabel.enumeration },
        graph: this.graph,
      });
    }
    return applyFilter({ data: result, filter, graph: this.graph });
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
   *
   * @param implicit - If true, includes also implicit data (e.g. domain enumerations)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this EnumerationMember as string
   */
  toString(implicit = true, filter?: FilterObject): string {
    return JSON.stringify(this.toJSON(implicit, filter), null, 2);
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
   * @param implicit - If true, include also implicit data. (e.g. domain enumerations)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this EnumerationMember as JavaScript Object
   */
  toJSON(implicit = true, filter?: FilterObject): ToJsonEnumerationMember {
    const result = super.toJSON() as ToJsonEnumerationMember;
    result["domainEnumerations"] = this.getDomainEnumerations(implicit, filter);
    return result;
  }
}
