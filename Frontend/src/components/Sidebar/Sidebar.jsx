import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, History, Bookmark, Settings, 
  Brain, Zap
} from 'lucide-react';
import { MOCK_HISTORY } from '../../data/mockData';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Zap, label: 'Workspace', path: '/app' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Bookmark, label: 'Saved Designs', path: '/saved' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const recentHistory = MOCK_HISTORY.slice(0, 3);

  return (
    <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
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

      {/* ── New Session ── */}
      <div className="sidebar-menu">
        <button
          onClick={() => { navigate('/app'); onClose(); }}
          className="sidebar-item sidebar-new-btn"
          data-label="New Session"
        >
          <Plus size={20} className="sidebar-icon" strokeWidth={3} />
          <span className="sidebar-text">New Session</span>
        </button>

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
        <div className="sidebar-user-wrap" data-label="Professional User">
          <div className="sidebar-user-avatar">U</div>
          <div className="sidebar-text sidebar-user-info">
             <p className="sidebar-user-name">Professional User</p>
             <p className="sidebar-user-plan">PRO PLAN</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
