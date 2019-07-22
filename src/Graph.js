const utilities = require("./utilities");

const GraphClass = require("./GraphClass");
const Class = require("./Class");

class Graph {
    constructor(sdoAdapter) {
        this.sdoAdapter = sdoAdapter;
        this.context = {};
        this.classes = {}; //key are the URI
        this.properties = {}; //key are the URI
        this.dataTypes = {}; //key are the URI
        this.enumerations = {}; //key are the URI
        this.enumerationValues = {}; //key are the URI
        this.addGraphClass(new GraphClass( {
            "@id": "http://schema.org/MedicalProcedure",
            "@type": "rdfs:Class",
            "http://schema.org/isPartOf": {
                "@id": "http://health-lifesci.schema.org"
            },
            "http://www.w3.org/2002/07/owl#equivalentClass": {
                "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/50731006"
            },
            "rdfs:comment": "A process of care used in either a diagnostic, therapeutic, preventive or palliative capacity that relies on invasive (surgical), non-invasive, or other techniques.",
            "rdfs:label": "MedicalProcedure",
            "rdfs:subClassOf": {
                "@id": "http://schema.org/MedicalEntity"
            }
        }));
    }

    addVocabulary(vocab) {

    }

    addGraphClass(graphClass) {
        if (graphClass.id !== undefined) {
            this.classes[graphClass.id] = graphClass;
        }
    }

    getClass(URI, filter = null) {
        let classObj = this.classes[URI];
        if (classObj !== undefined) {
            classObj = utilities.applyFilter([classObj], filter);
            if (classObj.length === 0) {
                throw new Error("There is no class with that URI and filter settings.");
            } else {
                return new Class(URI, this);
            }
        } else {
            throw new Error("There is no class with that URI.");
        }

    }

    getProperty(URI, filter = null) {
        let graphProperty = this.classes[URI];
        if (graphProperty !== undefined) {
            graphProperty = utilities.applyFilter([graphProperty], filter);
            if (graphProperty.length === 0) {
                throw new Error("There is no property with that URI and filter settings.");
            } else {
                return new Property(URI, this);
            }
        } else {
            throw new Error("There is no property with that URI.");
        }

    }
}

module.exports = Graph;