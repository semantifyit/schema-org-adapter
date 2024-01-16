import { constructURLSchemaVocabulary } from "../../src/classes/Infrastructure";
import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { isString } from "../../src/utilities/general/isString";
import { diff } from "deep-object-diff";

// to build (ignore errors)
// tsc tests/experimental/vocabulary-comparison.ts
// to execute
// node tests/experimental/vocabulary-comparison.js
// gotta delete all generated js files afterwards though

const vocabVersion1 = "15.0";
const vocabVersion2 = "latest";
const schemaRepoCommit = "ae70d0a9dbab49c005fd8dd1fd522f7236b04be0";

main();
async function main() {
  const url1 = await constructURLSchemaVocabulary(vocabVersion1, true, schemaRepoCommit);
  const url2 = await constructURLSchemaVocabulary(vocabVersion2, true, schemaRepoCommit);
  console.log(url2);
  const sdoAdapter = new SDOAdapter();
  let voc1 = await sdoAdapter.fetchVocabularyFromURL(url1);
  if (isString(voc1)) {
    voc1 = JSON.parse(voc1);
  }
  let voc2 = await sdoAdapter.fetchVocabularyFromURL(url2);
  if (isString(voc2)) {
    voc2 = JSON.parse(voc2);
  }
  const result: any = {};
  // context
  result.contextChanges = getDiff(voc1["@context"], voc2["@context"]);
  const g1 = voc1["@graph"];
  const g2 = voc2["@graph"];
  // in 1 but not in 2
  result.removals = g1.filter((el1) => !g2.find((el2) => el2["@id"] === el1["@id"]));
  // in 2 but not in 1
  result.additions = g2.filter((el2) => !g1.find((el1) => el1["@id"] === el2["@id"]));
  // in 1 and 2
  result.changes = g1
    .filter((el1) => g2.find((el2) => el2["@id"] === el1["@id"]))
    .map((el1) => {
      return {
        "@id": el1["@id"],
        ...getDiff(
          el1,
          g2.find((el2) => el2["@id"] === el1["@id"])
        )
      };
    })
    .filter((el) => Object.keys(el).length > 1);
  // console.log(JSON.stringify(result, null, 2));
  console.log(result);
}

function getDiff(obj1: any, obj2: any) {
  const d = diff(sortObjValues(obj1), sortObjValues(obj2));
  const result = {};
  for (const k of Object.keys(d)) {
    // if (typeof d[k] !== "object" || Object.keys(d[k]).length !== 0) {
    if (k !== "schema:source" && k !== "schema:contributor" && (typeof d[k] !== "object" || Object.keys(d[k]).length !== 0)) {
      result[k] = d[k];
    }
  }
  if (Object.keys(result).length === 0) {
    return undefined;
  }
  return result;
}

function sortObjValues(obj: any) {
  if (Array.isArray(obj)) {
    let r1 = obj.sort();
    if (r1[0] && typeof r1[0] === "object" && r1[0]["@id"]) {
      r1 = r1.sort((a, b) => {
        const keyA = a["@id"],
          keyB = b["@id"];
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    }
    return r1;
  }
  if (typeof obj !== "object") {
    return obj;
  }
  const result = {};
  const sortedKeys = Object.keys(obj).sort();
  for (const sk of sortedKeys) {
    result[sk] = sortObjValues(obj[sk]);
  }
  return result;
}
