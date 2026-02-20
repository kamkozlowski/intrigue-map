const STORAGE_INDEX_KEY = 'intrigue-maps-index';
const STORAGE_MAP_PREFIX = 'intrigue-map-';
const STORAGE_LAST_MAP_KEY = 'intrigue-map-last';

function getIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setIndex(index) {
  localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
}

export function getMapsList() {
  return getIndex();
}

export function getMap(id) {
  if (!id) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_MAP_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMap({ id, name, nodes, edges }) {
  const now = Date.now();
  const map = { id, name, nodes, edges, updatedAt: now };

  const index = getIndex();
  const existing = index.find((m) => m.id === id);
  if (existing) {
    existing.name = name;
    existing.updatedAt = now;
  } else {
    index.push({ id, name, updatedAt: now });
  }
  setIndex(index);
  localStorage.setItem(`${STORAGE_MAP_PREFIX}${id}`, JSON.stringify(map));
  return map;
}

export function deleteMap(id) {
  const index = getIndex().filter((m) => m.id !== id);
  setIndex(index);
  localStorage.removeItem(`${STORAGE_MAP_PREFIX}${id}`);
  const last = localStorage.getItem(STORAGE_LAST_MAP_KEY);
  if (last === id) {
    localStorage.removeItem(STORAGE_LAST_MAP_KEY);
  }
}

export function setLastOpenedMapId(id) {
  if (id) {
    localStorage.setItem(STORAGE_LAST_MAP_KEY, id);
  } else {
    localStorage.removeItem(STORAGE_LAST_MAP_KEY);
  }
}

export function getLastOpenedMapId() {
  return localStorage.getItem(STORAGE_LAST_MAP_KEY);
}

export function createMapId() {
  return `map-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
