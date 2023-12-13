/** @ignore
 * Returns the given absolute IRI, but with the opposite protocol (http vs. https)
 *
 * @param  {string}IRI - the IRI that should be transformed
 * @returns {string} - the resulting transformed IRI
 */
export function switchIRIProtocol(IRI: string): string {
  if (IRI.startsWith("https://")) {
    return "http" + IRI.substring(5);
  } else if (IRI.startsWith("http://")) {
    return "https" + IRI.substring(4);
  }
  return IRI;
}
