/** @ignore
 * schema.org extension identifiers as array
 */
export const SchemaModuleLabel = ["core", "health-lifesci", "pending", "bib", "meta", "auto", "attic"] as const;

/**
 * Schema module identifiers which reflect the extension modules of schema.org. More information about the schema modules can be found in <a href="https://schema.org/docs/schemas.html" target="_blank">Organization of Schemas - Hosted Sections</a>. `core` is added as an identifier for schema.org terms that belong to no particular extension:
 * > `"core"` -> core terms of the schema.org vocabulary - belong to no particular extension<br>
 * `"pending"` -> <a href="https://schema.org/docs/pending.home.html" target="_blank">The pending section</a> for work-in-progress terms<br>
 * `"health-lifesci"` -> <a href="https://schema.org/docs/health-lifesci.home.html" target="_blank">The Health and Lifesciences Section</a><br>
 * `"bib"` -> <a href="https://schema.org/docs/bib.home.html" target="_blank">The Bibliographic Section</a><br>
 * `"auto"` -> <a href="https://schema.org/docs/auto.home.html" target="_blank">The Auto Section</a><br>
 * `"meta"` -> <a href="https://schema.org/docs/meta.home.html" target="_blank">The meta section</a> designed to support the implementation of the Schema.org vocabulary itself. They are NOT advocated for widespread use across the web.<br>
 * `"attic"` -> <a href="https://schema.org/docs/attic.home.html" target="_blank">The attic section</a> includes terms which are no longer part of the core vocabulary or its extensions. It is encouraged to NOT use these terms.<br>
 */
export type SchemaModule = typeof SchemaModuleLabel[number];

/** @ignore
 * part of the namespaces for each schema module (protocol is omitted to allow http and https)
 */
export const SchemaModuleNamespaceMap: Record<SchemaModule, string> = {
  core: "//schema.org",
  "health-lifesci": "//health-lifesci.schema.org",
  pending: "//pending.schema.org",
  bib: "//bib.schema.org",
  meta: "//meta.schema.org",
  auto: "//auto.schema.org",
  attic: "//attic.schema.org"
};

export function isSchemaModule(value: string): value is SchemaModule {
  return Object.keys(SchemaModuleNamespaceMap).includes(value);
}

// returns the matching schema module identifier for the given schema module namespace (if any)
export function getSchemaModuleMatch(termVocabulary: string): SchemaModule | null {
  if(!termVocabulary){
    return null; // should NOT happen, that a term has no vocabulary namespace assigned to it. We add this check for safety nevertheless
  }
  for (const k of Object.keys(SchemaModuleNamespaceMap) as SchemaModule[]) {
    if (termVocabulary.includes(SchemaModuleNamespaceMap[k])) {
      return k;
    }
  }
  return null;
}
