import { getFileNameForSchemaOrgVersion } from "../../../src/utilities/infrastructure/getFileNameForSchemaOrgVersion";

describe("getFileNameForSchemaOrgVersion()", () => {
  // Checks if the function getFileNameForSchemaOrgVersion() retrieves filenames (only jsonld) for the corresponding schema.org versions as expected
  test("getFileNameForSchemaOrgVersion", async () => {
    // 2.0 - 3.0 have no jsonld -> error
    // 3.1 - 8.0 have all-layers.jsonld
    // 9.0 + have schemaorg-all-http.jsonld
    const expectedFileMapping = {
      "10.0": "schemaorg-all-https.jsonld",
      "9.0": "schemaorg-all-https.jsonld",
      "8.0": "all-layers.jsonld",
      7.04: "all-layers.jsonld",
      7.03: "all-layers.jsonld",
      7.02: "all-layers.jsonld",
      7.01: "all-layers.jsonld",
      "7.0": "all-layers.jsonld",
      "6.0": "all-layers.jsonld",
      "5.0": "all-layers.jsonld",
      "4.0": "all-layers.jsonld",
      3.9: "all-layers.jsonld",
      3.8: "all-layers.jsonld",
      3.7: "all-layers.jsonld",
      3.6: "all-layers.jsonld",
      3.5: "all-layers.jsonld",
      3.4: "all-layers.jsonld",
      3.3: "all-layers.jsonld",
      3.2: "all-layers.jsonld",
      3.1: "all-layers.jsonld",
      "3.0": null,
      2.2: null,
      2.1: null,
      "2.0": null,
    };
    for (const currVersion of Object.entries(expectedFileMapping)) {
      if (currVersion[1] === null) {
        // expect to fail (You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.)
        // eslint-disable-next-line jest/no-conditional-expect
        expect(() => {
          getFileNameForSchemaOrgVersion(currVersion[0]);
        }).toThrow();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(getFileNameForSchemaOrgVersion(currVersion[0])).toBe(
          currVersion[1]
        );
      }
    }
  });
});
