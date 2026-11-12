import { useState } from 'react'
const COLORS = { free: '#17C3A2', acc: '#5AA9FF', warn: '#F6C453', danger: '#EF5B5B', point: '#8B7CFF' }
// Mapa simulado: marcadores posicionados em %. Trocar por provedor real (Leaflet/Mapbox) depois.
export default function MapView({ markers = [], height = 320 }) {
  const [sel, setSel] = useState(null)
  return (
    <div className="map" style={{ height }} role="img" aria-label="Mapa interativo de São Paulo (simulado)">
      <span className="you" style={{ left: '48%', top: '52%' }} title="Você está aqui" />
      <span className="dest" style={{ left: '70%', top: '25%' }} title="Destino">⚑</span>
      {markers.map((m, i) => (
        <button key={i} className="pin" style={{ left: m.x + '%', top: m.y + '%', background: COLORS[m.c] }} aria-label={m.label} title={m.label} onClick={() => setSel(m)} />
      ))}
      {sel && <div className="map-tip">{sel.label}</div>}
      <div className="legend">{Object.entries({ free: 'Vaga livre', acc: 'Acessível', warn: 'Atenção', danger: 'Risco grave', point: 'Ponto de acessibilidade' }).map(([k, v]) => <span key={k}><i style={{ background: COLORS[k] }} />{v}</span>)}</div>
    </div>
  )
}
