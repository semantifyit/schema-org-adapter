const SDOAdapter = require('../src/SDOAdapter');
const VOC_OBJ_ZOO = require('./data/exampleExternalVocabulary');

/**
 *
 */
async function initAdapter() {
    const mySA = new SDOAdapter(global.useExperimental);
    const mySDOUrl = await mySA.constructSDOVocabularyURL('latest');
    await mySA.addVocabularies([mySDOUrl, VOC_OBJ_ZOO]);
    return mySA;
}

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
        expect(hotel.getDescription()).toBe('A hotel is an establishment that provides lodging paid on a short-term basis (Source: Wikipedia, the free encyclopedia, see http://en.wikipedia.org/wiki/Hotel).\n' +
      '<br /><br />\n' +
      'See also the <a href="/docs/hotels.html">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.');
        expect(hotel.getDescription('en')).toBe('A hotel is an establishment that provides lodging paid on a short-term basis (Source: Wikipedia, the free encyclopedia, see http://en.wikipedia.org/wiki/Hotel).\n' +
      '<br /><br />\n' +
      'See also the <a href="/docs/hotels.html">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.');
        expect(hotel.getDescription('de')).toBe(null);
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
        for (let i = 0; i < eventProps.length; i++) {
            expect(musicEventProps).toContain(eventProps[i]);
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
});
