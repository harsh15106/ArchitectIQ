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
  if (!design) return null; // Let the toggle handle empty states

  const scores = design.scores;
  const valIssues = design.validation?.missing_components?.map((c, i) => ({
    id: i, severity: design.validation.severities?.critical ? 'error' : 'warning',
    title: 'Missing Component', description: `Missing ${c}. ${design.validation?.recommendations?.[i] || ''}`
  })) || VALIDATION_DATA.issues;
  
  const valSuggs = design.validation?.recommendations?.map((r, i) => ({
    id: i, title: 'AI Recommendation', description: r, impact: 'High'
  })) || VALIDATION_DATA.suggestions;
  
  const costEstimation = design.cost?.total_monthly_usd_estimate || 0;
  const costItemized = design.cost?.itemized || [];

  return (
    <div className="ip-panel">
      <div className="ip-header">
        <span className="ip-title"><Activity size={13} /> Insights</span>
        <span className="ip-design-tag">{design.label}</span>
      </div>

      <div className="ip-body">

        {/* ── System Scores ── */}
        <CollapsibleSection title="System Scores" icon={<BarChart2 size={11} />} defaultOpen={true}>
          <div className="ip-score-container">
            {SCORE_KEYS.map(({ key, label }) => {
              const val = scores[key];
              const color = scoreColor(val);
              return (
                <div key={key} className="ip-score-metric">
                  <div className="ip-score-header">
                    <span className="ip-score-label">{label}</span>
                    <span className="ip-score-percent" style={{ color }}>{val}%</span>
                  </div>
                  <div className="ip-score-track">
                    <motion.div
                      className="ip-score-fill"
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
          {valIssues.map(issue => (
            <div key={issue.id} className={`ip-issue-card ${issue.severity}`}>
              <div className="ip-issue-top">
                 <span className="ip-issue-icon">{issue.severity === 'error' ? '🔴' : '🟡'}</span>
                 <span className="ip-issue-title">{issue.title}</span>
              </div>
              <p className="ip-issue-desc">{issue.description}</p>
            </div>
          ))}
        </CollapsibleSection>

        {/* ── AI Cost Estimate ── */}
        <CollapsibleSection
          title={`Cost Estimate (Monthly)`}
          icon={<Zap size={11} />}
          accent="var(--green)"
          defaultOpen={true}
        >
          <div className="ip-issue-card">
            <div className="ip-issue-title" style={{color:'var(--accent-bright)'}}>💰 Total: ${costEstimation}/month</div>
            {costItemized.map((c, idx) => (
              <p key={idx} className="ip-issue-desc">
                {c.name} ({c.type}): ${c.monthly_cost}
              </p>
            ))}
          </div>
        </CollapsibleSection>

        {/* ── Optimizations & Suggestions ── */}
        <CollapsibleSection
          title="AI Recommendations"
          icon={<Lightbulb size={11} />}
          accent="var(--blue)"
          defaultOpen={false}
        >
          {valSuggs.map(s => (
            <div key={s.id} className="ip-issue-card suggestion">
              <div className="ip-issue-title">💡 {s.title}</div>
              <p className="ip-issue-desc">{s.description}</p>
            </div>
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="AI Critique"
          icon={<Brain size={11} />}
          accent="#D4AF37"
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
