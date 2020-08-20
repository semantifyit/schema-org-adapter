# Schema.org Adapter

<div align="center">
<b>Fast, simple & flexible API for the Schema.org Vocabulary (and vocabulary extensions!) for Node and Browsers</b>
<br><br>
<a href="https://www.npmjs.com/package/schema-org-adapter" rel="nofollow"><img src="https://img.shields.io/npm/v/schema-org-adapter.svg" alt="NPM Version"></a>
<a href="https://eslint.org/"><img src="https://img.shields.io/badge/code%20style-ESLint-brightgreen" alt="Code style in ESLint" /></a>
<a href="https://david-dm.org/semantifyit/schema-org-adapter"><img src="https://david-dm.org/semantifyit/schema-org-adapter.svg" alt="Dependencies" /></a>
<a href="https://github.com/semantifyit/schema-org-adapter/issues"><img src="https://img.shields.io/github/issues/semantifyit/schema-org-adapter.svg" alt="Issues open" /></a>
<br>
<img src="https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/coverage/badge-functions.svg?sanitize=true" alt="Jest Test Coverage Functions" />
<img src="https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/coverage/badge-lines.svg?sanitize=true" alt="Jest Test Coverage Lines" />
<img src="https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/coverage/badge-statements.svg?sanitize=true" alt="Jest Test Coverage Statements" />
<br>
<a href="https://creativecommons.org/licenses/by-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg" alt="License: CC BY-SA 4.0" /></a>
</div>
<br>

```javascript
// 1. Import the package
const SDOAdapter = require('schema-org-adapter');
// 2. Create a new instance of the SDO-Adapter with no knowledge (it must yet be initialized with vocabularies)
const mySDOAdapter = new SDOAdapter();
// 3. Initialize the SDO-Adapter with a vocabulary/vocabularyURL (SDO-Adapter can help with that!)
await mySDOAdapter.addVocabularies(await mySDOAdapter.constructSDOVocabularyURL('latest'));

// 4. Use the SDO-Adapter!
let Hotel = mySDOAdapter.getClass('schema:Hotel');
Hotel.getProperties(); // -> ["schema:audience", "schema:checkinTime", "schema:availableLanguage", ...]
Hotel.getSuperClasses(false); // Only direct superclasses -> ["schema:LodgingBusiness"]
Hotel.getSuperClasses(); // Also superclasses of superclasses -> ["schema:LodgingBusiness", "schema:LocalBusiness", "schema:Place", "schema:Organization", "schema:Thing"]

let address = mySDOAdapter.getProperty("schema:address");
address.getRanges(); // -> ["schema:PostalAddress", "schema:Text"]
address.getDomains(false); // Only direct domains -> ["schema:Place", "schema:GeoCoordinates", "schema:GeoShape", "schema:Person", "schema:Organization"]
address.getDomains(); // Also subclasses of domains -> ["schema:Place", "schema:Accommodation", "schema:TouristAttraction", ...]
```

## Installation and Use

#### NPM

Install the npm package:

`npm install schema-org-adapter`

#### Node

Require the package:

```javascript
const SDOAdapter = require('schema-org-adapter');
```

#### Browser

Script-include the bundled package in **/dist** or load via a cdn:

```html
<script src="/dist/schema-org-adapter.min.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/gh/semantifyit/schema-org-adapter/dist/schema-org-adapter.min.js"></script>
```

## Features
&#8984; **Empowers the semantic web:** <a href="http://schema.org/" target="_blank">Schema.org</a> has become the standard vocabulary for the semantic web. This **Schema.org Adapter** gives developers a clear API to access the schema.org vocabulary in a simple way.

&#9733; **Clear data model:** The data model of the rdf-based, machine-readable version of Schema.org is slightly adapted (see <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md" target="_blank">documentation</a> for details) to create the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">clear and pragmatic data model</a> of this **Schema.org Adapter**.

&#8633; **Supports schema.org versions and external vocabularies:** The **Schema.org Adapter** is lightweight because it does NOT include the vocabulary data, instead it allows the user to input his needed local/remote vocabularies (JSON-LD or URL to JSON-LD). This gives the user the possibility to specify the <a href="https://schema.org/docs/developers.html" target="_blank">version of Schema.org</a> he/she needs, also to use <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md" target="_blank">external vocabularies</a>. It is possible to input the wished schema.org vocabulary file/URL directly, or build such a vocabulary URL using functions provided by schema-org-adapter (it uses a repository-fork with daily test-controlled updates from the official schema.org repository to ensure the correct function of the library while also keeping up-to-date with schema.org releases).

&#9851; **Built-in reasoning:** The API of **Schema.org Adapter** offers functions and parameters to enable built-in reasoning on the used vocabulary-terms (e.g. resolution of properties, sub-classes, ranges, etc.)

## API

#### JSDoc
Api documentation generated by JSDoc hosted at <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/api.md" target="_blank">GitHub</a>.

##### Examples

Check the examples for <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/tests/dist-test-node.js" target="_blank">Node</a> and <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/tests/dist-test-browser.html" target="_blank">Browser</a> on GitHub.

##### Use of filters

It is possible to filter the results of some functions by passing a filter object - The filter options can be: 
* "isSuperseded": boolean (e.g. `false` -> only vocabulary elements that are not superseded will be returned)
* "termType": string/Array (e.g. `['Property', 'Class']` -> only vocabulary elements that are properties or classes will be returned)
* "fromVocabulary": string/Array (e.g. `['http://schema.org/']` -> only vocabulary elements that come from a specific vocabulary will be returned (this may be interesting if you use additional <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md" target="_blank">external vocabularies</a>))

```javascript
const SDOAdapter = require('schema-org-adapter');
const mySdoAdapter = new SDOAdapter();
await mySdoAdapter.addVocabularies(await mySDOAdapter.constructSDOVocabularyURL('latest'));

//get list of classes that are NOT superseded
let listOfClasses = mySdoAdapter.getAllClasses({
  "isSuperseded": false
});
```

## Acknowledgement

<div align="center">
<h3><a href="https://semantify.it/" target="_blank">semantify.it</a></h3>
Made with &#10084;	 in Tirol!
</div>


