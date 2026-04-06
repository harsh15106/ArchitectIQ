import { motion } from 'framer-motion';
import { 
  Eye, Edit3, RefreshCw, Trash2, Star, 
  Clock, Cpu, BarChart3, ChevronRight, Zap
} from 'lucide-react';
import './HistoryCard.css';

export default function HistoryCard({ item }) {
  const complexityColors = {
    'Low': '#22C55E',
    'Medium': '#F59E0B',
    'High': '#EF4444',
    'Very High': '#EC4899'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card-wrapper"
    >
      {/* ── Top Header Section ── */}
      <div className="card-header-row">
        <h3 className="card-title-main">{item.title}</h3>
        <span className="card-complexity-badge" style={{ borderColor: complexityColors[item.complexity] + '44' }}>
          {item.complexity}
        </span>
      </div>

      {/* ── Description Summary ── */}
      <p className="card-preview-text">{item.preview}</p>

      {/* ── Tech Stack Chips ── */}
      <div className="card-tech-stack">
        {item.tags.map(tag => (
          <span key={tag} className="card-tech-chip">
            {tag}
          </span>
        ))}
      </div>

      {/* ── Bottom Row Metadata ── */}
      <div className="card-bottom-row">
        <div className="card-time-meta">
          <Clock size={11} strokeWidth={2.5} />
          {item.timestamp}
        </div>
        
        {item.isOptimized && (
          <div className="card-status-label">
            <Zap size={10} fill="currentColor" />
            <span>Optimized</span>
          </div>
        )}
      </div>

      {/* ── Hover Actions (Hidden by default) ── */}
      <div className="card-quick-actions">
        <button className="card-action-circle" title="View Design">
          <Eye size={14} strokeWidth={2.5} />
        </button>
        <button className="card-action-circle" title="Regenerate">
          <RefreshCw size={14} strokeWidth={2.5} />
        </button>
        <button className="card-action-circle" title="Delete Session">
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
