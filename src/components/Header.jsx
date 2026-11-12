import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import NotificationPanel from './NotificationPanel.jsx'
import ProfileMenu from './ProfileMenu.jsx'
export default function Header() {
  const { theme, setTheme, location, setLocation, notes, notify } = useApp()
  const [open, setOpen] = useState(null)
  const unread = notes.filter(n => !n.read).length
  const toggle = k => setOpen(o => (o === k ? null : k))
  return (
    <header className="topbar">
      <div className="searchbox"><span aria-hidden>⌕</span><input type="search" aria-label="Para onde você vai?" placeholder="Para onde você vai?" /><kbd>⌘K</kbd></div>
      <select aria-label="Localização" value={location} onChange={e => setLocation(e.target.value)}>
        {['Pinheiros, São Paulo', 'Vila Madalena, São Paulo', 'Moema, São Paulo'].map(l => <option key={l}>{l}</option>)}
      </select>
      <button className="icon" title="Comando por voz" aria-label="Comando por voz" onClick={() => notify('Ouvindo… diga seu destino (simulado).')}>🎙</button>
      <button className="icon" title="Notificações" aria-label={`Notificações, ${unread} novas`} onClick={() => toggle('n')}>🔔{unread > 0 && <i className="badge">{unread}</i>}</button>
      <button className="icon" title="Alternar tema" aria-label="Alternar tema claro ou escuro" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀' : '☾'}</button>
      <button className="icon avatar" aria-label="Menu do perfil" onClick={() => toggle('p')}>L</button>
      {open === 'n' && <NotificationPanel onClose={() => setOpen(null)} />}
      {open === 'p' && <ProfileMenu onClose={() => setOpen(null)} />}
    </header>
  )
}
