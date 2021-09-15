export = Property;
declare class Property extends Term {
    /**
     * Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit ranges (inheritance from sub-classes of the ranges)
     * @param {object|null} filter - (default = null) an optional filter for the ranges
     * @returns {string[]} The ranges of this Property
     */
    getRanges(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit domains (inheritance from sub-classes of the domains)
     * @param {object|null} filter - (default = null) an optional filter for the domains
     * @returns {string[]} The domains of this Property
     */
    getDomains(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-properties (recursive from super-properties)
     * @param {object|null} filter - (default = null) an optional filter for the super-properties
     * @returns {string[]} The super-properties of this Property
     */
    getSuperProperties(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-properties (recursive from sub-properties)
     * @param {object|null} filter - (default = null) an optional filter for the sub-properties
     * @returns {string[]} The sub-properties of this Property
     */
    getSubProperties(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the inverse Property (schema:inverseOf) of this Property
     *
     * @returns {string} The IRI of the inverse Property of this Property
     */
    getInverseOf(): string;
}
import Term = require("./Term");
