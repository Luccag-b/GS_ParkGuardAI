import { useApp } from '../context/AppContext.jsx'
export default function NotificationPanel({ onClose }) {
  const { notes, setNotes } = useApp()
  return (
    <div className="popover" role="dialog" aria-label="Notificações">
      <div className="row"><b>Notificações</b><button className="link" onClick={() => setNotes(n => n.map(x => ({ ...x, read: true })))}>Marcar como lidas</button></div>
      {notes.length === 0 ? <p className="muted">Nenhuma notificação por aqui.</p> : notes.map(n => <p key={n.id} className={n.read ? 'muted' : ''}>{n.text}</p>)}
      <button className="link" onClick={onClose}>Fechar</button>
    </div>
  )
}
