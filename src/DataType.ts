// the functions for a data type Object
import { Term } from "./Term";
import { FilterObject, ToJsonDataType, VocabularyNode } from "./types";
import { Graph } from "./Graph";
import {
  applyFilter,
  inferRangeOf,
  inferSubDataTypes,
  inferSuperDataTypes,
} from "./reasoning";
import { NS, TermTypeIRI, TermTypeLabel } from "./data/namespaces";

/**
 * A **DataType** represents a data-type term. These are a special kind of classes that [represents literal values in schema.org](https://schema.org/DataType). A DataType is identified by its IRI (e.g. [schema:Number](https://schema.org/Number)), where, by convention, the class name itself starts with an uppercase letter. A DataType instance is created with {@link SDOAdapter.getDataType | SDOAdapter.getDataType()} and offers the methods described below.
 * ```JS
 * // following DataType instance is used in the code examples below
 * const textDt = mySdoAdapter.getDataType("schema:Text");
 * ```
 */
export class DataType extends Term {
  /** @ignore */
  readonly termTypeLabel = TermTypeLabel.dataType;
  /** @ignore */
  readonly termTypeIRI = TermTypeIRI.dataType;

  /** @ignore
   * A DataType represents a schema:DataType. It is identified by its IRI
   *
   * @param IRI - The compacted IRI of this DataType, e.g. "schema:Number"
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
   * @param implicit - If true, retrieve also implicit super-DataTypes (recursive from super-DataTypes)
   * @param filter - The filter to be applied on the result
   * @returns The super-DataTypes of this DataType
   */
  getSuperDataTypes(implicit = true, filter?: FilterObject): string[] {
    const dataTypeObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...inferSuperDataTypes(this.IRI, this.graph));
    } else {
      result.push(...dataTypeObj[NS.rdfs.subClassOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
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
   * @param implicit - If true, retrieve also implicit sub-DataTypes (recursive from sub-DataTypes)
   * @param filter - The filter to be applied on the result
   * @returns The sub-DataTypes of this DataType
   */
  getSubDataTypes(implicit = true, filter?: FilterObject): string[] {
    const dataTypeObj = this.getTermObj();
    const result = [];
    if (implicit) {
      result.push(...inferSubDataTypes(this.IRI, this.graph));
    } else {
      result.push(...dataTypeObj[NS.soa.superClassOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
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
   * @param implicit - If true, retrieve also implicit properties (where a super-datatype of this class is a range)
   * @param filter - The filter to be applied on the result
   * @returns The properties that have this DataType as a range
   */
  isRangeOf(implicit = true, filter?: FilterObject): string[] {
    const result = [];
    if (implicit) {
      result.push(...inferRangeOf(this.IRI, this.graph));
    } else {
      result.push(...this.getTermObj()[NS.soa.isRangeOf]);
    }
    return applyFilter({ data: result, filter, graph: this.graph });
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
   * @param implicit - If true, includes also implicit data (e.g. sub-DataTypes, super-DataTypes, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this DataType as JavaScript Object
   */
  toJSON(implicit = true, filter?: FilterObject): ToJsonDataType {
    const result = super.toJSON() as ToJsonDataType;
    result.superDataTypes = this.getSuperDataTypes(implicit, filter);
    result.subDataTypes = this.getSubDataTypes(implicit, filter);
    result.rangeOf = this.isRangeOf(implicit, filter);
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
   * @param implicit - If true, includes also implicit data (e.g. sub-DataTypes, super-DataTypes, etc.)
   * @param filter - The filter to be applied on the result
   * @returns The JSON representation of this DataType as string
   */
  toString(implicit = true, filter?: FilterObject): string {
    return JSON.stringify(this.toJSON(implicit, filter), null, 2);
  }
}
