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

