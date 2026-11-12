import { useState } from 'react'
import { Link } from 'react-router-dom'
import MapView from '../components/MapView.jsx'
import AlertCard from '../components/AlertCard.jsx'
import Modal from '../components/Modal.jsx'
import { parkings, alerts } from '../data/mock.js'
import { fmtDist } from '../utils/storage.js'
const stats = [['Vagas próximas', 24], ['Vagas acessíveis', 6], ['Alertas no trajeto', 3], ['Tempo até o destino', '18 min'], ['Acessibilidade da rota', '92%']]
export default function Overview() {
  const [story, setStory] = useState(false)
  const markers = [...parkings.map(p => ({ x: p.x, y: p.y, c: p.acc ? 'acc' : 'free', label: p.name })), ...alerts.map(a => ({ x: a.x, y: a.y, c: a.sev === 'grave' ? 'danger' : 'warn', label: a.type })), { x: 55, y: 30, c: 'point', label: 'Rampa acessível' }]
  return (
    <div className="page">
      <div className="row wrap"><div><h1>Bom dia, Lucca</h1><p className="muted">Sua cidade está mais segura e acessível hoje.</p></div>
        <div className="row"><Link className="btn" to="/rotas">Planejar deslocamento</Link><Link className="btn ghost" to="/roadguard">Reportar ocorrência</Link></div></div>
      <div className="grid stats">{stats.map(([k, v]) => <div className="card stat" key={k}><b>{v}</b><span className="muted">{k}</span></div>)}</div>
      <div className="grid two">
        <section className="card"><h2>Mapa ao vivo</h2><MapView markers={markers} height={340} /></section>
        <section className="card"><h2>Seu próximo deslocamento</h2><p>Café Girassol, Vila Madalena</p><p className="muted">Acessibilidade da rota: 92% · 18 min</p><Link className="btn" to="/rotas">Iniciar navegação</Link>
          <hr /><button className="btn ghost" onClick={() => setStory(true)}>Uma chegada para todos</button></section>
      </div>
      <div className="grid three">
        <section className="card"><h2>Melhores opções agora</h2>{parkings.slice(0, 3).map(p => <p key={p.id}><b>{p.name}</b><br /><span className="muted">{fmtDist(p.dist)} · R$ {p.price}/h · {p.common + p.acc} vagas · ★ {p.rating}</span></p>)}</section>
        <section className="card"><h2>Alertas próximos</h2>{alerts.slice(0, 3).map(a => <AlertCard key={a.id} a={a} />)}</section>
        <section className="card"><h2>Impacto da comunidade</h2>
          <div className="bars" role="img" aria-label="Alertas validados e barreiras evitadas por semana">{[[40, 12], [55, 18], [48, 20], [72, 31]].map(([a, b], i) => <div key={i}><i style={{ height: a + '%' }} /><i className="alt" style={{ height: b + '%' }} /></div>)}</div>
          <p className="muted">Alertas validados · Barreiras evitadas</p></section>
      </div>
      {story && <Modal title="Uma chegada para todos" onClose={() => setStory(false)}><p>Marina utiliza cadeira de rodas e deseja ir a um café. O PARKGUARD AI encontra uma vaga acessível, verifica rampas e condições das calçadas, identifica uma barreira no caminho e recalcula a rota até a entrada acessível do estabelecimento.</p></Modal>}
    </div>
  )
}
