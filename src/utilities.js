function applyFilter(dataArray, filter) {
    if (!Array.isArray(dataArray) || dataArray.length === 0 || filter === null) {
        return dataArray;
    }
    let result = [];
    for (let i = 0; i < dataArray.length; i++) {
        //superseeded
        if(filter.superseeded !== undefined){
            if(filter.superseeded === false && dataArray[i].getSuperseeded() !== false ){
                continue; //skip this element
            }
            if(filter.superseeded === true && dataArray[i].getSuperseeded() === false ){
                continue; //skip this element
            }
        }
        //partOf

        //termType
        if(filter.termType !== undefined){
            if(filter.termType !== dataArray[i].getTermType()){
                continue; //skip this element
            }
        }

        result.push(dataArray[i]);
    }
    return result;
}

function copByVal(obj) {
    if(obj === undefined){
        return undefined; //causes error for JSON functions
    }
    return (JSON.parse(JSON.stringify(obj)));
}

module.exports = {
    applyFilter,
    copByVal
};