# Vocabulary Model

In the following the vocabulary model that is accepted by **SDOAdapter** is introduced.
 
 This vocabulary model is based on the <a href="https://schema.org/version/latest/all-layers.jsonld" target="_blank">vocabulary model of Schema.org</a>, but with some additional restrictions to guarantee a <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">clear data model</a> for **SDOAdapter**.
 
If you want to create your own vocabulary it is recommended to stick with the following guide, especially if you want to use your vocabulary along with Schema.org and **SDOAdapter**.

* <a href="#format">Format</a>
* <a href="#vocabularyTerms">Vocabulary Terms</a>
* <a href="#example">Example</a>

(todo: Add guide or links to best practises for vocabulary naming/construction/maintenance/versioning/hosting)

<a name="format"></a>
## Format

**SDOAdapter** accepts input vocabularies in <a href="https://www.w3.org/TR/json-ld11/" target="_blank">JSON-LD format</a>. If you prefer defining your vocabulary in another format (like <a href="https://www.w3.org/TR/turtle/">TURTLE</a>) you can use tools (programmatically by <a href="https://www.npmjs.com/package/n3" target="_blank">n3</a> and <a href="https://www.npmjs.com/package/jsonld" target="_blank">jsonld</a>, or manually by <a href="http://www.easyrdf.org/converter" target="_blank">easyRDF</a>) to translate it to JSON-LD.

The vocabulary consists of 2 main parts: the <a href="#context">@context</a> and the <a href="#graph">@graph</a>.

<a name="context"></a>
### @context

The @context is used to map terms (e.g. `schema:Hotel`) to IRIs (e.g. `http://schema.org/Hotel`). For details check the <a href="https://www.w3.org/TR/json-ld11/#the-context" target="_blank">JSON-LD specification</a>.

For **SDOAdapter** a vocabulary **MUST** have a @context, and the @context **MUST** include the IRI of the vocabulary itself and it **SHOULD** include the IRIs of the external vocabularies used within the vocabulary. In the following example `https://example-vocab.ex/` is the IRI of the vocabulary introduced):

```json
"@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/"
}
```

It is also possible to list specific terms in the @context and define their value type. This allows e.g. to omit @id-wrapper for IRI values, which makes the vocabulary easier to read and write (check the <a href="#example">example below</a>).

<a name="graph"></a>
### @graph

The @graph consists of an array containing all vocabulary terms. These terms are defined though the use of IRIs that connect the different parts and attributes of the terms. The exact properties of these terms are specified in <a href="#vocabularyTerms">Vocabulary Terms</a>.

For **SDOAdapter** a vocabulary **MUST** have a @graph. Every term in the @graph **MUST** be described with one of the stated term specifications listed below.

<a name="vocabularyTerms"></a>
## Vocabulary Terms

Before you read this, you should have a basic understanding of the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">data model</a> used in schema.org and **SDOAdapter**!

 In the following the 5 vocabulary term types used in **SDOAdapter** are introduced. For the examples shown, the @context listed below is used, where `https://example-vocab.ex/ ` is the IRI of the example vocabulary introduced:

```json
"@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/",
    "rdfs:subClassOf": {
        "@id": "rdfs:subClassOf",
        "@type": "@id"
    },
    "schema:domainIncludes": {
        "@id": "schema:domainIncludes",
        "@type": "@id"
    },
    "schema:rangeIncludes": {
        "@id": "schema:rangeIncludes",
        "@type": "@id"
    }
}
```

Every vocabulary element must be one of the following term types:

* <a href="#Class">Class</a>
* <a href="#Property">Property</a>
* <a href="#Enumeration">Enumeration</a>
* <a href="#EnumerationMember">EnumerationMember</a>
* <a href="#DataType">DataType</a>

However, the following term properties count for every **term type**:

##### @id (required)

The id of the term. The value **MUST** be an `IRI` and it **MUST** be unique.

```json
  "@id": "ex:Animal"
```

##### @type (required)

The type of the term. The value **MUST** be an `IRI` or an `Array of IRIs`, depending to which of the 5 term types described below the defined term belongs.

```json
  "@type": "rdfs:Class"
```

##### rdfs:label (required)

The name/label of the term. The value **MUST** be a `String` or a `tagged language object` (to support multiple languages), or an array of such. 

Specification for language tags: https://tools.ietf.org/html/bcp47 

List of language tags: http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

_Example with simple string:_

```json
  "rdfs:label": "Animal"
```

_Example with Array of tagged language objects:_

```json
  "rdfs:label": [
      {
        "@language": "en",
        "@value": "Tiger"
      },
      {
        "@language": "es",
        "@value": "Tigre"
      }
  ]
```

