// the functions for a data type Object
const util = require('./utilities');
const Term = require('./Term');

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
        return 'schema:DataType';
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
     * @param {boolean} implicit - (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the super-DataTypes
     * @returns {string[]} The super-DataTypes of this DataType
     */
    getSuperDataTypes(implicit = true, filter = null) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferSuperDataTypes(this.IRI));
        } else {
            result.push(...dataTypeObj['rdfs:subClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-DataTypes (recursive from sub-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the sub-DataTypes
     * @returns {string[]} The sub-DataTypes of this DataType
     */
    getSubDataTypes(implicit = true, filter = null) {
        const dataTypeObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferSubDataTypes(this.IRI));
        } else {
            result.push(...dataTypeObj['soa:superClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the properties that have this DataType as a range
     *
     * @param {boolean} implicit - (default = true) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {Array} The properties that have this DataType as a range
     */
    isRangeOf(implicit = true, filter = null) {
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferRangeOf(this.IRI));
        } else {
            result.push(...this.getTermObj()['soa:isRangeOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates an explicit/implicit JSON representation of this DataType.
     *
     * @param {boolean} implicit - (default = true) includes also implicit data (e.g. sub-DataTypes, super-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this DataType
     */
    toJSON(implicit = true, filter = null) {
        const result = super.toJSON();
        result.superDataTypes = this.getSuperDataTypes(implicit, filter);
        result.subDataTypes = this.getSubDataTypes(implicit, filter);
        result.rangeOf = this.isRangeOf(implicit, filter);
        return result;
    }
}

module.exports = DataType;
