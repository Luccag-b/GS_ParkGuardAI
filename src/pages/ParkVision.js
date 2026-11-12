import React from 'react';
import { Search, Map, Star, BatteryCharging, Shield, Clock, SlidersHorizontal } from 'lucide-react';

export default function ParkVision() {
  const parkingLots = [
    { name: 'Estapar Paulista', distance: '120m', price: 'R$ 15/h', accessible: 4, normal: 12, rating: 4.8, ev: true, security: true },
    { name: 'Multipark Consolação', distance: '300m', price: 'R$ 12/h', accessible: 2, normal: 8, rating: 4.5, ev: false, security: true },
    { name: 'SafePark MASP', distance: '450m', price: 'R$ 18/h', accessible: 5, normal: 20, rating: 4.9, ev: true, security: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">ParkVision | Estacionamento Inteligente</h1>
          <p className="text-muted">Encontre e reserve a melhor vaga perto do seu destino com dados em tempo real.</p>
        </div>
        <button className="btn-secondary" style={{color: 'var(--color-access-blue)', borderColor: 'var(--color-access-blue)'}}>
          Avise-me sobre vagas acessíveis
        </button>
      </div>
      
      <div className="flex-row" style={{marginBottom: '32px', gap: '16px'}}>
         <div style={{flex: 1, position: 'relative'}}>
           <Search size={20} style={{position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}/>
           <input type="text" placeholder="Buscar endereço, estacionamento ou ponto de interesse..." className="card" style={{width: '100%', padding: '16px 16px 16px 48px', border: '1px solid var(--border-color)', outline: 'none', color: 'var(--text-primary)', fontSize: '15px'}} />
         </div>
         <button className="btn-secondary" style={{padding: '16px 24px'}}><SlidersHorizontal size={20} style={{marginRight: '8px'}}/> Filtros</button>
      </div>

      <div className="grid-cards">
        {parkingLots.map((lot, idx) => (
          <div key={idx} className="card" style={{display: 'flex', flexDirection: 'column'}}>
             <div className="flex-between" style={{marginBottom: '16px'}}>
               <h3 style={{fontSize: '20px', color: 'var(--text-primary)'}}>{lot.name}</h3>
               <span className="badge badge-success">{lot.distance}</span>
             </div>
             <p className="text-muted" style={{marginBottom: '20px'}}>Aberto agora • Fecha às 23:00</p>
             
             <div className="flex-row" style={{gap: '24px', marginBottom: '20px', color: 'var(--text-primary)', fontWeight: '500'}}>
               <div className="flex-row" style={{gap: '8px'}}><Clock size={18} color="var(--text-secondary)"/> {lot.price}</div>
               <div className="flex-row" style={{gap: '8px'}}><Star size={18} color="var(--color-alert-yellow)"/> {lot.rating}</div>
             </div>
             
             <div style={{background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border-color)'}}>
                 <div style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px'}}>Disponibilidade em tempo real</div>
                 <div className="flex-row" style={{gap: '12px'}}>
                   <span className="badge" style={{background: 'rgba(23,195,162,0.15)', color: 'var(--color-primary)', fontSize: '14px', padding: '6px 12px'}}>{lot.normal} vagas</span>
                   <span className="badge badge-access" style={{fontSize: '14px', padding: '6px 12px'}}>{lot.accessible} PCD</span>
                 </div>
             </div>

             <div className="flex-row" style={{marginBottom: '24px', gap: '16px', color: 'var(--text-secondary)'}}>
               {lot.ev && <div className="flex-row" style={{gap: '6px', fontSize: '13px'}}><BatteryCharging size={18} color="var(--color-primary)"/> Elétrico</div>}
               {lot.security && <div className="flex-row" style={{gap: '6px', fontSize: '13px'}}><Shield size={18} color="var(--color-access-blue)"/> 24h Seguro</div>}
             </div>
             
             <div style={{marginTop: 'auto'}}>
                <button className="btn-primary" style={{width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px'}}>Ver detalhes e reservar</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}