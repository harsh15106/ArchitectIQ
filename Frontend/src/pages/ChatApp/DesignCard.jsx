import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Server, Layers, Code2, GitBranch, ThumbsUp, ThumbsDown, Activity } from 'lucide-react';
import './DesignCard.css';

export default function DesignCard({ design }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (!design || !mermaidRef.current) return;

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#050508',
            primaryColor: '#1e1b3a',
            primaryTextColor: '#e5e7eb',
            primaryBorderColor: '#7c3aed',
            lineColor: '#4f46e5',
            secondaryColor: '#0f0f1a',
            tertiaryColor: '#141420',
            clusterBkg: '#0f0f1a',
            titleColor: '#e5e7eb',
            edgeLabelBackground: '#0c0c14',
            fontSize: '13px',
          },
        });
        const id = `mermaid-${design.id}-${Date.now()}`;
        mermaidRef.current.removeAttribute('data-processed');
        mermaidRef.current.innerHTML = '';
        const { svg } = await mermaid.render(id, design.diagram);
        mermaidRef.current.innerHTML = svg;
      } catch (e) {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '<p style="color:var(--text-muted);font-size:0.75rem;text-align:center">Diagram unavailable</p>';
        }
      }
    };

    renderDiagram();
  }, [design?.id]);

  if (!design) return null;

  return (
    <motion.div
      key={design.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="dc-wrapper"
    >
      {/* ── Header ── */}
      <div className="dc-header">
        <div className="dc-header-top">
          <span className="dc-label">{design.label}</span>
          <span className={`dc-badge ${design.badgeColor}`}>{design.badge}</span>
        </div>
        <h2 className="dc-name">{design.name}</h2>
      </div>

      {/* ── Body ── */}
      <div className="dc-body">

        {/* Summary */}
        <section>
          <p className="dc-section-title"><Activity size={11} /> Overview</p>
          <p className="dc-summary">{design.summary}</p>
        </section>

        {/* Components */}
        <section>
          <p className="dc-section-title"><Server size={11} /> Key Components</p>
          <div className="dc-components">
            {design.components.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="dc-component-row"
              >
                <span className="dc-comp-name">{c.name}</span>
                <span className="dc-comp-role">{c.role}</span>
                <span className="dc-comp-tech">{c.tech}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <p className="dc-section-title"><Code2 size={11} /> Tech Stack</p>
          <div className="dc-tech-chips">
            {design.techStack.map((t, i) => (
              <span key={i} className="dc-tech-chip">{t}</span>
            ))}
          </div>
        </section>

        {/* Diagram */}
        <section>
          <p className="dc-section-title"><GitBranch size={11} /> Architecture Diagram</p>
          <div className="dc-diagram-wrap">
            <div className="mermaid" ref={mermaidRef} />
          </div>
        </section>

        {/* Pros & Cons */}
        <section>
          <p className="dc-section-title"><ThumbsUp size={11} /> Trade-offs</p>
          <div className="dc-pros-cons">
            <div className="dc-pros-col">
              <div className="dc-pros-title"><ThumbsUp size={10} /> Pros</div>
              {design.pros.map((p, i) => (
                <div key={i} className="dc-pc-item">
                  <span className="dc-pc-dot-green" />
                  {p}
                </div>
              ))}
            </div>
            <div className="dc-cons-col">
              <div className="dc-cons-title"><ThumbsDown size={10} /> Cons</div>
              {design.cons.map((c, i) => (
                <div key={i} className="dc-pc-item">
                  <span className="dc-pc-dot-red" />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
