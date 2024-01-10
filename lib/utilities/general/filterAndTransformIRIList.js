"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAndTransformIRIList = void 0;
const outputTransformation_1 = require("./outputTransformation");
const applyFilter_1 = require("../reasoning/applyFilter");
function filterAndTransformIRIList(compactIRIList, graph, paramObj) {
    return (0, outputTransformation_1.outputTransformation)((0, applyFilter_1.applyFilter)({ data: compactIRIList, filter: paramObj === null || paramObj === void 0 ? void 0 : paramObj.filter, graph: graph }), graph, paramObj === null || paramObj === void 0 ? void 0 : paramObj.outputFormat);
}
exports.filterAndTransformIRIList = filterAndTransformIRIList;
//# sourceMappingURL=filterAndTransformIRIList.js.map