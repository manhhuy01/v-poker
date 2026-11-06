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

  useEffect(() => {
    setVersionState(readUiVersion(userName))
    setReady(true)

    const onStorage = (event) => {
      if (event.key !== uiVersionStorageKey(userName)) return
      setVersionState(normalizeUiVersion(event.newValue))
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [userName])

  const setVersion = useCallback((nextVersion) => {
    setVersionState(writeUiVersion(userName, nextVersion))
  }, [userName])

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