##### rdfs:comment (required)

The description/comment of the term. The value **MUST** be a `String` or a `tagged language object` (to support multiple languages), or an array of such. 

_Example with simple string:_

```json
  "rdfs:label": "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera. It is most recognisable for its dark vertical stripes on orangish-brown fur with a lighter underside."
```

##### schema:supersededBy (optional)

Link to a term that supersedes this term, usually used to indicate that a newer vocabulary term should be used instead of this one. The value **MUST** be an `IRI`.


<a name="Class"></a>
### Class

Class-Terms **MUST** have the `@type` `rdfs:Class` 

Class-Terms **MUST** have an `@id` that start with a capital letter (e.g. `ex:Animal`)

##### rdfs:subClassOf (required)

Link to the super-classes of this Class. The value **MUST** be an `IRI` or an `Array of IRIs`. The most general Class in schema.org is `schema:Thing`.

_Example term definition for a Class:_
```JSON
{
      "@id": "ex:Animal",
      "@type": "rdfs:Class",
      "rdfs:comment": "Animals are multicellular eukaryotic organisms that form the biological kingdom Animalia. With few exceptions, animals consume organic material, breathe oxygen, are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development.",
      "rdfs:label": "Animal",
      "rdfs:subClassOf": "schema:Thing"
}
```

<a name="Property"></a>
### Property

Property-Terms **MUST** have the `@type` `rdf:Property`

Property-Terms **MUST** have an `@id` that start with a non-capital letter (e.g. `ex:numberOfLegs`)

##### schema:domainIncludes (required)

Link to the Classes that can use this Property. The value **MUST** be an `IRI` or an `Array of IRIs`. 

##### schema:rangeIncludes (required)

Link to the Classes, DataTypes, and/or Enumerations that are valid ranges for this Property. The value **MUST** be an `IRI` or an `Array of IRIs`. 

##### rdfs:subPropertyOf (optional)

Link to the super-properties of this Property. The value **MUST** be an `IRI` or an `Array of IRIs`. 

##### schema:inverseOf (optional)

Link to the inverse Property of this Property (e.g. includesPart vs. includedAsPartIn). The value **MUST** be an `IRI`. 

_Example term definition for a Property:_
```JSON
{
      "@id": "ex:numberOfLegs",
      "@type": "rdf:Property",
      "rdfs:comment": "The number of legs an animal or person has.",
      "rdfs:label": "numberOfLegs",
      "schema:domainIncludes": [
          "ex:Animal",
          "schema:Person"
      ],
      "schema:rangeIncludes": "schema:Integer"
}
```

<a name="Enumeration"></a>
### Enumeration

Enumeration-Terms **MUST** have the `@type` `rdfs:Class` and **MUST** have `schema:Enumeration` as implicit or explicit super-class. 

Enumeration-Terms **MUST** have an `@id` that start with a capital letter (e.g. `ex:AnimalLivingEnvironment`)

##### rdfs:subClassOf (required)

Link to the super-classes of this Enumeration. The value **MUST** be an `IRI` or an `Array of IRIs`. In order to be counted as an Enumeration a term **MUST** have `schema:Enumeration` as implicit or explicit super-class. 

_Example term definition for a Enumeration:_
```JSON
{
    "@id": "ex:AnimalLivingEnvironment",
    "@type": "rdfs:Class",
    "rdfs:comment": "An enumeration class that lists the possible living environments an animal can have.",
    "rdfs:label": "Animal",
    "rdfs:subClassOf": "schema:Enumeration"
}
```

<a name="EnumerationMember"></a>
### EnumerationMember

EnumerationMember-Terms **MUST** have a `@type` that describes the Enumeration (its `IRI`) for which the term is a valid EnumerationMember (there is usually only 1 value).

EnumerationMember-Terms **MUST** have an `@id` that start with a capital letter (e.g. `ex:AnimalLivingEnvironmentFreedom`)

_Example term definition for a EnumerationMember:_
```JSON
 {
      "@id": "ex:AnimalLivingEnvironmentFreedom",
      "@type": "ex:AnimalLivingEnvironment",
      "rdfs:comment": "The animal lives in freedom.",
      "rdfs:label": "AnimalLivingEnvironmentFreedom"
    }
```

<a name="DataType"></a>
### DataType

In practise there should be no need to define new data types. It is recommended to use the <a href="https://schema.org/DataType" target="_blank">ones defined in schema.org</a>.


DataType-Terms **MUST** have as `@type` an Array with the IRIs `rdfs:Class` and `schema:DataType`. It is also possible to only have `rdfs:Class` but have a **valid DataType** as implicit or explicit super-class.  

