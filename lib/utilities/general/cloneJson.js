"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneJson = void 0;
function cloneJson(input) {
    if (input === undefined) {
        return input;
    }
    return JSON.parse(JSON.stringify(input));
}
exports.cloneJson = cloneJson;
//# sourceMappingURL=cloneJson.js.map