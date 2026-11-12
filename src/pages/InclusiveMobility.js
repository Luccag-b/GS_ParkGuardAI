import React from 'react';
import { Wheelchair, Eye, Baby, ArrowRight, ShieldCheck, MapPin, Share2, PhoneCall, AlertTriangle } from 'lucide-react';

export default function InclusiveMobility() {
  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Inclusive Mobility | Rotas Acessíveis</h1>
          <p className="text-muted">Deslocamento seguro, inteligente e adaptado às suas necessidades reais.</p>
        </div>
        <div className="flex-row">
           <button className="btn-secondary"><Share2 size={18} style={{marginRight: '8px'}}/> Compartilhar Rota</button>
           <button className="btn-primary" style={{background: 'var(--color-alert-red)'}}><PhoneCall size={18} style={{marginRight: '8px'}}/> SOS</button>
        </div>
      </div>

      <div className="card" style={{marginBottom: '32px'}}>
        <h3 style={{marginBottom: '20px', color: 'var(--text-primary)'}}>1. Selecione seu perfil de mobilidade:</h3>
        <div className="flex-row" style={{gap: '16px', flexWrap: 'wrap'}}>
          <button className="btn-secondary active" style={{padding: '12px 24px', fontSize: '15px'}}><Wheelchair size={20} style={{marginRight: 10}}/> Cadeirante</button>
          <button className="btn-secondary" style={{padding: '12px 24px', fontSize: '15px'}}><Eye size={20} style={{marginRight: 10}}/> Deficiência Visual</button>
          <button className="btn-secondary" style={{padding: '12px 24px', fontSize: '15px'}}><Baby size={20} style={{marginRight: 10}}/> Carrinho de Bebê</button>
          <button className="btn-secondary" style={{padding: '12px 24px', fontSize: '15px'}}>Mobilidade Reduzida (Idoso)</button>
        </div>
      </div>

      <div className="grid-cards" style={{gridTemplateColumns: '1fr 2fr', alignItems: 'start'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <h3 style={{color: 'var(--text-primary)'}}>Opções de Rota</h3>
          
          <div className="card" style={{borderLeft: '5px solid var(--color-primary)', background: 'var(--bg-card-hover)', position: 'relative'}}>
            <div style={{position: 'absolute', top: '-10px', right: '20px'}}><span className="badge badge-success" style={{boxShadow: '0 4px 6px rgba(0,0,0,0.2)'}}>Recomendada</span></div>
            <div className="flex-between" style={{marginBottom: '12px', marginTop: '8px'}}>
              <strong style={{color: 'var(--color-primary)', fontSize: '18px'}}>Rota Mais Acessível</strong>
              <span style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)'}}>98%</span>
            </div>
            <p className="text-muted" style={{marginBottom: '16px', fontSize: '15px'}}>1.2 km • 15 min a pé</p>
            <ul style={{fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <li className="flex-row"><ShieldCheck size={18} color="var(--color-primary)"/> Calçadas regulares verificadas pela IA</li>
              <li className="flex-row"><ShieldCheck size={18} color="var(--color-primary)"/> Rampas mapeadas em todas as travessias</li>
              <li className="flex-row"><ShieldCheck size={18} color="var(--color-primary)"/> Boa iluminação no trajeto</li>
            </ul>
            <button className="btn-primary" style={{width: '100%', marginTop: '20px', justifyContent: 'center'}}>Iniciar Navegação Inclusiva</button>
          </div>
          
          <div className="card" style={{borderLeft: '5px solid var(--border-color)', opacity: 0.8}}>
            <div className="flex-between" style={{marginBottom: '12px'}}>
              <strong style={{fontSize: '16px', color: 'var(--text-primary)'}}>Rota Mais Rápida</strong>
              <span style={{fontSize: '16px', fontWeight: 'bold', color: 'var(--color-alert-yellow)'}}>72%</span>
            </div>
            <p className="text-muted" style={{marginBottom: '12px', fontSize: '14px'}}>0.8 km • 10 min a pé</p>
            <div style={{background: 'rgba(246, 196, 83, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(246, 196, 83, 0.2)'}}>
               <p style={{fontSize: '13px', color: 'var(--color-alert-yellow)', display: 'flex', alignItems: 'center'}}><AlertTriangle size={16} style={{marginRight: '8px'}}/> Atenção: 1 cruzamento sem rampa e calçada estreita detectados.</p>
            </div>
          </div>
        </div>

        <div className="card" style={{padding: 0, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)'}}>
           <div className="map-placeholder" style={{height: '600px', background: '#0B1220'}}>
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Map View" style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6}} />
             
             {/* Simulação de trajeto no mapa */}
             <svg style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
               <path d="M 150,400 C 250,350 350,450 450,300 C 550,150 650,250 750,200" fill="transparent" stroke="var(--color-primary)" strokeWidth="6" strokeDasharray="10 5" style={{filter: 'drop-shadow(0 0 5px var(--color-primary))'}}/>
               <circle cx="150" cy="400" r="10" fill="var(--color-primary)" />
               <circle cx="750" cy="200" r="12" fill="var(--color-access-purple)" />
             </svg>
           </div>
           
           <div style={{position: 'absolute', bottom: 24, left: 24, right: 24}}>
             <div className="card" style={{background: 'rgba(11, 18, 32, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid var(--color-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'}}>
               <div className="flex-between" style={{marginBottom: '12px'}}>
                 <p style={{fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)'}}>Navegação passo a passo (Simulação):</p>
                 <span className="badge badge-access">Voz Ativada</span>
               </div>
               <div className="flex-row" style={{alignItems: 'flex-start'}}>
                 <div style={{background: 'rgba(23,195,162,0.2)', padding: '10px', borderRadius: '50%', color: 'var(--color-primary)'}}>
                    <ArrowRight size={24}/>
                 </div>
                 <div style={{paddingTop: '2px'}}>
                    <strong style={{display: 'block', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px'}}>Siga por 120m pela calçada com piso regular.</strong>
                    <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Há uma rampa acessível à direita no próximo cruzamento. Obstáculo temporário evitado.</span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}