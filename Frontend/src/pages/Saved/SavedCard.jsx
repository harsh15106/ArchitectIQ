import { motion } from 'framer-motion';
import { 
  ExternalLink, Copy, Download, Trash2, 
  Star, Clock, Heart, Share2, MoreVertical, 
  LayoutTemplate 
} from 'lucide-react';

export default function SavedCard({ item }) {
  const actions = [
    { icon: ExternalLink, label: 'Open', color: 'var(--accent-bright)' },
    { icon: Copy, label: 'Duplicate', color: '#888' },
    { icon: Download, label: 'Export', color: '#888' },
    { icon: Trash2, label: 'Remove', color: 'var(--red)' },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col p-6 rounded-2xl transition-all duration-300"
      style={{
        background: 'rgba(20,20,32,0.65)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)';
        e.currentTarget.style.background = 'rgba(25,25,40,0.85)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.background = 'rgba(20,20,32,0.65)';
      }}
    >
      {/* --- Pin/Pin Ribbon --- */}
      {item.isPinned && (
        <div className="absolute top-0 left-6 -translate-y-1/2">
           <div className="bg-indigo-500 rounded-b-lg p-1.5 shadow-lg shadow-indigo-500/20">
             <Star size={10} fill="#fff" stroke="none" />
           </div>
        </div>
      )}

      {/* --- Header: Category & More --- */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] leading-none">{item.category}</span>
        </div>
        <button className="text-[#444] hover:text-[#777] transition-colors p-1">
          <MoreVertical size={14} />
        </button>
      </div>

      {/* --- Visual Icon/Preview Area --- */}
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0" 
           style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(139,92,246,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}>
        <LayoutTemplate size={22} style={{ color: 'var(--accent-bright)' }} strokeWidth={1.5} />
      </div>

      {/* --- Title & Summary --- */}
      <div className="mb-6">
        <h3 className="text-base font-bold mb-2 group-hover:text-indigo-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {item.title}
        </h3>
        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {item.summary}
        </p>
      </div>

      {/* --- Tags --- */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {item.tags.map(tag => (
          <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md border border-white/[0.04] bg-white/[0.03] text-[#888]">
            {tag}
          </span>
        ))}
      </div>

      {/* --- Footer & Actions (Reveal on Hover) --- */}
      <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/[0.03]">
        <div className="flex flex-col gap-0.5">
           <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-[#555]" />
              <span className="text-[10px] text-[#555] font-medium">Modified {item.modifiedTime}</span>
           </div>
           <span className="text-[10px] text-[#444]">Saved on {item.savedDate}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
           {actions.map(action => (
             <motion.button
               key={action.label}
               whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.06)' }}
               className="p-1.5 rounded-lg transition-colors border border-transparent hover:border-white/[0.05]"
               title={action.label}
             >
               <action.icon size={13} style={{ color: action.color }} />
             </motion.button>
           ))}
        </div>
      </div>

      {/* --- Rating Badge --- */}
      <div className="absolute top-6 right-6 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 border border-white/[0.03]">
         <Star size={10} fill="#f59e0b" stroke="none" />
         <span className="text-[10px] font-bold text-amber-500/80">{item.rating}</span>
      </div>
    </motion.div>
  );
}
