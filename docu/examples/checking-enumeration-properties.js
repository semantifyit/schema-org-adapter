const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example

main();

// analyze the properties of enumerations
async function main() {
  const sdoVersion = "28.1";
  const commit = "9d7406b660197aa9559090bcaf516ad80fdce7a0";
  const mySoa = await SOA.create({ schemaVersion: sdoVersion, commit: commit });
  const enumerationList = mySoa.getListOfEnumerations();
  console.log("#Enumerations " + sdoVersion + ": " + enumerationList.length);

  // enumerations with sub-enumerations
  for (const enumeration of enumerationList) {
    try {
      const enumInstance = mySoa.getEnumeration(enumeration);
      // const propertiesImpl = enumInstance.getProperties({implicit:true})
      const propertiesExpl = enumInstance.getProperties({implicit:false})
      if(propertiesExpl.length > 0) {
        console.log("Enumeration " + enumeration + " has following explicit properties: ", propertiesExpl);
      }
    } catch (e) {
      console.error(e);
    }
  }

}
