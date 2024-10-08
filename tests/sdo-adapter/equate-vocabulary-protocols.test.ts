import { SDOAdapter } from "../../src/classes/SDOAdapter";
import { commit, debugFuncErr } from "../resources/utilities/testUtilities";
import VOC_OBJ_ZOO from "../resources/data/vocabularies/vocabulary-animal.json";
import VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT from "../resources/data/vocabularies/vocabulary-animal-2.json";
import { SEMANTIFY_COMMIT } from "../../src/data/semantify";

describe("SDO Adapter - equateVocabularyProtocols", () => {
  test("schemaHttps 1", async () => {
    const mySA = new SDOAdapter({
      commit,
      schemaHttps: true,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("12.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(mySA.getClass("https://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("https://schema.org/Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(() => {
      mySA.getClass("http://schema.org/Hotel");
    }).toThrow();
  });

  test("schemaHttps 2", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("9.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI("Absolute")).toBe("http://schema.org/Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Absolute")).toBe("http://schema.org/Hotel");
    expect(() => {
      mySA.getClass("https://schema.org/Hotel");
    }).toThrow();
  });

  test("schemaHttps with incompatible version", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      schemaHttps: true,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("5.0"); // should get the http version (no https version available)
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI("Absolute")).toBe("http://schema.org/Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Absolute")).toBe("http://schema.org/Hotel");
    expect(() => {
      mySA.getClass("https://schema.org/Hotel");
    }).toThrow();
  });

  test("https not equated", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: false,
      schemaHttps: true,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(mySA.getClass("https://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("https://schema.org/Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(() => {
      mySA.getClass("http://schema.org/Hotel");
    }).toThrow();
    expect(() => {
      mySA.getTerm("http://schema.org/Hotel");
    }).toThrow();
    expect(() => {
      mySA.getProperty("http://schema.org/address");
    }).toThrow();
    expect(() => {
      mySA.getEnumeration("http://schema.org/DayOfWeek");
    }).toThrow();
    expect(() => {
      mySA.getEnumerationMember("http://schema.org/Monday");
    }).toThrow();
    expect(() => {
      mySA.getDataType("http://schema.org/Number");
    }).toThrow();
  });

  test("https equated", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: true,
      schemaHttps: true,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the https version
    await mySA.addVocabularies([versionUrl]);
    expect(mySA.getClass("schema:Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(mySA.getClass("https://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Compact")).toBe("schema:Hotel");
    expect(mySA.getClass("http://schema.org/Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(mySA.getTerm("http://schema.org/Hotel").getIRI("Absolute")).toBe("https://schema.org/Hotel");
    expect(mySA.getProperty("http://schema.org/address").getIRI("Absolute")).toBe("https://schema.org/address");
    expect(mySA.getEnumeration("http://schema.org/DayOfWeek").getIRI("Absolute")).toBe("https://schema.org/DayOfWeek");
    expect(mySA.getEnumerationMember("http://schema.org/Monday").getIRI("Absolute")).toBe("https://schema.org/Monday");
    expect(mySA.getDataType("http://schema.org/Number").getIRI("Absolute")).toBe("https://schema.org/Number");
  });

  test("http equated multiple vocabs", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI("Absolute")).toBe("http://schema.org/Thing");
  });

  test("http not equated multiple vocabs", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(false);
    expect(mySA.getClass("schema:Thing").getIRI("Absolute")).toBe("http://schema.org/Thing");
  });

  test("http equated multiple vocabs 2", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI("Absolute")).toBe("http://schema.org/Thing");
  });

  test("http not equated multiple vocabs 2", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([versionUrl, VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(false);
  });

  test("http equated multiple vocabs 3", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: true,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT, versionUrl]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(true);
    expect(mySA.getClass("schema:Thing").getIRI("Absolute")).toBe("https://schema.org/Thing");
  });

  test("http not equated multiple vocabs 3", async () => {
    // this test makes only sense for the GitHub-hosted vocabularies
    if(commit === SEMANTIFY_COMMIT){
      return;
    }
    const mySA = new SDOAdapter({
      commit,
      equateVocabularyProtocols: false,
      schemaHttps: false,
      onError: debugFuncErr
    });
    const versionUrl = await mySA.constructURLSchemaVocabulary("10.0"); // should get the http version
    await mySA.addVocabularies([VOC_OBJ_ZOO_NO_SCHEMA_IN_CONTEXT, versionUrl]);
    expect(mySA.getClass("ex:Animal").getIRI("Absolute")).toBe("https://example-vocab.ex/Animal");
    expect(mySA.getClass("ex:Animal").getSuperClasses({ implicit: false }).includes("schema:Thing")).toBe(true); // entry is in superclasses because the first vocabulary says so
    expect(() => {
      mySA.getClass("schema:Thing");
    }).toThrow(); // there is no schema:Thing because the sdo vocabulary does not use the same protocol as specified in the first vocabulary
  });
});
