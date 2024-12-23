const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example
const VOC_EXAMPLE = require("../../tests/resources/data/vocabularies/paymentMethods.json"); // load our external vocabulary

main();

/**
 * example usage of the SDOAdapter in node.js
 */
async function main() {
  const mySA = await SOA.create({schemaVersion: "20.0", vocabularies:[VOC_EXAMPLE]});
  let PaymentMethod = mySA.getEnumeration("schema:PaymentMethod");
  console.log(mySA.getVocabularies(true))
  console.log(JSON.stringify(PaymentMethod.toJSON(), null, 2));
  console.log(JSON.stringify(mySA.getEnumerationMember("gr:VISA").toJSON(),null,2))
}
