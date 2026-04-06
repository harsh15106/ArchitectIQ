import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Menu, X, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const PAGE_TITLES = {
  '/app': 'System Workspace',
  '/history': 'Recent Sessions',
  '/saved': 'Design Archive',
  '/settings': 'Configuration',
};

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Workspace';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div 
      className={`app-container ${!isSidebarOpen ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{ 
        '--sidebar-width': isSidebarOpen ? '240px' : '70px',
        /* On Mobile (< 768px), sidebar is fixed overlay, so margin should be 0 */
        ...(window.innerWidth <= 768 ? { '--sidebar-width': '0px' } : {})
      }}
    >
      {/* ── Global Navbar (Always Top-Level) ── */}
      <nav className="navbar">
        <div className="navbar-left">
          <button 
            className="hamburger-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="navbar-center" onClick={() => navigate('/')}>
          <span className="brand-text">ARCHITECTIQ</span>
        </div>

        <div className="navbar-right">
          <button className="navbar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
          <div id="topbar-actions" />
        </div>
      </nav>

      <div className="main-layout">
        {/* ── Sidebar Global Overlay (Mobile Only Focus) ── */}
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
