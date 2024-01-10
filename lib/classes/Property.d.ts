import { Term } from "./Term";
import { ToJsonProperty, VocabularyNode } from "../types/types";
import { Graph } from "./Graph";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { OutputIRIType } from "../types/OutputIRIType.type";
export declare class Property extends Term {
    readonly termTypeLabel: "Property";
    readonly termTypeIRI: "rdf:Property";
    constructor(IRI: string, graph: Graph);
    getTermObj(): VocabularyNode;
    getRanges(paramObj?: ParamObjIRIListInference): string[];
    getDomains(paramObj?: ParamObjIRIListInference): string[];
    getSuperProperties(paramObj?: ParamObjIRIListInference): string[];
    getSubProperties(paramObj?: ParamObjIRIListInference): string[];
    getInverseOf(outputIRIType?: OutputIRIType): string | null;
    toString(paramObj?: ParamObjIRIListInference): string;
    toJSON(paramObj?: ParamObjIRIListInference): ToJsonProperty;
    isValidDomain(domainId: string, implicit?: boolean): boolean;
    isValidRange(rangeId: string, implicit?: boolean): boolean;
    isValidSuperPropertyOf(subPropertyId: string, implicit?: boolean): boolean;
    isValidSubPropertyOf(superPropertyId: string, implicit?: boolean): boolean;
    isValidInverseOf(inversePropertyId: string): boolean;
}
//# sourceMappingURL=Property.d.ts.map