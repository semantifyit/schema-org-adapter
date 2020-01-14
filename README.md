<h1 align="center">Schema.org Adapter</h1>

<h5 align="center">Fast, simple & flexible API for the Schema.org Vocabulary (and vocabulary extensions!) for Node and Browsers</h5>

<div align="center"><a href="http://standardjs.com"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Code style in StandardJS" /></a></div>

```javascript
const SDOAdapter = require('schema-org-adapter')

const mySDOAdapter = new SDOAdapter()

const urlLatestSDO = await mySDOAdapter.constructSDOVocabularyURL('latest', 'all-layers')
await mySDOAdapter.addVocabularies([urlLatestSDO])

let Hotel = mySDOAdapter.getClass('schema:Hotel')
Hotel.getProperties() // 117 -> ["schema:audience", "schema:checkinTime", "schema:availableLanguage", ...]
Hotel.getSuperClasses(false) //only direct superclasses: 1 -> ["schema:LodgingBusiness"]
Hotel.getSuperClasses() //5 -> ["schema:LodgingBusiness", "schema:LocalBusiness", "schema:Place", "schema:Organization", "schema:Thing"]

let address = mySDOAdapter.getProperty("schema:address")
address.getRanges() // 2 -> ["schema:PostalAddress", "schema:Text"]
address.getDomains(false) // 5 -> ["schema:Place", "schema:GeoCoordinates", "schema:GeoShape", "schema:Person", "schema:Organization"]
address.getDomains() // 229 -> ["schema:Place", "schema:Accommodation", "schema:TouristAttraction", ...]
```

## Installation

#### NPM

Install the npm package:

`npm install schema-org-adapter`

Require the package:

```javascript
const SDOAdapter = require('schema-org-adapter')
```

#### Browser

Script-include the bundled package in **/dist** or load via cdn:

```html
<script src="TODO -> PUT REAL URL FROM CDN /schema-org-adapter.min.js"></script>
```




## API



