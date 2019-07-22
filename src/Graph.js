const util = require("./utilities");
const GraphClass = require("./GraphClass");
const Class = require("./Class");

class Graph {
    /**
     * @constructor
     * @param {object} sdoAdapter The parent sdoAdapter-class to which this Graph belongs
     */
    constructor(sdoAdapter) {
        this.sdoAdapter = sdoAdapter;
        this.context = {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "dc": "http://purl.org/dc/terms/",
            "schema": "http://schema.org/",
            "rdfs:subClassOf": {
                "@id": "rdfs:subClassOf",
                "@type": "@id"
            },
            "rdfs:subPropertyOf": {
                "@id": "rdfs:subPropertyOf",
                "@type": "@id"
            },
            "schema:isPartOf": {
                "@id": "schema:isPartOf",
                "@type": "@id"
            },
            "schema:domainIncludes": {
                "@id": "schema:domainIncludes",
                "@type": "@id"
            },
            "schema:rangeIncludes": {
                "@id": "schema:rangeIncludes",
                "@type": "@id"
            },
            "schema:supersededBy": {
                "@id": "schema:supersededBy",
                "@type": "@id"
            },
            "schema:inverseOf": {
                "@id": "schema:inverseOf",
                "@type": "@id"
            },
            "dc:source": {
                "@id": "dc:source",
                "@type": "@id"
            }
        };
        this.classes = {}; //keys are the URI
        this.properties = {}; //keys are the URI
        this.dataTypes = {}; //keys are the URI
        this.enumerations = {}; //keys are the URI
        this.enumerationValues = {}; //keys are the URI
        this.meta = {}; //keys are the URI, elements are the meta elements of the vocabulary (Enumeration, Class, Property, Datatype)
    }

    /**
     * Adds a new vocabulary (in JSON-LD format) to the graph data
     * @param {object} vocab - The vocabulary to add the graph, in JSON-LD format
     * @return {boolean} returns true on success
     */
    async addVocabulary(vocab) {
        try {
            //create new context
            this.context = util.generateContext(this.context, vocab["@context"]);
            //pre-process new vocab
            vocab = await util.preProcessVocab(vocab, this.context); //adapt @graph to new context
            for (let i = 0; i < vocab["@graph"].length; i++) {
                vocab["@graph"][i] = util.curateNode(vocab["@graph"][i]); //curate nodes
            }
            //add new vocab
            console.log(JSON.stringify(vocab, null, 2));

            //Classify Input
            /**
             Classify every @graph node based on its @type. The node is transformed to another data-model based on the @type and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the @type is not enough for a correct classification. The mapping of our data model and the @type(s) of the corresponding @graph nodes are as follows:
             classes ("@type" = "rdfs:Class")
             properties ("@type" = "rdf:Property")
             dataTypes ("@type" = "rdfs:Class" + "http://schema.org/DataType")
             enumerations ("@type" = "rdfs:Class")
             enumerationMembers ("@type" = @id of enumeration)
             */
            this.addGraphClass(new GraphClass({
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

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Creates/Updates a class node in the graph
     * @param {object} graphClass - The class node in JSON-LD format
     * @return {boolean} returns true on success
     */
    addGraphClass(graphClass) {
        try {
            if (graphClass.id !== undefined) {
                this.classes[graphClass.id] = graphClass;
            } else {
                //merging algorithm
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Creates/Updates a class node in the graph
     * @param {string} URI - The URI of the wished class node
     * @param {object} filter - (optional) The filter settings to be applied on the search
     * @return {Class} the Class object for the given URI
     */
    getClass(URI, filter = null) {
        let classObj = this.classes[URI];
        if (classObj !== undefined) {
            classObj = util.applyFilter([classObj], filter);
            if (classObj.length === 0) {
                throw new Error("There is no class with that URI and filter settings.");
            } else {
                return new Class(URI, this);
            }
        } else {
            throw new Error("There is no class with the URI " + URI);
        }

    }

    getProperty(URI, filter = null) {
        let graphProperty = this.classes[URI];
        if (graphProperty !== undefined) {
            graphProperty = util.applyFilter([graphProperty], filter);
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