# Conversion Algorithm

In the following the process of converting an input vocabulary into the in-memory data-model of the Schema.org adapter is presented. The process consists of 5 steps:

1. Pre-process Vocabulary
2. Classify Input
3. Classification cleaning (correction)
4. Add inverse Inheritance
5. Add inverse Relationships

### 1. Pre-process Vocabulary

The input vocabulary is a JSON-LD object with a `@context` and a `@graph` .
First, a new general `@context` is created, by combining the current `@context` of the SDOAdapter and the `@context` of the new JSON-LD vocabulary. Then this new general context is applied to the `@graph` of the new Vocabulary. Every graph-node holds minor information about a specific resource, which is identified by its used `@id`. 

Example graph-node for a Class:
```JSON
{
    "@id": "http://schema.org/ChildrensEvent",
    "@type": "rdfs:Class",
    "rdfs:comment": "Event type: Children's event.",
    "rdfs:label": "ChildrensEvent",
    "rdfs:subClassOf": {
        "@id": "http://schema.org/Event"
    }
}
```

Each of these nodes is curated, ensuring a wished format depending on the `@type` of the node (see graphUtilities.curateVocabNode() for details).

### 2. Classify Input

Classify every graph-node based on its `@type`. The node is stored in a corresponding memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the `@type` is not enough for a correct classification. The mapping of our data model and the types of the corresponding graph-nodes are as follows:

- **classes** (`@type` = `"rdfs:Class"`)
- **properties** (`@type` = `"rdf:Property"`)
- **dataTypes** (`@type` = `["rdfs:Class" , "http://schema.org/DataType"]`)
- **enumerations** (`@type` = `"rdfs:Class"` and has `"http://schema.org/Enumeration"` as implicit or explicit super-class)
- **enumerationMembers** (`@type` = `@id` of an enumeration)

Example graph-node for an Enumeration Instance (enumerationMember):
```JSON
{
  "@id": "http://schema.org/EBook",
  "@type": "http://schema.org/BookFormatType",
  "rdfs:comment": "Book format: Ebook.",
  "rdfs:label": "EBook"
}
```
Example graph-node for an Enumeration:
```JSON
{
  "@id": "http://schema.org/BookFormatType",
  "@type": "rdfs:Class",
  "rdfs:comment": "The publication format of the book.",
  "rdfs:label": "BookFormatType",
  "rdfs:subClassOf": {
    "@id": "http://schema.org/Enumeration"
  }
}
```

Since the `@type` of **BookFormatType** is `rdfs:Class` this data node is stored in the classes memory instead of the enumerations memory at this stage:
```JSON
{
  "name": "BookFormatType",
  "description": "The publication format of the book.",
  "type": "Class",
  "superClasses": [
    "Enumeration"
  ],
  "subClasses": []
}
```

### 3. Classification cleaning

To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:

- Enumerations which are handled as Classes.
- DataTypes which are handled as Classes.
 
#### 3.1. Extract enumerations from classes memory 

 For each entry in the classes-memory check if its `superClasses` contain **Enumeration**. If this is the case, it is known that this class is an enumeration, so this data entry is transformed and moved to the enumerations-memory.
  
 Enumerations from the GoodRelations Vocabulary for E-Commerce are problematic, since they do not have the same structure as the other SDO enumerations. Usually enumerations from SDO do not have properties and do not have subclasses. And they have enumeration instances (enumerationMembers) baked in the SDO vocabulary. GoodRelations enumerations do not have instances, instead they provide example URIs for possible values in the description of the enumeration. e.g.: `http://schema.org/PaymentMethod`
 
 The standard SDO approach and the GoodRelation approach of modelling enumerations are very different and there are arguments to defend any of the two design decisions. However, the fact that both enumeration design models are part of the SDO Core makes it difficult to create tools/algorithms which are aware and specialized around SDO enumerations.
 
 Our library handles enumerations as a "sub-type" of classes (the `@type` of enumerations is `rdfs:Class`). Enumerations have the same methods as classes, and additionally offer methods regarding their valid enumeration members.
 
#### 3.2. Extract dataTypes from classes memory 

For each entry in the classes-memory it is checked if its `superClasses` is included in the dataTypes memory. If this is the case, it is known that this class is a DataType, so this data entry is transformed and moved to the dataTypes memory.
  
   
#### 3.3. Change @type of data-types to "schema:DataType"

For each entry in the dataTypes memory the `@type` entry is changed to a single value, which is `schema:DataType`.
  

### 4. Inverse Inheritance

Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated and saved though multiple terms introduced by this library.

Terms introduced by this library are:
 - `"soa": "http://schema-org-adapter.at/vocabTerms/"` is the "virtual" vocabulary used by this library
 - `soa:superClassOf` is an inverse of `rdfs:subClassOf`
 - `soa:superPropertyOf` is an inverse of `rdfs:subPropertyOf`
 - `soa:hasProperty` is an inverse of `schema:domainIncludes`
 - `soa:isRangeOf` is an inverse of `schema:rangeIncludes`
 - `soa:hasEnumerationMember` is used for enumerations to list all its enumeration members (their `@type` includes the `@id` of the enumeration)
 - `soa:enumerationDomainIncludes` is an inverse of `soa:hasEnumerationMember`
 - `soa:EnumerationMember` is introduced as meta-type for the members of a `schema:Enumeration`
 
#### 4.1. Add subClasses (soa:superClassOf) for Classes and Enumerations

For each entry in the classes memory and enumerations memory the _superClasses_ are checked (if they are in classes memory or enumeration memory) and those super classes add the actual entry in their _subClasses_. Enumerations typically do not have subClasses, but the enumeration design of the GoodRelations Vocabulary breaks this rule, read more in step C.1. 

#### 4.2. Add subClasses (soa:superClassOf) for DataTypes

For each entry in the dataTypes memory the _superClasses_ are checked (if they are in dataTypes memory) and those super types add the actual entry in their _subClasses_.

#### 4.3. Add subProperties (soa:superPropertyOf) for Properties

For each entry in the properties-memory the _superProperties_ are checked (if they are in properties-memory) and those super properties add the actual entry in their _subProperties_.
 
### 5. Inverse Relationships

In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set. These fields are initialized with empty arrays.

- Classes -> `soa:hasProperty`, `soa:isRangeOf`
- Enumerations -> `soa:hasProperty`, `soa:isRangeOf`, `soa:hasEnumerationMember`
- EnumerationMembers -> `soa:enumerationDomainIncludes`
- DataTypes -> `soa:isRangeOf`
  
#### 5.1. Add explicit hasProperty and isRangeOf to classes and enumerations

 For each entry in the classes/enumeration-memory, the `soa:hasProperty` and `soa:isRangeOf` entries are added. `soa:hasProperty` holds all properties that have this class/enumeration as explicit domain. `soa:isRangeOf` holds all properties that have this class/enumeration as explicit range.
 
  
#### 5.2. Add soa:hasEnumerationMember to enumerations and soa:enumerationDomainIncludes to enumerationMembers

 For each entry in the enumeration memory the `soa:hasEnumerationMember` field is added, this data field holds all enumeration members which belong to this enumeration.
 For each entry in the enumerationMembers memory the `soa:enumerationDomainIncludes` field is added, this data field holds all enumerations that are a domain for this enumerationMember
  