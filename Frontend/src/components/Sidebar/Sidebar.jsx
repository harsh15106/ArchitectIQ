import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, History, Bookmark, Settings, 
  ChevronRight, Brain, User, Zap
} from 'lucide-react';
import { MOCK_HISTORY } from '../../data/mockData';
import './Sidebar.css';

export default function Sidebar({ activeNav, onNewSession, sessionTitle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: History, label: 'History', path: '/history' },
    { icon: Bookmark, label: 'Saved Designs', path: '/saved' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const recentHistory = MOCK_HISTORY.slice(0, 4);

  return (
    <aside className="sidebar-wrapper">
      {/* ── Brand Header ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Brain size={18} strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-group">
          <h1 className="sidebar-brand-title">ArchitectIQ</h1>
          <p className="sidebar-brand-subtitle">AI Assistant</p>
        </div>
      </div>

      {/* ── New Session Button ── */}
      <motion.button
        whileHover={{ scale: 1.01, translateY: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/app')}
        className="sidebar-new-btn"
      >
        <Plus size={16} strokeWidth={3} />
        <span>New Architect Session</span>
      </motion.button>

      {/* ── Primary Navigation ── */}
      <nav className="sidebar-nav-container">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`sidebar-nav-item ${activeNav === item.path ? 'active' : ''}`}
          >
            <item.icon size={18} strokeWidth={2.25} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Recent History List ── */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-label">Most Recent</h3>
        <div className="sidebar-recent-list">
          {recentHistory.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              className="sidebar-recent-card"
              onClick={() => navigate('/history')}
            >
              <span className="recent-title">{item.title}</span>
              <div className="recent-meta">
                <span>{item.timestamp}</span>
                <span>{item.complexity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── User & Status Section ── */}
      <footer className="sidebar-footer">
        <div className="sidebar-user-wrap">
          <div className="sidebar-user-avatar">
             <span>U</span>
          </div>
          <div className="sidebar-user-info">
             <p className="sidebar-user-name">Professional User</p>
             <p className="sidebar-user-plan">PRO PLAN</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
