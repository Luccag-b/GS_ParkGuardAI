export default function FilterPanel({ f, setF }) {
  const chk = (k, l) => <label className="chk"><input type="checkbox" checked={f[k]} onChange={e => setF({ ...f, [k]: e.target.checked })} /> {l}</label>
  return (
    <aside className="card filters" aria-label="Filtros">
      <h3>Filtros</h3>
      <label>Distância máxima: {f.dist} m<input type="range" min="100" max="1000" step="50" value={f.dist} onChange={e => setF({ ...f, dist: +e.target.value })} /></label>
      <label>Preço máximo: R$ {f.price}/h<input type="range" min="5" max="20" value={f.price} onChange={e => setF({ ...f, price: +e.target.value })} /></label>
      <label>Avaliação mínima: {f.rating}<input type="range" min="0" max="5" step="0.5" value={f.rating} onChange={e => setF({ ...f, rating: +e.target.value })} /></label>
      {chk('acc', 'Vagas acessíveis')}{chk('covered', 'Cobertura')}{chk('sec', 'Segurança 24h')}{chk('ev', 'Carregador elétrico')}
    </aside>
  )
}
