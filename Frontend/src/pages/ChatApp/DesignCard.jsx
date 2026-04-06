import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Layers, Code2, GitBranch, ThumbsUp, ThumbsDown, Activity, Save, X } from 'lucide-react';
import './DesignCard.css';

export default function DesignCard({ design }) {
  const mermaidRef = useRef(null);
  const [editingNode, setEditingNode] = useState(null);
  const [zoom, setZoom] = useState(1.1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      setZoom(z => Math.min(Math.max(0.4, z * delta), 3));
    }
  };

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
            primaryColor: '#161616',
            primaryTextColor: '#f5f5f5',
            primaryBorderColor: '#D4AF37',
            lineColor: '#D4AF37',
            secondaryColor: '#1a1a1a',
            tertiaryColor: '#111111',
            clusterBkg: '#111111',
            titleColor: '#e5e7eb',
            edgeLabelBackground: '#050508',
            fontSize: '18px',
            nodeSpacing: 80,
            rankSpacing: 100,
            padding: 20,
          },
        });
        const id = `mermaid-${design.id}-${Date.now()}`;
        mermaidRef.current.removeAttribute('data-processed');
        mermaidRef.current.innerHTML = '';
        const { svg } = await mermaid.render(id, design.diagram);
        mermaidRef.current.innerHTML = svg;

        // Add Click Listeners to Nodes
        const nodes = mermaidRef.current.querySelectorAll('.node');
        nodes.forEach(node => {
          node.style.cursor = 'pointer';
          const label = node.querySelector('.label')?.textContent || "";
          
          // Inject Highlight Classes
          if (label.match(/Gateway|Core|Database|Service/i)) {
            node.classList.add('highlight-node');
          }

          node.onclick = (e) => {
            e.stopPropagation();
            setEditingNode({ id: node.id, label: label || "Component" });
          };
        });

      } catch (e) {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '<p style="color:var(--text-muted);font-size:0.75rem;text-align:center">Diagram unavailable</p>';
        }
      }
    };

    renderDiagram();
  }, [design?.id, design?.diagram]);

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

        {/* ── Diagram (Primary Focus) ── */}
        <section>
          <p className="dc-section-title"><GitBranch size={11} /> Architecture Diagram (Interactive)</p>
          <div 
            className="dc-diagram-wrap"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          >
            <div 
              className="mermaid" 
              ref={mermaidRef} 
              style={{ 
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out'
              }}
            />
            
            <AnimatePresence>
              {editingNode && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="dc-edit-popup"
                >
                  <div className="dc-edit-title">Edit Component</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>COMPONENT NAME</label>
                    <input 
                      className="dc-edit-input" 
                      defaultValue={editingNode.label} 
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>TECHNOLOGY STACK</label>
                    <select className="dc-edit-input">
                      <option>Go / Gin</option>
                      <option>Node.js / Express</option>
                      <option>Python / FastAPI</option>
                      <option>Java / Spring Boot</option>
                      <option>Rust / Axum</option>
                    </select>
                  </div>
                  <div className="dc-edit-actions">
                    <button className="ws-skip-btn" onClick={() => setEditingNode(null)}>
                      <X size={12} /> Cancel
                    </button>
                    <button 
                      className="ws-generate-btn" 
                      style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                      onClick={() => setEditingNode(null)}
                    >
                      <Save size={12} /> Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

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
