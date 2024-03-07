const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example

main();

// compare the terms from different schema.org vocabulary versions
async function main() {
  const mySA12 = await SOA.create({schemaVersion: "12.0"});
  const mySALatest = await SOA.create({schemaVersion: "latest"});
  const classes12 = mySA12.getListOfClasses();
  const classesLatest = mySALatest.getListOfClasses();
  console.log("#Classes 12.0: "+classes12.length)
  console.log("#Classes Latest: "+classesLatest.length)

  const properties12 = mySA12.getListOfProperties();
  const propertiesLatest = mySALatest.getListOfProperties();
  console.log("#Properties 12.0: "+properties12.length)
  console.log("#Properties Latest: "+propertiesLatest.length)

  const enums12 = mySA12.getListOfEnumerations();
  const enumsLatest = mySALatest.getListOfEnumerations();
  console.log("#Enumerations 12.0: "+enums12.length)
  console.log("#Enumerations Latest: "+enumsLatest.length)

  const enumsMembers12 = mySA12.getListOfEnumerations();
  const enumsMembersLatest = mySALatest.getListOfEnumerations();
  console.log("#Enumeration Members 12.0: "+enumsMembers12.length)
  console.log("#Enumeration Members Latest: "+enumsMembersLatest.length)

  const dataTypes12 = mySA12.getListOfEnumerations();
  const dataTypesLatest = mySALatest.getListOfEnumerations();
  console.log("#DataTypes 12.0: "+dataTypes12.length)
  console.log("#DataTypes Latest: "+dataTypesLatest.length)

  // terms that have been deleted in newer versions
  console.log("Deleted Classes:",classes12.filter(c => !classesLatest.includes(c) ))
  console.log("Deleted Properties:",properties12.filter(c => !propertiesLatest.includes(c) ))
  console.log("Deleted Enumerations:",enums12.filter(c => !enumsLatest.includes(c) ))
  console.log("Deleted Enumeration Members:",enumsMembers12.filter(c => !enumsMembersLatest.includes(c) ))
  console.log("Deleted DataTypes:",dataTypes12.filter(c => !dataTypesLatest.includes(c) ))

  // classes with properties that they are no longer allowed to use
  for(const c of classes12){
    const ci12 = mySA12.getClass(c);
    const ciLatest = mySALatest.getClass(c);
    const ci12Properties = ci12.getProperties()
    const ciLatestProperties = ciLatest.getProperties()
    const deletedProps =   ci12Properties.filter(p => !ciLatestProperties.includes(p))
    if(deletedProps.length > 0){
      console.log("Deleted Properties for "+c+":",deletedProps)
    }
  }

  // properties with ranges that they are no longer allowed to use
  for(const p of properties12){
    const pi12 = mySA12.getProperty(p);
    const piLatest = mySALatest.getProperty(p);
    const pi12Ranges = pi12.getRanges()
    const piLatestRanges = piLatest.getRanges()
    const deletedRanges =   pi12Ranges.filter(p => !piLatestRanges.includes(p))
    if(deletedRanges.length > 0){
      // console.log("Property "+p+" ranges 12.0:" ,pi12Ranges)
      // console.log("Property "+p+" ranges latest:" ,piLatestRanges)
      console.log("Deleted Ranges for "+p+":",deletedRanges)
    }
  }
}
