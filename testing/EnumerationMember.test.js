const SDOAdapter = require("../src/SDOAdapter");
const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');

async function initAdapter() {
    let mySA = new SDOAdapter();
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
    return mySA;
}

describe('EnumerationMember methods', () => {

    test("getTermType()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getTermType()).toBe("soa:EnumerationMember");
    });

    test("getSource()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getSource()).toBe(null);
    });

    test("getVocabulary()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getVocabulary()).toBe("http://schema.org");
        let DrivingSchoolVehicleUsage = mySA.getEnumerationMember("schema:DrivingSchoolVehicleUsage");
        expect(DrivingSchoolVehicleUsage.getVocabulary()).toBe("http://auto.schema.org");
    });

    test("getIRI()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getIRI()).toBe("http://schema.org/Friday");
        expect(Friday.getIRI(true)).toBe("schema:Friday");
        expect(Friday.getIRI()).toBe(Friday.getIRI(false));
    });

    test("getName()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getName()).toBe("Friday");
        expect(Friday.getName('en')).toBe(Friday.getName());
        expect(Friday.getName('de')).toBe(null);
    });

    test("getDescription()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getDescription()).toBe("The day of the week between Thursday and Saturday.");
        expect(Friday.getDescription('en')).toBe("The day of the week between Thursday and Saturday.");
        expect(Friday.getDescription('de')).toBe(null);
    });

    test("isSupersededBy()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.isSupersededBy()).toBe(null);
    });

    test("getDomainEnumerations()", async () => {
        let mySA = await initAdapter();
        let Friday = mySA.getEnumerationMember("schema:Friday");
        expect(Friday.getDomainEnumerations()).toContain("schema:DayOfWeek");
        expect(Friday.getDomainEnumerations()).not.toContain("schema:Thing");
        let Radiography = mySA.getEnumerationMember("schema:Radiography");
        expect(Radiography.getDomainEnumerations()).toContain("schema:MedicalImagingTechnique");
        expect(Radiography.getDomainEnumerations()).toContain("schema:MedicalSpecialty");
    });
});
