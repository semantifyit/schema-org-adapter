# API documentation

This is the **technical API documentation** for the [schema-org-adapter](https://www.npmjs.com/package/schema-org-adapter) library. 

Additional documentation is linked at the end of this page.

## Setup

The [readme](https://github.com/semantifyit/schema-org-adapter#schemaorg-adapter) explains the installation, loading and basic usage of this library. In any case, it is expected that the variable `SOA` references the library.

Node.js

```javascript
const { SOA } = require('schema-org-adapter');
// or
import { SOA } from 'schema-org-adapter';
```

Browser

```html
<script src="/dist/schema-org-adapter.min.js"></script>
```

## Usage

The **schema-org-adapter** library itself (called **SOA** from now on) provides following static functions:

* <a href="./modules.html#create">create()</a>
* <a href="./modules.html#fetchSchemaVersions">fetchSchemaVersions()</a>
* <a href="./modules.html#getLatestSchemaVersion">getLatestSchemaVersion()</a>
* <a href="./modules.html#constructURLSchemaVocabulary">constructURLSchemaVocabulary()</a>

The most important function of **SOA** is {@link create | .create()}: it returns a new {@link SDOAdapter | SDOAdapter instance}. An `SDOAdapter` instance has its own settings and vocabularies, which are the base for the output given by its provided API. It is possible to pass these settings and vocabularies with a {@link ParamObjCreateSdoAdapter | parameter object} to the `.create()` function. 

In the following common use-case the SDOAdapter instance `mySdoAdapter` is created with default settings and the latest version of schema.org.

```javascript
const mySdoAdapter = await SOA.create({
  schemaVersion: "latest"
});
```

After the initialization of `mySdoAdapter`, its API can be used to retrieve information about the schema.org vocabulary. Check the {@link SDOAdapter | SDOAdapter reference page} to discover its API. The most important methods are those that create instances for vocabulary terms:

* {@link SDOAdapter.getClass | getClass()} - creates a new {@link Class | Class instance} for a specific class
* {@link SDOAdapter.getProperty | getProperty()}  - creates a new {@link Property | Property instance} for a specific property
* {@link SDOAdapter.getDataType | getDataType()} - creates a new {@link DataType | DataType instance} for a specific data-type
* {@link SDOAdapter.getEnumeration | getEnumeration()} - creates a new {@link Enumeration | Enumeration instance} for a specific enumeration
* {@link SDOAdapter.getEnumerationMember | getEnumerationMember()} - creates a new {@link EnumerationMember | EnumerationMember instance} for a specific enumeration member (a predefined value that an enumeration can have)

In the following example a new Class instance is generated for the schema.org class https://schema.org/Hotel

```javascript
const hotelClass = mySdoAdapter.getClass("schema:Hotel");
```

The term instances have their own API depending on their type. A {@link Class | Class instance}, for example, provides a function to get all properties that the Class can use:

```javascript
console.log(hotelClass.getProperties());
/* output:
 * [
 *  'schema:amenityFeature',
 *  'schema:numberOfRooms',
 *  'schema:starRating',
 *  'schema:checkinTime',
 *  'schema:petsAllowed',
 *  ...
 * ]
 */
```

There are many more methods, options and functionalities to use! Explore them in the <a href="./modules.html">index page</a>.

## Additional Documentation

#### [Data Model of SDO-Adapter](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md)
#### [Expected Vocabulary Structure](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md)
#### [Conversion Algorithm for Vocabularies](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md)
