import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, AlertCircle, AlertTriangle,
  Lightbulb, Zap, CheckCircle2, TrendingUp
} from 'lucide-react';

/* ── Collapsible wrapper ── */
function Section({ title, icon: Icon, count, accentColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, rgba(26,26,40,0.8) 0%, rgba(20,20,32,0.7) 100%)',
        border: '1px solid rgba(255,255,255,0.055)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all duration-150"
        style={{
          borderBottom: open ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}28`,
            }}
          >
            <Icon size={13} style={{ color: accentColor }} strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}25`,
            }}
          >
            {count}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4 flex flex-col gap-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Issue Card ── */
function IssueCard({ issue }) {
  const cfg = {
    error: { color: 'var(--red)', bg: 'var(--red-dim)', border: 'var(--red-border)', icon: AlertCircle, tag: 'Issue' },
    warning: { color: 'var(--amber)', bg: 'var(--amber-dim)', border: 'var(--amber-border)', icon: AlertTriangle, tag: 'Warning' },
    good: { color: 'var(--green)', bg: 'var(--green-dim)', border: 'var(--green-border)', icon: CheckCircle2, tag: 'Good' },
  }[issue.severity] || { color: 'var(--amber)', bg: 'var(--amber-dim)', border: 'var(--amber-border)', icon: AlertTriangle, tag: 'Warning' };

  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 rounded-xl relative overflow-hidden"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="flex items-start gap-3">
        <Icon size={14} style={{ color: cfg.color, marginTop: '2px', flexShrink: 0 }} strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{issue.title}</p>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.tag}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {issue.description}
          </p>
          {issue.component && (
            <span
              className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full mono"
              style={{ background: 'rgba(0,0,0,0.25)', color: 'var(--text-tertiary)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {issue.component}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Suggestion Card ── */
function SuggestionCard({ item }) {
  const impactCfg = {
    High: { color: 'var(--red)', bg: 'var(--red-dim)' },
    Medium: { color: 'var(--amber)', bg: 'var(--amber-dim)' },
    Low: { color: 'var(--green)', bg: 'var(--green-dim)' },
  }[item.impact] || { color: 'var(--amber)', bg: 'var(--amber-dim)' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl transition-all duration-150"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
    >
      <div className="flex items-start gap-2 mb-1">
        <p className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
          style={{ background: impactCfg.bg, color: impactCfg.color }}
        >
          {item.impact} Impact
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        {item.description}
      </p>
    </motion.div>
  );
}

/* ── Optimization Card ── */
function OptCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 rounded-xl transition-all duration-150"
      style={{
        background: 'var(--blue-dim)',
        border: '1px solid rgba(59,130,246,0.15)',
      }}
    >
      <div className="flex items-start gap-2 mb-1">
        <p className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
          style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--blue)' }}
        >
          {item.category}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        {item.description}
      </p>
    </motion.div>
  );
}

export default function ValidationCard({ issues, suggestions, optimizations }) {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Detected Issues" icon={AlertCircle} count={issues.length} accentColor="var(--red)" defaultOpen={true}>
        {issues.map(i => <IssueCard key={i.id} issue={i} />)}
      </Section>
      <Section title="Suggestions" icon={Lightbulb} count={suggestions.length} accentColor="var(--amber)" defaultOpen={true}>
        {suggestions.map(s => <SuggestionCard key={s.id} item={s} />)}
      </Section>
      <Section title="Optimizations" icon={TrendingUp} count={optimizations.length} accentColor="var(--blue)" defaultOpen={false}>
        {optimizations.map(o => <OptCard key={o.id} item={o} />)}
      </Section>
    </div>
  );
}
