const Graph = require('./Graph')
const util = require('./utilities')
const axios = require('axios')

const RETRIEVAL_MEMORY = {
  versionsFile: null,
  latest: null
}

const URI_SDO_GITHUB = 'https://raw.githubusercontent.com/schemaorg/schemaorg/master/'
const URI_SDO_RELEASES = URI_SDO_GITHUB + 'data/releases/'
const URI_SDO_VERSIONS = URI_SDO_GITHUB + 'versions.json'

class SDOAdapter {
  /**
   * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
   *
   * @class
   */
  constructor () {
    this.graph = new Graph(this)
  }

  /**
   * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary
   *
   * @param {Array.<string|JSON>} vocabArray - The vocabularies to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch.
   * @returns {Promise.<void>} This is an async function
   */
  async addVocabularies (vocabArray) {
    if (util.isArray(vocabArray)) {
      // check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
      for (let i = 0; i < vocabArray.length; i++) {
        if (util.isString(vocabArray[i])) {
          if (
            vocabArray[i].startsWith('www') ||
            vocabArray[i].startsWith('http')
          ) {
            // assume it is a URL
            const fetchedVocab = await this.fetchVocabularyFromURL(
              vocabArray[i]
            )
            try {
              await this.graph.addVocabulary(fetchedVocab)
            } catch (e) {
              console.log(
                'The given URL ' +
                vocabArray[i] +
                ' did not contain a valid JSON-LD vocabulary.'
              )
            }
          } else {
            // assume it is a string-version of a JSON-LD
            try {
              await this.graph.addVocabulary(JSON.parse(vocabArray[i]))
            } catch (e) {
              console.log(
                'Parsing of vocabulary string produced an invalid JSON-LD.'
              )
            }
          }
        } else if (util.isObject(vocabArray[i])) {
          await this.graph.addVocabulary(vocabArray[i])
        } else {
          // invalid argument type!
          throw new Error(
            'The first argument of the function must be an Array of vocabularies (JSON-LD as Object/String)'
          )
        }
      }
    } else {
      throw new Error(
        'The first argument of the function must be an Array of vocabularies (JSON-LD)'
      )
    }
  }

