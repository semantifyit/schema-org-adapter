## Classes

<dl>
<dt><a href="#SDOAdapter">SDOAdapter</a></dt>
<dd></dd>
<dt><a href="#Class">Class</a></dt>
<dd></dd>
<dt><a href="#Property">Property</a></dt>
<dd></dd>
<dt><a href="#Enumeration">Enumeration</a></dt>
<dd></dd>
<dt><a href="#EnumerationMember">EnumerationMember</a></dt>
<dd></dd>
<dt><a href="#DataType">DataType</a></dt>
<dd></dd>
</dl>

<a name="SDOAdapter"></a>

## SDOAdapter
**Kind**: global class  

* [SDOAdapter](#SDOAdapter)
    * [new SDOAdapter()](#new_SDOAdapter_new)
    * [.addVocabularies(vocabArray)](#SDOAdapter+addVocabularies) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getClass(id, filter)](#SDOAdapter+getClass) ⇒ [<code>Class</code>](#Class) \| [<code>Enumeration</code>](#Enumeration)
    * [.getAllClasses(filter)](#SDOAdapter+getAllClasses) ⇒ <code>Array.&lt;(Class\|Enumeration)&gt;</code>
    * [.getListOfClasses(filter)](#SDOAdapter+getListOfClasses) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getProperty(id, filter)](#SDOAdapter+getProperty) ⇒ [<code>Property</code>](#Property)
    * [.getAllProperties(filter)](#SDOAdapter+getAllProperties) ⇒ [<code>Array.&lt;Property&gt;</code>](#Property)
    * [.getListOfProperties(filter)](#SDOAdapter+getListOfProperties) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getDataType(id, filter)](#SDOAdapter+getDataType) ⇒ [<code>DataType</code>](#DataType)
    * [.getAllDataTypes(filter)](#SDOAdapter+getAllDataTypes) ⇒ [<code>Array.&lt;DataType&gt;</code>](#DataType)
    * [.getListOfDataTypes(filter)](#SDOAdapter+getListOfDataTypes) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getEnumeration(id, filter)](#SDOAdapter+getEnumeration) ⇒ [<code>Enumeration</code>](#Enumeration)
    * [.getAllEnumerations(filter)](#SDOAdapter+getAllEnumerations) ⇒ [<code>Array.&lt;Enumeration&gt;</code>](#Enumeration)
    * [.getListOfEnumerations(filter)](#SDOAdapter+getListOfEnumerations) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getEnumerationMember(id, filter)](#SDOAdapter+getEnumerationMember) ⇒ [<code>EnumerationMember</code>](#EnumerationMember)
    * [.getAllEnumerationMembers(filter)](#SDOAdapter+getAllEnumerationMembers) ⇒ [<code>Array.&lt;EnumerationMember&gt;</code>](#EnumerationMember)
    * [.getListOfEnumerationMembers(filter)](#SDOAdapter+getListOfEnumerationMembers) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getVocabularies()](#SDOAdapter+getVocabularies) ⇒ <code>object</code>
    * [.constructSDOVocabularyURL(version, vocabularyPart)](#SDOAdapter+constructSDOVocabularyURL) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_SDOAdapter_new"></a>

### new SDOAdapter()
The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.

<a name="SDOAdapter+addVocabularies"></a>

### sdoAdapter.addVocabularies(vocabArray) ⇒ <code>Promise.&lt;void&gt;</code>
Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;void&gt;</code> - This is an async function  

| Param | Type | Description |
| --- | --- | --- |
| vocabArray | <code>Array.&lt;(string\|JSON)&gt;</code> | The vocabularies to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch. |

<a name="SDOAdapter+getClass"></a>

### sdoAdapter.getClass(id, filter) ⇒ [<code>Class</code>](#Class) \| [<code>Enumeration</code>](#Enumeration)
Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Class</code>](#Class) \| [<code>Enumeration</code>](#Enumeration) - The JS-Class representing a Class of an Enumeration (depending on the given id)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used). |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Class creation |

<a name="SDOAdapter+getAllClasses"></a>

### sdoAdapter.getAllClasses(filter) ⇒ <code>Array.&lt;(Class\|Enumeration)&gt;</code>
Creates an array of JS-Classes for all vocabulary Classes

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;(Class\|Enumeration)&gt;</code> - An array of JS-Classes representing all vocabulary Classes, does not include Enumerations  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Class creation |

<a name="SDOAdapter+getListOfClasses"></a>

### sdoAdapter.getListOfClasses(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary Classes

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary Classes, does not include Enumerations  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

<a name="SDOAdapter+getProperty"></a>

### sdoAdapter.getProperty(id, filter) ⇒ [<code>Property</code>](#Property)
Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Property</code>](#Property) - The JS-Class representing a Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used). |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Property creation |

<a name="SDOAdapter+getAllProperties"></a>

### sdoAdapter.getAllProperties(filter) ⇒ [<code>Array.&lt;Property&gt;</code>](#Property)
Creates an array of JS-Classes for all vocabulary Properties

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;Property&gt;</code>](#Property) - An array of JS-Classes representing all vocabulary Properties  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Property creation |

<a name="SDOAdapter+getListOfProperties"></a>

### sdoAdapter.getListOfProperties(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary Properties

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary Properties  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

<a name="SDOAdapter+getDataType"></a>

### sdoAdapter.getDataType(id, filter) ⇒ [<code>DataType</code>](#DataType)
Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>DataType</code>](#DataType) - The JS-Class representing a DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used). |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the DataType creation |

<a name="SDOAdapter+getAllDataTypes"></a>

### sdoAdapter.getAllDataTypes(filter) ⇒ [<code>Array.&lt;DataType&gt;</code>](#DataType)
Creates an array of JS-Classes for all vocabulary DataTypes

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;DataType&gt;</code>](#DataType) - An array of JS-Classes representing all vocabulary DataTypes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the DataType creation |

<a name="SDOAdapter+getListOfDataTypes"></a>

### sdoAdapter.getListOfDataTypes(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary DataTypes

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary DataTypes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

<a name="SDOAdapter+getEnumeration"></a>

### sdoAdapter.getEnumeration(id, filter) ⇒ [<code>Enumeration</code>](#Enumeration)
Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Enumeration</code>](#Enumeration) - The JS-Class representing an Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used). |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Enumeration creation |

<a name="SDOAdapter+getAllEnumerations"></a>

### sdoAdapter.getAllEnumerations(filter) ⇒ [<code>Array.&lt;Enumeration&gt;</code>](#Enumeration)
Creates an array of JS-Classes for all vocabulary Enumerations

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;Enumeration&gt;</code>](#Enumeration) - An array of JS-Classes representing all vocabulary Enumerations  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Enumeration creation |

<a name="SDOAdapter+getListOfEnumerations"></a>

### sdoAdapter.getListOfEnumerations(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary Enumerations

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary Enumerations  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

<a name="SDOAdapter+getEnumerationMember"></a>

### sdoAdapter.getEnumerationMember(id, filter) ⇒ [<code>EnumerationMember</code>](#EnumerationMember)
Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>EnumerationMember</code>](#EnumerationMember) - The JS-Class representing an EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used). |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the EnumerationMember creation |

<a name="SDOAdapter+getAllEnumerationMembers"></a>

### sdoAdapter.getAllEnumerationMembers(filter) ⇒ [<code>Array.&lt;EnumerationMember&gt;</code>](#EnumerationMember)
Creates an array of JS-Classes for all vocabulary EnumerationMember

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;EnumerationMember&gt;</code>](#EnumerationMember) - An array of JS-Classes representing all vocabulary EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the EnumerationMember creation |

<a name="SDOAdapter+getListOfEnumerationMembers"></a>

### sdoAdapter.getListOfEnumerationMembers(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary EnumerationMember

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

<a name="SDOAdapter+getVocabularies"></a>

### sdoAdapter.getVocabularies() ⇒ <code>object</code>
Returns key-value pairs of the vocabularies used in this SDOAdapter

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>object</code> - An object containing the key-value pairs representing the used vocabularies  
<a name="SDOAdapter+constructSDOVocabularyURL"></a>

### sdoAdapter.constructSDOVocabularyURL(version, vocabularyPart) ⇒ <code>Promise.&lt;string&gt;</code>
Creates a URL pointing to the Schema.org vocabulary (the wished version/extension can be specified). This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary. Invalid version or vocabularyPart arguments will result in errors, check https://schema.org/docs/developers.html for more information
To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/master/versions.json is used.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The URL to the Schema.org vocabulary  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| version | <code>string</code> | <code>&quot;latest&quot;</code> | the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest" |
| vocabularyPart | <code>string</code> | <code>&quot;schema&quot;</code> | the wished part of the Schema.org vocabulary (schema.org has a core vocabulary and some extensions, check https://schema.org/docs/developers.html for more information). default: "schema" (the core vocabulary) |

<a name="Class"></a>

## Class
**Kind**: global class  

* [Class](#Class)
    * [new Class(IRI, graph)](#new_Class_new)
    * [.getIRI(compactForm)](#Class+getIRI) ⇒ <code>string</code>
    * [.getTermType()](#Class+getTermType) ⇒ <code>string</code>
    * [.getVocabulary()](#Class+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#Class+getSource) ⇒ <code>string</code> \| <code>null</code>
    * [.isSupersededBy()](#Class+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#Class+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#Class+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.getProperties(implicit, filter)](#Class+getProperties) ⇒ <code>Array</code>
    * [.getSuperClasses(implicit, filter)](#Class+getSuperClasses) ⇒ <code>Array</code>
    * [.getSubClasses(implicit, filter)](#Class+getSubClasses) ⇒ <code>Array</code>
    * [.toString()](#Class+toString) ⇒ <code>string</code>
    * [.toJSON(implicit, filter)](#Class+toJSON) ⇒ <code>object</code>

<a name="new_Class_new"></a>

### new Class(IRI, graph)
A Class represents an rdfs:Class. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Class, e.g. "schema:Book" |
| graph | <code>object</code> | The underlying data graph to enable the methods of this Class |

<a name="Class+getIRI"></a>

### class.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this Class in compact/absolute form

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> - The IRI (@id) of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:Book", if false -> return absolute IRI -> "http://schema.org/Book" |

<a name="Class+getTermType"></a>

### class.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this Class (is always "rdfs:Class")

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> - The term type of this Class -> "rdfs:Class"  
<a name="Class+getVocabulary"></a>

### class.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this Class  
<a name="Class+getSource"></a>

### class.getSource() ⇒ <code>string</code> \| <code>null</code>
Retrieves the source (dc:source) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> \| <code>null</code> - The source IRI given by the "dc:source" of this Class (null if none)  
<a name="Class+isSupersededBy"></a>

### class.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the class superseding (schema:supersededBy) this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> \| <code>null</code> - The Class superseding this Class (null if none)  
<a name="Class+getName"></a>

### class.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this Class in a wished language (optional)

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this Class (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="Class+getDescription"></a>

### class.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this Class in a wished language (optional)

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this Class (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="Class+getProperties"></a>

### class.getProperties(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit properties (soa:hasProperty) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array</code> - The properties of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit properties (inheritance from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the properties |

<a name="Class+getSuperClasses"></a>

### class.getSuperClasses(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array</code> - The super-classes of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-classes (recursive from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-classes |

<a name="Class+getSubClasses"></a>

### class.getSubClasses(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array</code> - The sub-classes of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-classes (recursive from sub-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-classes |

<a name="Class+toString"></a>

### class.toString() ⇒ <code>string</code>
Generates a string representation of this Class (Based on its JSON representation)

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> - The string representation of this Class  
<a name="Class+toJSON"></a>

### class.toJSON(implicit, filter) ⇒ <code>object</code>
Generates an explicit/implicit JSON representation of this Class.

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>object</code> - The JSON representation of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data (e.g. sub-Classes, super-Classes, properties, etc.) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="Property"></a>

## Property
**Kind**: global class  

* [Property](#Property)
    * [new Property(IRI, graph)](#new_Property_new)
    * [.getIRI(compactForm)](#Property+getIRI) ⇒ <code>string</code>
    * [.getTermType()](#Property+getTermType) ⇒ <code>string</code>
    * [.getVocabulary()](#Property+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#Property+getSource) ⇒ <code>string</code> \| <code>null</code>
    * [.isSupersededBy()](#Property+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#Property+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#Property+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.getRanges(implicit, filter)](#Property+getRanges) ⇒ <code>Array</code>
    * [.getDomains(implicit, filter)](#Property+getDomains) ⇒ <code>Array</code>
    * [.getSuperProperties(implicit, filter)](#Property+getSuperProperties) ⇒ <code>Array</code>
    * [.getSubProperties(implicit, filter)](#Property+getSubProperties) ⇒ <code>Array</code>
    * [.toString()](#Property+toString) ⇒ <code>string</code>
    * [.toJSON(implicit, filter)](#Property+toJSON) ⇒ <code>object</code>

<a name="new_Property_new"></a>

### new Property(IRI, graph)
A Property represents an rdf:Property. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Property, e.g. "schema:address" |
| graph | <code>object</code> | The underlying data graph to enable the methods of this Property |

<a name="Property+getIRI"></a>

### property.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this Property in compact/absolute form

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The IRI (@id) of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:address", if false -> return absolute IRI -> "http://schema.org/address" |

<a name="Property+getTermType"></a>

### property.getTermType() ⇒ <code>string</code>
Retrieves the term type of this Property (is always "rdf:Property")

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The term type of this Property -> "rdf:Property"  
<a name="Property+getVocabulary"></a>

### property.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this Property  
<a name="Property+getSource"></a>

### property.getSource() ⇒ <code>string</code> \| <code>null</code>
Retrieves the source (dc:source) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> \| <code>null</code> - The source IRI given by the "dc:source" of this Property (null if none)  
<a name="Property+isSupersededBy"></a>

### property.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the Property superseding (schema:supersededBy) this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> \| <code>null</code> - The Property superseding this Property (null if none)  
<a name="Property+getName"></a>

### property.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this Property in a wished language (optional)

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this Property (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="Property+getDescription"></a>

### property.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this Property in a wished language (optional)

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this Property (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="Property+getRanges"></a>

### property.getRanges(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array</code> - The ranges of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit ranges (inheritance from sub-classes of the ranges) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the ranges |

<a name="Property+getDomains"></a>

### property.getDomains(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array</code> - The domains of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit domains (inheritance from sub-classes of the domains) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the domains |

<a name="Property+getSuperProperties"></a>

### property.getSuperProperties(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array</code> - The super-properties of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-properties (recursive from super-properties) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-properties |

<a name="Property+getSubProperties"></a>

### property.getSubProperties(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array</code> - The sub-properties of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-properties (recursive from sub-properties) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-properties |

<a name="Property+toString"></a>

### property.toString() ⇒ <code>string</code>
Generates a string representation of this Property (Based on its JSON representation)

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The string representation of this Property  
<a name="Property+toJSON"></a>

### property.toJSON(implicit, filter) ⇒ <code>object</code>
Generates an explicit/implicit JSON representation of this Property.

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>object</code> - The JSON representation of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data (e.g. domains, ranges, etc.) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="Enumeration"></a>

## Enumeration
**Kind**: global class  

* [Enumeration](#Enumeration)
    * [new Enumeration(IRI, graph)](#new_Enumeration_new)
    * [.getIRI(compactForm)](#Enumeration+getIRI) ⇒ <code>string</code>
    * [.getTermType()](#Enumeration+getTermType) ⇒ <code>string</code>
    * [.getVocabulary()](#Enumeration+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#Enumeration+getSource) ⇒ <code>string</code> \| <code>null</code>
    * [.isSupersededBy()](#Enumeration+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#Enumeration+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#Enumeration+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.getEnumerationMembers(filter)](#Enumeration+getEnumerationMembers) ⇒ <code>Array</code>
    * [.getProperties(implicit, filter)](#Enumeration+getProperties) ⇒ <code>Array</code>
    * [.getSuperClasses(implicit, filter)](#Enumeration+getSuperClasses) ⇒ <code>Array</code>
    * [.getSubClasses(implicit, filter)](#Enumeration+getSubClasses) ⇒ <code>Array</code>
    * [.toString()](#Enumeration+toString) ⇒ <code>string</code>
    * [.toJSON(implicit, filter)](#Enumeration+toJSON) ⇒ <code>object</code>

<a name="new_Enumeration_new"></a>

### new Enumeration(IRI, graph)
An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek" |
| graph | <code>object</code> | The underlying data graph to enable the methods of this Enumeration |

<a name="Enumeration+getIRI"></a>

### enumeration.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this Enumeration in compact/absolute form

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> - The IRI (@id) of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:DayOfWeek", if false -> return absolute IRI -> "http://schema.org/DayOfWeek" |

<a name="Enumeration+getTermType"></a>

### enumeration.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> - The term type of this Enumeration -> "schema:Enumeration"  
<a name="Enumeration+getVocabulary"></a>

### enumeration.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this Enumeration  
<a name="Enumeration+getSource"></a>

### enumeration.getSource() ⇒ <code>string</code> \| <code>null</code>
Retrieves the source (dc:source) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> \| <code>null</code> - The source IRI given by the "dc:source" of this Enumeration (null if none)  
<a name="Enumeration+isSupersededBy"></a>

### enumeration.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the Enumeration superseding (schema:supersededBy) this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> \| <code>null</code> - The Enumeration superseding this Enumeration (null if none)  
<a name="Enumeration+getName"></a>

### enumeration.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this Enumeration in a wished language (optional)

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this Enumeration (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="Enumeration+getDescription"></a>

### enumeration.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this Enumeration in a wished language (optional)

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this Enumeration (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="Enumeration+getEnumerationMembers"></a>

### enumeration.getEnumerationMembers(filter) ⇒ <code>Array</code>
Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>Array</code> - The enumeration members of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the enumeration members |

<a name="Enumeration+getProperties"></a>

### enumeration.getProperties(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit properties (soa:hasProperty) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>Array</code> - The properties of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit properties (inheritance from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the properties |

<a name="Enumeration+getSuperClasses"></a>

### enumeration.getSuperClasses(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>Array</code> - The super-classes of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-classes (recursive from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-classes |

<a name="Enumeration+getSubClasses"></a>

### enumeration.getSubClasses(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>Array</code> - The sub-classes of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-classes (recursive from sub-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-classes |

<a name="Enumeration+toString"></a>

### enumeration.toString() ⇒ <code>string</code>
Generates a string representation of this Enumeration (Based on its JSON representation)

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> - The string representation of this Enumeration  
<a name="Enumeration+toJSON"></a>

### enumeration.toJSON(implicit, filter) ⇒ <code>object</code>
Generates an explicit/implicit JSON representation of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>object</code> - The JSON representation of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="EnumerationMember"></a>

## EnumerationMember
**Kind**: global class  

* [EnumerationMember](#EnumerationMember)
    * [new EnumerationMember(IRI, graph)](#new_EnumerationMember_new)
    * [.getIRI(compactForm)](#EnumerationMember+getIRI) ⇒ <code>string</code>
    * [.getTermType()](#EnumerationMember+getTermType) ⇒ <code>string</code>
    * [.getVocabulary()](#EnumerationMember+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#EnumerationMember+getSource) ⇒ <code>string</code> \| <code>Array</code> \| <code>null</code>
    * [.isSupersededBy()](#EnumerationMember+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#EnumerationMember+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#EnumerationMember+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.getDomainEnumerations(filter)](#EnumerationMember+getDomainEnumerations) ⇒ <code>Array</code>
    * [.toString()](#EnumerationMember+toString) ⇒ <code>string</code>
    * [.toJSON(filter)](#EnumerationMember+toJSON) ⇒ <code>object</code>

<a name="new_EnumerationMember_new"></a>

### new EnumerationMember(IRI, graph)
An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this EnumerationMember, e.g. "schema:Friday" |
| graph | <code>object</code> | The underlying data graph to enable the methods of this EnumerationMember |

<a name="EnumerationMember+getIRI"></a>

### enumerationMember.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this EnumerationMember in compact/absolute form

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> - The IRI (@id) of this EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday" |

<a name="EnumerationMember+getTermType"></a>

### enumerationMember.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this EnumerationMember (is always "schema:Enumeration")

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> - The term type of this EnumerationMember -> "soa:EnumerationMember" //there is no explicit type for enumeration members in the Schema.org Meta, so we use our own definition  
<a name="EnumerationMember+getVocabulary"></a>

### enumerationMember.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this EnumerationMember  
<a name="EnumerationMember+getSource"></a>

### enumerationMember.getSource() ⇒ <code>string</code> \| <code>Array</code> \| <code>null</code>
Retrieves the source (dc:source) of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> \| <code>Array</code> \| <code>null</code> - The source IRI given by the "dc:source" of this EnumerationMember (null if none)  
<a name="EnumerationMember+isSupersededBy"></a>

### enumerationMember.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the EnumerationMember superseding (schema:supersededBy) this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> \| <code>null</code> - The EnumerationMember superseding this EnumerationMember (null if none)  
<a name="EnumerationMember+getName"></a>

### enumerationMember.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this EnumerationMember in a wished language (optional)

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this EnumerationMember (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="EnumerationMember+getDescription"></a>

### enumerationMember.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this EnumerationMember in a wished language (optional)

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this EnumerationMember (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="EnumerationMember+getDomainEnumerations"></a>

### enumerationMember.getDomainEnumerations(filter) ⇒ <code>Array</code>
Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>Array</code> - The domain enumerations of this EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the domain enumerations |

<a name="EnumerationMember+toString"></a>

### enumerationMember.toString() ⇒ <code>string</code>
Generates a string representation of this EnumerationMember (Based on its JSON representation)

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> - The string representation of this EnumerationMember  
<a name="EnumerationMember+toJSON"></a>

### enumerationMember.toJSON(filter) ⇒ <code>object</code>
Generates a JSON representation of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>object</code> - The JSON representation of this EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="DataType"></a>

## DataType
**Kind**: global class  

* [DataType](#DataType)
    * [new DataType(IRI, graph)](#new_DataType_new)
    * [.getIRI(compactForm)](#DataType+getIRI) ⇒ <code>string</code>
    * [.getTermType()](#DataType+getTermType) ⇒ <code>string</code>
    * [.getVocabulary()](#DataType+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#DataType+getSource) ⇒ <code>string</code> \| <code>null</code>
    * [.isSupersededBy()](#DataType+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#DataType+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#DataType+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.getSuperDataTypes(implicit, filter)](#DataType+getSuperDataTypes) ⇒ <code>Array</code>
    * [.getSubDataTypes(implicit, filter)](#DataType+getSubDataTypes) ⇒ <code>Array</code>
    * [.toString()](#DataType+toString) ⇒ <code>string</code>
    * [.toJSON(implicit, filter)](#DataType+toJSON) ⇒ <code>object</code>

<a name="new_DataType_new"></a>

### new DataType(IRI, graph)
A DataType represents an schema:DataType. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this DataType, e.g. "schema:Number" |
| graph | <code>object</code> | The underlying data graph to enable the methods of this DataType |

<a name="DataType+getIRI"></a>

### dataType.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this DataType in compact/absolute form

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> - The IRI (@id) of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:Number", if false -> return absolute IRI -> "http://schema.org/Number" |

<a name="DataType+getTermType"></a>

### dataType.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this DataType (is always "schema:DataType")

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> - The term type of this DataType -> "schema:DataType"  
<a name="DataType+getVocabulary"></a>

### dataType.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this DataType  
<a name="DataType+getSource"></a>

### dataType.getSource() ⇒ <code>string</code> \| <code>null</code>
Retrieves the source (dc:source) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> \| <code>null</code> - The source IRI given by the "dc:source" of this DataType (null if none)  
<a name="DataType+isSupersededBy"></a>

### dataType.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the DataType superseding (schema:supersededBy) this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> \| <code>null</code> - The DataType superseding this DataType (null if none)  
<a name="DataType+getName"></a>

### dataType.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this DataType in a wished language (optional)

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this DataType (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="DataType+getDescription"></a>

### dataType.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this DataType in a wished language (optional)

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this DataType (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="DataType+getSuperDataTypes"></a>

### dataType.getSuperDataTypes(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>Array</code> - The super-DataTypes of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-DataTypes |

<a name="DataType+getSubDataTypes"></a>

### dataType.getSubDataTypes(implicit, filter) ⇒ <code>Array</code>
Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>Array</code> - The sub-DataTypes of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-DataTypes (recursive from sub-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-DataTypes |

<a name="DataType+toString"></a>

### dataType.toString() ⇒ <code>string</code>
Generates a string representation of this DataType (Based on its JSON representation)

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> - The string representation of this DataType  
<a name="DataType+toJSON"></a>

### dataType.toJSON(implicit, filter) ⇒ <code>object</code>
Generates an explicit/implicit JSON representation of this DataType.

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>object</code> - The JSON representation of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data (e.g. sub-DataTypes, super-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

