import { useState } from 'react'
import AccessibilityRouteCard from '../components/AccessibilityRouteCard.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { routes, steps, profiles } from '../data/mock.js'
export default function AccessibleRoutes() {
  const { prefs, setPrefs, notify } = useApp()
  const [profile, setProfile] = useState(profiles[0])
  const [route, setRoute] = useState('acc')
  const [sos, setSos] = useState(false)
  const speak = t => { if ('speechSynthesis' in window) speechSynthesis.speak(new SpeechSynthesisUtterance(t)) }
  return (
    <div className="page"><h1>Rotas acessíveis</h1>
      <div className="card form row wrap"><label>Origem<input defaultValue="Rua dos Pinheiros, 500" /></label><label>Destino<input defaultValue="Café Girassol, Vila Madalena" /></label>
        <label>Necessidade<select value={profile} onChange={e => setProfile(e.target.value)}>{profiles.map(p => <option key={p}>{p}</option>)}</select></label></div>
      <div className="row start wrap">
        <label className="chk"><input type="checkbox" checked={prefs.avoidStairs} onChange={e => setPrefs({ ...prefs, avoidStairs: e.target.checked })} /> Evitar escadas</label>
        <label className="chk"><input type="checkbox" checked={prefs.avoidNoSidewalk} onChange={e => setPrefs({ ...prefs, avoidNoSidewalk: e.target.checked })} /> Evitar ruas sem calçada</label>
        <label className="chk"><input type="checkbox" checked={prefs.contrast} onChange={e => setPrefs({ ...prefs, contrast: e.target.checked })} /> Alto contraste</label>
        <button className="btn ghost sm" onClick={() => setPrefs({ ...prefs, fontSize: Math.min(22, prefs.fontSize + 2) })}>A+</button>
        <button className="btn ghost sm" onClick={() => setPrefs({ ...prefs, fontSize: Math.max(14, prefs.fontSize - 2) })}>A−</button></div>
      <div className="grid three">{routes.map(r => <AccessibilityRouteCard key={r.id} r={r} selected={route === r.id} onSelect={setRoute} />)}</div>
      <section className="card"><h2>Navegação passo a passo</h2><ol>{steps.map(s => <li key={s}>{s}</li>)}</ol>
        <div className="row start wrap"><button className="btn" onClick={() => speak(steps.join(' '))}>Navegação por voz</button>
          <button className="btn ghost" onClick={() => notify('Link da rota segura copiado.')}>Compartilhar rota segura</button>
          <button className="btn danger" onClick={() => setSos(true)}>SOS</button></div></section>
      {sos && <Modal title="Confirmar SOS" onClose={() => setSos(false)}><p>Simulação: nenhum contato real será acionado.</p><button className="btn danger" onClick={() => { setSos(false); notify('SOS simulado enviado.') }}>Confirmar SOS</button></Modal>}
    </div>
  )
}