DataType-Terms **MUST** have an `@id` that start with a capital letter (e.g. `schema:Number`)

##### rdfs:subClassOf (optional)

Link to the super-dataTypes of this DataType. The value **MUST** be an `IRI` or an `Array of IRIs`.


_Example term definition for a EnumerationMember:_
```JSON
{
    "@id": "http://schema.org/Number",
    "@type": [
        "rdfs:Class",
        "http://schema.org/DataType"
    ],
    "rdfs:comment": "Data type: Number.",
    "rdfs:label": "Number"
}
```

<a name="example"></a>
## Example

The following vocabulary is hosted as <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/tests/data/exampleExternalVocabulary.json" target="_blank">independent JSON-LD file</a>, together with <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/tests/dist-test-node-example-vocabulary.js" target="_blank">example code</a> to show how to use it with **SDOAdapter**.

```json
{
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/",
    "rdfs:subClassOf": {
      "@id": "rdfs:subClassOf",
      "@type": "@id"
    },
    "schema:domainIncludes": {
      "@id": "schema:domainIncludes",
      "@type": "@id"
    },
    "schema:rangeIncludes": {
      "@id": "schema:rangeIncludes",
      "@type": "@id"
    }
  },
  "@graph": [
    {
      "@id": "ex:Animal",
      "@type": "rdfs:Class",
      "rdfs:comment": "Animals are multicellular eukaryotic organisms that form the biological kingdom Animalia. With few exceptions, animals consume organic material, breathe oxygen, are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development.",
      "rdfs:label": "Animal",
      "rdfs:subClassOf": "schema:Thing"
    },
    {
      "@id": "ex:numberOfLegs",
      "@type": "rdf:Property",
      "rdfs:comment": "The number of legs an animal has.",
      "rdfs:label": "numberOfLegs",
      "schema:domainIncludes": "ex:Animal",
      "schema:rangeIncludes": "schema:Integer"
    },
    {
      "@id": "ex:animalLivingEnvironment",
      "@type": "rdf:Property",
      "rdfs:comment": "The living environment of an animal. As values for this property you can write plain text of choose from the following: 'https://example-vocab.ex/AnimalLivingEnvironmentFreedom', 'https://example-vocab.ex/AnimalLivingEnvironmentZoo', 'https://example-vocab.ex/AnimalLivingEnvironmentDomestic' ",
      "rdfs:label": "animalLivingEnvironment",
      "schema:domainIncludes": "ex:Animal",
      "schema:rangeIncludes": [
        "schema:Text",
        "ex:AnimalLivingEnvironment"
      ]
    },
    {
      "@id": "ex:AnimalLivingEnvironment",
      "@type": "rdfs:Class",
      "rdfs:comment": "An enumeration class that lists the possible living environments an animal can have.",
      "rdfs:label": "Animal",
      "rdfs:subClassOf": "schema:Enumeration"
    },
    {
      "@id": "ex:AnimalLivingEnvironmentFreedom",
      "@type": "ex:AnimalLivingEnvironment",
      "rdfs:comment": "The animal lives in freedom.",
      "rdfs:label": "AnimalLivingEnvironmentFreedom"
    },
    {
      "@id": "ex:AnimalLivingEnvironmentZoo",
      "@type": "ex:AnimalLivingEnvironment",
      "rdfs:comment": "The animal lives in a public zoo.",
      "rdfs:label": "AnimalLivingEnvironmentZoo"
    },
    {
      "@id": "ex:AnimalLivingEnvironmentDomestic",
      "@type": "ex:AnimalLivingEnvironment",
      "rdfs:comment": "The animal lives in a private domestic environment.",
      "rdfs:label": "AnimalLivingEnvironmentDomestic"
    },
    {
      "@id": "ex:Tiger",
      "@type": "rdfs:Class",
      "rdfs:comment": [
        {
          "@language": "en",
          "@value": "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera. It is most recognisable for its dark vertical stripes on orangish-brown fur with a lighter underside."
        },
        {
          "@language": "zh",
          "@value": "虎（学名：Panthera tigris），俗称老虎、大虫，被人称为百獸之王，是現存体型最大的两种猫科动物之一（另一种是狮）。野外個體可長達3.38米（11.1英尺）、重388.7公斤（857英磅）（此为狩猎数据，实测数据的最大值为261kg）"
        }
      ],
      "rdfs:label": [
        {
          "@language": "en",
          "@value": "Tiger"
        },
        {
          "@language": "de",
          "@value": "Tiger"
        },
        {
          "@language": "es",
          "@value": "Tigre"
        },
        {
          "@language": "zh",
          "@value": "虎"
        }
      ],
      "rdfs:subClassOf": "ex:Animal"
    }
  ]
}
```