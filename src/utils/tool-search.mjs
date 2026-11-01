/** @param {string} value */
export function normalizeSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\/_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} query
 * @param {...string} fields
 */
export function matchesSearch(query, ...fields) {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const text = normalizeSearch(fields.join(' '));
  return terms.every((term) => text.includes(term));
}
