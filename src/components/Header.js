import React, { useContext } from 'react';
import { Search, MapPin, Mic, Bell, Moon, Sun } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import './Header.css';

export default function Header() {
  const { theme, toggleTheme } = useContext(AppContext);
  return (
    <header className="top-header">
      <div className="search-bar">
        <Search size={18} className="icon-search" />
        <input type="text" placeholder="Para onde você vai?" />
        <Mic size={18} className="icon-mic" />
      </div>
      <div className="header-actions">
        <div className="location-selector">
          <MapPin size={18} color="var(--color-primary)" />
          <span>São Paulo, SP</span>
        </div>
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="badge-count">3</span>
        </button>
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}