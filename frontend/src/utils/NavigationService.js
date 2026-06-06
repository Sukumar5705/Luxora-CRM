
let _navigate = null;

/**
 * Called once from App.jsx after the Router mounts.
 * @param {Function} navigateFn — the function returned by useNavigate()
 */
export function setNavigateFunction(navigateFn) {
  _navigate = navigateFn;
}

/**
 * Navigate programmatically from outside React components.
 * Falls back to window.location only if navigate was never registered
 * (e.g. before the router mounted — extremely unlikely in practice).
 * @param {string} path
 */
export function navigateTo(path) {
  if (_navigate) {
    _navigate(path);
  } else {
    window.location.href = path;
  }
}