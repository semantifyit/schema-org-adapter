const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example

main();

// analyze the hierarchy of enumerations
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
      const enumMembersImpl = enumInstance.getEnumerationMembers({implicit:true})
      const enumMembersExpl = enumInstance.getEnumerationMembers({implicit:false})
      const subEnumerationsDirect = enumInstance.getSubClasses({implicit:false});
      if(enumMembersExpl.length > 0 && subEnumerationsDirect.length > 0 ) {
        console.log("Enumeration " + enumeration + " has following implicit members: ", enumMembersImpl.filter(el => !enumMembersExpl.includes(el)));
        console.log("Enumeration " + enumeration + " has following explicit members: ", enumMembersExpl);
      }
      // const subEnumerationsDirect = enumInstance.getSubClasses({implicit:false});
      // if (subEnumerationsDirect.length > 0) {
      //   console.log("Enumeration " + enumeration + " has direct sub-classes:", subEnumerationsDirect);
      // }
    } catch (e) {
      console.error(e);
    }
  }

}
