// the functions for a data type Object
import { Term } from "./Term";
import { ToJsonDataType, VocabularyNode } from "../types/types";
import { Graph } from "./Graph";
import { NS, TermTypeIRI, TermTypeLabel } from "../data/namespaces";
import { inferSuperDataTypes } from "../utilities/reasoning/inferSuperDataTypes";
import { inferRangeOf } from "../utilities/reasoning/inferRangeOf";
import { inferSubDataTypes } from "../utilities/reasoning/inferSubDataTypes";
import { ParamObjIRIListInference } from "../types/ParamObjIRIListInference.type";
import { filterAndTransformIRIList } from "../utilities/general/filterAndTransformIRIList";

/**
 * A **DataType** represents a data-type term. These are a special kind of classes that [represents literal values in schema.org](https://schema.org/DataType). A DataType is identified by its IRI (e.g. [schema:Number](https://schema.org/Number)), where, by convention, the class name itself starts with an uppercase letter. A DataType instance is created with {@link SDOAdapter.getDataType | SDOAdapter.getDataType()} and offers the methods described below.
 * ```JS
 * // following DataType instance is used in the code examples below
 * const textDt = mySdoAdapter.getDataType("schema:Text");
 * // it is also possible to create a DataType instance with an absolute IRI or a label
 * const textDt2 = mySdoAdapter.getDataType("https://schema.org/Text");
 * const textDt3 = mySdoAdapter.getDataType("Text");
 * ```
 */
