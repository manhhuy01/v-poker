import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  DEFAULT_UI_VERSION,
  normalizeUiVersion,
  readUiVersion,
  uiVersionStorageKey,
  writeUiVersion,
} from '../utils/uiVersion'

const UiVersionContext = createContext(null)

export function UiVersionProvider({ userName, children }) {
  const [version, setVersionState] = useState(DEFAULT_UI_VERSION)
  const [ready, setReady] = useState(false)

  const applyDocumentVersion = useCallback((nextVersion) => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.uiVersion = nextVersion
  }, [])

  useEffect(() => {
    const storedVersion = readUiVersion(userName)
    applyDocumentVersion(storedVersion)
    setVersionState(storedVersion)
    setReady(true)

    const onStorage = (event) => {
      if (event.key !== uiVersionStorageKey(userName)) return
      const nextVersion = normalizeUiVersion(event.newValue)
      applyDocumentVersion(nextVersion)
      setVersionState(nextVersion)
    }

    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
      if (typeof document !== 'undefined') delete document.documentElement.dataset.uiVersion
    }
  }, [userName, applyDocumentVersion])

  const setVersion = useCallback((nextVersion) => {
    const savedVersion = writeUiVersion(userName, nextVersion)
    // Apply before the state update so the new skin never flashes the old one.
    applyDocumentVersion(savedVersion)
    setVersionState(savedVersion)
  }, [userName, applyDocumentVersion])

  const value = useMemo(() => ({ version, setVersion, ready }), [version, setVersion, ready])

  return (
    <UiVersionContext.Provider value={value}>
      {children}
    </UiVersionContext.Provider>
  )
}

export function useUiVersion() {
  const context = useContext(UiVersionContext)

  if (!context) {
    return { version: DEFAULT_UI_VERSION, setVersion: () => {}, ready: false }
  }

  return context
}
