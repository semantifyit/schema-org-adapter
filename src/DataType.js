// the functions for a data type Object
const Term = require("./Term");

/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */

class DataType extends Term {
  /**
   * A DataType represents an schema:DataType. It is identified by its IRI
   *
   * @class
   * @param {string} IRI - The compacted IRI of this DataType, e.g. "schema:Number"
   * @param {Graph} graph - The underlying data graph to enable the methods of this DataType
   */
  constructor(IRI, graph) {
    super(IRI, graph);
  }

  /**
   * Retrieves the term type (@type) of this DataType (is always "schema:DataType")
   *
   * @returns {string} The term type of this DataType -> "schema:DataType"
   */
  getTermType() {
    return "schema:DataType";
  }

  /**
   * Retrieves the term object of this DataType
   *
   * @returns {string} The term object of this DataType
   */
  getTermObj() {
    return this.graph.dataTypes[this.IRI];
  }

  /**
   * Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType
   *
   * @param {boolean} [implicit = true] - retrieves also implicit super-DataTypes (recursive from super-DataTypes) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The super-DataTypes of this DataType
   */
  getSuperDataTypes(implicit = true, filter = undefined) {
    const dataTypeObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...this.graph.reasoner.inferSuperDataTypes(this.IRI));
    } else {
      result.push(...dataTypeObj["rdfs:subClassOf"]);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType
   *
   * @param {boolean} [implicit = true] - retrieves also implicit sub-DataTypes (recursive from sub-DataTypes) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The sub-DataTypes of this DataType
   */
  getSubDataTypes(implicit = true, filter = undefined) {
    const dataTypeObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...this.graph.reasoner.inferSubDataTypes(this.IRI));
    } else {
      result.push(...dataTypeObj["soa:superClassOf"]);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Retrieves the properties that have this DataType as a range
   *
   * @param {boolean} [implicit = true] - includes also implicit data - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {string[]} The properties that have this DataType as a range
   */
  isRangeOf(implicit = true, filter = undefined) {
    const result = [];
    if (implicit) {
      result.push(...this.graph.reasoner.inferRangeOf(this.IRI));
    } else {
      result.push(...this.getTermObj()["soa:isRangeOf"]);
    }
    return this.util.applyFilter(
      this.util.uniquifyArray(result),
      filter,
      this.graph
    );
  }

  /**
   * Generates an explicit/implicit JSON representation of this DataType.
   *
   * @param {boolean} [implicit = true]  - includes also implicit data (e.g. sub-DataTypes, super-DataTypes) - (default = true)
   * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
   * @returns {object} The JSON representation of this DataType
   */
  toJSON(implicit = true, filter = undefined) {
    const result = super.toJSON();
    result.superDataTypes = this.getSuperDataTypes(implicit, filter);
    result.subDataTypes = this.getSubDataTypes(implicit, filter);
    result.rangeOf = this.isRangeOf(implicit, filter);
    return result;
  }
}

module.exports = DataType;
