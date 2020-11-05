// the functions for a term Object
const util = require('./utilities');

class Term {
    /**
     * A vocabulary term. It is identified by its IRI.
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Term
     * @param {Graph} graph - The underlying data graph to enable the methods of this Term
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Term in compact/absolute form
     *
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday"
     * @returns {string} The IRI (@id) of this Term
     */
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        }
        return util.toAbsoluteIRI(this.IRI, this.graph.context);
    }

    /**
     * Retrieves the term type (@type) of this Term
     *
     * @abstract
     * @returns {string} The term type of this Term
     */
    getTermType() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * Retrieves the term object of this Term
     *
     * @abstract
     * @returns {string} The term object of this Term
     */
    getTermObj() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * Retrieves the original vocabulary urls of this Term
     *
     * @returns {Array|null} The original vocabulary urls of this Term
     */
    getVocabURLs() {
        let termObj = this.getTermObj();
        if (!util.isNil(termObj['vocabURLs'])) {
            return termObj['vocabURLs'];
        }
        return null;
    }

    /**
     * Retrieves the original vocabulary (schema:isPartOf) of this Term
     *
     * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Term
     */
    getVocabulary() {
        let termObj = this.getTermObj();
        if (!util.isNil(termObj['schema:isPartOf'])) {
            return termObj['schema:isPartOf'];
        }
        return null;
    }

    /**
     * Retrieves the source (dc:source) of this Term
     *
     * @returns {string|Array|null} The source IRI given by the "dc:source" of this Term (null if none)
     */
    getSource() {
        let termObj = this.getTermObj();
        if (!util.isNil(termObj['dc:source'])) {
            return termObj['dc:source'];
        } else if (!util.isNil(termObj['schema:source'])) {
            return termObj['schema:source'];
        }
        return null;
    }

    /**
     * Retrieves the Term superseding (schema:supersededBy) this Term
     *
     * @returns {string|null} The Term superseding this Term (null if none)
     */
    isSupersededBy() {
        let termObj = this.getTermObj();
        if (util.isString(termObj['schema:supersededBy'])) {
            return termObj['schema:supersededBy'];
        }
        return null;
    }

    /**
     * Retrieves the name (rdfs:label) of this Term in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the name
     * @returns {string|null} The name of this Term (null if not given for specified language)
     */
    getName(language = 'en') {
        let termObj = this.getTermObj()['rdfs:label'];
        if (util.isNil(termObj) || util.isNil(termObj[language])) {
            return null;
        }
        return termObj[language];
    }

    /**
     * Retrieves the description (rdfs:comment) of this Term in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the description
     * @returns {string|null} The description of this Term (null if not given for specified language)
     */
    getDescription(language = 'en') {
        let termObj = this.getTermObj()['rdfs:comment'];
        if (util.isNil(termObj) || util.isNil(termObj[language])) {
            return null;
        }
        return termObj[language];
    }

    /**
     * Generates a string representation of this Term (Based on its JSON representation)
     *
     * @returns {string} The string representation of this Term
     */
    toString() {
        return JSON.stringify(this.toJSON(false, null), null, 2);
    }

    /**
     * Generates a JSON representation of this Term
     *
     * @returns {object} The JSON representation of this Term
     */
    toJSON() {
        const result = {};
        result['id'] = this.getIRI(true);
        result['IRI'] = this.getIRI();
        result['vocabURLs'] = this.getVocabURLs();
        result['type'] = this.getTermType();
        result['vocabulary'] = this.getVocabulary();
        result['source'] = this.getSource();
        result['supersededBy'] = this.isSupersededBy();
        result['name'] = this.getName();
        result['description'] = this.getDescription();
        return result;
    }
}

module.exports = Term;
