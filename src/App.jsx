import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import { useApp } from './context/AppContext.jsx'
import Overview from './pages/Overview.jsx'
import ParkVision from './pages/ParkVision.jsx'
import RoadGuard from './pages/RoadGuard.jsx'
import AccessibleRoutes from './pages/AccessibleRoutes.jsx'
import Community from './pages/Community.jsx'
import Profile from './pages/Profile.jsx'
import Placeholder from './pages/Placeholder.jsx'
export default function App() {
  const { toast } = useApp()
  return (
    <div className="shell">
      <a className="skip" href="#main">Pular para o conteúdo</a>
      <Sidebar />
      <div className="content">
        <Header />
        <main id="main" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/parkvision" element={<ParkVision />} />
            <Route path="/roadguard" element={<RoadGuard />} />
            <Route path="/rotas" element={<AccessibleRoutes />} />
            <Route path="/comunidade" element={<Community />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/:page" element={<Placeholder />} />
          </Routes>
        </main>
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
