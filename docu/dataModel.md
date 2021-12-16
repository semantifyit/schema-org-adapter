# Data Model

The data model used in **SDOAdapter** is based on the <a href="https://schema.org/docs/datamodel.html" target="_blank">data model of Schema.org</a>. If you are not familiar with it, we recommend to check that out before reading this document.

The data model used in **SDOAdapter** consists of following 5 types:

* <a href="#Class">Class</a>
* <a href="#Property">Property</a>
* <a href="#Enumeration">Enumeration</a>
* <a href="#EnumerationMember">EnumerationMember</a>
* <a href="#DataType">DataType</a>

The algorithm that translates the data model of schema.org to the one used by this library is described in <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md" target="_blank">algorithm.md</a>. How the data model of schema.org is used to define external vocabularies is described in <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md" target="_blank">vocabularies.md</a> 

<a name="Class"></a>
### Class

A Class (also known as <a href="http://schema.org/Class" target="_blank">Type</a> in schema.org) is a concept that describes entities like an "Hotel" or a "Person". Classes can have <a href="#Property">properties</a> that describe them. Classes are organized in a "multiple inheritance hierarchy" where each Class may be a sub-class of one or multiple Classes, where "Thing" is the most general Class.

Classes have following important attributes (for a complete list check the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md#Class" target="_blank">API</a>):

* **IRI**: The IRI of the Class. e.g. `http://schema.org/Hotel`
* **name**: The name(s) (multilinguality) of the Class. e.g. `Hotel`
* **description**: The description(s) about the Class.
* **properties**: The possible <a href="#Property">properties</a> that this Class can have. e.g. `http://schema.org/openingHoursSpecification`
* **super-classes**: Classes that are "parents" of this Class. e.g. `http://schema.org/LodgingBusiness`
* **sub-classes**: Classes that are "children" of this Class.
* **superseded by**: A newer Class that is meant to substitute this Class, in general it is recommended to not use superseded Classes.

<a name="Property"></a>
### Property

A Property is a characteristic that a <a href="#Class">Class</a> can have, like "name" or "address". Properties have one or multiple classes as **domains**, those domains (and their sub-classes) can use the Property. Properties have one or multiple classes/enumerations/data types as **ranges**, describing valid value types for the Property. 

Properties have following important attributes (for a complete list check the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md#Property" target="_blank">API</a>):

* **IRI**: The IRI of the Property. e.g. `http://schema.org/name`
* **name**: The name(s) (multilinguality) of the Property. e.g. `name`
* **description**: The description(s) about the Property.
* **domains**: The <a href="#Class">classes</a> that can use this Property . e.g. `http://schema.org/Thing`
* **ranges**: The <a href="#Class">classes</a>, <a href="#Enumeration">enumerations</a>, and <a href="#DataType">data types</a> that can be used as values for this Property. e.g. `http://schema.org/Text`
* **superseded by**: A newer Property that is meant to substitute this Property, in general it is recommended to not use superseded Properties.

<a name="Enumeration"></a>
### Enumeration

An Enumeration is a specific type of <a href="#Class">Class</a>, for which predefined instances (<a href="#EnumerationMember">Enumeration Members</a>) exist. In practise, instead of creating a new instance for an Enumeration, predefined instances referenced by their IRI are used (the property `dayOfWeek` has the Enumeration `DayOfWeek` as range. In this example the predefined instance with the @id `http://schema.org/Saturday` is used as value for the Enumeration):

```json
{
  "@type": "OpeningHoursSpecification",
  "closes": "17:00:00" ,
  "dayOfWeek": "http://schema.org/Saturday",
  "opens": "09:00:00"
}
```

Unfortunately, the data model of schema.org does not specify exactly how Enumerations are supposed to be modeled and used, which has generated some uncertainty around their definition (especially in schema.org extensions) and usage, e.g. Enumerations without Enumeration Members, Enumerations that have Properties, Enumeration Members that belong to multiple Enumerations, etc. 

However, in the data model of **SDOAdapter** Enumerations are treated as <a href="#Class">Classes</a> with a set of predefined instances (for a complete list of attributes check the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md#Enumeration" target="_blank">API</a>): 

* **enumeration members**: The <a href="#EnumerationMember">Enumeration Members</a> that are predefined instances (values) for this Enumeration . e.g. `http://schema.org/Saturday`

**SDOAdapter** treats any Class that is directly or indirectly a sub-class of the Class `http://schema.org/Enumeration` as an Enumeration. For details, check  <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md" target="_blank">algorithm.md</a>. 


<a name="EnumerationMember"></a>
### EnumerationMember

An EnumerationMember is a predefined instance for a specific <a href="#Enumeration">Enumeration</a>.

EnumerationMember have following important attributes (for a complete list check the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md#EnumerationMember" target="_blank">API</a>):

* **IRI**: The IRI of the EnumerationMember. e.g. `http://schema.org/Friday`
* **name**: The name(s) (multilinguality) of the EnumerationMember. e.g. `Friday`
* **description**: The description(s) about the EnumerationMember.
* **domain enumeration**: The <a href="#Enumeration">Enumeration type(s)</a> for which this EnumerationMember is a valid predefined instance (usually there is only 1 Enumeration type to which an EnumerationMember belongs). e.g. `http://schema.org/DayOfWeek`
* **superseded by**: A newer EnumerationMember that is meant to substitute this EnumerationMember, in general it is recommended to not use superseded EnumerationMember.

<a name="DataType"></a>
### DataType

A DataType represents a basic data type such as Integer or String.

DataType have following important attributes (for a complete list check the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md#DataType" target="_blank">API</a>):

* **IRI**: The IRI of the DataType. e.g. `http://schema.org/Integer`
* **name**: The name(s) (multilinguality) of the DataType. e.g. `Integer`
* **description**: The description(s) about the DataType.
* **super-dataTypes**: DataTypes that are "parents" of this DataType. e.g. `http://schema.org/Number`
* **sub-dataTypes**: DataTypes that are "children" of this DataType.
* **superseded by**: A newer DataType that is meant to substitute this DataType, in general it is recommended to not use superseded DataType.
