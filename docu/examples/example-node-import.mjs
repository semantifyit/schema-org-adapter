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
  console.log("getName() " + testClass.getName());
  console.log("getDescription(\"en\") " + testClass.getDescription("en"));
  console.log("getProperties() " + testClass.getProperties());
  const testProp = mySA.getProperty("schema:aspect");
  console.log("isSuperseededBy() " + testProp.isSupersededBy());
  testClass = mySA.getClass("schema:Person");
  console.log(JSON.stringify(testClass.toJSON({ implicit: false }), null, 2));
  const testProperty = mySA.getProperty("schema:translationOfWork");
  console.log(JSON.stringify(testProperty.toJSON({ implicit: false }), null, 2));
}
