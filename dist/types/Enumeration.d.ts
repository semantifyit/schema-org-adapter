export = Enumeration;
declare class Enumeration extends Class {
    /**
     * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
     *
     * @param {boolean} implicit - (default = false) retrieves also implicit enumeration members (inheritance from sub-enumerations)
     * @param {object|null} filter - (default = null) an optional filter for the enumeration members
     * @returns {string[]} The enumeration members of this Enumeration
     */
    getEnumerationMembers(implicit?: boolean, filter?: object | null): string[];
}
import Class = require("./Class");
