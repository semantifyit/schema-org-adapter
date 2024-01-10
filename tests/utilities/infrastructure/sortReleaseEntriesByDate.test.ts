import { debugFunc } from "../../resources/utilities/testUtilities";
import { isString } from "../../../src/utilities/general/isString";
import { isArray } from "../../../src/utilities/general/isArray";
import { sortReleaseEntriesByDate } from "../../../src/utilities/infrastructure/sortReleaseEntriesByDate";
import VERSIONS_24 from "../../resources/data/versions/versions-24.0.json";

function checkReleaseEntriesStructure(
  releaseEntries: [string, string][],
  expectedLength: number
) {
  debugFunc(releaseEntries);
  expect(isArray(releaseEntries)).toBe(true);
  expect(releaseEntries).toHaveLength(expectedLength);
  for (const tuple of releaseEntries) {
    expect(isArray(tuple)).toBe(true);
    expect(isString(tuple[0])).toBe(true);
    expect(isString(tuple[1])).toBe(true);
  }
}

describe("sortReleaseEntriesByDate()", () => {
  test("original case", () => {
    const releaseEntries = sortReleaseEntriesByDate(VERSIONS_24.releaseLog);
    checkReleaseEntriesStructure(releaseEntries, 39);
    expect(releaseEntries[0][0]).toBe("24.0");
    expect(releaseEntries[0][1]).toBe("2023-12-15");
    expect(releaseEntries[releaseEntries.length - 1][0]).toBe("2.0");
    expect(releaseEntries[releaseEntries.length - 1][1]).toBe("2015-05-13");
  });
  test("fantasy case", () => {
    const releaseEntries = sortReleaseEntriesByDate({
      "1.1": "2005-05-13",
      "1.0": "2002-04-20",
      "13.37": "2042-04-20",
      ...VERSIONS_24.releaseLog,
    });
    checkReleaseEntriesStructure(releaseEntries, 42);
    expect(releaseEntries[0][0]).toBe("13.37");
    expect(releaseEntries[0][1]).toBe("2042-04-20");
    expect(releaseEntries[releaseEntries.length - 1][0]).toBe("1.0");
    expect(releaseEntries[releaseEntries.length - 1][1]).toBe("2002-04-20");
  });
});
