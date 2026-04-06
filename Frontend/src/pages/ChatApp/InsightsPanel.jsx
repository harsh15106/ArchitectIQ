import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ShieldAlert, AlertTriangle, Lightbulb,
  TrendingUp, Brain, BarChart2, Zap, Activity, AlertCircle,
  FileCheck, ShieldCheck
} from 'lucide-react';
import { VALIDATION_DATA } from '../../data/mockData';
import './InsightsPanel.css';

const SCORE_KEYS = [
  { key: 'scalability', label: 'SCALABILITY' },
  { key: 'performance', label: 'PERFORMANCE' },
  { key: 'security', label: 'SECURITY' },
  { key: 'reliability', label: 'RELIABILITY' },
  { key: 'maintainability', label: 'MAINTAINABILITY' },
];

const AI_CRITIQUES = {
  mvp: "This monolith is solid for a v1. PostgreSQL with Redis caching will comfortably handle your first 50K users. Ship fast, instrument everything from day one, and watch your hotspots — you'll know when it's time to extract your first service.",
  scalable: "Strong choice for scale. Kafka-based event sourcing decouples your growth. Ensure your team enforces DDD boundaries or you'll end up with a distributed monolith. Auth service SPOF needs a fix — multi-AZ replicated before launch.",
  serverless: "Serverless fits spiky traffic perfectly with near-zero ops overhead. Cold start latency is the trade-off to manage — provision concurrency for latency-sensitive paths. Pair Step Functions with DLQs for workflow resilience.",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function CollapsibleSection({ title, icon, defaultOpen = true, children, accent }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ip-section">
      <button className="ip-section-header" onClick={() => setOpen(o => !o)}>
        <span className="ip-section-label">
          <span className="ip-header-icon">{icon}</span>
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
             transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
             className="ip-section-overflow"
           >
             <motion.div 
               className="ip-section-body"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
             >
               {children}
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InsightsPanel({ design }) {
  if (!design) return null;

  // Data mapping from Backend Logic (Remote)
  const scores = design.scores;
  
  const valIssues = design.validation?.missing_components?.map((c, i) => ({
    id: `issue-${i}`, 
    severity: design.validation.severities?.critical ? 'error' : 'warning',
    title: 'Missing Component', 
    description: `Missing ${c}. ${design.validation?.recommendations?.[i] || ''}`
  })) || VALIDATION_DATA.issues;
  
  const valSuggs = design.validation?.recommendations?.map((r, i) => ({
    id: `sugg-${i}`, 
    title: 'AI Recommendation', 
    description: r, 
    impact: 'High'
  })) || VALIDATION_DATA.suggestions;
  
  const costEstimation = design.cost?.total_monthly_usd_estimate || 0;
  const costItemized = design.cost?.itemized || [];

  return (
    <div className="ip-panel">
      <div className="ip-header">
        <span className="ip-title"><Activity size={13} /> SYSTEM INSIGHTS</span>
        <span className="ip-design-tag">{design.label}</span>
      </div>

      <div className="ip-body custom-scrollbar">

        {/* ── System Scores (Tech Meter Look) ── */}
        <CollapsibleSection title="SYSTEM DIAGNOSTICS" icon={<BarChart2 size={12} />} defaultOpen={true}>
          <div className="ip-score-container">
            {SCORE_KEYS.map(({ key, label }) => {
              const val = scores[key];
              const isCritical = val < 60;
              return (
                <motion.div key={key} className="ip-score-metric" variants={itemVariants}>
                  <div className="ip-score-header">
                    <span className="ip-score-label">{label}</span>
                    <span className={`ip-score-percent ${isCritical ? 'critical' : ''}`}>{val}%</span>
                  </div>
                  <div className="ip-score-track">
                    <motion.div
                      className={`ip-score-fill ${isCritical ? 'critical' : ''}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="ip-score-segments" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* ── Validation Issues (Elite Alerts) ── */}
        <CollapsibleSection
          title="CRITICAL ISSUES"
          icon={<ShieldAlert size={12} />}
          accent="var(--red)"
          defaultOpen={true}
        >
          {valIssues.map(issue => (
            <motion.div key={issue.id} className={`ip-issue-card ${issue.severity}`} variants={itemVariants}>
              <div className="ip-issue-top">
                 <span className="ip-icon-pulsing">
                   {issue.severity === 'error' ? <AlertCircle size={14} color="#EF4444" /> : <AlertTriangle size={14} color="#F59E0B" />}
                 </span>
                 <span className="ip-issue-title">{issue.title}</span>
              </div>
              <p className="ip-issue-desc">{issue.description}</p>
            </motion.div>
          ))}
        </CollapsibleSection>

        {/* ── AI Cost Estimate (High-End Metric) ── */}
        <CollapsibleSection
          title="COST ESTIMATE"
          icon={<Zap size={12} />}
          accent="var(--green)"
          defaultOpen={true}
        >
          <motion.div className="ip-issue-card" variants={itemVariants}>
            <div className="ip-issue-title" style={{color:'var(--accent-bright)'}}>
               💰 Monthly Total: ${costEstimation}
            </div>
            {costItemized.length > 0 ? (
              costItemized.map((c, idx) => (
                <p key={idx} className="ip-issue-desc">
                  {c.name} ({c.type}): ${c.monthly_cost}
                </p>
              ))
            ) : (
                <p className="ip-issue-desc">Estimation based on standard Tier 1 Cloud providers.</p>
            )}
          </motion.div>
        </CollapsibleSection>

        {/* ── Optimizations (Premium Recommendations) ── */}
        <CollapsibleSection
          title="OPTIMIZATION PATH"
          icon={<Lightbulb size={12} />}
          accent="var(--blue)"
          defaultOpen={false}
        >
          {valSuggs.map(s => (
            <motion.div key={s.id} className="ip-issue-card suggestion" variants={itemVariants}>
              <div className="ip-issue-top">
                <Lightbulb size={13} color="var(--blue)" />
                <span className="ip-issue-title">{s.title}</span>
              </div>
              <p className="ip-issue-desc">{s.description}</p>
              {s.impact && <div className="ip-card-footer"><span className="ip-tag-pill">{s.impact} Impact</span></div>}
            </motion.div>
          ))}
        </CollapsibleSection>

        {/* ── AI Critique (Signed Audit Log Look) ── */}
        <CollapsibleSection
          title="AI AUDIT LOG"
          icon={<Brain size={12} />}
          accent="#D4AF37"
          defaultOpen={true}
        >
          <motion.div className="ip-critique-box" variants={itemVariants}>
            <div className="ip-critique-header">
              <div className="ip-audit-seal"><ShieldCheck size={14} color="var(--accent)" /></div>
              <span className="ip-critique-label">Authoritative Review</span>
              <div className="ip-audit-mark">VERIFIED</div>
            </div>
            <p className="ip-critique-text">
              {AI_CRITIQUES[design.id] || AI_CRITIQUES.scalable}
            </p>
            <div className="ip-audit-footer">
              <div className="ip-audit-line" />
              <span>ArchitectIQ / Senior System Engineer</span>
            </div>
          </motion.div>
        </CollapsibleSection>

      </div>
    </div>
  );
}
