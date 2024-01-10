import { Class } from "./Class";
import { Property } from "./Property";
import { Enumeration } from "./Enumeration";
import { EnumerationMember } from "./EnumerationMember";
import { DataType } from "./DataType";
import { SDOAdapter } from "./SDOAdapter";
import { Context, TermMemory, Vocabulary, VocabularyNode } from "../types/types";
import { FilterObject } from "../types/FilterObject.type";
import { OutputIRIType } from "../types/OutputIRIType.type";
export declare class Graph {
    sdoAdapter: SDOAdapter;
    context: Context;
    outputFormat: OutputIRIType;
    classes: TermMemory;
    properties: TermMemory;
    dataTypes: TermMemory;
    enumerations: TermMemory;
    enumerationMembers: TermMemory;
    constructor(sdoAdapter: SDOAdapter, outputFormat?: OutputIRIType);
    addVocabulary(vocab: Vocabulary, vocabURL?: string): Promise<boolean>;
    addGraphNode(memory: Record<string, VocabularyNode>, newNode: VocabularyNode, vocabURL?: string): boolean;
    getTerm(id: string, filter?: FilterObject): Class | Enumeration | EnumerationMember | Property | DataType;
    getClass(id: string, filter?: FilterObject): Class;
    getProperty(id: string, filter?: FilterObject): Property;
    getDataType(id: string, filter?: FilterObject): DataType;
    getEnumeration(id: string, filter?: FilterObject): Enumeration;
    getEnumerationMember(id: string, filter?: FilterObject): EnumerationMember;
    discoverCompactIRI(input: string): string | null;
    containsLabel(termObj: VocabularyNode, label: string): boolean;
}
//# sourceMappingURL=Graph.d.ts.map