"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievalMemory = void 0;
const cloneJson_1 = require("../general/cloneJson");
class RetrievalMemory {
    constructor() {
        this.cache = new Map();
    }
    static getInstance() {
        if (!RetrievalMemory.instance) {
            RetrievalMemory.instance = new RetrievalMemory();
        }
        return RetrievalMemory.instance;
    }
    setData(dataId, data, commit = "standard") {
        let entry = this.cache.get(commit);
        if (!entry) {
            entry = {};
            this.cache.set(commit, entry);
        }
        entry[dataId] = (0, cloneJson_1.cloneJson)(data);
    }
    getData(dataId, commit = "standard") {
        const entry = this.cache.get(commit);
        if (entry) {
            return (0, cloneJson_1.cloneJson)(entry[dataId]);
        }
        return undefined;
    }
    deleteCache() {
        this.cache = new Map();
    }
}
exports.RetrievalMemory = RetrievalMemory;
//# sourceMappingURL=RetrievalMemory.js.map