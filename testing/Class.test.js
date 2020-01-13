const SDOAdapter = require("../src/SDOAdapter");
const VOC_OBJ_DACH = require('../testData/dachkg_1');
const VOC_OBJ_SDO3_7 = require('../testData/schema_3.7');

async function initAdapter() {
    let mySA = new SDOAdapter();
    await mySA.addVocabularies([VOC_OBJ_SDO3_7, VOC_OBJ_DACH]);
    return mySA;
}

describe('Class methods', () => {

    test("getTermType()", async () => {
        let mySA = await initAdapter();
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getTermType()).toBe("rdfs:Class");
    });

    test("getSource()", async () => {
        let mySA = await initAdapter();
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getSource()).toBe("https://www.w3.org/wiki/WebSchemas/SchemaDotOrgSources#STI_Accommodation_Ontology");
        let hospital = mySA.getClass("schema:Hospital");
        expect(hospital.getSource()).toBe(null);
    });

    test("getVocabulary()", async () => {
        let mySA = await initAdapter();
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getVocabulary()).toBe("http://schema.org");
        let Class = mySA.getClass("schema:Class");
        expect(Class.getVocabulary()).toBe("http://meta.schema.org");
        let trail = mySA.getClass("dachkg:Trail");
        expect(trail.getVocabulary()).toBe("http://dachkg.org/ontology/1.0");
    });

    test("getIRI()", async () => {
        let mySA = await initAdapter();
        let hospital = mySA.getClass("schema:Hospital");
        expect(hospital.getIRI()).toBe("http://schema.org/Hospital");
        expect(hospital.getIRI(true)).toBe("schema:Hospital");
        expect(hospital.getIRI()).toBe(hospital.getIRI(false));
        let trail = mySA.getClass("dachkg:Trail");
        expect(trail.getIRI(false)).toBe("http://dachkg.org/ontology/1.0/Trail");
    });

    test("getName()", async () => {
        let mySA = await initAdapter();
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getName()).toBe("Hotel");
        expect(hotel.getName('en')).toBe(hotel.getName());
        expect(hotel.getName('de')).toBe(null);
    });

    test("getDescription()", async () => {
        let mySA = await initAdapter();
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getDescription()).toBe("A hotel is an establishment that provides lodging paid on a short-term basis (Source: Wikipedia, the free encyclopedia, see http://en.wikipedia.org/wiki/Hotel).\n" +
            "<br /><br />\n" +
            "See also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.");
        expect(hotel.getDescription('en')).toBe("A hotel is an establishment that provides lodging paid on a short-term basis (Source: Wikipedia, the free encyclopedia, see http://en.wikipedia.org/wiki/Hotel).\n" +
            "<br /><br />\n" +
            "See also the <a href=\"/docs/hotels.html\">dedicated document on the use of schema.org for marking up hotels and other forms of accommodations</a>.");
        expect(hotel.getDescription('de')).toBe(null);
    });

    test("isSupersededBy()", async () => {
        let mySA = await initAdapter();
        let UserPlays = mySA.getClass("schema:UserPlays");
        expect(UserPlays.isSupersededBy()).toBe("schema:InteractionCounter");
        let Hotel = mySA.getClass("schema:Hotel");
        expect(Hotel.isSupersededBy()).toBe(null);
    });

    test("getProperties()", async () => {
        let mySA = await initAdapter();
        let person = mySA.getClass("schema:Person");
        expect(person.getProperties()).toContain("schema:givenName");
        expect(person.getProperties(true)).toContain("schema:givenName");
        expect(person.getProperties(false)).toContain("schema:givenName");
        expect(person.getProperties(true)).toContain("schema:name");
        expect(person.getProperties(false)).not.toContain("schema:name");
        let event = mySA.getClass("schema:Event");
        let musicEvent = mySA.getClass("schema:MusicEvent");
        let eventProps = event.getProperties(true);
        let musicEventProps = musicEvent.getProperties(true);
        for (let i = 0; i < eventProps.length; i++) {
            expect(musicEventProps).toContain(eventProps[i]);
        }
        let crWork = mySA.getClass("schema:CreativeWork");
        expect(crWork.getProperties(true)).not.toContain("schema:legislationJurisdiction");
    });

    test("getSuperClasses()", async () => {
        let mySA = await initAdapter();
        let person = mySA.getClass("schema:Person");
        expect(person.getSuperClasses()).toContain("schema:Thing");
        expect(person.getSuperClasses()).not.toContain("schema:Event");
        let hotel = mySA.getClass("schema:Hotel");
        expect(hotel.getSuperClasses(true)).toContain("schema:Thing");
        expect(hotel.getSuperClasses(false)).not.toContain("schema:Thing");
    });

    test("getSubClasses()", async () => {
        let mySA = await initAdapter();
        let thing = mySA.getClass("schema:Thing");
        expect(thing.getSubClasses()).toContain("schema:Hospital");
        expect(thing.getSubClasses(false)).not.toContain("schema:Hospital");
        let lodgingBusiness = mySA.getClass("schema:LodgingBusiness");
        expect(lodgingBusiness.getSubClasses()).toContain("schema:Hotel");
        expect(lodgingBusiness.getSubClasses()).not.toContain("schema:Thing");
    });
});
