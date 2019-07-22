const sdoAdapter = require("./../dist/sdoAdapter");
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');
let mySA = new sdoAdapter();

mySA.addVocabularies([VOC_OBJ_SDO3_7], onStart);

function onStart() {
    let testClass = mySA.getClass("http://schema.org/MedicalProcedure");

    console.log(testClass.getId());
    console.log(testClass.getName());
    console.log(testClass.getDescription("en"));
    console.log(testClass.toJSON(true));

}