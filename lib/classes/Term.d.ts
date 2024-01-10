import { Graph } from "./Graph";
import { ToJsonTerm, VocabularyNode } from "../types/types";
import { TermTypeIRIValue, TermTypeLabelValue } from "../data/namespaces";
import { OutputIRIType } from "../types/OutputIRIType.type";
export declare abstract class Term {
    protected readonly IRI: string;
    protected readonly graph: Graph;
    abstract readonly termTypeLabel: TermTypeLabelValue;
    abstract readonly termTypeIRI: TermTypeIRIValue;
    protected constructor(IRI: string, graph: Graph);
    getIRI(outputIRIType?: OutputIRIType): string;
    getTermTypeLabel(): TermTypeLabelValue;
    getTermTypeIRI(): TermTypeIRIValue;
    abstract getTermObj(): VocabularyNode;
    getVocabURLs(): string[] | null;
    getVocabulary(): string | null;
    getSource(): string | string[] | null;
    isSupersededBy(outputIRIType?: OutputIRIType): string | null;
    getName(language?: string): string | null;
    getDescription(language?: string): string | null;
    toString(): string;
    toJSON(): ToJsonTerm;
}
//# sourceMappingURL=Term.d.ts.map