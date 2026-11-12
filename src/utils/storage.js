import { useState, useEffect } from 'react'
// Hook que persiste estado no LocalStorage (tema, favoritos, preferências).
export function useLocal(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }, [key, v])
  return [v, setV]
}
export const fmtDist = m => (m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m')