export class DataType extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.dataType;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.dataType;

  /** @ignore
   * A DataType represents a schema:DataType. It is identified by its compact IRI
   *
   * @param IRI - The compact IRI of this DataType, e.g. "schema:Number"
   * @param  graph - The underlying data graph to enable the methods of this DataType
   */
  constructor(IRI: string, graph: Graph) {
    super(IRI, graph);
  }

  /** @ignore
   * Retrieves the term object of this DataType
   *
   * @returns The term object of this DataType
   */
  getTermObj(): VocabularyNode {
    return this.graph.dataTypes[this.IRI];
  }

  /**
   * Retrieves the super-DataTypes of this DataType
   *
   * @example
   * ```JS
   * const floatDt = mySdoAdapter.getDataType("schema:Float");
   * floatDt.getSuperDataTypes();
   * // returns all super-DataTypes of the DataType "schema:Float"
   * [
   *    "schema:Number"
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit super-DataTypes inherited recursively from super-DataTypes
   * @returns The super-DataTypes of this DataType
   */
  getSuperDataTypes(paramObj?: ParamObjIRIListInference): string[] {
    const dataTypeObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSuperDataTypes(this.IRI, this.graph));
    } else {
      result.push(...dataTypeObj[NS.rdfs.subClassOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Retrieves the sub-DataTypes of this DataType
   *
   * @example
   * ```JS
   * const numberDt = mySdoAdapter.getDataType("schema:Number");
   * numberDt.getSubDataTypes();
   * // returns all sub-DataTypes of the DataType "schema:Number"
   * [
   *    'schema:Integer',
   *    'schema:Float'
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit sub-DataTypes inherited recursively from sub-DataTypes
   * @returns The sub-DataTypes of this DataType
   */
  getSubDataTypes(paramObj?: ParamObjIRIListInference): string[] {
    const dataTypeObj = this.getTermObj();
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferSubDataTypes(this.IRI, this.graph));
    } else {
      result.push(...dataTypeObj[NS.soa.superClassOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Retrieves the properties that have this DataType as a range
   *
   * @example
   * ```JS
   * textDt.isRangeOf();
   * // returns all properties for which the datatype "schema:Text" is a valid range
   * [
   *    "schema:cookingMethod",
   *    "schema:broadcastFrequency",
   *    "schema:mechanismOfAction",
   *    ...
   * ]
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit properties (where a super-datatype of this class is a range)
   * @returns The properties that have this DataType as a range
   */
  isRangeOf(paramObj?: ParamObjIRIListInference): string[] {
    const result = [];
    // only skip if implicit is set to false
    if (!(paramObj?.implicit === false)) {
      result.push(...inferRangeOf(this.IRI, this.graph));
    } else {
      result.push(...this.getTermObj()[NS.soa.isRangeOf]);
    }
    return filterAndTransformIRIList(result, this.graph, paramObj);
  }

  /**
   * Generates a JSON representation of this DataType (as JavaScript Object)
   *
   * @example
   * ```JS
   * textDt.toJSON();
   * // returns a JSON representing the data-type "schema:Text"
   * {
   *   id: 'schema:Text',
   *   IRI: 'https://schema.org/Text',
   *   typeLabel: 'DataType',
   *   typeIRI: 'schema:DataType',
   *   vocabURLs: [
   *     'https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/12.0/schemaorg-all-https.jsonld'
   *   ],
   *   vocabulary: 'https://schema.org',
   *   source: null,
   *   supersededBy: null,
   *   name: 'Text',
   *   description: 'Data type: Text.',
   *   superDataTypes: [],
   *   subDataTypes: [
   *     'schema:PronounceableText',
   *     'schema:URL',
   *     'schema:CssSelectorType',
   *     'schema:XPathType'
   *   ],
   *     rangeOf: [
   *     'schema:cookingMethod',
   *     'schema:broadcastFrequency',
   *     'schema:mechanismOfAction',
   *     ...
   *   ]
   * }
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. sub-DataTypes, super-DataTypes, etc.)
   * @returns The JSON representation of this DataType as JavaScript Object
   */
  toJSON(paramObj?: ParamObjIRIListInference): ToJsonDataType {
    const result = super.toJSON() as ToJsonDataType;
    result.superDataTypes = this.getSuperDataTypes(paramObj);
    result.subDataTypes = this.getSubDataTypes(paramObj);
    result.rangeOf = this.isRangeOf(paramObj);
    return result;
  }

  /**
   * Generates a JSON representation of this DataType (as string)
   *
   * Check {@link toJSON | .toJSON()} for an example output
   *
   * @example
   * ```JS
   * textDt.toString();
   * ```
   *
   * @param paramObj - an optional parameter object that filters and formats the result, and defines the inference behaviour: The "implicit"-parameter defaults to true and returns also implicit data (e.g. sub-DataTypes, super-DataTypes, etc.)
   * @returns The JSON representation of this DataType as string
   */
  toString(paramObj?: ParamObjIRIListInference): string {
    return JSON.stringify(this.toJSON(paramObj), null, 2);
  }

  /**
   * Returns true, if this DataType is a valid super-datatype of the given sub-datatype. The implicit parameter (default: true) allows to cover recursive relationships (e.g. sub-datatypes of sub-datatypes are also taken into account)
   * @example
   * ```JS
   * text.isValidSuperDataTypeOf("schema:URL"); // true
   * number.isValidSuperDataTypeOf("schema:Float", true); // true
   * number.isValidSuperDataTypeOf("schema:Float", false); // true
   * ```
   *
   * @param subDataTypeId - The identification string of the sub-datatype in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, consider also recursive sub-datatypes
   * @returns if this DataType is a valid super-datatype of the given sub-datatype
   */
  isValidSuperDataTypeOf(subDataTypeId: string, implicit = true) {
    const dt = this.graph.getDataType(subDataTypeId);
    return this.getSubDataTypes({ implicit, outputFormat: "Compact" }).includes(dt.getIRI("Compact"));
  }

  /**
   * Returns true, if this DataType is a valid sub-datatype of the given super-datatype. The implicit parameter (default: true) allows to cover recursive relationships (e.g. super-datatypes of super-datatypes are also taken into account)
   * @example
   * ```JS
   * url.isValidSubDataTypeOf("schema:Text"); // true
   * float.isValidSubDataTypeOf("schema:Number", true); // true
   * float.isValidSubDataTypeOf("schema:Number", false); // true
   * ```
   *
   * @param superDataTypeId - The identification string of the super-datatype in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, consider also recursive super-datatypes
   * @returns if this DataType is a valid sub-datatype of the given super-datatype
   */
  isValidSubDataTypeOf(superDataTypeId: string, implicit = true) {
    const dt = this.graph.getDataType(superDataTypeId);
    return this.getSuperDataTypes({ implicit, outputFormat: "Compact" }).includes(dt.getIRI("Compact"));
  }

  /**
   * Returns true, if this DataType is a valid range of the given Property. The implicit parameter (default: true) allows to cover recursive relationships (e.g. domain properties of super-datatypes are also taken into account)
   * @example
   * ```JS
   * text.isValidRangeOf("schema:name"); // true
   * url.isValidRangeOf("schema:name", true); // true
   * url.isValidRangeOf("schema:name", false); // false, is range of a super-datatype
   * ```
   *
   * @param propertyId - The identification string of the Property in question, can be an IRI (absolute or compact) or a label
   * @param implicit - If true, consider also implicit domain properties (where a super-datatype of this class is a range)
   * @returns if this DataType is a valid range of the given Property
   */
  isValidRangeOf(propertyId: string, implicit = true) {
    const p = this.graph.getProperty(propertyId);
    return this.isRangeOf({ implicit, outputFormat: "Compact" }).includes(p.getIRI("Compact"));
  }
}
