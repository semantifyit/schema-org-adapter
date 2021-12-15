# Schema.org Adapter

<div align="center">
<b>Fast, simple & flexible API for the Schema.org Vocabulary (and vocabulary extensions!) for Node and Browsers</b>
<br><br>
<a href="https://libraries.io/npm/schema-org-adapter"><img src="https://img.shields.io/librariesio/release/npm/schema-org-adapter" alt="Dependencies" /></a>
<a href="https://github.com/semantifyit/schema-org-adapter/issues"><img src="https://img.shields.io/github/issues/semantifyit/schema-org-adapter.svg" alt="Issues open" /></a>
<a href="https://github.com/semantifyit/schema-org-adapter/issues"><img src="https://img.shields.io/snyk/vulnerabilities/github/semantifyit/schema-org-adapter" alt="Snyk Vulnerability Test" /></a>
<br>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/npm/types/scrub-js.svg" alt="Built with TypeScript" /></a>
<a href="https://eslint.org/"><img src="https://img.shields.io/badge/code%20style-ESLint-brightgreen" alt="Code style in ESLint" /></a>
<a href="https://npms.io/search?q=schema-org-adapter"><img src="https://img.shields.io/npms-io/quality-score/schema-org-adapter" alt="npms.io Code Quality" /></a>
<img src="https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/coverage/badge-functions.svg?sanitize=true" alt="Jest Test Coverage Functions" />
<br>
<a href="https://www.npmjs.com/package/schema-org-adapter" rel="nofollow"><img src="https://img.shields.io/npm/v/schema-org-adapter.svg" alt="NPM Version"></a>
<a href="https://github.com/semantifyit/schema-org-adapter/"><img src="https://img.shields.io/tokei/lines/github/semantifyit/schema-org-adapter" alt="Total lines of code" /></a>
<a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: CC BY-SA 4.0" /></a>
</div>
<br>

## Features
&#8984; **Empowers the semantic web:** <a href="http://schema.org/" target="_blank">Schema.org</a> has become the standard vocabulary for the semantic web. The **Schema.org Adapter** gives developers a clear API to access the schema.org vocabulary in a simple way.

&#9733; **Clear data model:** The data model of the rdf-based, machine-readable version of Schema.org is slightly adapted (see <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/algorithm.md" target="_blank">documentation</a> for details) to create the <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/dataModel.md" target="_blank">clear and pragmatic data model</a> for the **Schema.org Adapter**.

&#8633; **Supports schema.org versions and external vocabularies:** The **Schema.org Adapter** is lightweight because it does NOT include the vocabulary data, instead it allows the user to input his needed local/remote vocabularies (JSON-LD or URL to JSON-LD). This gives users the possibility to specify the <a href="https://schema.org/docs/developers.html" target="_blank">version of Schema.org</a> (including http/https variations) they need, also to use <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/docu/vocabulary.md" target="_blank">external vocabularies</a>. It is possible to input the wished schema.org vocabulary file/URL directly, or build such a vocabulary URL using functions provided by the library (it uses a repository-fork with tested updates from the official schema.org repository to ensure the correct function of the library while also keeping up-to-date with schema.org releases).

&#9851; **Built-in reasoning:** The API of **Schema.org Adapter** offers functions and parameters to enable built-in reasoning on the used vocabulary-terms (e.g. resolution of properties, sub-classes, ranges, etc.)

## Install and load

Independent of the installation and loading method there will be a variable `SDOAdapter` holding this library.

### NPM

```bash
npm install schema-org-adapter
```

#### Node.js

Require/import the package:

```javascript
const SDOAdapter = require('schema-org-adapter');
// or
import SDOAdapter from 'schema-org-adapter';
```

#### Browser

Script-include the bundled package in **/dist**:

```html
<script src="/dist/schema-org-adapter.min.js"></script>
```

### CDN

For the browser you can also directly load the library via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/semantifyit/schema-org-adapter/dist/schema-org-adapter.min.js"></script>
```

## Usage

```javascript
// 1. Create a Schema.org Adapter instance with the wished schema.org vocabulary version
const mySdoAdapter = await SDOAdapter.create({
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

[Documentation is available](https://semantifyit.github.io/schema-org-adapter/) including examples for each method provided by the library.

## Examples

Check the examples for <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/examples/example-node.js" target="_blank">Node</a> and <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/examples/example-browser.html" target="_blank">Browser</a> on GitHub.

## Changelog

See <a href="https://github.com/semantifyit/schema-org-adapter/blob/master/History.md" target="_blank">History.md</a>.

## Acknowledgement

<div align="center">
<h3><a href="https://semantify.it/" target="_blank">semantify.it</a></h3>
Made with &#10084;	 in Tirol!
</div>


