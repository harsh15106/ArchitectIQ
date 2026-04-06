import { motion, AnimatePresence } from 'framer-motion';
import MermaidDiagram from './MermaidDiagram';
import ValidationCard from './ValidationCard';
import { LayoutTemplate, Cpu, Sparkles, GitBranch } from 'lucide-react';

/* ── Empty / Placeholder state ── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center h-full gap-8 px-6 py-10 text-center"
    >
      {/* Animated orb cluster */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(139,92,246,0.25)',
            background: 'transparent',
          }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full"
          style={{
            border: '1px dashed rgba(99,102,241,0.2)',
            background: 'transparent',
          }}
        />
        {/* Core */}
        <div
          className="absolute inset-6 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          <LayoutTemplate size={20} style={{ color: 'var(--accent-bright)' }} strokeWidth={1.5} />
        </div>
        {/* Orbit dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
        >
          <div
            className="absolute w-2.5 h-2.5 rounded-full -top-1 left-1/2 -translate-x-1/2"
            style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          Architecture Panel
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)', fontSize: '0.83rem' }}>
          Start a conversation to generate your system architecture, validation analysis, and optimization recommendations.
        </p>
      </div>

      {/* Feature pills */}
      <div className="w-full flex flex-col gap-3">
        {[
          { icon: GitBranch, label: 'Live Architecture Diagram', sub: 'Mermaid.js powered visual', color: 'var(--accent)' },
          { icon: Sparkles, label: 'AI Validation & Insights', sub: 'Issues, suggestions & optimizations', color: 'var(--amber)' },
        ].map(item => (
          <motion.div
            key={item.label}
            whileHover={{ x: 3, scale: 1.01 }}
            className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}
            >
              <item.icon size={14} style={{ color: item.color }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main Panel ── */
export default function ArchitecturePanel({ diagram, validationData }) {
  const hasContent = !!diagram;

  return (
    <motion.aside
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col h-full shrink-0 relative"
      style={{
        width: '332px',
        background: 'linear-gradient(180deg, #0e0e1a 0%, #0a0a14 100%)',
        borderLeft: '1px solid rgba(139,92,246,0.1)',
      }}
    >
      {/* Subtle top-right glow */}
      <div className="orb absolute" style={{
        width: '260px', height: '220px',
        background: 'rgba(99,102,241,0.04)',
        top: '-60px', right: '-80px',
      }} />

      {/* ── Header ── */}
      <div
        className="relative z-10 flex items-center justify-between px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            <Cpu size={13} style={{ color: 'var(--accent-bright)' }} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Architecture</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>AI Intelligence Panel</p>
          </div>
        </div>

        <AnimatePresence>
          {hasContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--green)', fontSize: '10px' }}>Generated</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!hasContent ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="p-5 flex flex-col gap-6"
            >
              {/* Diagram */}
              <MermaidDiagram diagram={diagram} />

              {/* Divider */}
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)' }} />

              {/* Validation */}
              <AnimatePresence>
                {validationData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <ValidationCard
                      issues={validationData.issues}
                      suggestions={validationData.suggestions}
                      optimizations={validationData.optimizations}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
