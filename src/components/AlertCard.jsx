import { useApp } from '../context/AppContext.jsx'
export default function AlertCard({ a, actions }) {
  const { notify } = useApp()
  const sevColor = { grave: 'danger', média: 'warn', leve: 'free' }[a.sev]
  return (
    <article className="card alert">
      <div className="row"><b>{a.type}</b><span className={'tag ' + sevColor}>{a.sev}</span></div>
      <p className="muted">{a.addr} · {a.time} · {a.conf} confirmações</p>
      <p><span className="tag">{a.status}</span> <span className="tag acc">Validada por IA + comunidade</span></p>
      {actions && <div className="row start">{['Confirmar', 'Não encontrei', 'Já foi resolvido'].map(l => <button key={l} className="btn ghost sm" onClick={() => notify(`Obrigado! "${l}" registrado.`)}>{l}</button>)}</div>}
    </article>
  )
}
