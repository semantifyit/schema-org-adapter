// the functions for a property Object
const Term = require("./Term");

/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */

class Property extends Term {
  /**
   * A Property represents an rdf:Property. It is identified by its IRI
   *
   * @class
   * @param {string} IRI - The compacted IRI of this Property, e.g. "schema:address"
   * @param {Graph} graph - The underlying data graph to enable the methods of this Property
   */
  constructor(IRI, graph) {
    super(IRI, graph);
  }

  /**
   * Retrieves the term type of this Property (is always "rdf:Property")
   *
   * @returns {string} The term type of this Property -> "rdf:Property"
   */
  getTermType() {
    return "rdf:Property";
  }

  /**
   * Retrieves the term object of this Property
   *
   * @returns {string} The term object of this Property
   */
  getTermObj() {
    return this.graph.properties[this.IRI];
  }

  /**
   * Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property
   *
   * @param {boolean} [implicit = true] - retrieves also implicit ranges (inheritance from sub-classes of the ranges) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The ranges of this Property
   */
  getRanges(implicit = true, filter = undefined) {
    let propertyObj = this.getTermObj();
    let result = [];
    result.push(...propertyObj["schema:rangeIncludes"]);
    if (implicit) {
      // add sub-classes and sub-datatypes from ranges
      for (const actRes of result) {
        result.push(...this.graph.reasoner.inferSubDataTypes(actRes));
      }
      for (const actRes of result) {
        result.push(...this.graph.reasoner.inferSubClasses(actRes));
      }
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property
   *
   * @param {boolean} [implicit = true] - retrieves also implicit domains (inheritance from sub-classes of the domains) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The domains of this Property
   */
  getDomains(implicit = true, filter = undefined) {
    let propertyObj = this.getTermObj();
    let result = [];
    result.push(...propertyObj["schema:domainIncludes"]);
    if (implicit) {
      // add sub-classes from ranges
      let inferredSubClasses = [];
      for (const actRes of result) {
        inferredSubClasses.push(...this.graph.reasoner.inferSubClasses(actRes));
      }
      result.push(...inferredSubClasses);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property
   *
   * @param {boolean} [implicit = true] - retrieves also implicit super-properties (recursive from super-properties) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The super-properties of this Property
   */
  getSuperProperties(implicit = true, filter = undefined) {
    let propertyObj = this.getTermObj();
    let result = [];

    if (implicit) {
      result.push(...this.graph.reasoner.inferSuperProperties(this.IRI));
    } else {
      result.push(...propertyObj["rdfs:subPropertyOf"]);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property
   *
   * @param {boolean} [implicit = true] - retrieves also implicit sub-properties (recursive from sub-properties) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The sub-properties of this Property
   */
  getSubProperties(implicit = true, filter = undefined) {
    let propertyObj = this.getTermObj();
    let result = [];

    if (implicit) {
      result.push(...this.graph.reasoner.inferSubProperties(this.IRI));
    } else {
      result.push(...propertyObj["soa:superPropertyOf"]);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the inverse Property (schema:inverseOf) of this Property
   *
   * @returns {string} The IRI of the inverse Property of this Property
   */
  getInverseOf() {
    let propertyObj = this.getTermObj();
    return propertyObj["schema:inverseOf"];
  }

  /**
   * Generates an explicit/implicit JSON representation of this Property.
   *
   * @param {boolean} [implicit = true] - includes also implicit data (e.g. domains, ranges, etc.) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {object} The JSON representation of this Class
   */
  toJSON(implicit = true, filter = undefined) {
    const result = super.toJSON();
    result["ranges"] = this.getRanges(implicit, filter);
    result["domains"] = this.getDomains(implicit, filter);
    result["superProperties"] = this.getSuperProperties(implicit, filter);
    result["subProperties"] = this.getSubProperties(implicit, filter);
    result["inverseOf"] = this.getInverseOf();
    return result;
  }
}

module.exports = Property;
