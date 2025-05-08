const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example

main();

// analyze the hierarchy of properties
async function main() {
  const sdoVersion = "28.1";
  const commit = "9d7406b660197aa9559090bcaf516ad80fdce7a0";
  const mySoa = await SOA.create({ schemaVersion: sdoVersion, commit: commit });
  const propertiesV1 = mySoa.getListOfProperties();
  console.log("#Properties " + sdoVersion + ": " + propertiesV1.length);

  // properties with ranges that they are no longer allowed to use
  for (const p of propertiesV1) {
    try {
      const prop = mySoa.getProperty(p);
      const subPropertiesDirect = prop.getSubProperties({implicit:false});
      if (subPropertiesDirect.length > 0) {
        console.log("Property " + p + " has direct sub-properties:", subPropertiesDirect);
      }
      const subPropertiesIndirect = prop.getSubProperties({implicit:true}).filter(sp => !subPropertiesDirect.includes(sp));
      if (subPropertiesIndirect.length > 0) {
        console.log("Property " + p + " has indirect sub-properties:", subPropertiesIndirect);
      }
    } catch (e) {
      console.error(e);
    }
  }

}
