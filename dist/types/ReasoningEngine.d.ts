export = ReasoningEngine;
declare class ReasoningEngine {
    /**
     * This internal js-class offers reasoning-related functions that can be used by the other js-classes of this library
     *
     * @class
     * @param {Graph} graph The parent Graph-class to which this ReasoningEngine belongs
     */
    constructor(graph: any);
    graph: any;
    util: typeof import("./utilities");
    /**
     * Infers all properties that can be used by the given classes and all their implicit and explicit superClasses
     *
     * @param {string[]} superClasses - Array with IRIs of classes/enumerations
     * @returns {string[]} Array of IRIs of all properties from the given classes and their implicit and explicit superClasses
     */
    inferPropertiesFromSuperClasses(superClasses: string[]): string[];
    /**
     * Infers all implicit and explicit superClasses of a given Class/Enumeration
     *
     * @param {string} classIRI - IRI of a Class/Enumeration
     * @returns {string[]} Array of IRI of all implicit and explicit superClasses
     */
    inferSuperClasses(classIRI: string): string[];
    /**
     * Infers all implicit and explicit subClasses of a given Class/Enumeration
     *
     * @param {string} classIRI - IRI of a Class/Enumeration
     * @returns {string[]} Array of IRI of all implicit and explicit subClasses
     */
    inferSubClasses(classIRI: string): string[];
    /**
     * Infers all implicit and explicit superDataTypes of a given DataType
     *
     * @param {string} dataTypeIRI - IRI of a DataType
     * @returns {string[]} Array of IRI of all implicit and explicit superDataTypes
     */
    inferSuperDataTypes(dataTypeIRI: string): string[];
    /**
     * Infers all implicit and explicit subDataTypes of a given DataType
     *
     * @param {string} dataTypeIRI - IRI of a DataType
     * @returns {string[]} Array of IRI of all implicit and explicit subDataTypes
     */
    inferSubDataTypes(dataTypeIRI: string): string[];
    /**
     * Infers all implicit and explicit superProperties of a given Property
     *
     * @param {string} propertyIRI - IRI of a Property
     * @returns {string[]} Array of IRI of all implicit and explicit superProperties
     */
    inferSuperProperties(propertyIRI: string): string[];
    /**
     * Infers all implicit and explicit subProperties of a given Property
     *
     * @param {string} propertyIRI - IRI of a Property
     * @returns {string[]} Array of IRI of all implicit and explicit subProperties
     */
    inferSubProperties(propertyIRI: string): string[];
    /**
     * Infers all implicit and explicit properties that can have the given Class/Enumeration/DataType as range
     *
     * @param {string} rangeIRI - IRI of the range (Class/Enumeration/DataType)
     * @returns {string[]} Array of IRI of all implicit and explicit properties that can use the given range
     */
    inferRangeOf(rangeIRI: string): string[];
}
