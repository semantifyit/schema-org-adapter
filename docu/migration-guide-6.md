# Migration Guide to Version 6.0.0

Version 6.0.0. introduces several API improvements to SDO-Adapter, unfortunately some of these changes make the API non-backwards-compatible. The specific changes to the API are listed below (see "API Changes"). Before that, a brief overview about the improvements is given:

## 1. New Features

### 1.1 Added reasoning functions to the term instances

With these functions it is possible to check if a term is in a specific relationship with another term. In following example it is checked if the class `schema:Person` is a valid domain for the property `schema:name` (Can a schema:Person use the property schema:name?). These functions always return a boolean value. It is also possible to pass an `implicit` parameter (defaults to `true`) as second argument, to tell the function if inheritance is allowed or not (e.g. pass `false` as an argument if you want to check only direct domains). Note that all these reasoning functions start with "isValid" in their naming:

```JS
const isValidDomain = personClass.isValidDomainOf("schema:name") 
// -> true
const isValidDirectDomain = personClass.isValidDomainOf("schema:name", false) 
// -> false, since schema:Person inherits the name property from its superclass schema:Thing
```

### 1.2 Improved support for IRI formats

There are **compact IRIs** (e.g. `schema:Person` ) and **absolute IRIs** (e.g. `https://schema.org/Person` ). SDO-Adapter has worked mainly with compact IRIs so far, but it is now possible to input and output IRIs in both formats. A new type ([OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType)) has been introduced which can be passed as parameter during the initialization of an SDO-Adapter instance (see **2.1 SOA - the library object** below) or passed to functions which return IRIs as result (during running time, after the initialization). Functions will automatically return IRIs in the format that was stated during initialization (default: `"Compact"`, as it has been in previous versions), which means that asking for a specific IRI format on function-calls is only needed if the wished IRI format differs from the standard format set during the initialization.

### 1.3 Introduction of parameter objects

Since a lot of functions have multiple optional parameters now, it makes sense to use parameter objects with optional parameter-keys. See ([ParamObjIRIList](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIList)) and ([ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference)). 

**This will break backwards-compatibility!** 

In the following there is a list of the affected functions.

## 2. API Changes

### 2.1 SOA - the library class 

