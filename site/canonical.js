// v0.1.0 canonicalization
// - recursive lexicographic key sorting (objects only)
// - arrays preserve order
// - JSON.stringify(..., null, 2)
// - UTF-8 is applied during hashing (TextEncoder)
// - no trailing newline (JSON.stringify does not add one)

function _isPlainObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function _sortRec(value) {
  if (Array.isArray(value)) {
    return value.map(_sortRec); // preserve array order
  }
  if (_isPlainObject(value)) {
    const out = {};
    for (const k of Object.keys(value).sort()) {
      out[k] = _sortRec(value[k]);
    }
    return out;
  }
  return value; // primitives
}

function canonicalJson(manifest) {
  return JSON.stringify(_sortRec(manifest), null, 2);
}