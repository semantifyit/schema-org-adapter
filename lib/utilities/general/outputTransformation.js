"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputTransformation = void 0;
const toAbsoluteIRI_1 = require("./toAbsoluteIRI");
const isString_1 = require("./isString");
const isArray_1 = require("./isArray");
function outputTransformation(input, graph, outputFormat) {
    const format = outputFormat ? outputFormat : graph.outputFormat;
    if (format === "Compact") {
        return input;
    }
    if ((0, isString_1.isString)(input)) {
        return (0, toAbsoluteIRI_1.toAbsoluteIRI)(input, graph.context);
    }
    else if ((0, isArray_1.isArray)(input) && input.every((s) => (0, isString_1.isString)(s))) {
        return input.map((s) => (0, toAbsoluteIRI_1.toAbsoluteIRI)(s, graph.context));
    }
    throw new Error("Wrong input type! - must be string or array of strings");
}
exports.outputTransformation = outputTransformation;
//# sourceMappingURL=outputTransformation.js.map