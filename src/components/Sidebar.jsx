import { NavLink } from 'react-router-dom'
const items = [['/', 'Visão geral', '◉'], ['/parkvision', 'ParkVision', 'P'], ['/roadguard', 'RoadGuard', '⚠'], ['/rotas', 'Rotas acessíveis', '♿'], ['/mapa', 'Mapa ao vivo', '⌖'], ['/comunidade', 'Comunidade', '☺'], ['/reservas', 'Minhas reservas', '▣'], ['/historico', 'Histórico', '↺'], ['/ajuda', 'Central de ajuda', '?'], ['/configuracoes', 'Configurações', '⚙']]
// Sidebar fixa no desktop; vira menu inferior no celular (CSS).
export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Navegação principal">
      <div className="logo"><span className="logo-mark">P</span><b>PARKGUARD AI</b></div>
      <ul>{items.map(([to, label, ic]) => (
        <li key={to}><NavLink to={to} end={to === '/'} title={label}><span aria-hidden>{ic}</span><em>{label}</em></NavLink></li>))}</ul>
      <NavLink to="/perfil" className="user"><span className="avatar">L</span><em>Lucca<small>Ver perfil</small></em></NavLink>
    </nav>
  )
}
