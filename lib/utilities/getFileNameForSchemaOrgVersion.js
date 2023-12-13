"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameForSchemaOrgVersion = void 0;
function getFileNameForSchemaOrgVersion(version, schemaHttps = true) {
    switch (version) {
        case "2.0":
        case "2.1":
        case "2.2":
        case "3.0":
            throw new Error("There is no jsonld file for the wanted schema.org version " + version);
        case "3.1":
        case "3.2":
        case "3.3":
        case "3.4":
        case "3.5":
        case "3.6":
        case "3.7":
        case "3.8":
        case "3.9":
        case "4.0":
        case "5.0":
        case "6.0":
        case "7.0":
        case "7.01":
        case "7.02":
        case "7.03":
        case "7.04":
        case "8.0":
            return "all-layers.jsonld";
        case "9.0":
            if (schemaHttps) {
                return "schemaorg-all-https.jsonld";
            }
            else {
                return "schemaorg-all-http.jsonld";
            }
        default:
            if (schemaHttps) {
                return "schemaorg-all-https.jsonld";
            }
            else {
                return "schemaorg-all-http.jsonld";
            }
    }
}
exports.getFileNameForSchemaOrgVersion = getFileNameForSchemaOrgVersion;
//# sourceMappingURL=getFileNameForSchemaOrgVersion.js.map