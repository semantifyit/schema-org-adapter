const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7');

/**
 *
 */
async function initAdapter() {
    const mySA = new SDOAdapter();
    await mySA.addVocabularies([VOC_OBJ_SDO3_7]);
    return mySA;
}

describe('EnumerationMember methods', () => {
    test('getTermType()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getTermType()).toBe('soa:EnumerationMember');
    });

    test('getSource()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getSource()).toBe(null);
    });

    test('getVocabulary()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getVocabulary()).toBe('http://schema.org');
        const DrivingSchoolVehicleUsage = mySA.getEnumerationMember('schema:DrivingSchoolVehicleUsage');
        expect(DrivingSchoolVehicleUsage.getVocabulary()).toBe('http://auto.schema.org');
    });

    test('getIRI()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getIRI()).toBe('http://schema.org/Friday');
        expect(Friday.getIRI(true)).toBe('schema:Friday');
        expect(Friday.getIRI()).toBe(Friday.getIRI(false));
    });

    test('getName()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getName()).toBe('Friday');
        expect(Friday.getName('en')).toBe(Friday.getName());
        expect(Friday.getName('de')).toBe(null);
    });

    test('getDescription()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getDescription()).toBe('The day of the week between Thursday and Saturday.');
        expect(Friday.getDescription('en')).toBe('The day of the week between Thursday and Saturday.');
        expect(Friday.getDescription('de')).toBe(null);
    });

    test('isSupersededBy()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.isSupersededBy()).toBe(null);
    });

    test('getDomainEnumerations()', async() => {
        const mySA = await initAdapter();
        const Friday = mySA.getEnumerationMember('schema:Friday');
        expect(Friday.getDomainEnumerations()).toContain('schema:DayOfWeek');
        expect(Friday.getDomainEnumerations()).not.toContain('schema:Thing');
        const Radiography = mySA.getEnumerationMember('schema:Radiography');
        expect(Radiography.getDomainEnumerations()).toContain('schema:MedicalImagingTechnique');
        expect(Radiography.getDomainEnumerations()).toContain('schema:MedicalSpecialty');
        expect(Radiography.getDomainEnumerations()).not.toContain('schema:MedicalEnumeration');
        expect(Radiography.getDomainEnumerations().length).toBe(2);
        expect(Radiography.getDomainEnumerations(true).length).not.toBe(2);
        expect(Radiography.getDomainEnumerations(true)).toContain('schema:MedicalEnumeration');
    });
});
