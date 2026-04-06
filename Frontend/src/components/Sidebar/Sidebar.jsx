import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, History, Bookmark, User, 
  Brain, Zap, Menu, X, LogOut
} from 'lucide-react';
import { MOCK_HISTORY } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Zap, label: 'Workspace', path: '/app' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Bookmark, label: 'Saved Designs', path: '/saved' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const recentHistory = MOCK_HISTORY.slice(0, 3);
  
  const { user, logout } = useAuth();
  const userData = user || { name: 'Demo User', role: 'user' };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-top">
        {/* ── Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Brain size={20} strokeWidth={2.5} />
          </div>
          <div className="sidebar-text sidebar-brand-group">
            <h1 className="sidebar-brand-title">ArchitectIQ</h1>
            <p className="sidebar-brand-subtitle">AI Assistant</p>
          </div>
        </div>

        {/* ── Sidebar Toggle (Internal) ── */}
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggle}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* ── New Session ── */}
        <div className="sidebar-menu">
          {/* ── primary Nav ── */}
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); onClose(); }}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              data-label={item.label}
            >
              <item.icon size={20} className="sidebar-icon" strokeWidth={2.25} />
              <span className="sidebar-text">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        {/* ── History (Only visible when expanded) ── */}
        <div className="sidebar-section-wrap">
          <div className="sidebar-text sidebar-section-label">Most Recent</div>
          <div className="sidebar-recent-list">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="sidebar-recent-card"
                onClick={() => { navigate('/history'); onClose(); }}
              >
                <span className="sidebar-text recent-title">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── User ── */}
        <footer className="sidebar-footer">
          <div className="sidebar-user-wrap" data-label={userData.name}>
            <div className="sidebar-user-avatar">{userData.name.charAt(0)}</div>
            <div className="sidebar-text sidebar-user-info">
               <p className="sidebar-user-name">{userData.name}</p>
               <p className="sidebar-user-plan">{userData.role || 'PRO PLAN'}</p>
            </div>
          </div>
          <button className="sidebar-logout-icon-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </footer>
      </div>
    </aside>
  );
}
