import { ErrorFunction, Vocabulary } from "./types";
import { OutputIRIType } from "./OutputIRIType.type";
export declare type ParamObjCreateSdoAdapter = {
    commit?: string;
    schemaHttps?: boolean;
    equateVocabularyProtocols?: boolean;
    onError?: ErrorFunction;
    vocabularies?: (Vocabulary | string)[];
    schemaVersion?: string;
    outputFormat?: OutputIRIType;
};
//# sourceMappingURL=ParamObjCreateSdoAdapter.type.d.ts.map