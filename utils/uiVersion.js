export const UI_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
}

export const UI_VERSION_VALUES = Object.values(UI_VERSIONS)

export const DEFAULT_UI_VERSION = UI_VERSIONS.V1

export const UI_VERSION_STORAGE_PREFIX = 'v-poker:ui-version'

// Retired skins (e.g. the old V3 "Ngọt ngào" table) are no longer valid values,
// so a saved version that no longer exists falls back to the default instead of
// leaving the user on a table that has no stylesheet.
export function normalizeUiVersion(value) {
  return UI_VERSION_VALUES.includes(value) ? value : DEFAULT_UI_VERSION
}

export function uiVersionStorageKey(userName) {
  return `${UI_VERSION_STORAGE_PREFIX}:${userName || 'guest'}`
}

export function readUiVersion(userName) {
  if (typeof window === 'undefined') return DEFAULT_UI_VERSION

  try {
    return normalizeUiVersion(window.localStorage.getItem(uiVersionStorageKey(userName)))
  } catch (err) {
    return DEFAULT_UI_VERSION
  }
}

export function writeUiVersion(userName, version) {
  const nextVersion = normalizeUiVersion(version)
  if (typeof window === 'undefined') return nextVersion

  try {
    window.localStorage.setItem(uiVersionStorageKey(userName), nextVersion)
  } catch (err) {
    // localStorage can be unavailable (e.g. private mode); the in-memory value still applies.
  }

  return nextVersion
}
