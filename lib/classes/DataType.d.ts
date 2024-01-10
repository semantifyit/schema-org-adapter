import { Term } from "./Term";
import { ToJsonDataType, VocabularyNode } from "../types/types";
import { Graph } from "./Graph";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
export declare class DataType extends Term {
    readonly termTypeLabel: "DataType";
    readonly termTypeIRI: "schema:DataType";
    constructor(IRI: string, graph: Graph);
    getTermObj(): VocabularyNode;
    getSuperDataTypes(paramObj?: ParamObjIRIListInference): string[];
    getSubDataTypes(paramObj?: ParamObjIRIListInference): string[];
    isRangeOf(paramObj?: ParamObjIRIListInference): string[];
    toJSON(paramObj?: ParamObjIRIListInference): ToJsonDataType;
    toString(paramObj?: ParamObjIRIListInference): string;
    isValidSuperDataTypeOf(subDataTypeId: string, implicit?: boolean): boolean;
    isValidSubDataTypeOf(superDataTypeId: string, implicit?: boolean): boolean;
    isValidRangeOf(propertyId: string, implicit?: boolean): boolean;
}
//# sourceMappingURL=DataType.d.ts.map