import { Link } from 'react-router-dom'
export default function ProfileMenu({ onClose }) {
  return (
    <div className="popover" role="menu">
      <Link role="menuitem" to="/perfil" onClick={onClose}>Meu perfil</Link>
      <Link role="menuitem" to="/configuracoes" onClick={onClose}>Configurações</Link>
      <Link role="menuitem" to="/ajuda" onClick={onClose}>Central de ajuda</Link>
    </div>
  )
}
