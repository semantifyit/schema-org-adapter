import { SOA } from "../../lib/";
import { SDOAdapter } from "../../lib/";
import { Class } from "../../lib/";
import { Property } from "../../lib/";
import { Term } from "../../lib/";
import { DataType } from "../../lib/";
import { EnumerationMember } from "../../lib/";
import { Enumeration } from "../../lib/";

main();

async function main() {
  const mySA: SDOAdapter = await SOA.create();
  const c: Class = mySA.getClass("schema:Hotel");
  const p: Property = mySA.getProperty("schema:name");
  const t: Term = mySA.getTerm("schema:name");
  const dt: DataType = mySA.getDataType("schema:Text");
  const e: Enumeration = mySA.getEnumeration("schema:DayOfWeek");
  const em: EnumerationMember = mySA.getEnumerationMember("schema:Monday");
}
