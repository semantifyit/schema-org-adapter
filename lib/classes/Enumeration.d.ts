import { Class } from "./Class";
import { Graph } from "./Graph";
import { ToJsonEnumeration, VocabularyNode } from "../types/types";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
export declare class Enumeration extends Class {
    readonly termTypeLabel: "Enumeration";
    readonly termTypeIRI: "schema:Enumeration";
    constructor(IRI: string, graph: Graph);
    getTermObj(): VocabularyNode;
    getEnumerationMembers(paramObj?: ParamObjIRIListInference): string[];
    toString(paramObj?: ParamObjIRIListInference): string;
    toJSON(paramObj?: ParamObjIRIListInference): ToJsonEnumeration;
    isValidDomainEnumerationOf(enumerationMemberId: string, implicit?: boolean): boolean;
}
//# sourceMappingURL=Enumeration.d.ts.map