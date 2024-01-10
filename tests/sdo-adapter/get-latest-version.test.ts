import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { commit, debugFuncErr } from "../resources/utilities/testUtilities";
import { getLatestSchemaVersion } from "../../src/classes/Infrastructure";

describe("SDO Adapter - getLatestVersion", () => {
  test("get latest sdo version", async () => {
    const mySA = new SDOAdapter({
      commit,
      onError: debugFuncErr
    });
    const latestVersionSDO = await mySA.getLatestSchemaVersion();
    const latestVersionInfra = await getLatestSchemaVersion(commit);
    expect(latestVersionSDO).toBe(latestVersionInfra);
  });
});
