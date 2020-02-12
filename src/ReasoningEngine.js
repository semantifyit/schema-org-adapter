const util = require('./utilities')

class ReasoningEngine {
  /**
   * @class
   * @param {Graph} graph The parent Graph-class to which this ReasoningEngine belongs
   */
  constructor (graph) {
    this.graph = graph
  }

  inferPropertiesFromSuperClasses (superClasses) {
    const result = []
    for (let s = 0; s < superClasses.length; s++) {
      let superClassObj = this.graph.classes[superClasses[s]]
      if (superClassObj === undefined) {
        superClassObj = this.graph.enumerations[superClasses[s]]
      }
      if (superClassObj !== undefined) {
        result.push(...superClassObj['soa:hasProperty'])
        if (superClassObj['rdfs:subClassOf'].length !== 0) {
          result.push(...this.inferPropertiesFromSuperClasses(superClassObj['rdfs:subClassOf']))
        }
      }
    }
    return util.uniquifyArray(result)
  }

  inferImplicitSuperClasses (classIRI) {
    let classObj = this.graph.classes[classIRI]
    let result = []
    if (classObj === undefined) {
      classObj = this.graph.enumerations[classIRI]
    }
    if (classObj !== undefined) {
      result.push(...classObj['rdfs:subClassOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          let parentClassObj = this.graph.classes[addition[i]]
          if (parentClassObj === undefined) {
            parentClassObj = this.graph.enumerations[addition[i]]
          }
          if (parentClassObj !== undefined) {
            newAddition.push(...parentClassObj['rdfs:subClassOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
    }
    return result
  }

  inferImplicitSubClasses (classIRI) {
    let classObj = this.graph.classes[classIRI]
    let result = []
    if (classObj === undefined) {
      classObj = this.graph.enumerations[classIRI]
    }
    if (classObj !== undefined) {
      result.push(...classObj['soa:superClassOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          let parentClassObj = this.graph.classes[addition[i]]
          if (parentClassObj === undefined) {
            parentClassObj = this.graph.enumerations[addition[i]]
          }
          if (parentClassObj !== undefined) {
            newAddition.push(...parentClassObj['soa:superClassOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
      return result
    }
    return result
  }

  inferImplicitSuperDataTypes (dataTypeIRI) {
    const dataTypeObj = this.graph.dataTypes[dataTypeIRI]
    let result = []
    if (dataTypeObj !== undefined) {
      result.push(...dataTypeObj['rdfs:subClassOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          const parentDataTypeObj = this.graph.dataTypes[addition[i]]
          if (parentDataTypeObj !== undefined) {
            newAddition.push(...parentDataTypeObj['rdfs:subClassOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
    }
    return result
  }

  inferImplicitSubDataTypes (dataTypeIRI) {
    const dataTypeObj = this.graph.dataTypes[dataTypeIRI]
    let result = []
    if (dataTypeObj !== undefined) {
      result.push(...dataTypeObj['soa:superClassOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          const childDataTypeObj = this.graph.dataTypes[addition[i]]
          if (childDataTypeObj !== undefined) {
            newAddition.push(...childDataTypeObj['soa:superClassOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
    }
    return result
  }

  inferSubProperties (propertyIRI) {
    const propertyObj = this.graph.properties[propertyIRI]
    let result = []
    if (propertyObj !== undefined) {
      result.push(...propertyObj['soa:superPropertyOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          const parentPropertyObj = this.graph.properties[addition[i]]
          if (parentPropertyObj !== undefined) {
            newAddition.push(...parentPropertyObj['soa:superPropertyOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
    }
    return result
  }

  inferSuperProperties (propertyIRI) {
    const propertyObj = this.graph.properties[propertyIRI]
    let result = []
    if (propertyObj !== undefined) {
      result.push(...propertyObj['rdfs:subPropertyOf'])
      let addition = util.copByVal(result) // make a copy
      do {
        let newAddition = []
        for (let i = 0; i < addition.length; i++) {
          const parentPropertyObj = this.graph.properties[addition[i]]
          if (parentPropertyObj !== undefined) {
            newAddition.push(...parentPropertyObj['rdfs:subPropertyOf'])
          }
        }
        newAddition = util.uniquifyArray(newAddition)
        addition = util.copByVal(newAddition)
        result.push(...newAddition)
      } while (addition.length !== 0)
      result = util.uniquifyArray(result)
    }
    return result
  }
}

module.exports = ReasoningEngine
