// the functions for a enumeration Object
const util = require('./utilities')

class Enumeration {
  /**
   * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI
   *
   * @class
   * @param {string} IRI - The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek"
   * @param {object} graph - The underlying data graph to enable the methods of this Enumeration
   */
  constructor (IRI, graph) {
    this.IRI = IRI
    this.graph = graph
  }

  /**
   * Retrieves the IRI (@id) of this Enumeration in compact/absolute form
   *
   * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:DayOfWeek", if false -> return absolute IRI -> "http://schema.org/DayOfWeek"
   * @returns {string} The IRI (@id) of this Enumeration
   */
  getIRI (compactForm = false) {
    if (compactForm) {
      return this.IRI
    } else {
      return util.toAbsoluteIRI(this.IRI, this.graph.context)
    }
  }

  /**
   * Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")
   *
   * @returns {string} The term type of this Enumeration -> "schema:Enumeration"
   */
  getTermType () {
    return 'schema:Enumeration'
  }

  /**
   * Retrieves the original vocabulary (schema:isPartOf) of this Enumeration
   *
   * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Enumeration
   */
  getVocabulary () {
    const enumObj = this.graph.enumerations[this.IRI]
    if (enumObj['schema:isPartOf'] !== undefined) {
      return enumObj['schema:isPartOf']
    } else {
      return null
    }
  }

  /**
   * Retrieves the source (dc:source) of this Enumeration
   *
   * @returns {string|null} The source IRI given by the "dc:source" of this Enumeration (null if none)
   */
  getSource () {
    const enumObj = this.graph.enumerations[this.IRI]
    if (enumObj['dc:source'] !== undefined) {
      return enumObj['dc:source']
    } else {
      return null
    }
  }

  /**
   * Retrieves the Enumeration superseding (schema:supersededBy) this Enumeration
   *
   * @returns {string|null} The Enumeration superseding this Enumeration (null if none)
   */
  isSupersededBy () {
    const enumObj = this.graph.enumerations[this.IRI]
    if (util.isString(enumObj['schema:supersededBy'])) {
      return enumObj['schema:supersededBy']
    } else {
      return null
    }
  }

  /**
   * Retrieves the name (rdfs:label) of this Enumeration in a wished language (optional)
   *
   * @param {string} language - (default = "en") the wished language for the name
   * @returns {string|null} The name of this Enumeration (null if not given for specified language)
   */
  getName (language = 'en') {
    const nameObj = this.graph.enumerations[this.IRI]['rdfs:label']
    if (nameObj === null || nameObj[language] === undefined) {
      return null
    }
    return nameObj[language]
  }

  /**
   * Retrieves the description (rdfs:comment) of this Enumeration in a wished language (optional)
   *
   * @param {string} language - (default = "en") the wished language for the description
   * @returns {string|null} The description of this Enumeration (null if not given for specified language)
   */
  getDescription (language = 'en') {
    const descriptionObj = this.graph.enumerations[this.IRI]['rdfs:comment']
    if (descriptionObj === null || descriptionObj[language] === undefined) {
      return null
    }
    return descriptionObj[language]
  }

  /**
   * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
   *
   * @returns {Array} The enumeration members of this Enumeration
   * @param {object|null} filter - (default = null) an optional filter for the enumeration members
   */
  getEnumerationMembers (filter = null) {
    const enumObj = this.graph.enumerations[this.IRI]
    const result = enumObj['soa:hasEnumerationMember']
    return util.applyFilter(util.uniquifyArray(result), filter, this.graph)
  }

  /**
   * Retrieves the explicit/implicit properties (soa:hasProperty) of this Enumeration
   *
   * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
   * @param {object|null} filter - (default = null) an optional filter for the properties
   * @returns {Array} The properties of this Enumeration
   */
  getProperties (implicit = true, filter = null) {
    const enumObj = this.graph.enumerations[this.IRI]
    const result = []
    result.push(...enumObj['soa:hasProperty'])
    if (implicit === true) {
      // add properties from super-classes
      result.push(...this.graph.reasoner.inferPropertiesFromSuperClasses(enumObj['rdfs:subClassOf']))
      // add sub-properties ? todo
      // for (let p = 0; p < result.length; p++) {
      //     result.push(... this.graph.reasoner.inferSubProperties(result[p]));
      // }
    }
    return util.applyFilter(util.uniquifyArray(result), filter, this.graph)
  }

  /**
   * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Enumeration
   *
   * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
   * @param {object|null} filter - (default = null) an optional filter for the super-classes
   * @returns {Array} The super-classes of this Enumeration
   */
  getSuperClasses (implicit = true, filter = null) {
    const enumObj = this.graph.enumerations[this.IRI]
    const result = []
    if (implicit === true) {
      result.push(...this.graph.reasoner.inferImplicitSuperClasses(this.IRI))
    } else {
      result.push(...enumObj['rdfs:subClassOf'])
    }
    return util.applyFilter(util.uniquifyArray(result), filter, this.graph)
  }

  /**
   * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Enumeration
   *
   * @param {boolean} implicit - (default = true) retrieves also implicit sub-classes (recursive from sub-classes)
   * @param {object|null} filter - (default = null) an optional filter for the sub-classes
   * @returns {Array} The sub-classes of this Enumeration
   */
  getSubClasses (implicit = true, filter = null) {
    const enumObj = this.graph.enumerations[this.IRI]
    const result = []
    if (implicit === true) {
      result.push(...this.graph.reasoner.inferImplicitSubClasses(this.IRI))
    } else {
      result.push(...enumObj['soa:superClassOf'])
    }
    return util.applyFilter(util.uniquifyArray(result), filter, this.graph)
  }

  /**
   * Generates a string representation of this Enumeration (Based on its JSON representation)
   *
   * @returns {string} The string representation of this Enumeration
   */
  toString () {
    return JSON.stringify(this.toJSON(false, null), null, 2)
  }

  /**
   * Generates an explicit/implicit JSON representation of this Enumeration
   *
   * @param {boolean} implicit - (default = true) includes also implicit data
   * @param {object|null} filter - (default = null) an optional filter for the generated data
   * @returns {object} The JSON representation of this Enumeration
   */
  toJSON (implicit = true, filter = null) {
    const result = {}
    result.id = this.getIRI(true)
    result.IRI = this.getIRI()
    result.type = this.getTermType()
    result.vocabulary = this.getVocabulary()
    result.source = this.getSource()
    result.supersededBy = this.isSupersededBy()
    result.name = this.getName()
    result.description = this.getDescription()
    result.enumerationMembers = this.getEnumerationMembers(filter)
    result.superClasses = this.getSuperClasses(implicit, filter)
    result.subClasses = this.getSubClasses(implicit, filter)
    result.properties = this.getProperties(implicit, filter)
    return result
  }
}

module.exports = Enumeration
