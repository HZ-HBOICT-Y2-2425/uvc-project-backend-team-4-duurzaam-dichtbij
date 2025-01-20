const cache = new Map();

/**
 * Zet een waarde in de cache met een verloopduur.
 * @param {string} key - De sleutel.
 * @param {any} value - De waarde.
 * @param {number} ttl - Time to live in milliseconden.
 */
export function setCache(key, value, ttl) {
  const expireAt = Date.now() + ttl;
  cache.set(key, { value, expireAt });

  // Verwijder verlopen items automatisch
  setTimeout(() => {
    if (cache.get(key)?.expireAt <= Date.now()) {
      cache.delete(key);
    }
  }, ttl);
}

/**
 * Haal een waarde uit de cache.
 * @param {string} key - De sleutel.
 * @returns {any|null} - De waarde of null als het niet bestaat/verlopen is.
 */
export function getCache(key) {
  const data = cache.get(key);
  if (!data) return null;

  // Verwijder als de data verlopen is
  if (data.expireAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return data.value;
}
