import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

const PAGE_TITLES = {
  '/app': 'System Workspace',
  '/history': 'Recent Sessions',
  '/saved': 'Design Archive',
  '/settings': 'Configuration',
};

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Workspace';

  return (
    <div className="main-layout">
      {/* ── Background Decals for layout ── */}
      <div className="layout-orb layout-orb-1" />
      <div className="layout-orb layout-orb-2" />

      <div className="layout-container">
        <Sidebar
          activeNav={location.pathname}
          onNewSession={() => navigate('/app')}
          sessionTitle={pageTitle}
        />

        <div className="main-content-col">
          {/* Top navigation */}
          <header className="main-topbar">
            <div className="topbar-title-wrap">
              <div className="topbar-icon-wrap">
                <Layers size={14} />
              </div>
              <span className="topbar-title">
                {pageTitle}
              </span>
            </div>
            <div id="topbar-actions" />
          </header>

          <main className="main-outlet-wrapper">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
