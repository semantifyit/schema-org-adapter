const { SOA } = require("../../lib/index"); // run the npm-script "buildTs" to generate js files for this example
const VOC_EXAMPLE = require("../../tests/resources/data/vocabularies/vocabulary-animal.json"); // load our external vocabulary

main();

/**
 * example usage of the SDOAdapter in node.js
 */
async function main() {
  console.log(await SOA.fetchSchemaVersions())
  // create an instance of the SDOAdapter with the latest schema.org vocabulary and the example vocabulary
  const mySA = await SOA.create({schemaVersion: "latest", vocabularies:[VOC_EXAMPLE], equateVocabularyProtocols: true});
  let AnimalClass = mySA.getClass("ex:Animal"); // get a JS-Class for the Class-Term https://example-vocab.ex/Animal , note that the compacted version of the IRI is also a valid parameter for the function
  console.log(JSON.stringify(AnimalClass.toJSON(), null, 2)); // AnimalClass.toJSON() prints a JSON version of the Class, note that here we pass 'true' as parameter for the reasoning (the result will contain attributes resolved though reasoning, e.g. properties of superclasses)
  /*
  {
    "id": "ex:Animal",
    "IRI": "https://example-vocab.ex/Animal",
    "type": "rdfs:Class",
    "vocabulary": "https://example-vocab.ex",
    "source": null,
    "supersededBy": null,
    "name": "Animal",
    "description": "Animals are multicellular eukaryotic organisms that form the biological kingdom Animalia. With few exceptions, animals consume organic material, breathe oxygen, are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development.",
    "superClasses": [
        "schema:Thing"
    ],
    "subClasses": [
        "ex:Tiger"
    ],
    "properties": [
        "ex:numberOfLegs",
        "ex:animalLivingEnvironment",
        "schema:sameAs",
        "schema:url",
        "schema:image",
        "schema:additionalType",
        "schema:name",
        "schema:identifier",
        "schema:subjectOf",
        "schema:mainEntityOfPage",
        "schema:potentialAction",
        "schema:description",
        "schema:disambiguatingDescription",
        "schema:alternateName"
    ]
  }
  */
  let TigerClass = mySA.getClass("ex:Tiger");
  console.log(JSON.stringify(TigerClass.toJSON(), null, 2));
  /*
   {
      "id": "ex:Tiger",
      "IRI": "https://example-vocab.ex/Tiger",
      "type": "rdfs:Class",
      "vocabulary": "https://example-vocab.ex",
      "source": null,
      "supersededBy": null,
      "name": "Tiger",
      "description": "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera. It is most recognisable for its dark vertical stripes on orangish-brown fur with a lighter underside.",
      "superClasses": [
          "ex:Animal",
          "schema:Thing"
      ],
      "subClasses": [],
      "properties": [
          "ex:numberOfLegs",
          "ex:animalLivingEnvironment",
          "schema:sameAs",
          "schema:url",
          "schema:image",
          "schema:additionalType",
          "schema:name",
          "schema:identifier",
          "schema:subjectOf",
          "schema:mainEntityOfPage",
          "schema:potentialAction",
          "schema:description",
          "schema:disambiguatingDescription",
          "schema:alternateName"
      ]
    }
  */
  console.log(TigerClass.getName()); // print the name. When no language tag is given as parameter, then "en" for english is taken as default
  /* Tiger */
  console.log(TigerClass.getName("es")); // print the spanish name
  /* Tigre */
  console.log(TigerClass.getName("zh")); // print the chinese (zh) name
  /* 虎 */

  let AnimalLivingEnvironmentEnumeration = mySA.getEnumeration(
    "ex:AnimalLivingEnvironment"
  ); // get JS-Class for the Enumeration-Term "https://example-vocab.ex/AnimalLivingEnvironment"
  console.log(
    JSON.stringify(
      AnimalLivingEnvironmentEnumeration.getEnumerationMembers(),
      null,
      2
    )
  ); // print all EnumerationMembers of the Enumeration
  /*
  [
    "ex:AnimalLivingEnvironmentFreedom",
    "ex:AnimalLivingEnvironmentZoo",
    "ex:AnimalLivingEnvironmentDomestic"
  ]
  */
}
