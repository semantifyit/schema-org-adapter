import { toCompactIRI } from "../../../src/utilities/general/toCompactIRI";
import CONTEXT_1 from "../../resources/data/context/test-context.json";

describe("toCompactIRI()", () => {
  test("toCompactIRI", async () => {
    expect(toCompactIRI("http://schema.org/Book", CONTEXT_1)).toBe(
      "schema:Book"
    );
    expect(toCompactIRI("http://schema.org/Book", CONTEXT_1, false)).toBe(
      "schema:Book"
    );
    expect(toCompactIRI("https://schema.org/Book", CONTEXT_1, true)).toBe(
      "schema:Book"
    );
    expect(() =>
      toCompactIRI("https://schema.org/Book", CONTEXT_1, false)
    ).toThrow();
  });
});
