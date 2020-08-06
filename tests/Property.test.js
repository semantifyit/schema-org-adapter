const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_Zoo = require('./data/exampleExternalVocabulary');
const VOC_OBJ_SDO3_7 = require('./data/schema_3.7');

/**
 *
 */
async function initAdapter() {
    const mySA = new SDOAdapter();
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_Zoo]);
    return mySA;
}

describe('Property methods', () => {
    test('getTermType()', async() => {
        const mySA = await initAdapter();
        const address = mySA.getProperty('schema:address');
        expect(address.getTermType()).toBe('rdf:Property');
    });

    test('getSource()', async() => {
        const mySA = await initAdapter();
        const accelerationTime = mySA.getProperty('schema:accelerationTime');
        expect(accelerationTime.getSource()).toBe('http://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#Automotive_Ontology_Working_Group');
        const startLocation = mySA.getProperty('ex:animalLivingEnvironment');
        expect(startLocation.getSource()).toBe(null);
    });

    test('getVocabulary()', async() => {
        const mySA = await initAdapter();
        const address = mySA.getProperty('schema:address');
        expect(address.getVocabulary()).toBe('http://schema.org');
        const accelerationTime = mySA.getProperty('schema:accelerationTime');
        expect(accelerationTime.getVocabulary()).toBe('http://auto.schema.org');
        const startLocation = mySA.getProperty('ex:animalLivingEnvironment');
        expect(startLocation.getVocabulary()).toBe('https://example-vocab.ex');
    });

    test('getIRI()', async() => {
        const mySA = await initAdapter();
        const address = mySA.getProperty('schema:address');
        expect(address.getIRI()).toBe('http://schema.org/address');
        expect(address.getIRI(true)).toBe('schema:address');
        expect(address.getIRI()).toBe(address.getIRI(false));
        const startLocation = mySA.getProperty('ex:animalLivingEnvironment');
        expect(startLocation.getIRI(false)).toBe('https://example-vocab.ex/animalLivingEnvironment');
    });

    test('getName()', async() => {
        const mySA = await initAdapter();
        const address = mySA.getProperty('schema:address');
        expect(address.getName()).toBe('address');
        expect(address.getName('en')).toBe(address.getName());
        expect(address.getName('es')).toBe(null);
    });

    test('getDescription()', async() => {
        const mySA = await initAdapter();
        const address = mySA.getProperty('schema:address');
        expect(address.getDescription()).toBe('Physical address of the item.');
        expect(address.getDescription('en')).toBe('Physical address of the item.');
        expect(address.getDescription('de')).toBe(null);
    });

    test('isSupersededBy()', async() => {
        const mySA = await initAdapter();
        const serviceAudience = mySA.getProperty('schema:serviceAudience');
        expect(serviceAudience.isSupersededBy()).toBe('schema:audience');
        const address = mySA.getProperty('schema:address');
        expect(address.isSupersededBy()).toBe(null);
    });

    test('getRanges()', async() => {
        const mySA = await initAdapter();
        const serviceAudience = mySA.getProperty('schema:serviceAudience');
        expect(serviceAudience.getRanges()).toContain('schema:Audience');
        expect(serviceAudience.getRanges(true)).toContain('schema:Audience');
        expect(serviceAudience.getRanges(false)).toContain('schema:Audience');
        expect(serviceAudience.getRanges(true)).toContain('schema:MedicalAudience');
        expect(serviceAudience.getRanges(false)).not.toContain('schema:MedicalAudience');
        const startLocation = mySA.getProperty('ex:animalLivingEnvironment');
        expect(startLocation.getRanges(true)).toContain('schema:Text');
        expect(startLocation.getRanges(true)).toContain('ex:AnimalLivingEnvironment');
        expect(startLocation.getRanges(true, { fromVocabulary: 'ex' })).not.toContain('schema:Text');
    });

    test('getDomains()', async() => {
        const mySA = await initAdapter();
        const serviceAudience = mySA.getProperty('schema:serviceAudience');
        expect(serviceAudience.getDomains()).toContain('schema:Service');
        expect(serviceAudience.getDomains(true)).toContain('schema:Service');
        expect(serviceAudience.getDomains(false)).toContain('schema:Service');
        expect(serviceAudience.getDomains(true)).toContain('schema:FoodService');
        expect(serviceAudience.getDomains(false)).not.toContain('schema:FoodService');
        const startLocation = mySA.getProperty('ex:animalLivingEnvironment');
        expect(startLocation.getDomains(true)).toContain('ex:Tiger');
        expect(startLocation.getDomains(false)).not.toContain('ex:Tiger');
        expect(startLocation.getDomains(true, { fromVocabulary: 'ex' })).toContain('ex:Tiger');
    });

    test('getSuperProperties()', async() => {
        const mySA = await initAdapter();
        const startLocation = mySA.getProperty('schema:vendor');
        expect(startLocation.getSuperProperties()).toContain('schema:participant');
        expect(startLocation.getSuperProperties()).not.toContain('schema:address');
    });

    test('getSubProperties()', async() => {
        const mySA = await initAdapter();
        const workFeatured = mySA.getProperty('schema:workFeatured');
        expect(workFeatured.getSubProperties()).toContain('schema:workPresented');
        expect(workFeatured.getSubProperties().length).toBe(2);
        expect(workFeatured.getSubProperties()).not.toContain('schema:location');
        const address = mySA.getProperty('schema:address');
        expect(address.getSubProperties().length).toBe(0);
    });

    test('getInverseOf()', async() => {
        const mySA = await initAdapter();
        const subOrganization = mySA.getProperty('schema:subOrganization');
        console.log(subOrganization.getInverseOf());
        expect(subOrganization.getInverseOf()).toBe('schema:parentOrganization');
    });

    test('getInverseOf() - Bijection', async() => {
        const mySA = await initAdapter();
        const allProperties = mySA.getAllProperties();
        for (let p = 0; p < allProperties.length; p++) {
            let thisProp = allProperties[p].getIRI(true);
            let thisInverse = allProperties[p].getInverseOf();
            if (thisInverse !== undefined) {
                let inverseProp = mySA.getProperty(thisInverse, null);
                let inversePropInverse = inverseProp.getInverseOf();
                console.log(thisProp + ' -> ' + thisInverse + ' -> ' + inversePropInverse);
                expect(inversePropInverse).toBe(thisProp);
            }
        }
    });
});
