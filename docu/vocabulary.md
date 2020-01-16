# Vocabulary Model

In the following the vocabulary model that is accepted by **SDOAdapter** is introduced.
 
 This vocabulary model is based on the <a href="https://schema.org/version/latest/all-layers.jsonld" target="_blank">vocabulary model of Schema.org</a>, but with some additional restrictions to guarantee a <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">clear data model</a> for **SDOAdapter**.
 
If you want to create your own vocabulary it is recommended to stick with the following guide, especially if you want to use your vocabulary along with Schema.org and **SDOAdapter**.

* <a href="#format">Format</a>
* <a href="#vocabularyTerms">Vocabulary Terms</a>
* <a href="#example">Example</a>

<a name="format"></a>
## Format

**SDOAdapter** accepts input vocabularies in <a href="https://www.w3.org/TR/json-ld11/" target="_blank">JSON-LD format</a>. If you prefer defining your vocabulary in another format (like <a href="https://www.w3.org/TR/turtle/">TURTLE</a>) you can use tools (programmatically by <a href="https://www.npmjs.com/package/n3" target="_blank">n3</a> and <a href="https://www.npmjs.com/package/jsonld" target="_blank">jsonld</a>, or manually by <a href="http://www.easyrdf.org/converter" target="_blank">easyRDF</a>) to translate it to JSON-LD.

The vocabulary consists of 2 main parts: the <a href="#context">@context</a> and the <a href="#graph">@graph</a>.

<a name="context"></a>
#### @context

The @context is used to map terms (e.g. `schema:Hotel`) to IRIs (e.g. `http://schema.org/Hotel`). For details check the <a href="https://www.w3.org/TR/json-ld11/#the-context" target="_blank">JSON-LD specification</a>.

For **SDOAdapter** a vocabulary **MUST** have a @context, and the @context **MUST** include the IRI of the vocabulary itself and it **SHOULD** include the IRIs of the external vocabularies used within the vocabulary. In the following example `https://example-vocab.ex/1.0/ ` is the IRI of the vocabulary introduced):

```json
"@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/1.0/"
}
```

todo: additional term definition to spare @id wrapper

todo: best practise for vocabulary IRI construction/versioning https://example-vocab.ex/1.0/

<a name="graph"></a>
#### @graph

The @graph consists of an array containing all vocabulary elements. These vocabulary elements are defined though the use of IRIs that connect the different parts and attributes of the elements. The exact properties of these elements are specified in <a href="#vocabularyTerms">Vocabulary Terms</a>.

<a name="vocabularyTerms"></a>
## Vocabulary Terms

In the following the 5 vocabulary term types used in **SDOAdapter** are introduced. For the examples shown, the following @context is used, where `https://example-vocab.ex/1.0/ ` is the IRI of the example vocabulary introduced:

```json
"@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/1.0/",
    "rdfs:subClassOf": {
        "@id": "rdfs:subClassOf",
        "@type": "@id"
    }
}
```
* <a href="#Class">Class</a>
* <a href="#Property">Property</a>
* <a href="#Enumeration">Enumeration</a>
* <a href="#EnumerationMember">EnumerationMember</a>
* <a href="#DataType">DataType</a>

<a name="Class"></a>
#### Class

Example _@graph node_ for a Class:
```JSON
{
    "@id": "ex:Animal",
    "@type": "rdfs:Class",
    "rdfs:comment": "An animal (alive, dead, undead, or fictional).",
    "rdfs:label": "Animal",
    "rdfs:subClassOf": "schema:Thing"
}
```

<a name="Property"></a>
#### Property

<a name="Enumeration"></a>
#### Enumeration

<a name="EnumerationMember"></a>
#### EnumerationMember

<a name="DataType"></a>
#### DataType

<a name="example"></a>
## Example

todo: update once it is finished, link the jsonld file and the example file using this vocabulary

```json
{
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfa": "http://www.w3.org/ns/rdfa#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "schema": "http://schema.org/",
    "ex": "https://example-vocab.ex/1.0/",
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
      "@id": "ex:animalFamily",
      "@type": "rdf:Property",
      "rdfs:comment": "The animal family to which an animal belongs.",
      "rdfs:label": "animalFamily",
      "schema:domainIncludes": "ex:Animal",
      "schema:rangeIncludes": "ex:AnimalFamily"
    },
    {
      "@id": "ex:Tiger",
      "@type": "rdfs:Class",
      "rdfs:comment": "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera. It is most recognisable for its dark vertical stripes on orangish-brown fur with a lighter underside.",
      "rdfs:label": "Tiger",
      "rdfs:subClassOf": "schema:Thing"
    }
  ]
}
```