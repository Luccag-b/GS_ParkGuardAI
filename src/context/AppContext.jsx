import { createContext, useContext, useEffect, useState } from 'react'
import { useLocal } from '../utils/storage.js'
import { notifications as seed } from '../data/mock.js'
const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
// Estado global: tema, localização, alertas/notificações, favoritos e acessibilidade.
export function AppProvider({ children }) {
  const [theme, setTheme] = useLocal('pg-theme', 'dark')
  const [favorites, setFavorites] = useLocal('pg-fav', [])
  const [prefs, setPrefs] = useLocal('pg-prefs', { fontSize: 16, contrast: false, plate: '', voice: 'Feminina', lang: 'pt-BR', avoidStairs: true, avoidNoSidewalk: true })
  const [location, setLocation] = useState('Pinheiros, São Paulo')
  const [notes, setNotes] = useState(seed.map((t, i) => ({ id: i, text: t, read: false })))
  const [toast, setToast] = useState(null)
  useEffect(() => {
    const d = document.documentElement
    d.dataset.theme = theme; d.dataset.contrast = prefs.contrast ? 'high' : ''
    d.style.fontSize = prefs.fontSize + 'px'
  }, [theme, prefs])
  const notify = text => { setToast(text); setTimeout(() => setToast(null), 3000) }
  const toggleFav = id => setFavorites(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id]))
  return <Ctx.Provider value={{ theme, setTheme, favorites, toggleFav, prefs, setPrefs, location, setLocation, notes, setNotes, toast, notify }}>{children}</Ctx.Provider>
}
