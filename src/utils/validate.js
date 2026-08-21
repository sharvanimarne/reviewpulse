/**
 * Validates a PR payload before it is accepted for metrics analysis.
 * Returns { valid: boolean, errors: string[] }.
 */
function validatePRPayload(payload = {}) {
  const errors = [];
  const { repo, prNumber, author } = payload;

  if (!repo) errors.push("repo is required");
  if (!prNumber) errors.push("prNumber is required");
  if (!author) errors.push("author is required");

  return { valid: errors.length === 0, errors };
}

module.exports = { validatePRPayload };
