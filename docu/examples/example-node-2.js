const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example
const SCHEMA_URL = "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld";
const VOC_OBJ_ZOO = require("../../tests/resources/data/vocabularies/vocabulary-animal.json");
const VOC_OBJ_ZOO_DVS = require("../../tests/resources/data/vocabularies/vocabulary-animal-dvs.json");
main();

/**
 * example usage of the library within node.js
 */
async function main() {
  const mySA = await SOA.create({ vocabularies: [SCHEMA_URL, VOC_OBJ_ZOO] });
  const mySDOUrl = await mySA.constructURLSchemaVocabulary("latest");
  console.log("The latest version is " + mySDOUrl);
  let testClass = mySA.getClass("https://schema.org/Person");
  console.log(mySA.getVocabularies());
  console.log("getIRI() " + testClass.getIRI());
  console.log(JSON.stringify(testClass.toJSON({ implicit: false }), null, 2));

  const extVocClass = mySA.getClass("ex:Tiger");
  console.log(JSON.stringify(extVocClass.toJSON(), null, 2));
  const testEnumerationMember = mySA.getEnumerationMember("schema:Radiography");
  console.log(
    JSON.stringify(testEnumerationMember.toJSON({ implicit: false }), null, 2)
  );

  const mySA2 = await SOA.create({ vocabularies: [SCHEMA_URL, VOC_OBJ_ZOO_DVS] });
  console.log(mySA2.getVocabularies());
  console.log(mySA2.getListOfClasses({
    filter: {
      fromVocabulary: "ex"
    }
  }));
  console.log(mySA2.getListOfClasses({
    filter: {
      fromVocabulary: "ex"
    },
    outputFormat:"Absolute"
  }));
}
