const SDOAdapter = require("../src/SDOAdapter");
let mySA = new SDOAdapter();
mySA.addVocabularies(["schema.org/3.6", {"vocab": "schema.org/3.7"}, '{"vocab": "schema.org/3.7"}'], onStart);

function onStart() {
    let testClass = mySA.getClass("http://schema.org/MedicalProcedure");

    console.log(testClass.getId());
    console.log(testClass.getName());
    console.log(testClass.getDescription("en"));
    console.log(testClass.toJSON(true));

}