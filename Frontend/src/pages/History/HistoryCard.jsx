import { motion } from 'framer-motion';
import { 
  Eye, Edit3, RefreshCw, Trash2, Star, 
  Clock, Cpu, BarChart3, ChevronRight 
} from 'lucide-react';

export default function HistoryCard({ item, viewType = 'grid' }) {
  const isGrid = viewType === 'grid';

  const complexityColors = {
    'Low': 'var(--green)',
    'Medium': 'var(--amber)',
    'High': 'var(--red)',
    'Very High': '#ec4899' // Pink
  };

  const cardActions = [
    { icon: Eye, label: 'View', color: 'var(--accent-bright)' },
    { icon: Edit3, label: 'Edit', color: 'var(--text-secondary)' },
    { icon: RefreshCw, label: 'Regenerate', color: 'var(--amber)' },
    { icon: Trash2, label: 'Delete', color: 'var(--red)' },
  ];

  if (isGrid) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group relative flex flex-col p-5 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(20,20,32,0.6)',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
          e.currentTarget.style.background = 'rgba(20,20,32,0.85)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.background = 'rgba(20,20,32,0.6)';
        }}
      >
        {/* Header: Title & Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate pr-2" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Star size={10} fill="var(--amber)" stroke="none" />
              <span className="text-[10px] font-bold" style={{ color: 'var(--text-tertiary)' }}>{item.rating}</span>
              <span className="text-[10px]" style={{ color: 'var(--border-default)' }}>•</span>
              <span className="text-[10px] font-medium" style={{ color: complexityColors[item.complexity] }}>
                 {item.complexity} Complexity
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" 
               style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Cpu size={14} style={{ color: 'var(--accent-bright)' }} />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {item.preview}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {item.tags.map(tag => (
            <span 
              key={tag} 
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-tertiary)' 
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Metadata & Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.03]">
          <div className="flex items-center gap-1.5">
            <Clock size={10} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {cardActions.map((action, i) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
                className="p-1.5 rounded-lg transition-colors"
                title={action.label}
              >
                <action.icon size={13} style={{ color: action.color }} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selection Glow */}
        {item.isOptimized && (
           <div className="absolute top-2 right-12 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider"
                style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>
             ⚡ Optimized
           </div>
        )}
      </motion.div>
    );
  }

  // --- List View UI ---
  return (
    <motion.div
      layout
      className="group relative flex items-center p-4 rounded-xl gap-4 transition-all duration-200"
      style={{
        background: 'rgba(20,20,32,0.4)',
        border: '1px solid var(--border-ultra-subtle)',
        backdropFilter: 'blur(12px)'
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,30,45,0.6)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(20,20,32,0.4)'}
    >
      {/* Small Icon/Preview */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
           style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <BarChart3 size={16} className="text-indigo-400" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
          <div className="flex items-center gap-1">
             <Star size={10} fill="var(--amber)" stroke="none" />
             <span className="text-[10px] font-bold" style={{ color: 'var(--text-tertiary)' }}>{item.rating}</span>
          </div>
        </div>
        <p className="text-xs truncate max-w-md mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.preview}</p>
      </div>

      {/* Metadata */}
      <div className="hidden lg:flex items-center gap-4 px-6 shrink-0 border-r border-white/[0.05]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Complexity</span>
            <span className="text-xs font-semibold mt-0.5" style={{ color: complexityColors[item.complexity] }}>{item.complexity}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Generated</span>
             <span className="text-xs text-[#888] font-medium mt-0.5">{item.timestamp}</span>
          </div>
      </div>

      {/* Tags (Horizontal) */}
      <div className="hidden sm:flex items-center gap-2 px-4 shrink-0">
        {item.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md border border-white/[0.04] bg-white/[0.02] text-[#999]">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions (List) */}
      <div className="flex items-center gap-1 shrink-0 bg-black/20 p-1 rounded-lg border border-white/[0.05]">
         {cardActions.map(action => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
              title={action.label}
            >
              <action.icon size={13} style={{ color: action.color }} />
            </motion.button>
         ))}
      </div>
    </motion.div>
  );
}
