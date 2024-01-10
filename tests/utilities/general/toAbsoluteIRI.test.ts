import { toAbsoluteIRI } from "../../../src/utilities/general/toAbsoluteIRI";
import CONTEXT_1 from "../../resources/data/context/test-context.json"

describe("toAbsoluteIRI()", () => {
  test("toAbsoluteIRI", async () => {
    const input = "schema:Hotel";
    const expectedOutcome = "http://schema.org/Hotel";
    expect(toAbsoluteIRI(input, CONTEXT_1)).toBe(expectedOutcome);
    expect(() => toAbsoluteIRI("schemaaaa:Hotel", CONTEXT_1)).toThrow();
  });
})
