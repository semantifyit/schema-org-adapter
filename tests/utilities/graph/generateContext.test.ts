import { generateContext } from "../../../src/utilities/graph/generateContext";
import CONTEXT_1 from "../../resources/data/context/test-context.json"
import CONTEXT_2 from "../../resources/data/context/test-context-2.json"

describe("generateContext()", () => {
  test("simple", async () => {
    const newContext = generateContext(CONTEXT_1, CONTEXT_1);
    expect(newContext).toEqual(CONTEXT_1);
    const newContext2 = generateContext(CONTEXT_1, CONTEXT_2);
    expect(newContext2).not.toEqual(CONTEXT_1);
  });
  test("advanced", async () => {
    const contextA = {
      schema: "https://schema.org/",
    };
    const contextB = {
      schema2: "https://schema.org/",
    };
    const contextC = {
      schema: "http://schema.org/",
    };
    const contextD = {
      schema2: "http://schema.org/",
    };
    expect(generateContext(contextA, contextA)).toEqual(contextA);
    expect(generateContext(contextA, contextB)).toEqual(contextA);
    expect(generateContext(contextB, contextA)).toEqual(contextB);
    expect(generateContext(contextA, contextC)).toEqual({
      schema: "https://schema.org/",
      schema1: "http://schema.org/",
    });
    expect(generateContext(contextA, contextD)).toEqual({
      schema: "https://schema.org/",
      schema2: "http://schema.org/",
    });
  });
})
