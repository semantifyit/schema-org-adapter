import { VersionsFile } from "../types/types";
export declare function constructURLSchemaVocabulary(version?: string, schemaHttps?: boolean, commit?: string): Promise<string>;
export declare function fetchSchemaVersions(cacheClear?: boolean, commit?: string): Promise<VersionsFile>;
export declare function getLatestSchemaVersion(commit?: string): Promise<string>;
//# sourceMappingURL=Infrastructure.d.ts.map