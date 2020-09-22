// the functions for a data type Object
const util = require('./utilities');

class DataType {
    /**
     * A DataType represents an schema:DataType. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this DataType, e.g. "schema:Number"
     * @param {Graph} graph - The underlying data graph to enable the methods of this DataType
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this DataType in compact/absolute form
     *
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Number", if false -> return absolute IRI -> "http://schema.org/Number"
     * @returns {string} The IRI (@id) of this DataType
     */
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        }
        return util.toAbsoluteIRI(this.IRI, this.graph.context);
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
     * Retrieves the original vocabulary (schema:isPartOf) of this DataType
     *
     * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this DataType
     */
    getVocabulary() {
        const dataTypeObj = this.graph.dataTypes[this.IRI];
        if (!util.isNil(dataTypeObj['schema:isPartOf'])) {
            return dataTypeObj['schema:isPartOf'];
        }
        return null;
    }

    /**
     * Retrieves the source (dc:source) of this DataType
     *
     * @returns {string|null} The source IRI given by the "dc:source" of this DataType (null if none)
     */
    getSource() {
        const dataTypeObj = this.graph.dataTypes[this.IRI];
        if (!util.isNil(dataTypeObj['dc:source'])) {
            return dataTypeObj['dc:source'];
        } else if (!util.isNil(dataTypeObj['schema:source'])) {
            return dataTypeObj['schema:source'];
        }
        return null;
    }

    /**
     * Retrieves the DataType superseding (schema:supersededBy) this DataType
     *
     * @returns {string|null} The DataType superseding this DataType (null if none)
     */
    isSupersededBy() {
        const dataTypeObj = this.graph.dataTypes[this.IRI];
        if (util.isString(dataTypeObj['schema:supersededBy'])) {
            return dataTypeObj['schema:supersededBy'];
        }
        return null;
    }

    /**
     * Retrieves the name (rdfs:label) of this DataType in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the name
     * @returns {string|null} The name of this DataType (null if not given for specified language)
     */
    getName(language = 'en') {
        const nameObj = this.graph.dataTypes[this.IRI]['rdfs:label'];
        if (util.isNil(nameObj) || util.isNil(nameObj[language])) {
            return null;
        }
        return nameObj[language];
    }

    /**
     * Retrieves the description (rdfs:comment) of this DataType in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the description
     * @returns {string|null} The description of this DataType (null if not given for specified language)
     */
    getDescription(language = 'en') {
        const descriptionObj = this.graph.dataTypes[this.IRI]['rdfs:comment'];
        if (util.isNil(descriptionObj) || util.isNil(descriptionObj[language])) {
            return null;
        }
        return descriptionObj[language];
    }

    /**
     * Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the super-DataTypes
     * @returns {string[]} The super-DataTypes of this DataType
     */
    getSuperDataTypes(implicit = true, filter = null) {
        const dataTypeObj = this.graph.dataTypes[this.IRI];
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
        const dataTypeObj = this.graph.dataTypes[this.IRI];
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferSubDataTypes(this.IRI));
        } else {
            result.push(...dataTypeObj['soa:superClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates a string representation of this DataType (Based on its JSON representation)
     *
     * @returns {string} The string representation of this DataType
     */
    toString() {
        return JSON.stringify(this.toJSON(false, null), null, 2);
    }

    /**
     * Generates an explicit/implicit JSON representation of this DataType.
     *
     * @param {boolean} implicit - (default = true) includes also implicit data (e.g. sub-DataTypes, super-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this DataType
     */
    toJSON(implicit = true, filter = null) {
        const result = {};
        result.id = this.getIRI(true);
        result.IRI = this.getIRI();
        result.type = this.getTermType();
        result.vocabulary = this.getVocabulary();
        result.source = this.getSource();
        result.supersededBy = this.isSupersededBy();
        result.name = this.getName();
        result.description = this.getDescription();
        result.superDataTypes = this.getSuperDataTypes(implicit, filter);
        result.subDataTypes = this.getSubDataTypes(implicit, filter);
        return result;
    }
}

module.exports = DataType;
