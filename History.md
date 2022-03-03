5.1.1 / 2022-03-22
==================
* Types for Classes provided by this library are now also exported.

5.1.0 / 2022-03-22
==================
* Node/TypeScript: All types and interfaces that may be interesting for the user are being reexported in index.d.ts now.
* Update of dependencies.

5.0.4 / 2021-12-21
==================
* `schema-org-adapter` now supports node from version 10.
* Fixed expected import signature for node to a named import: `import { SOA } from 'schema-org-adapter';`

5.0.2 / 2021-12-20
==================
* Added file-endings for `main` and `types` in `package.json` to enable correct import in non-TS environments.

5.0.1 / 2021-12-20
==================
* Vocabulary addition algorithm improved (for the rare use-case that an enumeration or data-type is used in multiple vocabularies added).

5.0.0 / 2021-12-17
==================
* Refactored entire code to TypeScript.
* The way how to create an SDO-Adapter instance has been improved.
* The global name for the library has changed from `SDOAdapter` to `SOA`, in order to clarify the difference between the library itself and the SDOAdapter instances.
* Every `implicit` parameter is `true` by default.
* Replaced the function `getTermType()` with 2 new functions, namely `getTermTypeIRI()` and `getTermTypeLabel()`. `getTermTypeIRI()` returns the compacted term type IRI (e.g. `"rdf:Property"` ) that was previously provided by `getTermType()`. `getTermTypeLabel()` on the other hand returns a human-readable label for the term type (e.g. `"Property"`). The corresponding `toJson()` and `toString()` functions reflect these changes.
* Changes to several functions, parameters and how certain methods work.
* Introduction of a library-wide cache and exposure of different static methods for handy utilities.
* To reflect all these changes the documentation has been updated, please have a look at it and adapt your code if you want to upgrade to this version of SDO-Adapter: https://semantifyit.github.io/schema-org-adapter/


4.3.0 / 2021-10-05
==================

* Removed use of Babel for bundling. Older browser (versions) like IE won't be supported anymore. There should be no changes for modern browsers.

4.2.0 / 2021-09-15
==================

* Added support for TypeScript (.d.ts files).
* Major Update of dependencies.
* License changed to Apache 2.0.
* Minor vocabulary fetching improvements.

4.1.0 / 2021-05-28
==================

* A new option is added to the SDOAdapter() constructor: `equateVocabularyProtocols` has a boolean value (default: `false`) which specifies if the protocols (http/https) used in a vocabulary namespace should be understood as if they were equal. e.g. `http://schema.org/Hotel` is understood as equal to `https://schema.org/Hotel`. If this option is true, the default protocol version is set by the **first occurrence of a namespace** in the given vocabularies.
* Changed the behavior for the standard `@context` depending on `schemaHttps`: In version **4.0.0** this option fixed the namespace version used for `schema`. This won't be the case anymore, instead the used protocol is set by the **first occurrence of the schema.org namespace** in the given vocabularies. This means that even if `schemaHttps` is set to `true`, if the given schema.org vocabulary uses the `http` protocol (e.g. because the wanted vocabulary version does not support `https`), then `schema` will still use the `http` namespace version in the standard `@context`.

4.0.0 / 2021-04-16
==================

* Major Update of dependencies.
* Breaking API change for the SDOAdapter() constructor: now a parameter object can be passed, with the old option `commit`, and the new option `onError` that provides a callback in the case an error happens that hasn't been handled properly yet. Additionally, there is the new option `schemaHttps` with a boolean value (default: `true`) that specifies if the https version of the schema.org vocabulary should be used, if available for the given vocabulary version (version 9.0 upwards).

3.5.0 / 2021-03-17
==================

* Update of dependencies.

3.4.0 / 2021-01-14
==================

* Update of dependencies.
* Adapted test suite to the latest schema.org vocabulary and website changes

3.3.0 / 2020-11-10
==================

  * Added "vocabURLs" to the term's data-model. This should make it possible to recognize from which URL a specific term-node originates.

3.2.0 / 2020-10-21
==================

  * Added http-header for the fetchVocabularyByURL() function -> accept: jsonld or json (json was default before).

3.1.2 / 2020-10-16
==================

  * Added "null" as default value for schema:inverseOf for properties.

3.1.1 / 2020-10-15
==================

  * Restructuring of code. API stays the same.
  * Update of dependency "jsonld".

3.1.0 / 2020-09-24
==================

  * Added **.isRangeOf()** to Classes and DataTypes (retrieve properties for which this enumeration is a range).
  * Added implicit and filter parameters to **.isRangeOf()**.
  * Fixed a bug regarding the reasoning for ranges of properties that are data-types.
  * Added functions **.getAllTerms()** and **.getListOfTerms()** to the SDOAdapter.js.
  
3.0.5 / 2020-09-22
==================

  * Added **.isRangeOf()** to Enumerations (retrieve properties for which this enumeration is a range).

3.0.4 / 2020-09-11
==================

  * Dependencies update.
  * Minor bug-fix regarding the reusability of **constructURLSchemaVocabulary()**.

3.0.0 / 2020-08-20
==================

  * **constructURLSchemaVocabulary()** -> Adapted our code to work with the new vocabulary file deployment style/naming. It is not possible to specify the used "parts" of schema.org anymore (e.g. auto, pending, etc.). The files "all-layers.jsonld" and "schemaorg-all-http.jsonld" are now taken as the standard. 
  * **constructURLSchemaVocabulary()** -> In order to ensure the quality of this library we made a fork of schema.org, from which we fetch the data. We have an update script that checks for schema.org releases, executes tests, and if they succeed, the fork will automatically be updated (which consequently enables this library to use the latest release of schema.org). If you want to use the **original repository**, you can pass the commit/branch name to the schema-org-adapter on creation -> `let mySdoAdapter = new SDOAdapter("main")`
  * Added **getTerm()** for the SDOAdapter JS-Class. This function will automatically detect the term-type for the given URI.  
  * Dependencies update.
  * Changed code-style from Standard to ESLint.
  
2.0.0 / 2020-07-24
==================

  * Schema.org has changed their repository structure renaming their "master"-branch to "main". This change broke up the implications of this tool regarding the programmatic construction of schema.org vocabulary URLs, so we updated them.

1.6.0 / 2020-07-20
==================

  * Dependencies update.
  
1.5.1 / 2020-07-06
==================

  * Added sorting for versions retrieved from schema.org's versions.json, so that the newest versions are tried first as backfall-versions if the latest doesnt exist yet.

1.5.0 / 2020-05-04
==================

  * Added memory for schema.org versions file. Improved handling of fetch errors regarding this versions and the latest version. Got rid of hardcoded fallback version, instead a valid latest version is dynamically determined.

1.4.0 / 2020-04-29
==================

  * Added fallback version for "latest" schema.org version, in case the versions file lists a file that doesnt exist yet.

1.2.0 / 2020-02-12
==================

  * Adapted function `getEnumerationMembers()` to the Enumeration API (now has 'implicit' as parameter).
  * Adapted function `getDomainEnumerations()` to the EnumerationMember API (now has 'implicit' as parameter).
  * Adapted function `toJSON()` to the EnumerationMember API (now has 'implicit' as parameter).

1.1.0 / 2020-02-04
==================

  * Added function `getInverseOf()` to the Property API.