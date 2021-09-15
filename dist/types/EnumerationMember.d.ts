export = EnumerationMember;
declare class EnumerationMember extends Term {
    /**
     * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
     *
     * @param {boolean} implicit - (default = false) retrieves also implicit domain enumerations (inheritance from super-enumerations)
     * @param {object|null} filter - (default = null) an optional filter for the domain enumerations
     * @returns {string[]} The domain enumerations of this EnumerationMember
     */
    getDomainEnumerations(implicit?: boolean, filter?: object | null): string[];
}
import Term = require("./Term");
