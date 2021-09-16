export = Term;
declare class Term {
    /**
     * A vocabulary term. It is identified by its IRI.
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Term
     * @param {Graph} graph - The underlying data graph to enable the methods of this Term
     */
    constructor(IRI: string, graph: Graph);
    IRI: string;
    graph: Graph;
    util: typeof import("./utilities");
    /**
     * Retrieves the IRI (@id) of this Term in compact/absolute form
     *
     * @param {boolean} [compactForm = false] - if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday" (default: false)
     * @returns {string} The IRI (@id) of this Term
     */
    getIRI(compactForm?: boolean): string;
    /**
     * Retrieves the term type (@type) of this Term
     *
     * @abstract
     * @returns {string} The term type of this Term
     */
    getTermType(): string;
    /**
     * Retrieves the term object of this Term
     *
     * @abstract
     * @returns {string} The term object of this Term
     */
    getTermObj(): string;
    /**
     * Retrieves the original vocabulary urls of this Term
     *
     * @returns {Array|null} The original vocabulary urls of this Term
     */
    getVocabURLs(): any[] | null;
    /**
     * Retrieves the original vocabulary (schema:isPartOf) of this Term
     *
     * @returns {?string} The vocabulary IRI given by the "schema:isPartOf" of this Term
     */
    getVocabulary(): string | null;
    /**
     * Retrieves the source (dc:source) of this Term
     *
     * @returns {string|Array|null} The source IRI given by the "dc:source" of this Term (null if none)
     */
    getSource(): string | any[] | null;
    /**
     * Retrieves the Term superseding (schema:supersededBy) this Term
     *
     * @returns {?string} The Term superseding this Term (null if none)
     */
    isSupersededBy(): string | null;
    /**
     * Retrieves the name (rdfs:label) of this Term in a wished language (optional)
     *
     * @param {string} [language = en] - the wished language for the name (default = "en")
     * @returns {?string} The name of this Term (null if not given for specified language)
     */
    getName(language?: string): string | null;
    /**
     * Retrieves the description (rdfs:comment) of this Term in a wished language (optional)
     *
     * @param {string} [language = en] - the wished language for the description (default = "en")
     * @returns {?string} The description of this Term (null if not given for specified language)
     */
    getDescription(language?: string): string | null;
    /**
     * Generates a string representation of this Term (Based on its JSON representation)
     *
     * @returns {string} The string representation of this Term
     */
    toString(): string;
    /**
     * Generates a JSON representation of this Term
     *
     * @returns {object} The JSON representation of this Term
     */
    toJSON(): object;
}
import Graph = require("./Graph");
