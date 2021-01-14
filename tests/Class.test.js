const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary');
const util = require('../src/utilities');

/**
 *  @returns {SDOAdapter} - the initialized SDO-Adapter ready for testing.
 */
async function initAdapter() {
    const mySA = new SDOAdapter(global.commitBase);
    const mySDOUrl = await mySA.constructSDOVocabularyURL('latest');
    await mySA.addVocabularies([mySDOUrl, VOC_OBJ_ZOO]);
    return mySA;
}

/**
 *  Tests regarding the JS-Class for "Class"
 */
describe('Class methods', () => {
    test('getTermType()', async() => {
        const mySA = await initAdapter();
        const hotel = mySA.getClass('schema:Hotel');
        expect(hotel.getTermType()).toBe('rdfs:Class');
    });

    test('getSource()', async() => {
        const mySA = await initAdapter();
        const hotel = mySA.getClass('schema:Hotel');
        expect(hotel.getSource()).toBe('https://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#STI_Accommodation_Ontology');
        const hospital = mySA.getClass('schema:Hospital');
        expect(hospital.getSource()).toBe(null);
    });

    test('getVocabulary()', async() => {
        const mySA = await initAdapter();
        const Hotel = mySA.getClass('schema:Hotel');
        expect(Hotel.getVocabulary()).toBe('http://schema.org');
        const Class = mySA.getClass('schema:Class');
        expect(Class.getVocabulary()).toBe('http://meta.schema.org');
        const Tiger = mySA.getClass('ex:Tiger');
        expect(Tiger.getVocabulary()).toBe('https://example-vocab.ex');
    });

    test('getIRI()', async() => {
        const mySA = await initAdapter();
        const hospital = mySA.getClass('schema:Hospital');
        expect(hospital.getIRI()).toBe('http://schema.org/Hospital');
        expect(hospital.getIRI(true)).toBe('schema:Hospital');
        expect(hospital.getIRI()).toBe(hospital.getIRI(false));
        const Tiger = mySA.getClass('ex:Tiger');
        expect(Tiger.getIRI(false)).toBe('https://example-vocab.ex/Tiger');
    });

    test('getName()', async() => {
        const mySA = await initAdapter();
        const hotel = mySA.getClass('schema:Hotel');
        expect(hotel.getName()).toBe('Hotel');
        expect(hotel.getName('en')).toBe(hotel.getName());
        expect(hotel.getName('de')).toBe(null);
    });

    test('getDescription()', async() => {
        const mySA = await initAdapter();
        const hotel = mySA.getClass('schema:Hotel');
        expect(hotel.getDescription().includes("A hotel")).toBe(true);
    });

    test('isSupersededBy()', async() => {
        const mySA = await initAdapter();
        const UserPlays = mySA.getClass('schema:UserPlays');
        expect(UserPlays.isSupersededBy()).toBe('schema:InteractionCounter');
        const Hotel = mySA.getClass('schema:Hotel');
        expect(Hotel.isSupersededBy()).toBe(null);
    });

    test('getProperties()', async() => {
        const mySA = await initAdapter();
        const person = mySA.getClass('schema:Person');
        expect(person.getProperties()).toContain('schema:givenName');
        expect(person.getProperties(true)).toContain('schema:givenName');
        expect(person.getProperties(false)).toContain('schema:givenName');
        expect(person.getProperties(true)).toContain('schema:name');
        expect(person.getProperties(false)).not.toContain('schema:name');
        const event = mySA.getClass('schema:Event');
        const musicEvent = mySA.getClass('schema:MusicEvent');
        const eventProps = event.getProperties(true);
        const musicEventProps = musicEvent.getProperties(true);
        for (const actProp of eventProps) {
            expect(musicEventProps).toContain(actProp);
        }
        const crWork = mySA.getClass('schema:CreativeWork');
        expect(crWork.getProperties(true)).not.toContain('schema:legislationJurisdiction');
    });

    test('getSuperClasses()', async() => {
        const mySA = await initAdapter();
        const person = mySA.getClass('schema:Person');
        expect(person.getSuperClasses()).toContain('schema:Thing');
        expect(person.getSuperClasses()).not.toContain('schema:Event');
        const hotel = mySA.getClass('schema:Hotel');
        expect(hotel.getSuperClasses(true)).toContain('schema:Thing');
        expect(hotel.getSuperClasses(false)).not.toContain('schema:Thing');
    });

    test('getSubClasses()', async() => {
        const mySA = await initAdapter();
        const thing = mySA.getClass('schema:Thing');
        expect(thing.getSubClasses()).toContain('schema:Hospital');
        expect(thing.getSubClasses(false)).not.toContain('schema:Hospital');
        const lodgingBusiness = mySA.getClass('schema:LodgingBusiness');
        expect(lodgingBusiness.getSubClasses()).toContain('schema:Hotel');
        expect(lodgingBusiness.getSubClasses()).not.toContain('schema:Thing');
    });

    test('isRangeOf()', async() => {
        const mySA = await initAdapter();
        const thing = mySA.getClass('schema:Thing');
        expect(thing.isRangeOf()).toContain('schema:about');
        expect(thing.isRangeOf(false)).toContain('schema:about');
        expect(thing.isRangeOf().length === thing.isRangeOf(false).length).toBe(true);
        const restaurant = mySA.getClass('schema:Restaurant');
        expect(restaurant.isRangeOf()).toContain('schema:about');
        expect(restaurant.isRangeOf(false)).not.toContain('schema:about');
        const foodEstablishment = mySA.getClass('schema:FoodEstablishment');
        expect(restaurant.isRangeOf().length === foodEstablishment.isRangeOf().length).toBe(true);
    });

    test('toString()', async() => {
        const mySA = await initAdapter();
        const thing = mySA.getClass('schema:Thing');
        expect(util.isObject(JSON.parse(thing.toString()))).toBe(true);
    });
});
