import { Term } from "./Term";
import { Graph } from "./Graph";
import { ToJsonEnumerationMember, VocabularyNode } from "../types/types";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
export declare class EnumerationMember extends Term {
    readonly termTypeLabel: "EnumerationMember";
    readonly termTypeIRI: "soa:EnumerationMember";
    constructor(IRI: string, graph: Graph);
    getTermObj(): VocabularyNode;
    getDomainEnumerations(paramObj?: ParamObjIRIListInference): string[];
    toString(paramObj?: ParamObjIRIListInference): string;
    toJSON(paramObj?: ParamObjIRIListInference): ToJsonEnumerationMember;
    isValidEnumerationMemberOf(enumerationId: string, implicit?: boolean): boolean;
}
//# sourceMappingURL=EnumerationMember.d.ts.map