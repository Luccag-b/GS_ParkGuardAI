import { useState } from 'react'
import AlertCard from '../components/AlertCard.jsx'
import MapView from '../components/MapView.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { alerts } from '../data/mock.js'
const types = ['Todos', 'Buraco', 'Alagamento', 'Acidente', 'Obras', 'Calçada bloqueada']
export default function RoadGuard() {
  const { notify } = useApp()
  const [t, setT] = useState('Todos')
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const list = alerts.filter(a => t === 'Todos' || a.type === t)
  const submit = e => { e.preventDefault(); setSent(true); notify('Ocorrência enviada para validação.') }
  return (
    <div className="page"><div className="row wrap"><div><h1>RoadGuard</h1><p className="muted">Condições urbanas em tempo real.</p></div><button className="btn" onClick={() => { setSent(false); setOpen(true) }}>Reportar ocorrência</button></div>
      <div className="chips">{types.map(x => <button key={x} className={'chip' + (x === t ? ' on' : '')} aria-pressed={x === t} onClick={() => setT(x)}>{x}</button>)}</div>
      <div className="grid two"><section className="card"><h2>Mapa de calor</h2><MapView height={300} markers={list.map(a => ({ x: a.x, y: a.y, c: a.sev === 'grave' ? 'danger' : 'warn', label: a.type + ' — ' + a.addr }))} /></section>
        <section className="card"><h2>Risco da rota</h2><p>Alagamento na Av. Faria Lima pode atrasar sua rota em 6 min.</p><p className="muted">Alternativa mais segura: seguir pela Rua das Acácias.</p></section></div>
      <h2>Alertas recentes</h2>{list.length === 0 ? <p className="muted">Nenhum alerta deste tipo agora.</p> : list.map(a => <AlertCard key={a.id} a={a} actions />)}
      {open && <Modal title="Reportar ocorrência" onClose={() => setOpen(false)}>{sent ? <p role="status">Obrigado! Sua ocorrência está em validação.</p> :
        <form onSubmit={submit} className="form"><label>Categoria<select>{types.slice(1).map(x => <option key={x}>{x}</option>)}</select></label>
          <label>Descrição<textarea required rows="3" /></label><label>Foto<input type="file" accept="image/*" /></label>
          <label>Severidade<select><option>leve</option><option>média</option><option>grave</option></select></label>
          <label className="chk"><input type="checkbox" /> Impacta pessoas com mobilidade reduzida</label>
          <button className="btn">Enviar ocorrência</button></form>}</Modal>}
    </div>
  )
}
