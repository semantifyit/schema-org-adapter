<div align="center">
<h1>Schema.org Adapter</h1>
<b>Fast, simple & flexible API for the Schema.org Vocabulary (and vocabulary extensions!) for Node and Browsers</b>
<br><br>
<a href="https://libraries.io/npm/schema-org-adapter"><img src="https://img.shields.io/librariesio/release/npm/schema-org-adapter" alt="Dependencies" /></a>
<a href="https://github.com/semantifyit/schema-org-adapter/issues"><img src="https://img.shields.io/github/issues/semantifyit/schema-org-adapter.svg" alt="Issues open" /></a>
<a href="https://github.com/semantifyit/schema-org-adapter/issues"><img src="https://img.shields.io/snyk/vulnerabilities/github/semantifyit/schema-org-adapter" alt="Snyk Vulnerability Test" /></a>
<br>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/npm/types/scrub-js.svg" alt="Built with TypeScript" /></a>
<a href="https://eslint.org/"><img src="https://img.shields.io/badge/code%20style-ESLint-brightgreen" alt="Code style in ESLint" /></a>
<a href="https://npms.io/search?q=schema-org-adapter"><img src="https://img.shields.io/npms-io/quality-score/schema-org-adapter" alt="npms.io Code Quality" /></a>
<img src="https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/docu/coverage/badge-functions.svg?sanitize=true" alt="Functions test coverage" />
<br>
<a href="https://www.npmjs.com/package/schema-org-adapter" rel="nofollow"><img src="https://img.shields.io/npm/v/schema-org-adapter.svg" alt="NPM Version"></a>
<a href="https://github.com/semantifyit/schema-org-adapter/"><img src="https://img.shields.io/tokei/lines/github/semantifyit/schema-org-adapter" alt="Total lines of code" /></a>
<a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: CC BY-SA 4.0" /></a>
</div>
<br>

## Features
&#8984; **Empowers the semantic web:** <a href="http://schema.org/" target="_blank">Schema.org</a> has become the standard vocabulary for the semantic web. The **Schema.org Adapter** (SDO-Adapter) gives developers a clear API to access the schema.org vocabulary in a simple way.

&#9733; **Clear data model:** The data model of the rdf-based, machine-readable version of Schema.org is slightly adapted (see <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md" target="_blank">algorithm documentation</a> for details) to create the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">clear and pragmatic data model</a> for the **Schema.org Adapter**.

&#8633; **Supports schema.org versions and external vocabularies:** The **Schema.org Adapter** is lightweight because it does NOT include the vocabulary data, instead it allows the user to input his needed local/remote vocabularies (JSON-LD or URL to JSON-LD). This gives users the possibility to specify the <a href="https://schema.org/docs/developers.html" target="_blank">version of Schema.org</a> (including http/https variations) they need, also to use <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md" target="_blank">external vocabularies</a>.

&#9883; **Built-in reasoning:** The simple-to-use [API of this library](https://semantifyit.github.io/schema-org-adapter/)  offers functions and parameters that enable built-in reasoning on the used vocabulary-terms (e.g. resolution of properties, sub-classes, ranges, etc.)


## Install and load

Independent of the installation and loading method it is expected that a variable named `SOA` provides this library.

### NPM

```bash
npm install schema-org-adapter
```

#### Node.js

Require/import the package:

```javascript
const SOA = require('schema-org-adapter');
// or
import SOA from 'schema-org-adapter';
```

#### Browser

Script-include the bundled package in **/dist**:

```html
<script src="/dist/schema-org-adapter.min.js"></script>
<!--Global variable 'SOA' is available-->
```

### CDN

For the browser you can also directly load the library via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/semantifyit/schema-org-adapter/dist/schema-org-adapter.min.js"></script>
<!--Global variable 'SOA' is available-->
```

## Usage

```javascript
// 1. Create an SDO-Adapter instance with the latest schema.org vocabulary version
const mySdoAdapter = await SOA.create({
  schemaVersion: "latest"
});

// 2. Use the SDO-Adapter!

// get all properties that are usable by the class schema:Hotel
const hotelInstance = mySdoAdapter.getClass('schema:Hotel');
const hotelProperties = hotelInstance.getProperties();
// ["schema:audience", "schema:checkinTime", "schema:availableLanguage", ...]

// get all data-types and classes that are valid ranges for the property schema:address
const addressInstance = mySdoAdapter.getProperty("schema:address");
const addressRanges = addressInstance.getRanges();
// ["schema:PostalAddress", "schema:Text"]
```

## Documentation

### [Technical API documentation](https://semantifyit.github.io/schema-org-adapter/)
### [Data Model of the Schema.org Adapter](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md)
### [Expected Vocabulary Structure](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md)
### [Conversion Algorithm for Vocabularies](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md)

## Code Examples

### [Example for Node](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/examples/example-node-2.js)
### [Example for Browser](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/examples/example-browser-2.html)
### [All examples](https://github.com/semantifyit/schema-org-adapter/blob/master/docu/examples)

## Changelog

### [History.md](https://github.com/semantifyit/schema-org-adapter/blob/master/History.md)

<div align="center">
<h3><a href="https://semantify.it/" target="_blank">semantify.it</a></h3>
Made with &#10084;	 in Tirol!
</div>


