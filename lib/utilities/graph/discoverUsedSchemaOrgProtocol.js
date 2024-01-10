"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverUsedSchemaOrgProtocol = void 0;
const isObject_1 = require("../general/isObject");
const isString_1 = require("../general/isString");
function discoverUsedSchemaOrgProtocol(vocabulary) {
    const httpsIRI = "https://schema.org/";
    const httpIRI = "http://schema.org/";
    if (vocabulary["@context"]) {
        for (const contextEntry of Object.values(vocabulary["@context"])) {
            if ((0, isObject_1.isObject)(contextEntry) && contextEntry["@vocab"]) {
                if (contextEntry["@vocab"] === httpsIRI) {
                    return "https";
                }
                else if (contextEntry["@vocab"] === httpIRI) {
                    return "http";
                }
            }
            else if ((0, isString_1.isString)(contextEntry)) {
                if (contextEntry === httpsIRI) {
                    return "https";
                }
                else if (contextEntry === httpIRI) {
                    return "http";
                }
            }
        }
    }
    const stringifiedVocab = JSON.stringify(vocabulary);
    const amountHttps = stringifiedVocab.split(httpsIRI).length - 1;
    const amountHttp = stringifiedVocab.split(httpIRI).length - 1;
    if (amountHttps > amountHttp) {
        return "https";
    }
    else if (amountHttp > amountHttps) {
        return "http";
    }
    else {
        return httpsIRI;
    }
}
exports.discoverUsedSchemaOrgProtocol = discoverUsedSchemaOrgProtocol;
//# sourceMappingURL=discoverUsedSchemaOrgProtocol.js.map