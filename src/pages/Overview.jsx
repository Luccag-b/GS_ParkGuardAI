import { useState } from 'react'
import { Link } from 'react-router-dom'
import MapView from '../components/MapView.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { parkings, alerts } from '../data/mock.js'
import { fmtDist } from '../utils/storage.js'
const stats = [['Vagas próximas', '24'], ['Acessíveis', '6'], ['Alertas no trajeto', '3'], ['Tempo até o destino', '18 min'], ['Acessibilidade', '92%']]
// Anéis concêntricos em SVG (percentuais 0–100).
function Rings({ v }) {
  const cols = ['#17C3A2', '#5AA9FF', '#8B7CFF']
  return (
    <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Anéis de acessibilidade">
      {v.map((p, i) => { const r = 62 - i * 17, c = 2 * Math.PI * r
        return <g key={i} fill="none" strokeWidth="12" transform="rotate(-90 70 70)"><circle cx="70" cy="70" r={r} stroke={cols[i]} opacity=".18" />
          <circle cx="70" cy="70" r={r} stroke={cols[i]} strokeLinecap="round" strokeDasharray={`${c * p / 100} ${c}`} /></g> })}
    </svg>
  )
}
export default function Overview() {
  const { notify } = useApp()
  const [story, setStory] = useState(false)
  const [mode, setMode] = useState('Acessível')
  const best = parkings[0]
  const markers = [...parkings.map(p => ({ x: p.x, y: p.y, c: p.acc ? 'acc' : 'free', label: p.name })), ...alerts.map(a => ({ x: a.x, y: a.y, c: a.sev === 'grave' ? 'danger' : 'warn', label: a.type })), { x: 55, y: 30, c: 'point', label: 'Rampa acessível' }]
  const days = [['Seg', 30], ['Ter', 62], ['Qua', 45], ['Qui', 0], ['Sex', 0], ['Sáb', 0], ['Dom', 0]]
  return (
    <div className="page">
      <h1 className="hero">Bom dia, Lucca</h1>
      <p className="muted">Quarta-feira, 11 de novembro · Sua cidade está mais segura e acessível hoje.</p>
      <div className="row wrap top">
        <div className="chips2">{stats.map(([k, v]) => <div className="chipstat" key={k}><small>{k}</small><b>{v}</b></div>)}</div>
        <div className="row"><Link className="btn ghost" to="/roadguard">＋ Reportar ocorrência</Link><Link className="btn" to="/rotas">Planejar deslocamento</Link></div>
      </div>
      <div className="grid g3">
        <section className="card"><h2>Hoje</h2><p className="muted">Feche seus anéis de acessibilidade</p>
          <div className="rings"><Rings v={[75, 92, 60]} />
            <div className="legend2">{[['Vagas acessíveis', '6', '/ 8', '#17C3A2'], ['Rota acessível', '92%', '', '#5AA9FF'], ['Alertas evitados', '3', '/ 5', '#8B7CFF']].map(([k, v, t, c]) => <div key={k} style={{ borderColor: c }}><small>{k}</small><b>{v}<span>{t}</span></b></div>)}</div></div></section>
        <section className="card"><div className="row"><div><h2>Melhores opções</h2></div><Link className="link" to="/parkvision">ParkVision</Link></div>
          <div className="hl"><small>a {fmtDist(best.dist)} · agora</small><h3>{best.name}</h3><p className="muted">R$ {best.price}/h · {best.common} comuns · {best.acc} acessíveis · ★ {best.rating}</p>
            <div className="row"><button className="btn ghost sm" onClick={() => setStory(true)}>Uma chegada para todos</button><button className="btn sm" onClick={() => notify('Navegação iniciada.')}>Navegar</button></div></div>
          {parkings.slice(1, 4).map((p, i) => <div className="li" key={p.id}><i style={{ background: ['#F6C453', '#5AA9FF', '#8B7CFF'][i] }} /><span>{p.name}</span><small>{fmtDist(p.dist)}</small></div>)}</section>
        <section className="card"><div className="row"><div><h2>Navegação</h2><p className="muted">Rota ao vivo</p></div>
          <div className="seg">{['Acessível', 'Rápida', 'Segura'].map(m => <button key={m} className={m === mode ? 'on' : ''} aria-pressed={m === mode} onClick={() => setMode(m)}>{m}</button>)}</div></div>
          <div className="row start nav"><div className="eta"><b>18:00</b><small>min · pronto</small></div>
            <div className="grow"><small className="muted">Destino</small><select><option>Café Girassol, Vila Madalena</option><option>Trabalho · Faria Lima</option></select>
              <button className="btn wide" onClick={() => notify('Navegação iniciada.')}>▶ Iniciar navegação</button></div></div>
          <div className="foot"><div className="row"><small className="muted">Acessibilidade da rota</small><b>92% · 3 alertas</b></div><div className="bar"><i style={{ width: '92%' }} /></div></div></section>
      </div>
      <div className="grid g2">
        <section className="card"><div className="row"><div><h2>Alertas próximos</h2><p className="muted">No seu trajeto</p></div><Link className="link" to="/roadguard">Ver todos</Link></div>
          {alerts.slice(0, 4).map(a => <div className="task" key={a.id}><span className="circ" /><div className="grow"><b>{a.type}</b><br /><span className="pill">{a.addr}</span> <small className="muted">{a.time}</small></div><span className={'sev ' + a.sev}>{a.sev}</span></div>)}</section>
        <section className="card"><h2>Impacto da comunidade</h2><p className="muted">Alertas validados esta semana</p>
          <p><span className="big">15</span> validados · <b className="up">+25% vs semana passada</b></p>
          <div className="cols" role="img" aria-label="Alertas validados por dia">{days.map(([d, h]) => <div key={d}><i style={{ height: h + '%' }} /><small>{d}</small></div>)}</div></section>
      </div>
      <section className="card"><h2>Mapa ao vivo</h2><MapView markers={markers} height={340} /></section>
      {story && <Modal title="Uma chegada para todos" onClose={() => setStory(false)}><p>Marina utiliza cadeira de rodas e deseja ir a um café. O PARKGUARD AI encontra uma vaga acessível, verifica rampas e condições das calçadas, identifica uma barreira no caminho e recalcula a rota até a entrada acessível do estabelecimento.</p></Modal>}
    </div>
  )
}
