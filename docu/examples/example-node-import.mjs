import { SOA } from "../../lib/index.js"; // run the npm-script "buildTs" to generate js files for this example
main();

/**
 * example usage of the library within node.js
 */
async function main() {
  const mySA = await SOA.create();
  const mySDOUrl = await mySA.constructURLSchemaVocabulary("latest");
  console.log("The latest version is " + mySDOUrl);
  await mySA.addVocabularies([mySDOUrl]);
  let testClass = mySA.getClass("https://schema.org/Person");
  console.log(mySA.getVocabularies());
  console.log("getIRI() " + testClass.getIRI());
  console.log("getIRI(true) " + testClass.getIRI(true));
  console.log("getName() " + testClass.getName());
  console.log("getDescription(\"en\") " + testClass.getDescription("en"));
  console.log("getProperties(false) " + testClass.getProperties(false));
  console.log("getProperties(true) " + testClass.getProperties(true));
  console.log("getProperties(true, {}) " + testClass.getProperties(true, {}));
  console.log(testClass.toString());
  console.log(JSON.stringify(testClass.toJSON(true, null), null, 2));

  const testProp = mySA.getProperty("schema:aspect");
  console.log("isSuperseededBy() " + testProp.isSupersededBy());

  testClass = mySA.getClass("schema:Person");
  console.log(JSON.stringify(testClass.toJSON(false, null), null, 2));
  const testProperty = mySA.getProperty("schema:translationOfWork");
  console.log(JSON.stringify(testProperty.toJSON(false, null), null, 2));
  console.log(JSON.stringify(testProperty.getName("en"), null, 2));
  const testDataType = mySA.getDataType("schema:Number");
  console.log(JSON.stringify(testDataType.toJSON(false, null), null, 2));
  let testEnumeration = mySA.getEnumeration("schema:MedicalEnumeration");
  console.log(JSON.stringify(testEnumeration.toJSON(true, null), null, 2));
  const testEnumerationMember = mySA.getEnumerationMember("schema:Radiography");
  console.log(
    JSON.stringify(testEnumerationMember.toJSON(false, null), null, 2)
  );
  console.log(
    JSON.stringify(testEnumerationMember.toJSON(true, null), null, 2)
  );
}