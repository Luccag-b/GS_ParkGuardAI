import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import ParkVision from './pages/ParkVision';
import RoadGuard from './pages/RoadGuard';
import InclusiveMobility from './pages/InclusiveMobility';
import { AppProvider } from './context/AppContext';

const Community = () => <div className="page-container"><h1 className="page-title">Comunidade</h1><p className="text-muted">Espaço colaborativo em desenvolvimento...</p></div>;
const Profile = () => <div className="page-container"><h1 className="page-title">Perfil e Preferências</h1><p className="text-muted">Configurações de acessibilidade e veículos em desenvolvimento...</p></div>;

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header />
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/parkvision" element={<ParkVision />} />
              <Route path="/roadguard" element={<RoadGuard />} />
              <Route path="/inclusive-mobility" element={<InclusiveMobility />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}