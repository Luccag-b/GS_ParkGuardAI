import { useParams } from 'react-router-dom'
import MapView from '../components/MapView.jsx'
const names = { mapa: 'Mapa ao vivo', reservas: 'Minhas reservas', historico: 'Histórico', ajuda: 'Central de ajuda', configuracoes: 'Configurações' }
export default function Placeholder() {
  const { page } = useParams()
  return (
    <div className="page"><h1>{names[page] || 'Página não encontrada'}</h1>
      {page === 'mapa' ? <MapView height={480} markers={[{ x: 40, y: 40, c: 'free', label: 'Vaga livre' }, { x: 60, y: 55, c: 'warn', label: 'Atenção' }]} />
        : <div className="card"><h3>Nada por aqui ainda</h3><p className="muted">Esta área chega nas próximas versões.</p></div>}
    </div>
  )
}
