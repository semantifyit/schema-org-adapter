// the functions for a enumeration Object
const Class = require("./Class");

/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */

class Enumeration extends Class {
  /**
   * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI
   *
   * @class
   * @param {string} IRI - The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek"
   * @param {Graph} graph - The underlying data graph to enable the methods of this Enumeration
   */
  constructor(IRI, graph) {
    super(IRI, graph);
  }

  /**
   * Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")
   *
   * @returns {string} The term type of this Enumeration -> "schema:Enumeration"
   */
  getTermType() {
    return "schema:Enumeration";
  }

  /**
   * Retrieves the term object of this Enumeration
   *
   * @returns {string} The term object of this Enumeration
   */
  getTermObj() {
    return this.graph.enumerations[this.IRI];
  }

  /**
   * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
   *
   * @param {boolean} [implicit = true] - retrieves also implicit enumeration members (inheritance from sub-enumerations) - (default = false)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The enumeration members of this Enumeration
   */
  getEnumerationMembers(implicit = false, filter = undefined) {
    const result = [];
    result.push(...this.getTermObj()["soa:hasEnumerationMember"]);
    if (implicit) {
      const subClasses = this.getSubClasses(true);
      for (const actSubClass of subClasses) {
        const actualEnumeration = this.graph.enumerations[actSubClass];
        if (!this.util.isNil(actualEnumeration)) {
          result.push(...actualEnumeration["soa:hasEnumerationMember"]);
        }
      }
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Generates an explicit/implicit JSON representation of this Enumeration
   *
   * @param {boolean} [implicit = true] - includes also implicit data - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {object} The JSON representation of this Enumeration
   */
  toJSON(implicit = true, filter = undefined) {
    const result = super.toJSON(implicit, filter);
    result.enumerationMembers = this.getEnumerationMembers(implicit, filter);
    return result;
  }
}

module.exports = Enumeration;
