"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMergeAddIds = void 0;
const isNil_1 = require("../general/isNil");
function nodeMergeAddIds(oldNode, newNode, property) {
    if (!(0, isNil_1.isNil)(newNode[property])) {
        for (const arrayElement of newNode[property]) {
            if (!oldNode[property].includes(arrayElement)) {
                oldNode[property].push(arrayElement);
            }
        }
    }
}
exports.nodeMergeAddIds = nodeMergeAddIds;
//# sourceMappingURL=nodeMergeAddIds.js.map