import React from 'react';
import { AlertTriangle, MapPin, Search, CheckCircle, ShieldAlert } from 'lucide-react';

export default function RoadGuard() {
  const alerts = [
    { id: 1, type: 'Buraco Profundo', address: 'Av. Paulista, 1500', time: 'Há 10 min', severity: 'Alto', status: 'Em validação' },
    { id: 2, type: 'Calçada Inacessível / Obras', address: 'Rua Augusta, 800', time: 'Há 25 min', severity: 'Médio', status: 'Confirmado', ia: true },
    { id: 3, type: 'Alagamento', address: 'Av. 23 de Maio', time: 'Há 1 hora', severity: 'Crítico', status: 'Resolvido' },
    { id: 4, type: 'Iluminação Precária', address: 'Praça da República', time: 'Há 2 horas', severity: 'Médio', status: 'Confirmado', ia: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">RoadGuard | Segurança nas Vias</h1>
          <p className="text-muted">Mapa de calor e prevenção de riscos urbanos atualizados pela comunidade e IA.</p>
        </div>
        <button className="btn-primary" style={{background: 'var(--color-alert-red)', padding: '12px 24px'}}>
          <AlertTriangle size={20}/> Reportar Ocorrência
        </button>
      </div>

      <div className="grid-cards" style={{gridTemplateColumns: '1fr 2fr', alignItems: 'start'}}>
        <div className="card" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
           <h3 style={{color: 'var(--text-primary)'}}>Feed de Alertas Recentes</h3>
           
           <div className="flex-row" style={{gap: '8px', flexWrap: 'wrap'}}>
              <span className="badge" style={{background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>Todos</span>
              <span className="badge" style={{background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--color-alert-red)'}}>Críticos</span>
              <span className="badge" style={{background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--color-access-blue)'}}>Acessibilidade</span>
           </div>

           <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px'}}>
             {alerts.map(alert => (
               <div key={alert.id} style={{padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-card-hover)'}}>
                 <div className="flex-between" style={{marginBottom: '12px'}}>
                   <strong style={{fontSize: '16px', color: alert.severity === 'Crítico' ? 'var(--color-alert-red)' : alert.severity === 'Alto' ? 'var(--color-alert-orange)' : 'var(--color-alert-yellow)'}}>
                     <ShieldAlert size={16} style={{marginRight: '6px', verticalAlign: 'text-bottom'}}/> 
                     {alert.type}
                   </strong>
                   <span style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{alert.time}</span>
                 </div>
                 <p className="text-muted" style={{fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center'}}><MapPin size={16} style={{marginRight: '6px'}}/> {alert.address}</p>
                 <div className="flex-between">
                   <span className="badge" style={{background: alert.status === 'Resolvido' ? 'rgba(23,195,162,0.1)' : 'rgba(255,255,255,0.05)', color: alert.status === 'Resolvido' ? 'var(--color-primary)' : 'var(--text-secondary)', border: '1px solid var(--border-color)'}}>{alert.status}</span>
                   {alert.ia && <span style={{fontSize: '12px', color: 'var(--color-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><CheckCircle size={14} style={{marginRight: '4px'}}/> IA + Comunidade</span>}
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div className="card" style={{padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)'}}>
           <div className="map-placeholder" style={{height: '750px', width: '100%', background: '#0B1220'}}>
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Heatmap" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5}} />
             <div style={{position: 'absolute', top: 24, left: 24, background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}>
               <h4 style={{marginBottom: '12px', color: 'var(--text-primary)'}}>Mapa de Calor (Risco)</h4>
               <div className="flex-row text-muted" style={{fontSize: '13px', gap: '16px'}}>
                 <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: 12, height: 12, background: 'var(--color-alert-red)', borderRadius: '50%', boxShadow: '0 0 8px var(--color-alert-red)'}}></span> Crítico</span>
                 <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: 12, height: 12, background: 'var(--color-alert-orange)', borderRadius: '50%', boxShadow: '0 0 8px var(--color-alert-orange)'}}></span> Alto</span>
                 <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: 12, height: 12, background: 'var(--color-alert-yellow)', borderRadius: '50%'}}></span> Médio</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}