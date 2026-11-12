import { NavLink } from 'react-router-dom'
const items = [['/', 'Visão geral', '⌂'], ['/parkvision', 'ParkVision', ], ['/roadguard', 'RoadGuard'], ['/rotas', 'Rotas acessíveis'], ['/mapa', 'Mapa ao vivo'], ['/comunidade', 'Comunidade'], ['/reservas', 'Minhas reservas' ], ['/historico', 'Histórico', '↺'], ['/ajuda', 'Central de ajuda', '?'], ['/configuracoes', 'Configurações', '⚙']]
const pinned = [['Café Girassol', '#5AA9FF'], ['Trabalho · Faria Lima', '#8B7CFF']]
// Painel flutuante no desktop; vira menu inferior no celular (CSS).
export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Navegação principal">
      <div className="logo"><span className="logo-mark">P</span><b>ParkGuard AI</b></div>
      <ul>{items.map(([to, label, ic]) => (
        <li key={to}><NavLink to={to} end={to === '/'} title={label}><span aria-hidden>{ic}</span><em>{label}</em></NavLink></li>))}</ul>
      <div className="pinned"><small>FIXADOS</small>{pinned.map(([n, c]) => <p key={n}><i style={{ background: c }} />{n}</p>)}</div>
      <NavLink to="/perfil" className="user"><span className="avatar">L</span><em>Lucca Bicudo<small>Motorista</small></em><span>⌄</span></NavLink>
    </nav>
  )
}
