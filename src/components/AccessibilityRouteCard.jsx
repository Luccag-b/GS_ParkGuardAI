export default function AccessibilityRouteCard({ r, selected, onSelect }) {
  const rows = [['Calçadas', r.sidewalk], ['Rampas', r.ramps], ['Travessias seguras', r.crossings], ['Pontos de descanso', r.rests], ['Iluminação', r.light], ['Obstáculos', r.obstacles], ['Vaga acessível', r.parking]]
  return (
    <article className={'card route' + (selected ? ' sel' : '')}>
      <div className="row"><h3>{r.title}</h3><b className="score">{r.score}%</b></div>
      <p className="muted">{r.dist} · {r.time}</p>
      <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <button className="btn sm" aria-pressed={selected} onClick={() => onSelect(r.id)}>{selected ? 'Rota selecionada' : 'Escolher rota'}</button>
    </article>
  )
}
