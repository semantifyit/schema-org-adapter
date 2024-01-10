"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMergeLanguageTerm = void 0;
const isNil_1 = require("../general/isNil");
function nodeMergeLanguageTerm(oldNode, newNode, property) {
    if (!(0, isNil_1.isNil)(newNode[property])) {
        const langKeys = Object.keys(newNode[property]);
        for (const actLangKey of langKeys) {
            oldNode[property][actLangKey] = newNode[property][actLangKey];
        }
    }
}
exports.nodeMergeLanguageTerm = nodeMergeLanguageTerm;
//# sourceMappingURL=nodeMergeLanguageTerm.js.map