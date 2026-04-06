import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns2, LayoutPanelLeft, Layers, Sparkles, Cpu, Search, Zap } from 'lucide-react';
import { MULTI_DESIGNS } from '../../data/mockData';
import WorkspaceInput from './WorkspaceInput';
import DesignCard from './DesignCard';
import InsightsPanel from './InsightsPanel';
import './ChatApp.css';

const EXAMPLE_PROMPTS = [
  'Design a social media feed for 50M users',
  'Build a ride-sharing backend with location tracking',
  'Create a PCI-compliant payment gateway',
  'Design a video streaming platform',
];

export default function ChatApp() {
  const [activeTabId, setActiveTabId] = useState('scalable');
  const [isComparison, setIsComparison] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const activeDesign = MULTI_DESIGNS.find(d => d.id === activeTabId);

  const handleGenerate = async (text) => {
    setPrompt(text);
    setIsGenerating(true);
    setIsGenerated(false);
    await new Promise(r => setTimeout(r, 2200));
    setIsGenerating(false);
    setIsGenerated(true);
    setActiveTabId('scalable');
    setIsComparison(false);
  };

  return (
    <div className="workspace-root">
      {/* ── Compact Top Input ── */}
      <section className="ws-input-bar">
        <div className="ws-input-wrap">
          <Search size={16} className="ws-input-icon" />
          <input 
            type="text" 
            placeholder="Describe your system requirements..."
            className="ws-input-field" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
          />
        </div>
        <button 
          className="ws-generate-btn" 
          onClick={() => handleGenerate(prompt)}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? <Sparkles size={16} className="animate-spin" /> : <Zap size={16} />}
          <span>{isGenerating ? 'Generating...' : 'Architect System'}</span>
        </button>
      </section>

      {/* ── Main workspace row ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0 }}>

        {/* ── Central design area ── */}
        <div className="workspace-root" style={{ borderRight: '1px solid var(--border)' }}>

          {/* ── Tab Bar (only when designs exist) ── */}
          {isGenerated && (
            <div className="ws-tabbar">
              {MULTI_DESIGNS.map(d => (
                <button
                  key={d.id}
                  className={`ws-tab ${!isComparison && activeTabId === d.id ? 'active' : ''}`}
                  onClick={() => { setActiveTabId(d.id); setIsComparison(false); }}
                >
                  {d.label}
                  <span className="ws-tab-badge">{d.badge}</span>
                </button>
              ))}

              <div style={{ marginLeft: 'auto' }}>
                <button
                  className={`ws-tab ${isComparison ? 'active' : ''}`}
                  onClick={() => setIsComparison(c => !c)}
                >
                  <Columns2 size={13} />
                  <span>{isComparison ? 'Single View' : 'Compare All'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Content Area ── */}
          <div className="ws-content-area custom-scrollbar">
            <div className="ws-design-area">
              <div className="ws-max-container">
                <AnimatePresence mode="wait">
                  {/* ── Initial Empty State ── */}
                  {!isGenerated && !isGenerating && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="ws-empty-state"
                    >
                      <div className="ws-empty-icon-wrap">
                        <Cpu size={24} strokeWidth={2.5} />
                      </div>
                      <h2 className="ws-empty-title">AI System Designer</h2>
                      <p className="ws-empty-subtitle">
                        ArchitectIQ designs scalable systems for you. Enter requirements above to generate architecture options with expert validation.
                      </p>
                      <div className="ws-example-prompts">
                        {EXAMPLE_PROMPTS.map((p, i) => (
                          <button key={i} className="ws-example-chip" onClick={() => handleGenerate(p)}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Generation Logic Visible ── */}
                  {isGenerating && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ws-empty-state"
                    >
                      <div className="ws-empty-icon-wrap">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                          <Sparkles size={24} />
                        </motion.div>
                      </div>
                      <h2 className="ws-empty-title">Generating Options</h2>
                      <p className="ws-empty-subtitle">Designing for: "{prompt}"</p>
                    </motion.div>
                  )}

                  {/* ── Comparison View ── */}
                  {isGenerated && isComparison && (
                    <motion.div
                      key="comparison"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ws-comparison-grid"
                    >
                      {MULTI_DESIGNS.map(d => (
                        <div key={d.id} className="ws-comparison-col">
                          <DesignCard design={d} />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* ── Active Single Tab ── */}
                  {isGenerated && !isComparison && activeDesign && (
                    <motion.div
                      key={activeDesign.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ws-single-view"
                    >
                      <DesignCard design={activeDesign} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Insights Side Panel ── */}
        <InsightsPanel design={isGenerated ? activeDesign : null} />
      </div>
    </div>
  );
}
