(function (root) {
  function canStartCut(point, target) {
    return !!point && !!target &&
      Math.abs(point.x - target.x) <= target.halfWidth &&
      point.y >= target.top - 75 && point.y <= target.top + 35;
  }

  function isDownwardCut(points, target) {
    if (!Array.isArray(points) || points.length < 2 || !canStartCut(points[0], target)) return false;
    const first = points[0], last = points.at(-1);
    if (last.y < target.bottom + 8 || last.y - first.y < target.bottom - target.top + 15) return false;
    let priorY = first.y;
    for (const point of points) {
      if (Math.abs(point.x - target.x) > target.halfWidth || point.y < priorY - 28) return false;
      priorY = point.y;
    }
    return Math.abs(last.x - first.x) <= target.halfWidth * 1.25;
  }

  root.HonglouCutGesture = { canStartCut, isDownwardCut };
  if (typeof module !== 'undefined') module.exports = root.HonglouCutGesture;
})(typeof window === 'undefined' ? globalThis : window);
