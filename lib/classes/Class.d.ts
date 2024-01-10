import { Term } from "./Term";
import { Graph } from "./Graph";
import { ToJsonClass, VocabularyNode } from "../types/types";
import { TermTypeIRIValue, TermTypeLabelValue } from "../data/namespaces";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
export declare class Class extends Term {
    readonly termTypeLabel: TermTypeLabelValue;
    readonly termTypeIRI: TermTypeIRIValue;
    constructor(IRI: string, graph: Graph);
    getTermObj(): VocabularyNode;
    getProperties(paramObj?: ParamObjIRIListInference): string[];
    getSuperClasses(paramObj?: ParamObjIRIListInference): string[];
    getSubClasses(paramObj?: ParamObjIRIListInference): string[];
    isRangeOf(paramObj?: ParamObjIRIListInference): string[];
    toString(paramObj?: ParamObjIRIListInference): string;
    toJSON(paramObj?: ParamObjIRIListInference): ToJsonClass;
    isValidSubClassOf(superClassId: string, implicit?: boolean): boolean;
    isValidSuperClassOf(subClassId: string, implicit?: boolean): boolean;
    isValidRangeOf(propertyId: string, implicit?: boolean): boolean;
    isValidDomainOf(propertyId: string, implicit?: boolean): boolean;
}
//# sourceMappingURL=Class.d.ts.map