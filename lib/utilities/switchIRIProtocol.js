"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchIRIProtocol = void 0;
function switchIRIProtocol(IRI) {
    if (IRI.startsWith("https://")) {
        return "http" + IRI.substring(5);
    }
    else if (IRI.startsWith("http://")) {
        return "https" + IRI.substring(4);
    }
    return IRI;
}
exports.switchIRIProtocol = switchIRIProtocol;
//# sourceMappingURL=switchIRIProtocol.js.map