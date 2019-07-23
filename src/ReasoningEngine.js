const util = require('./utilities');


class ReasoningEngine {
    /**
     * @constructor
     * @param {object} graph The parent Graph-class to which this ReasoningEngine belongs
     */
    constructor(graph) {
        this.graph = graph;
    }

    inferPropertiesFromSuperClasses(superClasses) {
        let result = [];
        for (let s = 0; s < superClasses.length; s++) {
            let superClassObj = this.graph.classes[superClasses[s]];
            if (superClassObj === undefined) {
                superClassObj = this.graph.enumerations[superClasses[s]];
            }
            if (superClassObj !== undefined) {
                result.push(... superClassObj["soa:hasProperty"]);
                if(superClassObj["rdfs:subClassOf"].length !== 0){
                    result.push(... this.inferPropertiesFromSuperClasses(superClassObj["rdfs:subClassOf"]));
                }
            }
        }
        return util.uniquifyArray(result);
    }


}

module.exports = ReasoningEngine;