import { useEffect, useMemo, useState } from 'react'
import FilterPanel from '../components/FilterPanel.jsx'
import ParkingCard from '../components/ParkingCard.jsx'
import MapView from '../components/MapView.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { parkings } from '../data/mock.js'
export default function ParkVision() {
  const { notify } = useApp()
  const [loading, setLoading] = useState(true)
  const [f, setF] = useState({ dist: 1000, price: 20, rating: 0, acc: false, covered: false, sec: false, ev: false })
  const [sel, setSel] = useState(null)
  const [cmp, setCmp] = useState([])
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])
  const list = useMemo(() => parkings.filter(p => p.dist <= f.dist && p.price <= f.price && p.rating >= f.rating && (!f.acc || p.acc > 0) && (!f.covered || p.covered) && (!f.sec || p.sec) && (!f.ev || p.ev)), [f])
  const toggleCmp = id => setCmp(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id].slice(-3)))
  return (
    <div className="page"><h1>ParkVision</h1><p className="muted">Encontre a melhor vaga perto do seu destino.</p>
      <input className="search wide" type="search" aria-label="Destino" placeholder="Destino" />
      <div className="grid side"><FilterPanel f={f} setF={setF} />
        <div>
          <MapView height={220} markers={list.map(p => ({ x: p.x, y: p.y, c: p.acc ? 'acc' : 'free', label: p.name }))} />
          <button className="btn ghost" onClick={() => notify('Avisaremos quando houver vaga acessível nesta região.')}>Avise-me quando houver vaga acessível nesta região</button>
          {loading ? <p role="status">Carregando estacionamentos…</p> : list.length === 0 ? <div className="card"><h3>Nenhum estacionamento encontrado</h3><p className="muted">Relaxe os filtros para ver mais opções.</p></div> : list.map(p => <ParkingCard key={p.id} p={p} onDetails={setSel} compare={cmp.includes(p.id)} onCompare={toggleCmp} />)}
          {cmp.length > 1 && <table className="card cmp"><thead><tr><th>Estacionamento</th><th>Preço</th><th>Distância</th><th>Segurança</th><th>Acessíveis</th></tr></thead>
            <tbody>{parkings.filter(p => cmp.includes(p.id)).map(p => <tr key={p.id}><td>{p.name}</td><td>R$ {p.price}</td><td>{p.dist} m</td><td>{p.sec ? 'Sim' : 'Não'}</td><td>{p.acc}</td></tr>)}</tbody></table>}
        </div></div>
      {sel && <Modal title={sel.name} onClose={() => setSel(null)}>
        <p className="muted">Horário: {sel.hours} · Nota {sel.rating} · R$ {sel.price}/h</p>
        <p>Rota até a entrada: calçada regular com rampa à direita. {sel.acc ? `${sel.acc} vagas acessíveis próximas à entrada.` : 'Sem vagas acessíveis neste local.'}</p>
        <div className="row start"><button className="btn" disabled title="Em breve">Reservar vaga (em breve)</button><button className="btn ghost" onClick={() => { notify('Navegação iniciada.'); setSel(null) }}>Iniciar navegação</button></div></Modal>}
    </div>
  )
}
