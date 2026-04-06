import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ShieldAlert, AlertTriangle, Lightbulb,
  TrendingUp, Brain, BarChart2, Zap, Activity
} from 'lucide-react';
import { VALIDATION_DATA } from '../../data/mockData';
import './InsightsPanel.css';

const SCORE_COLORS = {
  high: '#10b981',
  mid: '#f59e0b',
  low: '#ef4444',
};

function scoreColor(v) {
  if (v >= 80) return SCORE_COLORS.high;
  if (v >= 60) return SCORE_COLORS.mid;
  return SCORE_COLORS.low;
}

const SCORE_KEYS = [
  { key: 'scalability', label: 'Scalability' },
  { key: 'performance', label: 'Performance' },
  { key: 'security', label: 'Security' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'maintainability', label: 'Maintainability' },
];

const AI_CRITIQUES = {
  mvp: "This monolith is solid for a v1. PostgreSQL with Redis caching will comfortably handle your first 50K users. Ship fast, instrument everything from day one, and watch your hotspots — you'll know when it's time to extract your first service.",
  scalable: "Strong choice for scale. Kafka-based event sourcing decouples your growth. Ensure your team enforces DDD boundaries or you'll end up with a distributed monolith. Auth service SPOF needs a fix — multi-AZ replicated before launch.",
  serverless: "Serverless fits spiky traffic perfectly with near-zero ops overhead. Cold start latency is the trade-off to manage — provision concurrency for latency-sensitive paths. Pair Step Functions with DLQs for workflow resilience.",
};

function CollapsibleSection({ title, icon, defaultOpen = true, children, accent }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ip-section">
      <button className="ip-section-header" onClick={() => setOpen(o => !o)}>
        <span className="ip-section-label" style={accent ? { color: accent } : {}}>
          {icon}
          {title}
        </span>
        <ChevronDown size={13} className={`ip-section-chevron ${open ? 'open' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="ip-section-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InsightsPanel({ design }) {
  if (!design) {
    return (
      <div className="ip-panel">
        <div className="ip-header">
          <span className="ip-title"><Activity size={13} /> Insights</span>
        </div>
        <div className="ip-empty">
          <div className="ip-empty-icon"><BarChart2 size={18} style={{ color: 'var(--text-muted)' }} /></div>
          <p className="ip-empty-text">Generate architectures to see<br />validation, scores, and AI critique.</p>
        </div>
      </div>
    );
  }

  const scores = design.scores;

  return (
    <div className="ip-panel">
      <div className="ip-header">
        <span className="ip-title"><Activity size={13} /> Insights</span>
        <span className="ip-design-tag">{design.label}</span>
      </div>

      <div className="ip-body">

        {/* ── System Scores ── */}
        <CollapsibleSection title="System Scores" icon={<BarChart2 size={11} />} defaultOpen={true}>
          <div className="ip-score-row">
            {SCORE_KEYS.map(({ key, label }) => {
              const val = scores[key];
              const color = scoreColor(val);
              return (
                <div key={key} className="ip-score-item">
                  <div className="ip-score-label-row">
                    <span className="ip-score-label">{label}</span>
                    <span className="ip-score-value" style={{ color }}>{val}%</span>
                  </div>
                  <div className="ip-score-bar-bg">
                    <motion.div
                      className="ip-score-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* ── Validation Issues ── */}
        <CollapsibleSection
          title="Issues & Warnings"
          icon={<ShieldAlert size={11} />}
          accent="var(--red)"
          defaultOpen={true}
        >
          {VALIDATION_DATA.issues.map(issue => (
            <div key={issue.id} className={`ip-issue-card ${issue.severity}`}>
              <div className="ip-issue-title">
                {issue.severity === 'error' ? '🔴' : '🟡'} {issue.title}
              </div>
              <p className="ip-issue-desc">{issue.description}</p>
              <div className="ip-issue-meta">
                <span className="ip-tag">{issue.component}</span>
                <span className="ip-tag">{issue.severity.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* ── Optimizations ── */}
        <CollapsibleSection
          title="Optimization Tips"
          icon={<TrendingUp size={11} />}
          accent="var(--green)"
          defaultOpen={false}
        >
          {VALIDATION_DATA.optimizations.map(opt => (
            <div key={opt.id} className="ip-issue-card optimization">
              <div className="ip-issue-title">⚡ {opt.title}</div>
              <p className="ip-issue-desc">{opt.description}</p>
              <div className="ip-issue-meta">
                <span className="ip-tag">{opt.category}</span>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* ── Suggestions ── */}
        <CollapsibleSection
          title="Suggestions"
          icon={<Lightbulb size={11} />}
          accent="var(--blue)"
          defaultOpen={false}
        >
          {VALIDATION_DATA.suggestions.map(s => (
            <div key={s.id} className="ip-issue-card suggestion">
              <div className="ip-issue-title">💡 {s.title}</div>
              <p className="ip-issue-desc">{s.description}</p>
              <div className="ip-issue-meta">
                <span className="ip-tag">Impact: {s.impact}</span>
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* ── AI Critique ── */}
        <CollapsibleSection
          title="AI Critique"
          icon={<Brain size={11} />}
          accent="var(--accent-bright)"
          defaultOpen={true}
        >
          <div className="ip-critique-box">
            <div className="ip-critique-header">
              <div className="ip-critique-icon"><Zap size={11} color="var(--accent-bright)" /></div>
              <span className="ip-critique-label">Senior Engineer Review</span>
            </div>
            <p className="ip-critique-text">
              {AI_CRITIQUES[design.id] || AI_CRITIQUES.scalable}
            </p>
          </div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
