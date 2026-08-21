/**
 * Computes review turnaround time (in hours) for a set of pull requests.
 * Each PR object must have openedAt and mergedAt as ISO timestamps or epoch ms.
 * PRs without a mergedAt (still open) are excluded from the average.
 */
function averageTurnaroundHours(prs) {
  const closed = prs.filter(pr => pr.mergedAt);
  if (closed.length === 0) return 0;

  const totalHours = closed.reduce((sum, pr) => {
    const opened = new Date(pr.openedAt).getTime();
    const merged = new Date(pr.mergedAt).getTime();
    return sum + (merged - opened) / (1000 * 60 * 60);
  }, 0);

  return Number((totalHours / closed.length).toFixed(2));
}

function reviewerLoad(prs) {
  const load = {};
  prs.forEach(pr => {
    if (!pr.reviewer) return;
    load[pr.reviewer] = (load[pr.reviewer] || 0) + 1;
  });
  return load;
}

module.exports = { averageTurnaroundHours, reviewerLoad };
