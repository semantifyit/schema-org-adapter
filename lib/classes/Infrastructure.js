"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestSchemaVersion = exports.fetchSchemaVersions = exports.constructURLSchemaVocabulary = void 0;
const RetrievalMemory_1 = require("../utilities/infrastructure/RetrievalMemory");
const getFileNameForSchemaOrgVersion_1 = require("../utilities/infrastructure/getFileNameForSchemaOrgVersion");
const checkIfUrlExists_1 = require("../utilities/infrastructure/checkIfUrlExists");
const axios_1 = __importDefault(require("axios"));
const sortReleaseEntriesByDate_1 = require("../utilities/infrastructure/sortReleaseEntriesByDate");
const getGitHubBaseURL_1 = require("../utilities/infrastructure/getGitHubBaseURL");
const myRetrievalMemory = RetrievalMemory_1.RetrievalMemory.getInstance();
async function constructURLSchemaVocabulary(version = "latest", schemaHttps = true, commit) {
    if (version === "latest") {
        version = await getLatestSchemaVersion(commit);
    }
    const fileName = (0, getFileNameForSchemaOrgVersion_1.getFileNameForSchemaOrgVersion)(version, schemaHttps);
    return (0, getGitHubBaseURL_1.getGitHubBaseURL)(commit) + "/data/releases/" + version + "/" + fileName;
}
exports.constructURLSchemaVocabulary = constructURLSchemaVocabulary;
async function fetchSchemaVersions(cacheClear = false, commit) {
    let versionFile;
    if (cacheClear) {
        myRetrievalMemory.deleteCache();
    }
    else {
        const cachedData = myRetrievalMemory.getData("versionsFile", commit);
        if (cachedData) {
            return cachedData;
        }
    }
    const urlSchemaVersions = (0, getGitHubBaseURL_1.getGitHubBaseURL)(commit) + "/versions.json";
    try {
        versionFile = await axios_1.default.get(urlSchemaVersions);
    }
    catch (e) {
        throw new Error("Unable to retrieve the schema.org versions file at " + urlSchemaVersions);
    }
    if (!versionFile || !versionFile.data || !versionFile.data.releaseLog) {
        throw new Error("The schema.org versions file at " + urlSchemaVersions + " returned an unexpected result.");
    }
    const schemaVersions = versionFile.data;
    myRetrievalMemory.setData("versionsFile", schemaVersions, commit);
    let latestVersion;
    if (schemaVersions.schemaversion &&
        (await (0, checkIfUrlExists_1.checkIfUrlExists)(await constructURLSchemaVocabulary(schemaVersions.schemaversion, true, commit)))) {
        latestVersion = schemaVersions.schemaversion;
    }
    else {
        const sortedArray = (0, sortReleaseEntriesByDate_1.sortReleaseEntriesByDate)(schemaVersions.releaseLog);
        console.log("sortedArray", sortedArray);
        for (const currVersion of sortedArray) {
            if (await (0, checkIfUrlExists_1.checkIfUrlExists)(await constructURLSchemaVocabulary(currVersion[0], true, commit))) {
                latestVersion = currVersion[0];
                break;
            }
        }
    }
    if (!latestVersion) {
        throw new Error('Could not find any valid vocabulary file in the schema.org versions to be declared as "latest".');
    }
    myRetrievalMemory.setData("latest", latestVersion, commit);
    return schemaVersions;
}
exports.fetchSchemaVersions = fetchSchemaVersions;
async function getLatestSchemaVersion(commit) {
    let latestVersion = myRetrievalMemory.getData("latest", commit);
    if (!latestVersion) {
        await fetchSchemaVersions(false, commit);
    }
    latestVersion = myRetrievalMemory.getData("latest", commit);
    if (latestVersion) {
        return latestVersion;
    }
    else {
        throw new Error("Could not identify the latest version of the schema.org vocabulary");
    }
}
exports.getLatestSchemaVersion = getLatestSchemaVersion;
//# sourceMappingURL=Infrastructure.js.map