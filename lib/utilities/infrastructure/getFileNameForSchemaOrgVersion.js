"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameForSchemaOrgVersion = void 0;
function getFileNameForSchemaOrgVersion(version, schemaHttps = true) {
    if (!(Number(version) > 3.0)) {
        throw new Error("There is no jsonld file for the wanted schema.org version " + version);
    }
    if (!(Number(version) > 8.0)) {
        return "all-layers.jsonld";
    }
    if (schemaHttps) {
        return "schemaorg-all-https.jsonld";
    }
    return "schemaorg-all-http.jsonld";
}
exports.getFileNameForSchemaOrgVersion = getFileNameForSchemaOrgVersion;
//# sourceMappingURL=getFileNameForSchemaOrgVersion.js.map