const util = require('./utilities');

class ReasoningEngine {
    /**
     * This internal js-class offers reasoning-related functions that can be used by the other js-classes of this library
     *
     * @class
     * @param {Graph} graph The parent Graph-class to which this ReasoningEngine belongs
     */
    constructor(graph) {
        this.graph = graph;
    }

    /**
     * Infers all properties that can be used by the given classes and all their implicit and explicit superClasses
     *
     * @param {string[]} superClasses - Array with IRIs of classes/enumerations
     * @returns {string[]} Array of IRIs of all properties from the given classes and their implicit and explicit superClasses
     */
    inferPropertiesFromSuperClasses(superClasses) {
        const result = [];
        for (const superClass of superClasses) {
            let superClassObj = this.graph.classes[superClass] || this.graph.enumerations[superClass];
            if (superClassObj) {
                result.push(...superClassObj['soa:hasProperty']);
                if (superClassObj['rdfs:subClassOf'].length !== 0) {
                    result.push(...this.inferPropertiesFromSuperClasses(superClassObj['rdfs:subClassOf']));
                }
            }
        }
        return util.uniquifyArray(result);
    }

    /**
     * Infers all implicit and explicit superClasses of a given Class/Enumeration
     *
     * @param {string} classIRI - IRI of a Class/Enumeration
     * @returns {string[]} Array of IRI of all implicit and explicit superClasses
     */
    inferSuperClasses(classIRI) {
        let result = [];
        const classObj = this.graph.classes[classIRI] || this.graph.enumerations[classIRI];
        if (classObj) {
            result.push(...classObj['rdfs:subClassOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (const curAdd of addition) {
                    let parentClassObj = this.graph.classes[curAdd] || this.graph.enumerations[curAdd];
                    if (parentClassObj) {
                        newAddition.push(...parentClassObj['rdfs:subClassOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }

    /**
     * Infers all implicit and explicit subClasses of a given Class/Enumeration
     *
     * @param {string} classIRI - IRI of a Class/Enumeration
     * @returns {string[]} Array of IRI of all implicit and explicit subClasses
     */
    inferSubClasses(classIRI) {
        let result = [];
        const classObj = this.graph.classes[classIRI] || this.graph.enumerations[classIRI];
        if (classObj) {
            result.push(...classObj['soa:superClassOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (const curAdd of addition) {
                    let parentClassObj = this.graph.classes[curAdd] || this.graph.enumerations[curAdd];
                    if (parentClassObj) {
                        newAddition.push(...parentClassObj['soa:superClassOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }

    /**
     * Infers all implicit and explicit superDataTypes of a given DataType
     *
     * @param {string} dataTypeIRI - IRI of a DataType
     * @returns {string[]} Array of IRI of all implicit and explicit superDataTypes
     */
    inferSuperDataTypes(dataTypeIRI) {
        let result = [];
        const dataTypeObj = this.graph.dataTypes[dataTypeIRI];
        if (dataTypeObj) {
            result.push(...dataTypeObj['rdfs:subClassOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (const curAdd of addition) {
                    const parentDataTypeObj = this.graph.dataTypes[curAdd];
                    if (parentDataTypeObj) {
                        newAddition.push(...parentDataTypeObj['rdfs:subClassOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }

    /**
     * Infers all implicit and explicit subDataTypes of a given DataType
     *
     * @param {string} dataTypeIRI - IRI of a DataType
     * @returns {string[]} Array of IRI of all implicit and explicit subDataTypes
     */
    inferSubDataTypes(dataTypeIRI) {
        let result = [];
        const dataTypeObj = this.graph.dataTypes[dataTypeIRI];
        if (dataTypeObj) {
            result.push(...dataTypeObj['soa:superClassOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (const curAdd of addition) {
                    const childDataTypeObj = this.graph.dataTypes[curAdd];
                    if (childDataTypeObj) {
                        newAddition.push(...childDataTypeObj['soa:superClassOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }

    /**
     * Infers all implicit and explicit superProperties of a given Property
     *
     * @param {string} propertyIRI - IRI of a Property
     * @returns {string[]} Array of IRI of all implicit and explicit superProperties
     */
    inferSuperProperties(propertyIRI) {
        let result = [];
        const propertyObj = this.graph.properties[propertyIRI];
        if (propertyObj) {
            result.push(...propertyObj['rdfs:subPropertyOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (let curAdd of addition) {
                    const parentPropertyObj = this.graph.properties[curAdd];
                    if (parentPropertyObj) {
                        newAddition.push(...parentPropertyObj['rdfs:subPropertyOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }

    /**
     * Infers all implicit and explicit subProperties of a given Property
     *
     * @param {string} propertyIRI - IRI of a Property
     * @returns {string[]} Array of IRI of all implicit and explicit subProperties
     */
    inferSubProperties(propertyIRI) {
        let result = [];
        const propertyObj = this.graph.properties[propertyIRI];
        if (propertyObj) {
            result.push(...propertyObj['soa:superPropertyOf']);
            let addition = util.copByVal(result); // make a copy
            do {
                let newAddition = [];
                for (const curAdd of addition) {
                    const parentPropertyObj = this.graph.properties[curAdd];
                    if (parentPropertyObj) {
                        newAddition.push(...parentPropertyObj['soa:superPropertyOf']);
                    }
                }
                newAddition = util.uniquifyArray(newAddition);
                addition = util.copByVal(newAddition);
                result.push(...newAddition);
            } while (addition.length !== 0);
            result = util.uniquifyArray(result);
        }
        return result;
    }
}

module.exports = ReasoningEngine;
