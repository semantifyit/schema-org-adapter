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
  const mySA: SDOAdapter = await SOA.create({
    schemaVersion: "20.0",
    commit: "SEMANTIFY"
  });
  const c: Class = mySA.getClass("schema:Hotel");
  console.log(c.getNames())
  const p: Property = mySA.getProperty("schema:name");
  console.log(p.getNames())
  const t: Term = mySA.getTerm("schema:name");
  console.log(t.getNames())
  const dt: DataType = mySA.getDataType("schema:Text");
  console.log(dt.getNames())
  const e: Enumeration = mySA.getEnumeration("schema:DayOfWeek");
  console.log(e.getNames())
  const em: EnumerationMember = mySA.getEnumerationMember("schema:Monday");
  console.log(em.getNames())
}
