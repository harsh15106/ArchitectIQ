import { motion } from 'framer-motion';
import { 
  Eye, Trash2, Clock, Star
} from 'lucide-react';
import '../History/HistoryCard.css';

export default function SavedCard({ item, onClick }) {
  // Map categories to the color patterns used in HistoryCard's complexity badge
  const categoryColors = {
    'E-commerce': '#22C55E',
    'Communication': '#F59E0B',
    'Fintech': '#EF4444',
  };

  const badgeColor = categoryColors[item.category] || '#D4AF37';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="card-wrapper"
    >
      {/* ── Top Header Section ── */}
      <div className="card-header-row">
        <h3 className="card-title-main">{item.title}</h3>
        <span 
          className="card-complexity-badge" 
          style={{ 
            borderColor: badgeColor + '44', 
            color: badgeColor,
            background: badgeColor + '10' // Slight tint of the assigned color
          }}
        >
          {item.category}
        </span>
      </div>

      {/* ── Description Summary ── */}
      <p className="card-preview-text">{item.summary}</p>

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
          {item.modifiedTime}
        </div>
        
        {item.isPinned && (
          <div className="card-status-label" style={{ color: '#D4AF37', background: 'rgba(212, 175, 55, 0.08)' }}>
            <Star size={10} fill="currentColor" />
            <span style={{ marginLeft: '4px' }}>Pinned</span>
          </div>
        )}
      </div>

      {/* ── Hover Actions (Hidden by default) ── */}
      <div className="card-quick-actions">
        <button 
          className="card-action-circle" 
          title="View Architecture Diagram" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClick(); 
          }}
        >
          <Eye size={14} strokeWidth={2.5} />
        </button>
        <button 
          className="card-action-circle" 
          title="Delete Saved Design" 
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
