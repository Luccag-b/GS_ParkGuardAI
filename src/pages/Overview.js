import React from 'react';
import { Navigation, AlertTriangle, CheckCircle, CarFront, Users } from 'lucide-react';
import ArrivalModal from '../components/ArrivalModal';

export default function Overview() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Bom dia, Lucca</h1>
          <p className="text-muted">Sua cidade está mais segura e acessível hoje.</p>
        </div>
        <div className="flex-row">
          <button className="btn-secondary" onClick={() => setModalOpen(true)}>Uma Chegada Para Todos</button>
          <button className="btn-primary"><Navigation size={18}/> Planejar deslocamento</button>
        </div>
      </div>

      <div className="grid-cards" style={{marginBottom: '32px'}}>
        <div className="card">
          <div className="flex-between" style={{marginBottom: '16px'}}>
            <div className="text-muted">Vagas Livres Próximas</div>
            <CarFront size={20} color="var(--color-primary)"/>
          </div>
          <div style={{fontSize: '36px', fontWeight: 'bold', color: 'var(--color-primary)'}}>24</div>
        </div>
        <div className="card">
          <div className="flex-between" style={{marginBottom: '16px'}}>
            <div className="text-muted">Vagas Acessíveis</div>
            <Users size={20} color="var(--color-access-blue)"/>
          </div>
          <div style={{fontSize: '36px', fontWeight: 'bold', color: 'var(--color-access-blue)'}}>6</div>
        </div>
        <div className="card">
          <div className="flex-between" style={{marginBottom: '16px'}}>
            <div className="text-muted">Alertas no Trajeto</div>
            <AlertTriangle size={20} color="var(--color-alert-yellow)"/>
          </div>
          <div style={{fontSize: '36px', fontWeight: 'bold', color: 'var(--color-alert-yellow)'}}>3</div>
        </div>
        <div className="card">
          <div className="flex-between" style={{marginBottom: '16px'}}>
            <div className="text-muted">Índice Acessibilidade</div>
            <CheckCircle size={20} color="var(--color-access-purple)"/>
          </div>
          <div style={{fontSize: '36px', fontWeight: 'bold', color: 'var(--color-access-purple)'}}>92%</div>
        </div>
      </div>

      <div className="grid-cards" style={{gridTemplateColumns: '2fr 1fr'}}>
        <div className="card" style={{padding: '0', overflow: 'hidden', height: '500px'}}>
          <div className="map-placeholder">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Map" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4}} />
             <div style={{position: 'absolute', top: 20, left: 20, background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', zIndex: 10, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'}}>
                <strong style={{display: 'block', marginBottom: '12px', color: 'var(--text-primary)'}}>Mapa ao vivo</strong>
                <div className="flex-row"><span className="badge badge-success">Vagas</span><span className="badge badge-access">Acessível</span><span className="badge badge-alert">Risco</span></div>
             </div>
          </div>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="card">
            <h3 style={{marginBottom: '20px', color: 'var(--text-primary)'}}>Seu próximo deslocamento</h3>
            <div className="flex-between" style={{marginBottom: '12px'}}>
              <strong style={{fontSize: '16px'}}>Escritório (Av. Paulista)</strong>
              <span className="badge badge-access" style={{fontSize: '14px', padding: '6px 12px'}}>18 min</span>
            </div>
            <p className="text-muted" style={{marginBottom: '20px', lineHeight: '1.5'}}>Rota 92% acessível. Um alerta de obra na via evitado pelo sistema.</p>
            <button className="btn-primary" style={{width: '100%', justifyContent: 'center', padding: '12px'}}><Navigation size={18}/> Iniciar navegação</button>
          </div>
          
          <div className="card" style={{flex: 1}}>
            <h3 style={{marginBottom: '20px', color: 'var(--text-primary)'}}>Alertas próximos</h3>
            <ul style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <li className="flex-row" style={{background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                 <AlertTriangle color="var(--color-alert-yellow)" size={20}/> 
                 <div><strong style={{display: 'block', fontSize: '14px'}}>Calçada bloqueada</strong><span className="text-muted" style={{fontSize: '12px'}}>A 150m da sua posição</span></div>
               </li>
               <li className="flex-row" style={{background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                 <AlertTriangle color="var(--color-alert-red)" size={20}/> 
                 <div><strong style={{display: 'block', fontSize: '14px'}}>Semáforo inoperante</strong><span className="text-muted" style={{fontSize: '12px'}}>A 300m - Risco grave</span></div>
               </li>
               <li className="flex-row" style={{background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
                 <CheckCircle color="var(--color-primary)" size={20}/> 
                 <div><strong style={{display: 'block', fontSize: '14px'}}>Buraco tapado</strong><span className="text-muted" style={{fontSize: '12px'}}>Validado pela comunidade</span></div>
               </li>
            </ul>
          </div>
        </div>
      </div>

      {modalOpen && <ArrivalModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}