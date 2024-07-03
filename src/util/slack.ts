/**
 * Converts slack comma delimited OAuth scopes to an array of strings.
 *
 * Ex:
 *
 * Input: "users:read,users:read.email"
 * Output: ["users:read", "users:read.email"]
 */
export function parseSlackScopes(scopes: string): Set<string> {
  return new Set(scopes.replace(/ /g, '').split(','));
}
