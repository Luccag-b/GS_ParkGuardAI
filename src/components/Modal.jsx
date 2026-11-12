import { useEffect } from 'react'
// Modal acessível: fecha com Esc, foco inicial no diálogo.
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()}>
        <div className="row"><h2>{title}</h2><button className="icon" aria-label="Fechar" onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  )
}
