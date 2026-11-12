import React from 'react';
import { X, Wheelchair, CheckCircle, Navigation } from 'lucide-react';

export default function ArrivalModal({ onClose }) {
  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(11, 18, 32, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div className="card" style={{width: '90%', maxWidth: '550px', position: 'relative', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'}}>
        <button onClick={onClose} style={{position: 'absolute', top: 16, right: 16, background: 'var(--bg-main)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <X size={20}/>
        </button>
        <div style={{textAlign: 'center', marginBottom: '24px'}}>
          <div style={{width: 72, height: 72, background: 'rgba(90, 169, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-access-blue)'}}>
            <Wheelchair size={36}/>
          </div>
          <h2 style={{fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px'}}>Uma chegada para todos</h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '15px'}}>Simulação de navegação inclusiva</p>
        </div>
        <div style={{background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px'}}>
          <p style={{color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '15px'}}>
            <strong>Exemplo em Ação:</strong> Marina utiliza cadeira de rodas e deseja ir a um café. O <strong>PARKGUARD AI</strong> encontra uma vaga acessível, verifica rampas e condições das calçadas, identifica uma barreira no caminho e recalcula a rota até a entrada acessível do estabelecimento.
          </p>
        </div>
        <ul style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
           <li className="flex-row" style={{alignItems: 'flex-start'}}><CheckCircle size={20} color="var(--color-primary)" style={{marginTop: '2px'}}/> <div><strong style={{display: 'block', color: 'var(--text-primary)'}}>Vaga acessível reservada</strong><span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Garantida a 50m da entrada</span></div></li>
           <li className="flex-row" style={{alignItems: 'flex-start'}}><CheckCircle size={20} color="var(--color-primary)" style={{marginTop: '2px'}}/> <div><strong style={{display: 'block', color: 'var(--text-primary)'}}>Condição das calçadas verificada</strong><span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Piso regular, sem buracos ou desníveis graves</span></div></li>
           <li className="flex-row" style={{alignItems: 'flex-start'}}><CheckCircle size={20} color="var(--color-primary)" style={{marginTop: '2px'}}/> <div><strong style={{display: 'block', color: 'var(--text-primary)'}}>Desvio de obstáculo calculado</strong><span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>Obra na via evitada automaticamente</span></div></li>
        </ul>
        <button className="btn-primary" style={{width: '100%', justifyContent: 'center', padding: '14px', fontSize: '16px'}} onClick={onClose}>
          <Navigation size={20}/> Iniciar Simulação de Rota
        </button>
      </div>
    </div>
  );
}