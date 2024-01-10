"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enumeration = void 0;
const Class_1 = require("./Class");
const namespaces_1 = require("../data/namespaces");
const isNil_1 = require("../utilities/general/isNil");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
class Enumeration extends Class_1.Class {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.enumeration;
        this.termTypeIRI = namespaces_1.TermTypeIRI.enumeration;
    }
    getTermObj() {
        return this.graph.enumerations[this.IRI];
    }
    getEnumerationMembers(paramObj) {
        const result = [];
        result.push(...this.getTermObj()[namespaces_1.NS.soa.hasEnumerationMember]);
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            const subClasses = this.getSubClasses(paramObj);
            for (const actSubClass of subClasses) {
                const actualEnumeration = this.graph.enumerations[actSubClass];
                if (!(0, isNil_1.isNil)(actualEnumeration)) {
                    result.push(...actualEnumeration[namespaces_1.NS.soa.hasEnumerationMember]);
                }
            }
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    toString(paramObj) {
        return JSON.stringify(this.toJSON(paramObj), null, 2);
    }
    toJSON(paramObj) {
        const result = super.toJSON(paramObj);
        result.enumerationMembers = this.getEnumerationMembers(paramObj);
        return result;
    }
    isValidDomainEnumerationOf(enumerationMemberId, implicit = true) {
        const em = this.graph.getEnumerationMember(enumerationMemberId);
        return this.getEnumerationMembers({ implicit, outputFormat: "Compact" }).includes(em.getIRI("Compact"));
    }
}
exports.Enumeration = Enumeration;
//# sourceMappingURL=Enumeration.js.map