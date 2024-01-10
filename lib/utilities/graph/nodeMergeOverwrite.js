"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMergeOverwrite = void 0;
const isNil_1 = require("../general/isNil");
function nodeMergeOverwrite(oldNode, newNode, property) {
    if (!(0, isNil_1.isNil)(newNode[property])) {
        oldNode[property] = newNode[property];
    }
}
exports.nodeMergeOverwrite = nodeMergeOverwrite;
//# sourceMappingURL=nodeMergeOverwrite.js.map