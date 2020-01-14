todo!

# Data Model

The data model used in SDOAdapter is based on that <a href="https://schema.org/docs/datamodel.html" target="_blank">from Schema.org</a>. If you are not familiar with it, we recommend to check that out before reading this document.

The data model used in SDOAdapter consists of 5 types:

* <a href="#Class">Class</a>
* <a href="#Property">Property</a>
* <a href="#Enumeration">Enumeration</a>
* <a href="#EnumerationMember">EnumerationMember</a>
* <a href="#DataType">DataType</a>

<a name="Class"></a>
### Class

##### IRI

The IRI of the class. e.g.

`https://schema.org/Hotel`

##### TermType

`rdfs:Class`


    result.type = this.getTermType()
    result.vocabulary = this.getVocabulary()
    result.source = this.getSource()
    result.supersededBy = this.isSupersededBy()
    result.name = this.getName()
    result.description = this.getDescription()
    result.superClasses = this.getSuperClasses(implicit, filter)
    result.subClasses = this.getSubClasses(implicit, filter)
    result.properties = this.getProperties(implicit, filter)

<a name="Property"></a>
### Property 

<a name="Enumeration"></a>
### Enumeration

<a name="EnumerationMember"></a>
### EnumerationMember

<a name="DataType"></a>
### DataType