## Classes

<dl>
<dt><a href="#SDOAdapter">SDOAdapter</a></dt>
<dd></dd>
<dt><a href="#Term">Term</a></dt>
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
    * [new SDOAdapter(parameterObject)](#new_SDOAdapter_new)
    * [.addVocabularies(vocabArray)](#SDOAdapter+addVocabularies) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.fetchVocabularyFromURL(url)](#SDOAdapter+fetchVocabularyFromURL) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getTerm(id, filter)](#SDOAdapter+getTerm) ⇒ [<code>Term</code>](#Term)
    * [.getAllTerms(filter)](#SDOAdapter+getAllTerms) ⇒ [<code>Array.&lt;Class&gt;</code>](#Class)
    * [.getListOfTerms(filter)](#SDOAdapter+getListOfTerms) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getClass(id, filter)](#SDOAdapter+getClass) ⇒ [<code>Class</code>](#Class) \| [<code>Enumeration</code>](#Enumeration)
    * [.getAllClasses(filter)](#SDOAdapter+getAllClasses) ⇒ [<code>Array.&lt;Class&gt;</code>](#Class)
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
    * [.constructSDOVocabularyURL(version)](#SDOAdapter+constructSDOVocabularyURL) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getSDOVersionFile()](#SDOAdapter+getSDOVersionFile) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.checkURL(url)](#SDOAdapter+checkURL) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.getLatestSDOVersion()](#SDOAdapter+getLatestSDOVersion) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getReleasesURI()](#SDOAdapter+getReleasesURI) ⇒ <code>string</code>
    * [.getVersionFileURI()](#SDOAdapter+getVersionFileURI) ⇒ <code>string</code>

<a name="new_SDOAdapter_new"></a>

### new SDOAdapter(parameterObject)
The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parameterObject | <code>object</code> \| <code>null</code> | <code></code> | an object with optional parameters for the constructor. There is 'commitBase': The commit string from https://github.com/schemaorg/schemaorg which is the base for the adapter (if not given, we take the latest commit of our fork at https://github.com/semantifyit/schemaorg). There is 'onError': A callback function(string) that is called when an unexpected error happens. There is 'schemaHttps': a boolean flag - use the https version of the schema.org vocabulary, it defaults to true. Only available if for schema.org version 9.0 upwards |

<a name="SDOAdapter+addVocabularies"></a>

### sdoAdapter.addVocabularies(vocabArray) ⇒ <code>Promise.&lt;void&gt;</code>
Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;void&gt;</code> - This is an async function  

| Param | Type | Description |
| --- | --- | --- |
| vocabArray | <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;object&gt;</code> \| <code>string</code> \| <code>object</code> | The vocabular(y/ies) to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch. |

<a name="SDOAdapter+fetchVocabularyFromURL"></a>

### sdoAdapter.fetchVocabularyFromURL(url) ⇒ <code>Promise.&lt;object&gt;</code>
Fetches a vocabulary from the given URL.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;object&gt;</code> - - the fetched vocabulary object  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the URL from which the vocabulary should be fetched |

<a name="SDOAdapter+getTerm"></a>

### sdoAdapter.getTerm(id, filter) ⇒ [<code>Term</code>](#Term)
Creates a corresponding JS-Class for the given IRI, depending on its term-category

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Term</code>](#Term) - the JS-Class for the given IRI  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> |  | The id of the wished term, can be an IRI (absolute or compact) or a label |
| filter | <code>object</code> | <code></code> | (optional) The filter settings to be applied on the result |

<a name="SDOAdapter+getAllTerms"></a>

### sdoAdapter.getAllTerms(filter) ⇒ [<code>Array.&lt;Class&gt;</code>](#Class)
Creates an array of JS-Classes for all vocabulary Terms (corresponding JS-Classes depending on the Term types)

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;Class&gt;</code>](#Class) - An array of JS-Classes representing all vocabulary Terms  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the Term creation |

<a name="SDOAdapter+getListOfTerms"></a>

### sdoAdapter.getListOfTerms(filter) ⇒ <code>Array.&lt;string&gt;</code>
Creates an array of IRIs for all vocabulary Terms

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of IRIs representing all vocabulary Terms  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the List creation |

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

### sdoAdapter.getAllClasses(filter) ⇒ [<code>Array.&lt;Class&gt;</code>](#Class)
Creates an array of JS-Classes for all vocabulary Classes

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: [<code>Array.&lt;Class&gt;</code>](#Class) - An array of JS-Classes representing all vocabulary Classes, does not include Enumerations  

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

### sdoAdapter.constructSDOVocabularyURL(version) ⇒ <code>Promise.&lt;string&gt;</code>
Creates a URL pointing to the Schema.org vocabulary (the wished version can be specified). This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary. Invalid version argument will result in errors, check https://schema.org/docs/developers.html for more information
To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The URL to the Schema.org vocabulary  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| version | <code>string</code> | <code>&quot;latest&quot;</code> | the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest" |

<a name="SDOAdapter+getSDOVersionFile"></a>

### sdoAdapter.getSDOVersionFile() ⇒ <code>Promise.&lt;void&gt;</code>
Retrieves the schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json
and saves it in the local memory. Also sends head-requests to determine if the 'latest' version is really 'fetchable'.
If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the memory.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Returns void when the process ends (signalizing the process ending).  
<a name="SDOAdapter+checkURL"></a>

### sdoAdapter.checkURL(url) ⇒ <code>Promise.&lt;boolean&gt;</code>
Sends a head-request to the given URL, checking if content exists.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - returns true if there is content  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the URL to check |

<a name="SDOAdapter+getLatestSDOVersion"></a>

### sdoAdapter.getLatestSDOVersion() ⇒ <code>Promise.&lt;string&gt;</code>
Returns the latest version number of the schema.org vocabulary
To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>Promise.&lt;string&gt;</code> - The latest version of the schema.org vocabulary  
<a name="SDOAdapter+getReleasesURI"></a>

### sdoAdapter.getReleasesURI() ⇒ <code>string</code>
Returns the base part of respective release URI

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>string</code> - the base part of respective release URI  
<a name="SDOAdapter+getVersionFileURI"></a>

### sdoAdapter.getVersionFileURI() ⇒ <code>string</code>
Returns the URI of the respective versions file

**Kind**: instance method of [<code>SDOAdapter</code>](#SDOAdapter)  
**Returns**: <code>string</code> - the URI of the respective versions file  
<a name="Term"></a>

## Term
**Kind**: global class  

* [Term](#Term)
    * [new Term(IRI, graph)](#new_Term_new)
    * [.getIRI(compactForm)](#Term+getIRI) ⇒ <code>string</code>
    * *[.getTermType()](#Term+getTermType) ⇒ <code>string</code>*
    * *[.getTermObj()](#Term+getTermObj) ⇒ <code>string</code>*
    * [.getVocabURLs()](#Term+getVocabURLs) ⇒ <code>Array</code> \| <code>null</code>
    * [.getVocabulary()](#Term+getVocabulary) ⇒ <code>string</code> \| <code>null</code>
    * [.getSource()](#Term+getSource) ⇒ <code>string</code> \| <code>Array</code> \| <code>null</code>
    * [.isSupersededBy()](#Term+isSupersededBy) ⇒ <code>string</code> \| <code>null</code>
    * [.getName(language)](#Term+getName) ⇒ <code>string</code> \| <code>null</code>
    * [.getDescription(language)](#Term+getDescription) ⇒ <code>string</code> \| <code>null</code>
    * [.toString()](#Term+toString) ⇒ <code>string</code>
    * [.toJSON()](#Term+toJSON) ⇒ <code>object</code>

<a name="new_Term_new"></a>

### new Term(IRI, graph)
A vocabulary term. It is identified by its IRI.


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Term |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this Term |

<a name="Term+getIRI"></a>

### term.getIRI(compactForm) ⇒ <code>string</code>
Retrieves the IRI (@id) of this Term in compact/absolute form

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> - The IRI (@id) of this Term  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| compactForm | <code>boolean</code> | <code>false</code> | (default = false), if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday" |

<a name="Term+getTermType"></a>

### *term.getTermType() ⇒ <code>string</code>*
Retrieves the term type (@type) of this Term

**Kind**: instance abstract method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> - The term type of this Term  
<a name="Term+getTermObj"></a>

### *term.getTermObj() ⇒ <code>string</code>*
Retrieves the term object of this Term

**Kind**: instance abstract method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> - The term object of this Term  
<a name="Term+getVocabURLs"></a>

### term.getVocabURLs() ⇒ <code>Array</code> \| <code>null</code>
Retrieves the original vocabulary urls of this Term

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>Array</code> \| <code>null</code> - The original vocabulary urls of this Term  
<a name="Term+getVocabulary"></a>

### term.getVocabulary() ⇒ <code>string</code> \| <code>null</code>
Retrieves the original vocabulary (schema:isPartOf) of this Term

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> \| <code>null</code> - The vocabulary IRI given by the "schema:isPartOf" of this Term  
<a name="Term+getSource"></a>

### term.getSource() ⇒ <code>string</code> \| <code>Array</code> \| <code>null</code>
Retrieves the source (dc:source) of this Term

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> \| <code>Array</code> \| <code>null</code> - The source IRI given by the "dc:source" of this Term (null if none)  
<a name="Term+isSupersededBy"></a>

### term.isSupersededBy() ⇒ <code>string</code> \| <code>null</code>
Retrieves the Term superseding (schema:supersededBy) this Term

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> \| <code>null</code> - The Term superseding this Term (null if none)  
<a name="Term+getName"></a>

### term.getName(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the name (rdfs:label) of this Term in a wished language (optional)

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> \| <code>null</code> - The name of this Term (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the name |

<a name="Term+getDescription"></a>

### term.getDescription(language) ⇒ <code>string</code> \| <code>null</code>
Retrieves the description (rdfs:comment) of this Term in a wished language (optional)

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> \| <code>null</code> - The description of this Term (null if not given for specified language)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| language | <code>string</code> | <code>&quot;en&quot;</code> | (default = "en") the wished language for the description |

<a name="Term+toString"></a>

### term.toString() ⇒ <code>string</code>
Generates a string representation of this Term (Based on its JSON representation)

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>string</code> - The string representation of this Term  
<a name="Term+toJSON"></a>

### term.toJSON() ⇒ <code>object</code>
Generates a JSON representation of this Term

**Kind**: instance method of [<code>Term</code>](#Term)  
**Returns**: <code>object</code> - The JSON representation of this Term  
<a name="Class"></a>

## Class
**Kind**: global class  

* [Class](#Class)
    * [new Class(IRI, graph)](#new_Class_new)
    * [.getTermType()](#Class+getTermType) ⇒ <code>string</code>
    * [.getTermObj()](#Class+getTermObj) ⇒ <code>string</code>
    * [.getProperties(implicit, filter)](#Class+getProperties) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getSuperClasses(implicit, filter)](#Class+getSuperClasses) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getSubClasses(implicit, filter)](#Class+getSubClasses) ⇒ <code>Array.&lt;string&gt;</code>
    * [.isRangeOf(implicit, filter)](#Class+isRangeOf) ⇒ <code>Array</code>
    * [.toJSON(implicit, filter)](#Class+toJSON) ⇒ <code>object</code>

<a name="new_Class_new"></a>

### new Class(IRI, graph)
A Class represents an rdfs:Class. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Class, e.g. "schema:Book" |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this Class |

<a name="Class+getTermType"></a>

### class.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this Class (is always "rdfs:Class")

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> - The term type of this Class -> "rdfs:Class"  
<a name="Class+getTermObj"></a>

### class.getTermObj() ⇒ <code>string</code>
Retrieves the term object of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>string</code> - The term object of this Class  
<a name="Class+getProperties"></a>

### class.getProperties(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit properties (soa:hasProperty) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array.&lt;string&gt;</code> - The properties of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit properties (inheritance from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the properties |

<a name="Class+getSuperClasses"></a>

### class.getSuperClasses(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array.&lt;string&gt;</code> - The super-classes of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-classes (recursive from super-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-classes |

<a name="Class+getSubClasses"></a>

### class.getSubClasses(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array.&lt;string&gt;</code> - The sub-classes of this Class  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-classes (recursive from sub-classes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-classes |

<a name="Class+isRangeOf"></a>

### class.isRangeOf(implicit, filter) ⇒ <code>Array</code>
Retrieves the properties that have this Class as a range

**Kind**: instance method of [<code>Class</code>](#Class)  
**Returns**: <code>Array</code> - The properties that have this Class as a range  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

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
    * [.getTermType()](#Property+getTermType) ⇒ <code>string</code>
    * [.getTermObj()](#Property+getTermObj) ⇒ <code>string</code>
    * [.getRanges(implicit, filter)](#Property+getRanges) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getDomains(implicit, filter)](#Property+getDomains) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getSuperProperties(implicit, filter)](#Property+getSuperProperties) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getSubProperties(implicit, filter)](#Property+getSubProperties) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getInverseOf()](#Property+getInverseOf) ⇒ <code>string</code>
    * [.toJSON(implicit, filter)](#Property+toJSON) ⇒ <code>object</code>

<a name="new_Property_new"></a>

### new Property(IRI, graph)
A Property represents an rdf:Property. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Property, e.g. "schema:address" |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this Property |

<a name="Property+getTermType"></a>

### property.getTermType() ⇒ <code>string</code>
Retrieves the term type of this Property (is always "rdf:Property")

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The term type of this Property -> "rdf:Property"  
<a name="Property+getTermObj"></a>

### property.getTermObj() ⇒ <code>string</code>
Retrieves the term object of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The term object of this Property  
<a name="Property+getRanges"></a>

### property.getRanges(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array.&lt;string&gt;</code> - The ranges of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit ranges (inheritance from sub-classes of the ranges) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the ranges |

<a name="Property+getDomains"></a>

### property.getDomains(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array.&lt;string&gt;</code> - The domains of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit domains (inheritance from sub-classes of the domains) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the domains |

<a name="Property+getSuperProperties"></a>

### property.getSuperProperties(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array.&lt;string&gt;</code> - The super-properties of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-properties (recursive from super-properties) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-properties |

<a name="Property+getSubProperties"></a>

### property.getSubProperties(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>Array.&lt;string&gt;</code> - The sub-properties of this Property  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-properties (recursive from sub-properties) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-properties |

<a name="Property+getInverseOf"></a>

### property.getInverseOf() ⇒ <code>string</code>
Retrieves the inverse Property (schema:inverseOf) of this Property

**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>string</code> - The IRI of the inverse Property of this Property  
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
    * [.getTermType()](#Enumeration+getTermType) ⇒ <code>string</code>
    * [.getTermObj()](#Enumeration+getTermObj) ⇒ <code>string</code>
    * [.getEnumerationMembers(implicit, filter)](#Enumeration+getEnumerationMembers) ⇒ <code>Array.&lt;string&gt;</code>
    * [.toJSON(implicit, filter)](#Enumeration+toJSON) ⇒ <code>object</code>

<a name="new_Enumeration_new"></a>

### new Enumeration(IRI, graph)
An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek" |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this Enumeration |

<a name="Enumeration+getTermType"></a>

### enumeration.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> - The term type of this Enumeration -> "schema:Enumeration"  
<a name="Enumeration+getTermObj"></a>

### enumeration.getTermObj() ⇒ <code>string</code>
Retrieves the term object of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>string</code> - The term object of this Enumeration  
<a name="Enumeration+getEnumerationMembers"></a>

### enumeration.getEnumerationMembers(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>Array.&lt;string&gt;</code> - The enumeration members of this Enumeration  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>false</code> | (default = false) retrieves also implicit enumeration members (inheritance from sub-enumerations) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the enumeration members |

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
    * [.getTermType()](#EnumerationMember+getTermType) ⇒ <code>string</code>
    * [.getTermObj()](#EnumerationMember+getTermObj) ⇒ <code>string</code>
    * [.getDomainEnumerations(implicit, filter)](#EnumerationMember+getDomainEnumerations) ⇒ <code>Array.&lt;string&gt;</code>
    * [.toJSON(implicit, filter)](#EnumerationMember+toJSON) ⇒ <code>object</code>

<a name="new_EnumerationMember_new"></a>

### new EnumerationMember(IRI, graph)
An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this EnumerationMember, e.g. "schema:Friday" |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this EnumerationMember |

<a name="EnumerationMember+getTermType"></a>

### enumerationMember.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this EnumerationMember (is always "schema:Enumeration")

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> - The term type of this EnumerationMember -> "soa:EnumerationMember" //there is no explicit type for enumeration members in the Schema.org Meta, so we use our own definition  
<a name="EnumerationMember+getTermObj"></a>

### enumerationMember.getTermObj() ⇒ <code>string</code>
Retrieves the term object of this Enumeration Member

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>string</code> - The term object of this Enumeration Member  
<a name="EnumerationMember+getDomainEnumerations"></a>

### enumerationMember.getDomainEnumerations(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>Array.&lt;string&gt;</code> - The domain enumerations of this EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>false</code> | (default = false) retrieves also implicit domain enumerations (inheritance from super-enumerations) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the domain enumerations |

<a name="EnumerationMember+toJSON"></a>

### enumerationMember.toJSON(implicit, filter) ⇒ <code>object</code>
Generates a JSON representation of this EnumerationMember

**Kind**: instance method of [<code>EnumerationMember</code>](#EnumerationMember)  
**Returns**: <code>object</code> - The JSON representation of this EnumerationMember  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>false</code> | (default = false) includes also implicit data |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="DataType"></a>

## DataType
**Kind**: global class  

* [DataType](#DataType)
    * [new DataType(IRI, graph)](#new_DataType_new)
    * [.getTermType()](#DataType+getTermType) ⇒ <code>string</code>
    * [.getTermObj()](#DataType+getTermObj) ⇒ <code>string</code>
    * [.getSuperDataTypes(implicit, filter)](#DataType+getSuperDataTypes) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getSubDataTypes(implicit, filter)](#DataType+getSubDataTypes) ⇒ <code>Array.&lt;string&gt;</code>
    * [.isRangeOf(implicit, filter)](#DataType+isRangeOf) ⇒ <code>Array</code>
    * [.toJSON(implicit, filter)](#DataType+toJSON) ⇒ <code>object</code>

<a name="new_DataType_new"></a>

### new DataType(IRI, graph)
A DataType represents an schema:DataType. It is identified by its IRI


| Param | Type | Description |
| --- | --- | --- |
| IRI | <code>string</code> | The compacted IRI of this DataType, e.g. "schema:Number" |
| graph | <code>Graph</code> | The underlying data graph to enable the methods of this DataType |

<a name="DataType+getTermType"></a>

### dataType.getTermType() ⇒ <code>string</code>
Retrieves the term type (@type) of this DataType (is always "schema:DataType")

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> - The term type of this DataType -> "schema:DataType"  
<a name="DataType+getTermObj"></a>

### dataType.getTermObj() ⇒ <code>string</code>
Retrieves the term object of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>string</code> - The term object of this DataType  
<a name="DataType+getSuperDataTypes"></a>

### dataType.getSuperDataTypes(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>Array.&lt;string&gt;</code> - The super-DataTypes of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the super-DataTypes |

<a name="DataType+getSubDataTypes"></a>

### dataType.getSubDataTypes(implicit, filter) ⇒ <code>Array.&lt;string&gt;</code>
Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>Array.&lt;string&gt;</code> - The sub-DataTypes of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) retrieves also implicit sub-DataTypes (recursive from sub-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the sub-DataTypes |

<a name="DataType+isRangeOf"></a>

### dataType.isRangeOf(implicit, filter) ⇒ <code>Array</code>
Retrieves the properties that have this DataType as a range

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>Array</code> - The properties that have this DataType as a range  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

<a name="DataType+toJSON"></a>

### dataType.toJSON(implicit, filter) ⇒ <code>object</code>
Generates an explicit/implicit JSON representation of this DataType.

**Kind**: instance method of [<code>DataType</code>](#DataType)  
**Returns**: <code>object</code> - The JSON representation of this DataType  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| implicit | <code>boolean</code> | <code>true</code> | (default = true) includes also implicit data (e.g. sub-DataTypes, super-DataTypes) |
| filter | <code>object</code> \| <code>null</code> | <code></code> | (default = null) an optional filter for the generated data |

