import { useApp } from '../context/AppContext.jsx'
export default function Profile() {
  const { prefs, setPrefs, notify } = useApp()
  const set = (k, v) => setPrefs({ ...prefs, [k]: v })
  return (
    <div className="page"><h1>Perfil e preferências</h1>
      <form className="card form" onSubmit={e => { e.preventDefault(); notify('Preferências salvas.') }}>
        <label>Placa do veículo (opcional)<input value={prefs.plate} onChange={e => set('plate', e.target.value)} /></label>
        <label>Idioma<select value={prefs.lang} onChange={e => set('lang', e.target.value)}><option>pt-BR</option><option>en-US</option><option>es-ES</option></select></label>
        <label>Voz da navegação<select value={prefs.voice} onChange={e => set('voice', e.target.value)}><option>Feminina</option><option>Masculina</option></select></label>
        <label>Tamanho do texto: {prefs.fontSize}px<input type="range" min="14" max="22" value={prefs.fontSize} onChange={e => set('fontSize', +e.target.value)} /></label>
        <label className="chk"><input type="checkbox" checked={prefs.contrast} onChange={e => set('contrast', e.target.checked)} /> Alto contraste</label>
        <p className="muted">Sua localização é usada apenas para mostrar vagas e alertas próximos e não é compartilhada.</p>
        <button className="btn">Salvar preferências</button></form>
    </div>
  )
}
