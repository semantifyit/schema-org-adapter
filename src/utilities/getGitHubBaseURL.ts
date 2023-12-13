
/** @ignore
 * Returns the base URL for the corresponding GitHub repository, based on the given commit (commit -> original schema.org; else semantify fork)
 */
export function getGitHubBaseURL(commit?: string) {
  if (commit) {
    return "https://raw.githubusercontent.com/schemaorg/schemaorg/" + commit;
  } else {
    return "https://raw.githubusercontent.com/semantifyit/schemaorg/main";
  }
}
