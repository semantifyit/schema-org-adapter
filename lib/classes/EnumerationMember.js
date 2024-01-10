"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumerationMember = void 0;
const Term_1 = require("./Term");
const namespaces_1 = require("../data/namespaces");
const cloneJson_1 = require("../utilities/general/cloneJson");
const inferSuperClasses_1 = require("../utilities/reasoning/inferSuperClasses");
const applyFilter_1 = require("../utilities/reasoning/applyFilter");
const filterAndTransformIRIList_1 = require("../utilities/general/filterAndTransformIRIList");
class EnumerationMember extends Term_1.Term {
    constructor(IRI, graph) {
        super(IRI, graph);
        this.termTypeLabel = namespaces_1.TermTypeLabel.enumerationMember;
        this.termTypeIRI = namespaces_1.TermTypeIRI.enumerationMember;
    }
    getTermObj() {
        return this.graph.enumerationMembers[this.IRI];
    }
    getDomainEnumerations(paramObj) {
        const enumObj = this.getTermObj();
        let result = [];
        result.push(...enumObj[namespaces_1.NS.soa.enumerationDomainIncludes]);
        if (!((paramObj === null || paramObj === void 0 ? void 0 : paramObj.implicit) === false)) {
            const domainEnumerationsToCheck = (0, cloneJson_1.cloneJson)(result);
            for (const actDE of domainEnumerationsToCheck) {
                result.push(...(0, inferSuperClasses_1.inferSuperClasses)(actDE, this.graph));
            }
            result = (0, applyFilter_1.applyFilter)({
                data: result,
                filter: { termType: namespaces_1.TermTypeLabel.enumeration },
                graph: this.graph
            });
        }
        return (0, filterAndTransformIRIList_1.filterAndTransformIRIList)(result, this.graph, paramObj);
    }
    toString(paramObj) {
        return JSON.stringify(this.toJSON(paramObj), null, 2);
    }
    toJSON(paramObj) {
        const result = super.toJSON();
        result["domainEnumerations"] = this.getDomainEnumerations(paramObj);
        return result;
    }
    isValidEnumerationMemberOf(enumerationId, implicit = true) {
        const e = this.graph.getEnumeration(enumerationId);
        return this.getDomainEnumerations({ implicit, outputFormat: "Compact" }).includes(e.getIRI("Compact"));
    }
}
exports.EnumerationMember = EnumerationMember;
//# sourceMappingURL=EnumerationMember.js.map