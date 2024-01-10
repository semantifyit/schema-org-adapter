"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preProcessVocab = void 0;
const cloneJson_1 = require("../general/cloneJson");
const jsonld_1 = __importDefault(require("jsonld"));
async function preProcessVocab(vocab, newContext) {
    let foundInnerGraph = false;
    do {
        const newGraph = [];
        foundInnerGraph = false;
        for (let i = 0; i < vocab["@graph"].length; i++) {
            if (vocab["@graph"][i]["@graph"] !== undefined) {
                newGraph.push(...(0, cloneJson_1.cloneJson)(vocab["@graph"][i]["@graph"]));
                foundInnerGraph = true;
            }
            else {
                newGraph.push((0, cloneJson_1.cloneJson)(vocab["@graph"][i]));
            }
        }
        vocab["@graph"] = (0, cloneJson_1.cloneJson)(newGraph);
    } while (foundInnerGraph);
    const compactedVocab = await jsonld_1.default.compact(vocab, newContext);
    if (compactedVocab["@graph"] === undefined) {
        delete compactedVocab["@context"];
        return {
            "@context": newContext,
            "@graph": [compactedVocab],
        };
    }
    else {
        return compactedVocab;
    }
}
exports.preProcessVocab = preProcessVocab;
//# sourceMappingURL=preProcessVocab.js.map