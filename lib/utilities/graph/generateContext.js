"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContext = void 0;
const cloneJson_1 = require("../general/cloneJson");
const isString_1 = require("../general/isString");
const isObject_1 = require("../general/isObject");
function generateContext(currentContext, newContext) {
    const keysCurrentContext = Object.keys(currentContext);
    const keysNewContext = Object.keys(newContext);
    let resultContext = (0, cloneJson_1.cloneJson)(currentContext);
    for (const keyNC of keysNewContext) {
        if ((0, isString_1.isString)(newContext[keyNC])) {
            let foundMatch = false;
            for (const keyCC of keysCurrentContext) {
                if ((0, isString_1.isString)(resultContext[keyCC])) {
                    if (resultContext[keyCC] === newContext[keyNC]) {
                        foundMatch = true;
                        break;
                    }
                }
            }
            if (foundMatch) {
                continue;
            }
            if (!resultContext[keyNC]) {
                resultContext[keyNC] = newContext[keyNC];
            }
            else {
                if (resultContext[keyNC] !== newContext[keyNC]) {
                    let foundFreeName = false;
                    let counter = 1;
                    while (!foundFreeName) {
                        const newVocabIndicator = keyNC + counter++;
                        if (!resultContext[newVocabIndicator]) {
                            foundFreeName = true;
                            resultContext[newVocabIndicator] = newContext[keyNC];
                        }
                    }
                }
            }
        }
    }
    const ordered = {};
    Object.keys(resultContext)
        .sort()
        .forEach(function (key) {
        ordered[key] = resultContext[key];
    });
    resultContext = ordered;
    const keysResultContext = Object.keys(resultContext);
    const orderedResultContext = {};
    for (const keyRC of keysResultContext) {
        if ((0, isString_1.isString)(resultContext[keyRC])) {
            orderedResultContext[keyRC] = resultContext[keyRC];
        }
    }
    for (const keyRC of keysResultContext) {
        if ((0, isObject_1.isObject)(resultContext[keyRC])) {
            orderedResultContext[keyRC] = resultContext[keyRC];
        }
    }
    return orderedResultContext;
}
exports.generateContext = generateContext;
//# sourceMappingURL=generateContext.js.map