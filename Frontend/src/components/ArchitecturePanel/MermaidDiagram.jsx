import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background: 'transparent',
    primaryColor: '#1e1b3a',
    primaryTextColor: '#eeeeff',
    primaryBorderColor: '#7c3aed',
    lineColor: '#6366f1',
    secondaryColor: '#1a1a28',
    tertiaryColor: '#141420',
    edgeLabelBackground: '#0c0c14',
    clusterBkg: '#141420',
    clusterBorder: '#3730a3',
    titleColor: '#c4b5fd',
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    edgeStroke: '#6366f1',
    nodeTextColor: '#eeeeff',
  },
  flowchart: { htmlLabels: true, curve: 'basis', padding: 16 },
  securityLevel: 'loose',
});

let diagramCounter = 0;

export default function MermaidDiagram({ diagram }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.85);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;
    const render = async () => {
      setLoading(true);
      setError(null);
      try {
        diagramCounter++;
        const id = `mermaid-d${diagramCounter}`;
        const { svg } = await mermaid.render(id, diagram);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            svgEl.style.maxWidth = '100%';
          }
        }
      } catch (e) {
        console.error(e);
        setError('Could not render diagram');
      }
      setLoading(false);
    };
    render();
  }, [diagram]);

  const controls = [
    { icon: ZoomOut, action: () => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2))), tip: 'Zoom out' },
    { icon: Maximize2, action: () => setZoom(0.85), tip: 'Reset' },
    { icon: ZoomIn, action: () => setZoom(z => Math.min(2.2, +(z + 0.15).toFixed(2))), tip: 'Zoom in' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          Architecture Diagram
        </p>
        <div className="flex items-center gap-1">
          {controls.map(({ icon: Icon, action, tip }) => (
            <motion.button
              key={tip}
              title={tip}
              onClick={action}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                e.currentTarget.style.color = 'var(--accent-bright)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <Icon size={12} strokeWidth={2} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Diagram box */}
      <div
        className="rounded-2xl overflow-auto relative"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,18,0.9) 0%, rgba(14,14,22,0.85) 100%)',
          border: '1px solid rgba(139,92,246,0.12)',
          maxHeight: '300px',
          minHeight: '120px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Corner glow decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
          background: 'radial-gradient(circle at top right, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none" style={{
          background: 'radial-gradient(circle at bottom left, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }} />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-32 gap-3"
            >
              <RefreshCw size={18} className="animate-spin" style={{ color: 'var(--accent-bright)' }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Rendering architecture…</p>
            </motion.div>
          ) : error ? (
            <motion.div key="err" className="flex items-center justify-center h-32">
              <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="diagram"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="p-4"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.22s ease',
              }}
            >
              <div ref={containerRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zoom badge */}
      <div className="flex justify-end">
        <span
          className="text-xs px-2 py-0.5 rounded-full mono"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            fontSize: '10px',
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}
