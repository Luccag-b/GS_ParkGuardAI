import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, ShieldAlert, Wheelchair, Map, Users, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Map color="var(--color-primary)" size={28}/>
        <h2>PARKGUARD <span>AI</span></h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end><LayoutDashboard size={20}/> Visão Geral</NavLink>
        <NavLink to="/parkvision"><Car size={20}/> ParkVision</NavLink>
        <NavLink to="/roadguard"><ShieldAlert size={20}/> RoadGuard</NavLink>
        <NavLink to="/inclusive-mobility"><Wheelchair size={20}/> Rotas Acessíveis</NavLink>
        <div className="nav-divider"></div>
        <NavLink to="/community"><Users size={20}/> Comunidade</NavLink>
        <NavLink to="/profile"><Settings size={20}/> Configurações</NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">L</div>
          <div className="user-info">
            <strong>Lucca</strong>
            <span>Pro Member</span>
          </div>
        </div>
      </div>
    </aside>
  );
}