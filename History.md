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