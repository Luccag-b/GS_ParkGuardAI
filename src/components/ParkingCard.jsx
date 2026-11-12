import { useApp } from '../context/AppContext.jsx'
import { fmtDist } from '../utils/storage.js'
export default function ParkingCard({ p, onDetails, compare, onCompare }) {
  const { favorites, toggleFav } = useApp()
  const fav = favorites.includes(p.id)
  return (
    <article className="card park">
      <div className="photo" aria-hidden>🅿</div>
      <div className="grow">
        <div className="row"><h3>{p.name}</h3>
          <button className="icon" aria-pressed={fav} aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'} onClick={() => toggleFav(p.id)}>{fav ? '★' : '☆'}</button></div>
        <p className="muted">{fmtDist(p.dist)} · R$ {p.price}/h · {p.hours} · ★ {p.rating}</p>
        <p><span className="tag free">{p.common} comuns</span> <span className="tag acc">{p.acc} acessíveis</span> {p.feat.map(f => <span className="tag" key={f}>{f}</span>)}</p>
        <div className="row start"><button className="btn sm" onClick={() => onDetails(p)}>Ver detalhes</button>
          {onCompare && <label className="chk"><input type="checkbox" checked={!!compare} onChange={() => onCompare(p.id)} /> Comparar</label>}</div>
      </div>
    </article>
  )
}
