/**
 * Defines the format in which the IRI results from functions should be returned.
 * This option can be set for the SDO-Adapter on initialization, which becomes the standard (default = "Compact").
 * After the initialization it is also possible to pass this option to some API-functions to get IRIs in a different format. The options are as follows:
 * * "Compact": The resulting IRIs are given in compact form, e.g. "schema:Hotel"
 * * "Absolute": The resulting IRIs are given in absolute form, e.g. "https://schema.org/Hotel"
 */
export type OutputIRIType = "Compact" | "Absolute";
