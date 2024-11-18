const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example

main();

// compare the terms from different schema.org vocabulary versions
async function main() {
  const v1 = "27.02"; // 3.1 is the lowest version possible
  const commit1 = "ad42b25994b238eb6e5b982b079ae2f403c5bba0";
  const v2 = "latest";
  const commit2 = "ad42b25994b238eb6e5b982b079ae2f403c5bba0";
  console.log("Comparing version " + v1 + " from commit " + commit1 + " with version " + v2 + " from commit " + commit2);
  const mySa1 = await SOA.create({ schemaVersion: v1, commit: commit1 });
  const mySa2 = await SOA.create({ schemaVersion: v2, commit: commit2 });
  const classesV1 = mySa1.getListOfClasses();
  const classesV2 = mySa2.getListOfClasses();
  console.log("#Classes " + v1 + ": " + classesV1.length);
  console.log("#Classes " + v2 + ": " + classesV2.length);

  const propertiesV1 = mySa1.getListOfProperties();
  const propertiesV2 = mySa2.getListOfProperties();
  console.log("#Properties " + v1 + ": " + propertiesV1.length);
  console.log("#Properties " + v2 + ": " + propertiesV2.length);

  const enumsV1 = mySa1.getListOfEnumerations();
  const enumsV2 = mySa2.getListOfEnumerations();
  console.log("#Enumerations " + v1 + ": " + enumsV1.length);
  console.log("#Enumerations " + v2 + ": " + enumsV2.length);

  const enumsMembersV1 = mySa1.getListOfEnumerationMembers();
  const enumsMembersV2 = mySa2.getListOfEnumerationMembers();
  console.log("#Enumeration Members " + v1 + ": " + enumsMembersV1.length);
  console.log("#Enumeration Members " + v2 + ": " + enumsMembersV2.length);

  const dataTypesV1 = mySa1.getListOfDataTypes();
  const dataTypesV2 = mySa2.getListOfDataTypes();
  console.log("#DataTypes " + v1 + ": " + dataTypesV1.length);
  console.log("#DataTypes " + v2 + ": " + dataTypesV2.length);

  // terms that have been deleted in newer versions
  console.log("Deleted Classes:", classesV1.filter(c => !classesV2.includes(c)));
  console.log("Deleted Properties:", propertiesV1.filter(c => !propertiesV2.includes(c)));
  console.log("Deleted Enumerations:", enumsV1.filter(c => !enumsV2.includes(c)));
  console.log("Deleted Enumeration Members:", enumsMembersV1.filter(c => !enumsMembersV2.includes(c)));
  console.log("Deleted DataTypes:", dataTypesV1.filter(c => !dataTypesV2.includes(c)));

  // classes with properties that they are no longer allowed to use
  for (const c of classesV1) {
    try {
      const ci12 = mySa1.getClass(c);
      const ciLatest = mySa2.getClass(c);
      const ci12Properties = ci12.getProperties();
      const ciLatestProperties = ciLatest.getProperties();
      const deletedProps = ci12Properties.filter(p => !ciLatestProperties.includes(p));
      if (deletedProps.length > 0) {
        console.log("Deleted Properties for " + c + ":", deletedProps);
      }
    } catch (e) {

    }

  }

  // properties with ranges that they are no longer allowed to use
  for (const p of propertiesV1) {
    try {
      const pi12 = mySa1.getProperty(p);
      const piLatest = mySa2.getProperty(p);
      const pi12Ranges = pi12.getRanges();
      const piLatestRanges = piLatest.getRanges();
      const deletedRanges = pi12Ranges.filter(p => !piLatestRanges.includes(p));
      if (deletedRanges.length > 0) {
        console.log("Deleted Ranges for " + p + ":", deletedRanges);
      }
    } catch (e) { }
  }

  // enumerations with an enumeration-hierarchy with more than 2 levels (PaymentMethod was - before 28.0 - the only enumeration that had 2 further levels below)
  for (const e of enumsV2) {
    try {
      const ei = mySa2.getEnumeration(e);
      const subClassesImplicit = ei.getSubClasses({ implicit: true });
      const subClassesExplicit = ei.getSubClasses({ implicit: false });
      if (subClassesImplicit.length > 0) {
        if (subClassesExplicit.length !== subClassesImplicit.length) {
          console.log(e + " has explicit subclasses: " + JSON.stringify(subClassesExplicit));
          console.log(e + " has implicit subclasses: " + JSON.stringify(subClassesImplicit));
        }
      }
    } catch (e) { }
  }
}
