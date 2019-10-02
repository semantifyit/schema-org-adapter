const sdoAdapter = require("./../dist/node/sdoAdapter");
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');
const VOC_OBJ_DACH = require('../testData/dachkg_1');

const VOC_URL_DACH = "https://raw.githubusercontent.com/STIInnsbruck/dachkg-schema/master/schema/dachkg_trail.json";

let mySA = new sdoAdapter();

//node js needs superagent

mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_URL_DACH], onStart);

function onStart() {
    let testClass = mySA.getClass("schema:Hotel");
    // console.log(testClass.getIRI());
    // console.log(testClass.getName());
    // console.log(testClass.getDescription("en"));
    // console.log(JSON.stringify(testClass.toJSON(true),null,2));

    let testClass2 = mySA.getClass("dachkg:Trail");
    //console.log(JSON.stringify(testClass2.toJSON(true, {"isSuperseded": false}), null, 2));
    console.log(JSON.stringify(mySA.getProperty("dachkg:wayPoint").getRanges(true), null, 2));
}