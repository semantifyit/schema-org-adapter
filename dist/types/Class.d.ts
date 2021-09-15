export = Class;
declare class Class extends Term {
    /**
     * Retrieves the explicit/implicit properties (soa:hasProperty) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the properties
     * @returns {string[]} The properties of this Class
     */
    getProperties(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the super-classes
     * @returns {string[]} The super-classes of this Class
     */
    getSuperClasses(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-classes (recursive from sub-classes)
     * @param {object|null} filter - (default = null) an optional filter for the sub-classes
     * @returns {string[]} The sub-classes of this Class
     */
    getSubClasses(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the properties that have this Class as a range
     *
     * @param {boolean} implicit - (default = true) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {Array} The properties that have this Class as a range
     */
    isRangeOf(implicit?: boolean, filter?: object | null): any[];
}
import Term = require("./Term");