  async fetchVocabularyFromURL (url) {
    try {
      return new Promise(function (resolve, reject) {
        axios
          .get(url)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (err) {
            reject(console.log(err))
          })
      })
    } catch (e) {
      console.log(e)
      return ''
    }
  }

  /**
   * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
   *
   * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
   * @param {object|null} filter - (default = null) an optional filter for the Class creation
   * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
   */
  getClass (id, filter = null) {
    // returns also enumerations
    return this.graph.getClass(id, filter)
  }

  /**
   * Creates an array of JS-Classes for all vocabulary Classes
   *
   * @param {object|null} filter - (default = null) an optional filter for the Class creation
   * @returns {Array.<Class|Enumeration>} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
   */
  getAllClasses (filter = null) {
    const classesIRIList = this.getListOfClasses(filter)
    const result = []
    for (let i = 0; i < classesIRIList.length; i++) {
      try {
        result.push(this.getClass(classesIRIList[i]))
      } catch (e) {
        throw new Error('There is no class with the IRI ' + classesIRIList[i])
      }
    }
    return result
  }

  /**
   * Creates an array of IRIs for all vocabulary Classes
   *
   * @param {object|null} filter - (default = null) an optional filter for the List creation
   * @returns {Array.<string>} An array of IRIs representing all vocabulary Classes, does not include Enumerations
   */
  getListOfClasses (filter = null) {
    // do not include enumerations
    return util.applyFilter(
      Object.keys(this.graph.classes),
      filter,
      this.graph
    )
  }

  /**
   * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
   *
   * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
   * @param {object|null} filter - (default = null) an optional filter for the Property creation
   * @returns {Property} The JS-Class representing a Property
   */
  getProperty (id, filter = null) {
    return this.graph.getProperty(id, filter)
  }

  /**
   * Creates an array of JS-Classes for all vocabulary Properties
   *
   * @param {object|null} filter - (default = null) an optional filter for the Property creation
   * @returns {Array.<Property>} An array of JS-Classes representing all vocabulary Properties
   */
  getAllProperties (filter = null) {
    const propertiesIRIList = this.getListOfProperties(filter)
    const result = []
    for (let i = 0; i < propertiesIRIList.length; i++) {
      try {
        result.push(this.getProperty(propertiesIRIList[i]))
      } catch (e) {
        throw new Error('There is no property with the IRI ' + propertiesIRIList[i])
      }
    }
    return result
  }

  /**
   * Creates an array of IRIs for all vocabulary Properties
   *
   * @param {object|null} filter - (default = null) an optional filter for the List creation
   * @returns {Array.<string>} An array of IRIs representing all vocabulary Properties
   */
  getListOfProperties (filter = null) {
    return util.applyFilter(
      Object.keys(this.graph.properties),
      filter,
      this.graph
    )
  }

  /**
   * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
   *
   * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
   * @param {object|null} filter - (default = null) an optional filter for the DataType creation
   * @returns {DataType} The JS-Class representing a DataType
   */
  getDataType (id, filter = null) {
    return this.graph.getDataType(id, filter)
  }

  /**
   * Creates an array of JS-Classes for all vocabulary DataTypes
   *
   * @param {object|null} filter - (default = null) an optional filter for the DataType creation
   * @returns {Array.<DataType>} An array of JS-Classes representing all vocabulary DataTypes
   */
  getAllDataTypes (filter = null) {
    const dataTypesIRIList = this.getListOfDataTypes(filter)
    const result = []
    for (let i = 0; i < dataTypesIRIList.length; i++) {
      try {
        result.push(this.getDataType(dataTypesIRIList[i]))
      } catch (e) {
        throw new Error('There is no data type with the IRI ' + dataTypesIRIList[i])
      }
    }
    return result
  }

  /**
   * Creates an array of IRIs for all vocabulary DataTypes
   *
   * @param {object|null} filter - (default = null) an optional filter for the List creation
   * @returns {Array.<string>} An array of IRIs representing all vocabulary DataTypes
   */
  getListOfDataTypes (filter = null) {
    return util.applyFilter(
      Object.keys(this.graph.dataTypes),
      filter,
      this.graph
    )
  }

  /**
   * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
   *
   * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
   * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
   * @returns {Enumeration} The JS-Class representing an Enumeration
   */
  getEnumeration (id, filter = null) {
    return this.graph.getEnumeration(id, filter)
  }

  /**
   * Creates an array of JS-Classes for all vocabulary Enumerations
   *
   * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
   * @returns {Array.<Enumeration>} An array of JS-Classes representing all vocabulary Enumerations
   */
  getAllEnumerations (filter = null) {
    const enumerationsIRIList = this.getListOfEnumerations(filter)
    const result = []
    for (let i = 0; i < enumerationsIRIList.length; i++) {
      try {
        result.push(this.getEnumeration(enumerationsIRIList[i]))
      } catch (e) {
        throw new Error('There is no enumeration with the IRI ' + enumerationsIRIList[i])
      }
    }
    return result
  }

  /**
   * Creates an array of IRIs for all vocabulary Enumerations
   *
   * @param {object|null} filter - (default = null) an optional filter for the List creation
   * @returns {Array.<string>} An array of IRIs representing all vocabulary Enumerations
   */
  getListOfEnumerations (filter = null) {
    return util.applyFilter(
      Object.keys(this.graph.enumerations),
      filter,
      this.graph
    )
  }

  /**
   * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
   *
   * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
   * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
   * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
   */
  getEnumerationMember (id, filter = null) {
    return this.graph.getEnumerationMember(id, filter)
  }

  /**
   * Creates an array of JS-Classes for all vocabulary EnumerationMember
   *
   * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
   * @returns {Array.<EnumerationMember>} An array of JS-Classes representing all vocabulary EnumerationMember
   */
  getAllEnumerationMembers (filter = null) {
    const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter)
    const result = []
    for (let i = 0; i < enumerationMembersIRIList.length; i++) {
      try {
        result.push(this.getEnumerationMember(enumerationMembersIRIList[i]))
      } catch (e) {
        throw new Error('There is no enumeration member with the IRI ' + enumerationMembersIRIList[i])
      }
    }
    return result
  }

  /**
   * Creates an array of IRIs for all vocabulary EnumerationMember
   *
   * @param {object|null} filter - (default = null) an optional filter for the List creation
   * @returns {Array.<string>} An array of IRIs representing all vocabulary EnumerationMember
   */
  getListOfEnumerationMembers (filter = null) {
    return util.applyFilter(
      Object.keys(this.graph.enumerationMembers),
      filter,
      this.graph
    )
  }

  /**
   * Returns key-value pairs of the vocabularies used in this SDOAdapter
   *
   * @returns {object} An object containing the key-value pairs representing the used vocabularies
   */
  getVocabularies () {
    const vocabKeys = Object.keys(this.graph.context)
    const result = {}
    const blacklist = ['soa', 'xsd', 'rdf', 'rdfa', 'rdfs', 'dc'] // standard vocabs that should not be exposed
    for (let i = 0; i < vocabKeys.length; i++) {
      if (util.isString(this.graph.context[vocabKeys[i]])) {
        if (blacklist.indexOf(vocabKeys[i]) === -1) {
          result[vocabKeys[i]] = this.graph.context[vocabKeys[i]]
        }
      }
    }
    return result
  }

  /**
   * Creates a URL pointing to the Schema.org vocabulary (the wished version/extension can be specified). This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary. Invalid version or vocabularyPart arguments will result in errors, check https://schema.org/docs/developers.html for more information
   * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/master/versions.json is used.
   *
   * @param {?string} version - the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
   * @param {?string} vocabularyPart - the wished part of the Schema.org vocabulary (schema.org has a core vocabulary and some extensions, check https://schema.org/docs/developers.html for more information). default: "schema" (the core vocabulary)
   * @returns {Promise.<string>} The URL to the Schema.org vocabulary
   */
  async constructSDOVocabularyURL (version = 'latest', vocabularyPart = 'schema') {
    // "https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.9/all-layers.jsonld";
    if (version === 'latest') {
      try {
        if (!RETRIEVAL_MEMORY.versionsFile) {
          //1. retrieve versions file if needed (checks for latest and valid version)
          await this.getSDOVersionFile()
        }
        //2. use latest version
        return URI_SDO_RELEASES + RETRIEVAL_MEMORY.latest + '/' + vocabularyPart + '.jsonld'
      } catch (e) {
        console.log('Could not determine/retrieve the latest version of schema.org')
        throw e
      }
    } else {
      return URI_SDO_RELEASES + version + '/' + vocabularyPart + '.jsonld'
    }
  }

  /**
   * Retrieves the schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/master/versions.json
   * and saves it in the local memory. Also sends head-requests to determine if the 'latest' version is really 'fetchable'.
   * If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the memory.
   *
   * @returns {Promise<void>} Returns void when the process ends (signalizing the process ending).
   */
  async getSDOVersionFile () {
    let versionFile
    //1. retrieve versions file
    try {
      versionFile = await axios.get(URI_SDO_VERSIONS)
    } catch (e) {
      console.log('Unable to retrieve the schema.org versions file at ' + URI_SDO_VERSIONS)
      throw(e)
    }
    //2. determine the latest valid version
    if (versionFile && versionFile.data) {
      RETRIEVAL_MEMORY.versionsFile = versionFile.data
      if (RETRIEVAL_MEMORY.versionsFile.schemaversion) {
        if (await this.checkURL(URI_SDO_RELEASES + RETRIEVAL_MEMORY.versionsFile.schemaversion + '/all-layers.jsonld')) {
          RETRIEVAL_MEMORY.latest = RETRIEVAL_MEMORY.versionsFile.schemaversion
        } else {
          if (RETRIEVAL_MEMORY.versionsFile.releaseLog) {
            let versions = Object.keys(RETRIEVAL_MEMORY.versionsFile.releaseLog).sort();
            for (let i = versions.length - 1; i >= 0; i--) {
              if (await this.checkURL(URI_SDO_RELEASES + versions[i] + '/all-layers.jsonld')) {
                RETRIEVAL_MEMORY.latest = versions[i]
                break
              }
            }
          }
        }
        return
      }
      console.log('Schema.org versions file has an unexpected structure -> ' + URI_SDO_VERSIONS)
      throw new Error('Schema.org versions file has an unexpected structure!')
    }
  }

  /**
   * Sends a head-request to the given URL, checking if content exists.
   *
   * @param {string} url - the URL to check
   * @returns {Promise<boolean>} - returns true if there is content
   */
  async checkURL (url) {
    try {
      await axios.head(url)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Returns the latest version number of the schema.org vocabulary
   * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/master/versions.json is used.
   *
   * @returns {Promise.<string>} The latest version of the schema.org vocabulary
   */
  async getLatestSDOVersion () {
    if (!RETRIEVAL_MEMORY.latest) {
      //retrieve versions file if needed (checks for latest and valid version)
      await this.getSDOVersionFile()
    }
    return RETRIEVAL_MEMORY.latest
  }
}

module.exports = SDOAdapter
