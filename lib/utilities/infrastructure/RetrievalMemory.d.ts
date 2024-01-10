import { CacheLiteral } from "../../types/types";
export declare class RetrievalMemory {
    private static instance;
    private cache;
    private constructor();
    static getInstance(): RetrievalMemory;
    setData(dataId: string, data: CacheLiteral, commit?: string): void;
    getData(dataId: string, commit?: string): CacheLiteral | undefined;
    deleteCache(): void;
}
//# sourceMappingURL=RetrievalMemory.d.ts.map