"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubBaseURL = void 0;
function getGitHubBaseURL(commit) {
    if (commit) {
        return "https://raw.githubusercontent.com/schemaorg/schemaorg/" + commit;
    }
    else {
        return "https://raw.githubusercontent.com/semantifyit/schemaorg/main";
    }
}
exports.getGitHubBaseURL = getGitHubBaseURL;
//# sourceMappingURL=getGitHubBaseURL.js.map