The library class (SOA) is the main entry point to create an SDO-Adapter instance. The parameter object for the [.create()](https://semantifyit.github.io/schema-org-adapter/modules.html#create) function has been improved (type: [ParamObjCreateSdoAdapter](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjCreateSdoAdapter)) - there is an optional parameter-key `outputFormat` (type: [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType)): now, which can be either `"Compact"` (default) or `"Absolute"`. This defines the standard output format for IRIs that are returned by function calls for the created SDO-Adapter instance. 

```JS
const { SOA } = require("schema-org-adapter");
// create a new SDOAdapter instance with the latest version of schema.org and set compact as the standard iri output format
const mySdoAdapter = await SOA.create({
  schemaVersion: "latest",
  outputFormat: "Compact"
});
```

### 2.2 SDOAdapter - the instance class

#### 2.2.1 FilterObject -> ParamObjIRIList

Functions, that return IRIs as result, had their parameter type changed from [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIList](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIList). 

```JS
// PREVIOUS - getListOfClasses(filter?: FilterObject)
const classesIRIs = mySdoAdapter.getListOfClasses({
  isSuperseded: false,
  fromVocabulary: ["https://schema.org/"],
})
// NEW - getListOfClasses(paramObj?: ParamObjIRIList)
const classesIRIs = mySdoAdapter.getListOfClasses({
  filter: {
    isSuperseded: false,
    fromVocabulary: ["https://schema.org/"],
  },
  outputFormat: "Compact"
})
```

The new parameter object is optional, it has 2 optional keys: there is `filter` which allows the use of a FilterObject as in earlier versions, and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.getListOfClasses()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfClasses)
* [.getListOfProperties()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfProperties)
* [.getListOfDataTypes()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfDataTypes)
* [.getListOfEnumerations()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfEnumerations)
* [.getListOfEnumerationMembers()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfEnumerationMembers)
* [.getListOfTerms()](https://semantifyit.github.io/schema-org-adapter/classes/SDOAdapter.html#getListOfTerms)


### 2.3 Class 

#### 2.3.1 implicit + FilterObject -> ParamObjIRIListInference

Functions, that return IRIs as result, had their parameter type changed from `implicit` and [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference).

```JS
// PREVIOUS - getProperties(implicit?: boolean, filter?: FilterObject)
const propertiesIRIs = classInstance.getProperties(true, {
  isSuperseded: false
})
// NEW - getProperties(paramObj?: ParamObjIRIListInference)
const propertiesIRIs = classInstance.getProperties({
  filter: {
      isSuperseded: false
  },
  implicit: true,
  outputFormat: "Compact"
})
```

This new parameter object is optional, it has 3 optional keys: there is `filter` which allows the use of a FilterObject (as in earlier versions), the reasoning parameter `implicit` (as in earlier versions) and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.getProperties()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#getProperties)
* [.getSubClasses()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#getSubClasses)
* [.getSuperClasses()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#getSuperClasses)
* [.isRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isRangeOf)
* [.toJSON()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#toJSON)
* [.toString()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#toString)

#### 2.3.2 compactForm -> OutputIRIType

Functions, that return a single IRI as result, had their parameter type changed from `compactForm` (boolean) to [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType). 

```JS
// PREVIOUS - getIRI(compactForm?: boolean) - default was "false"
const compactIri = classInstance.getIRI(true)
// NEW - getIRI(outputIRIType?: OutputIRIType) - default is "Absolute"
const compactIri = classInstance.getIRI("Compact")
```

The new default values for the affected functions will reflect the previous default values, in order to return the same IRI format as before.

Affected functions:

* [.getIRI()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#getIRI)
* [.isSupersededBy()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isSupersededBy) (previously, this function returned only the compact IRI)

#### 2.3.3 New reasoning functions

Regarding the general idea about these newly added reasoning functions, see **Added reasoning functions to the term instances** above. Details about the specific functions can be found in the linked documentation below:

* [.isValidDomainOf()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isValidDomainOf)
* [.isValidRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isValidRangeOf)
* [.isValidSubClassOf()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isValidSubClassOf)
* [.isValidSuperClassOf()](https://semantifyit.github.io/schema-org-adapter/classes/Class.html#isValidSuperClassOf)


### 2.4 Property

#### 2.4.1 implicit + FilterObject -> ParamObjIRIListInference

Functions, that return IRIs as result, had their parameter type changed from `implicit` and [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference).

```JS
// PREVIOUS - getRanges(implicit?: boolean, filter?: FilterObject)
const rangesIRIs = propertyInstance.getRanges(true, {
  isSuperseded: false
})
// NEW - getRanges(paramObj?: ParamObjIRIListInference)
const rangesIRIs = propertyInstance.getProperties({
  filter: {
      isSuperseded: false
  },
  implicit: true,
  outputFormat: "Compact"
})
```

This new parameter object is optional, it has 3 optional keys: there is `filter` which allows the use of a FilterObject (as in earlier versions), the reasoning parameter `implicit` (as in earlier versions) and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.getDomains()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getDomains)
* [.getRanges()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getRanges)
* [.getSubProperties()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getSubProperties)
* [.getSuperProperties()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getSuperProperties)
* [.toJSON()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#toJSON)
* [.toString()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#toString)

#### 2.4.2 compactForm -> OutputIRIType

Functions, that return a single IRI as result, had their parameter type changed from `compactForm` (boolean) to [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType).

```JS
// PREVIOUS - getIRI(compactForm?: boolean) - default was "false"
const compactIri = propertyInstance.getIRI(true)
// NEW - getIRI(outputIRIType?: OutputIRIType) - default is "Absolute"
const compactIri = propertyInstance.getIRI("Compact")
```

The new default values for the affected functions will reflect the previous default values, in order to return the same IRI format as before.

Affected functions:

* [.getIRI()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getIRI)
* [.isSupersededBy()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isSupersededBy) (previously, this function returned only the compact IRI)
* [.getInverseOf()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#getInverseOf) (previously, this function returned only the compact IRI)

#### 2.4.3 New reasoning functions

Regarding the general idea about these newly added reasoning functions, see **Added reasoning functions to the term instances** above. Details about the specific functions can be found in the linked documentation below:

* [.isValidDomain()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isValidDomain)
* [.isValidRange()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isValidRange)
* [.isValidInverseOf()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isValidInverseOf)
* [.isValidSubPropertyOf()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isValidSubPropertyOf)
* [.isValidSuperPropertyOf()](https://semantifyit.github.io/schema-org-adapter/classes/Property.html#isValidSuperPropertyOf)


### 2.5 DataType

#### 2.5.1 implicit + FilterObject -> ParamObjIRIListInference

Functions, that return IRIs as result, had their parameter type changed from `implicit` and [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference).

```JS
// PREVIOUS - isRangeOf(implicit?: boolean, filter?: FilterObject)
const propertiesIRIs = dataTypeInstance.isRangeOf(true, {
  isSuperseded: false
})
// NEW - isRangeOf(paramObj?: ParamObjIRIListInference)
const propertiesIRIs = dataTypeInstance.isRangeOf({
  filter: {
      isSuperseded: false
  },
  implicit: true,
  outputFormat: "Compact"
})
```

This new parameter object is optional, it has 3 optional keys: there is `filter` which allows the use of a FilterObject (as in earlier versions), the reasoning parameter `implicit` (as in earlier versions) and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.isRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#isRangeOf)
* [.getSubDataTypes()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#getSubDataTypes)
* [.getSuperDataTypes()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#getSuperDataTypes)
* [.toJSON()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#toJSON)
* [.toString()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#toString)


#### 2.5.2 compactForm -> OutputIRIType

Functions, that return a single IRI as result, had their parameter type changed from `compactForm` (boolean) to [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType).

```JS
// PREVIOUS - getIRI(compactForm?: boolean) - default was "false"
const compactIri = dataTypeInstance.getIRI(true)
// NEW - getIRI(outputIRIType?: OutputIRIType) - default is "Absolute"
const compactIri = dataTypeInstance.getIRI("Compact")
```

The new default values for the affected functions will reflect the previous default values, in order to return the same IRI format as before.

Affected functions:

* [.getIRI()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#getIRI)
* [.isSupersededBy()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#isSupersededBy) (previously, this function returned only the compact IRI)

#### 2.5.3 New reasoning functions

Regarding the general idea about these newly added reasoning functions, see **Added reasoning functions to the term instances** above. Details about the specific functions can be found in the linked documentation below:

* [.isValidRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#isValidRangeOf)
* [.isValidSubDataTypeOf()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#isValidSubDataTypeOf)
* [.isValidSuperDataTypeOf()](https://semantifyit.github.io/schema-org-adapter/classes/DataType.html#isValidSuperDataTypeOf)


### 2.6 Enumeration

#### 2.6.1 implicit + FilterObject -> ParamObjIRIListInference

Functions, that return IRIs as result, had their parameter type changed from `implicit` and [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference).

```JS
// PREVIOUS - getEnumerationMembers(implicit?: boolean, filter?: FilterObject)
const enumerationMemberIRIs = enumerationInstance.getEnumerationMembers(true, {
  isSuperseded: false
})
// NEW - getEnumerationMembers(paramObj?: ParamObjIRIListInference)
const enumerationMemberIRIs = enumerationInstance.getEnumerationMembers({
  filter: {
      isSuperseded: false
  },
  implicit: true,
  outputFormat: "Compact"
})
```

This new parameter object is optional, it has 3 optional keys: there is `filter` which allows the use of a FilterObject (as in earlier versions), the reasoning parameter `implicit` (as in earlier versions) and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.getEnumerationMembers()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#getEnumerationMembers)
* [.getProperties()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#getProperties)
* [.getSubClasses()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#getSubClasses)
* [.getSuperClasses()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#getSuperClasses)
* [.isRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isRangeOf)
* [.toJSON()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#toJSON)
* [.toString()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#toString)

#### 2.6.2 compactForm -> OutputIRIType

Functions, that return a single IRI as result, had their parameter type changed from `compactForm` (boolean) to [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType).

```JS
// PREVIOUS - getIRI(compactForm?: boolean) - default was "false"
const compactIri = enumerationInstance.getIRI(true)
// NEW - getIRI(outputIRIType?: OutputIRIType) - default is "Absolute"
const compactIri = enumerationInstance.getIRI("Compact")
```

The new default values for the affected functions will reflect the previous default values, in order to return the same IRI format as before.

Affected functions:

* [.getIRI()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#getIRI)
* [.isSupersededBy()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isSupersededBy) (previously, this function returned only the compact IRI)

#### 2.6.3 New reasoning functions

Regarding the general idea about these newly added reasoning functions, see **Added reasoning functions to the term instances** above. Details about the specific functions can be found in the linked documentation below:

* [.isValidDomainEnumerationOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isValidDomainEnumerationOf)
* [.isValidDomainOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isValidDomainOf)
* [.isValidRangeOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isValidRangeOf)
* [.isValidSubClassOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isValidSubClassOf)
* [.isValidSuperClassOf()](https://semantifyit.github.io/schema-org-adapter/classes/Enumeration.html#isValidSuperClassOf)


### 2.7 EnumerationMember

#### 2.7.1 implicit + FilterObject -> ParamObjIRIListInference

Functions, that return IRIs as result, had their parameter type changed from `implicit` and [FilterObject](https://semantifyit.github.io/schema-org-adapter/modules.html#FilterObject) to [ParamObjIRIListInference](https://semantifyit.github.io/schema-org-adapter/modules.html#ParamObjIRIListInference).

```JS
// PREVIOUS - getDomainEnumerations(implicit?: boolean, filter?: FilterObject)
const enumerationIRIs = enumerationMemberInstance.getDomainEnumerations(true, {
  isSuperseded: false
})
// NEW - getDomainEnumerations(paramObj?: ParamObjIRIListInference)
const enumerationIRIs = enumerationMemberInstance.getDomainEnumerations({
  filter: {
      isSuperseded: false
  },
  implicit: true,
  outputFormat: "Compact"
})
```

This new parameter object is optional, it has 3 optional keys: there is `filter` which allows the use of a FilterObject (as in earlier versions), the reasoning parameter `implicit` (as in earlier versions) and there is the new `outputFormat` which states the format of the resulting IRIs. Use this parameter only if the wished format is different to the default format set for the SDO-Adapter during its initialization. See **Improved support for IRI formats** above for details.

Affected functions:

* [.getDomainEnumerations()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#getDomainEnumerations)
* [.toJSON()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#toJSON)
* [.toString()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#toString)

#### 2.7.2 compactForm -> OutputIRIType

Functions, that return a single IRI as result, had their parameter type changed from `compactForm` (boolean) to [OutputIRIType](https://semantifyit.github.io/schema-org-adapter/modules.html#OutputIRIType).

```JS
// PREVIOUS - getIRI(compactForm?: boolean) - default was "false"
const compactIri = enumerationMemberInstance.getIRI(true)
// NEW - getIRI(outputIRIType?: OutputIRIType) - default is "Absolute"
const compactIri = enumerationMemberInstance.getIRI("Compact")
```

The new default values for the affected functions will reflect the previous default values, in order to return the same IRI format as before.

Affected functions:

* [.getIRI()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#getIRI)
* [.isSupersededBy()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#isSupersededBy) (previously, this function returned only the compact IRI)

#### 2.7.3 New reasoning functions

Regarding the general idea about these newly added reasoning functions, see **Added reasoning functions to the term instances** above. Details about the specific functions can be found in the linked documentation below:

* [.isValidEnumerationMemberOf()](https://semantifyit.github.io/schema-org-adapter/classes/EnumerationMember.html#isValidEnumerationMemberOf)
