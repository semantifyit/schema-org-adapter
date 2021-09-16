// the functions for a enumeration member Object
const Term = require("./Term");

/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */

class EnumerationMember extends Term {
  /**
   * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
   *
   * @class
   * @param {string} IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
   * @param {Graph} graph - The underlying data graph to enable the methods of this EnumerationMember
   */
  constructor(IRI, graph) {
    super(IRI, graph);
  }

  /**
   * Retrieves the term type (@type) of this EnumerationMember (is always "schema:Enumeration")
   *
   * @returns {string} The term type of this EnumerationMember -> "soa:EnumerationMember" //there is no explicit type for enumeration members in the Schema.org Meta, so we use our own definition
   */
  getTermType() {
    return "soa:EnumerationMember";
  }

  /**
   * Retrieves the term object of this Enumeration Member
   *
   * @returns {string} The term object of this Enumeration Member
   */
  getTermObj() {
    return this.graph.enumerationMembers[this.IRI];
  }

  /**
   * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
   *
   * @param {boolean} [implicit = true] - retrieves also implicit domain enumerations (inheritance from super-enumerations) - (default = false)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The domain enumerations of this EnumerationMember
   */
  getDomainEnumerations(implicit = false, filter = undefined) {
    let enumObj = this.getTermObj();
    let result = [];
    result.push(...enumObj["soa:enumerationDomainIncludes"]);
    if (implicit) {
      let domainEnumerationsToCheck = this.util.copByVal(result);
      for (const actDE of domainEnumerationsToCheck) {
        result.push(...this.graph.reasoner.inferSuperClasses(actDE));
      }
      result = this.util.applyFilter(
        this.util.uniquifyArray(result),
        { termType: "Enumeration" },
        this.graph
      );
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Generates a JSON representation of this EnumerationMember
   *
   * @param {boolean} [implicit = true] - includes also implicit data - (default = false)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {object} The JSON representation of this EnumerationMember
   */
  toJSON(implicit = false, filter = undefined) {
    const result = super.toJSON();
    result["domainEnumerations"] = this.getDomainEnumerations(implicit, filter);
    return result;
  }
}

module.exports = EnumerationMember;
