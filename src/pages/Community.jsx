import { useApp } from '../context/AppContext.jsx'
import { ranking, campaigns } from '../data/mock.js'
export default function Community() {
  const { notify } = useApp()
  return (
    <div className="page"><h1>Comunidade</h1><p className="muted">Cada contribuição torna a cidade mais acessível.</p>
      <div className="grid two"><section className="card"><h2>Colaboradores</h2>{ranking.map((r, i) => <p key={r.name}>{i + 1}. <b>{r.name}</b> · {r.pts} pts<br /><span className="tag acc">{r.badge}</span></p>)}</section>
        <section className="card"><h2>Campanhas</h2>{campaigns.map(c => <p key={c} className="row"><span>{c}</span><button className="btn sm" onClick={() => notify('Você entrou na campanha!')}>Participar</button></p>)}</section></div>
      <section className="card"><h2>Sugerir melhoria</h2><form className="form" onSubmit={e => { e.preventDefault(); notify('Sugestão enviada. Obrigado!'); e.target.reset() }}>
        <label>Para quem?<select><option>Estabelecimento</option><option>Prefeitura</option></select></label><label>Sugestão<textarea required rows="3" /></label><button className="btn">Enviar sugestão</button></form></section>
    </div>
  )
}
