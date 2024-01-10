import axios from "axios";

/** @ignore
 * Sends a head-request to the given URL, checking if content exists.
 *
 * @param url - the URL to check
 * @returns Returns true if there is content
 */
export async function checkIfUrlExists(url: string) {
  try {
    await axios.head(url);
    return true;
  } catch (e) {
    return false;
  }
}
