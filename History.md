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
  * Minor bug-fix regarding the reusability of **constructSDOVocabularyURL()**.

3.0.0 / 2020-08-20
==================

  * **constructSDOVocabularyURL()** -> Adapted our code to work with the new vocabulary file deployment style/naming. It is not possible to specify the used "parts" of schema.org anymore (e.g. auto, pending, etc.). The files "all-layers.jsonld" and "schemaorg-all-http.jsonld" are now taken as the standard. 
  * **constructSDOVocabularyURL()** -> In order to ensure the quality of this library we made a fork of schema.org, from which we fetch the data. We have an update script that checks for schema.org releases, executes tests, and if they succeed, the fork will automatically be updated (which consequently enables this library to use the latest release of schema.org). If you want to use the **original repository**, you can pass the commit/branch name to the schema-org-adapter on creation -> `let mySdoAdapter = new SDOAdapter("main")`
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