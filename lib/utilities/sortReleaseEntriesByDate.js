"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortReleaseEntriesByDate = void 0;
function sortReleaseEntriesByDate(releaseLog) {
    const versionEntries = Object.entries(releaseLog);
    return versionEntries.sort((a, b) => +new Date(b[1]) - +new Date(a[1]));
}
exports.sortReleaseEntriesByDate = sortReleaseEntriesByDate;
//# sourceMappingURL=sortReleaseEntriesByDate.js.map