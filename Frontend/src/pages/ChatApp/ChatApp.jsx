import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns2, LayoutPanelLeft, Layers, Sparkles, Cpu, Search, Zap, CheckCircle2, ChevronRight, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const [step, setStep] = useState('IDLE'); // 'IDLE' | 'CLARIFY' | 'GENERATING' | 'RESULTS'
  const [prompt, setPrompt] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [panelWidth, setPanelWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [isInsightsManualOpen, setIsInsightsManualOpen] = useState(true);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 280 && newWidth <= 500) {
        setPanelWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const CLARIFICATION_QUESTIONS = [
    {
      id: 'scale',
      question: 'What is the expected scale of your users?',
      options: ['Low (1k - 10k)', 'Medium (100k - 500k)', 'High (1M+)', 'Global (10M+)'],
    },
    {
      id: 'type',
      question: 'What is the primary system type?',
      options: ['Real-time / Latency sensitive', 'Batch processing', 'Hybrid', 'Static Cache heavy'],
    },
    {
      id: 'priority',
      question: 'What is your architectural priority?',
      options: ['Scalability', 'Security', 'Cost Efficiency', 'Developer Speed'],
    },
    {
      id: 'tech',
      question: 'Do you have a specific tech preference?',
      options: ['Cloud Native (AWS/GCP)', 'Serverless', 'On-Prem / Kubernetes', 'Managed Services'],
    }
  ];

  const activeDesign = MULTI_DESIGNS.find(d => d.id === activeTabId);

  const handleStartClarification = (text) => {
    if (!text.trim()) return;
    setPrompt(text);
    setStep('CLARIFY');
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [CLARIFICATION_QUESTIONS[currentQuestionIndex].id]: option }));
    if (currentQuestionIndex < CLARIFICATION_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
    } else {
      handleFinalGenerate();
    }
  };

  const handleFinalGenerate = async () => {
    setStep('GENERATING');
    await new Promise(r => setTimeout(r, 2200));
    setStep('RESULTS');
    setActiveTabId('scalable');
    setIsComparison(false);
    setIsInsightsManualOpen(true); // Auto-open when new results arrive
  };

  const handleSkip = () => {
    handleFinalGenerate();
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
            onKeyDown={(e) => e.key === 'Enter' && handleStartClarification(prompt)}
          />
        </div>
        <button 
          className="ws-generate-btn" 
          onClick={() => handleStartClarification(prompt)}
          disabled={step === 'GENERATING' || !prompt.trim()}
        >
          {step === 'GENERATING' ? <Sparkles size={16} className="animate-spin" /> : <Zap size={16} />}
          <span>{step === 'GENERATING' ? 'Generating...' : 'Architect System'}</span>
        </button>
      </section>

      {/* ── Main workspace row ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0 }}>

        {/* ── Central design area ── */}
        <div className="workspace-root" style={{ borderRight: '1px solid var(--border)' }}>

          {/* ── Tab Bar (only when designs exist) ── */}
          {step === 'RESULTS' && (
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
          <div 
            className="ws-content-area custom-scrollbar"
            style={{ 
              paddingRight: (step === 'RESULTS' && isInsightsManualOpen) ? `${panelWidth}px` : 0,
              transition: isResizing ? 'none' : 'padding-right 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* ── Manual Insights Toggle (Floating Edge) ── */}
            {step === 'RESULTS' && (
              <button 
                className={`ws-panel-toggle-btn ${!isInsightsManualOpen ? 'collapsed' : ''}`}
                onClick={() => setIsInsightsManualOpen(o => !o)}
                style={{ right: isInsightsManualOpen ? `${panelWidth - 14}px` : '20px' }}
              >
                {isInsightsManualOpen ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              </button>
            )}

            <div className="ws-design-area">
              <div className="ws-max-container">
                <AnimatePresence mode="wait">
                  {/* ── Initial Empty State ── */}
                  {step === 'IDLE' && (
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
                          <button key={i} className="ws-example-chip" onClick={() => handleStartClarification(p)}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Clarification Phase (Active Thinking) ── */}
                  {step === 'CLARIFY' && (
                    <motion.div
                      key="clarify"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="ws-empty-state"
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', maxWidth: '500px' }}>
                        <div className="ws-progress-indicator">
                          <span>Step {currentQuestionIndex + 1} of {CLARIFICATION_QUESTIONS.length}</span>
                          <div className="ws-progress-dots">
                             {CLARIFICATION_QUESTIONS.map((_, i) => (
                               <div key={i} className={`ws-progress-dot ${i <= currentQuestionIndex ? 'active' : ''}`} />
                             ))}
                          </div>
                        </div>

                        <h2 className="ws-empty-title" style={{ fontSize: '1.5rem', minHeight: '60px' }}>
                          {CLARIFICATION_QUESTIONS[currentQuestionIndex].question}
                        </h2>

                        <div className="ws-example-prompts" style={{ gap: '12px' }}>
                          {CLARIFICATION_QUESTIONS[currentQuestionIndex].options.map((opt, i) => (
                            <button
                              key={i}
                              className="ws-example-chip"
                              style={{ padding: '14px 24px', fontSize: '0.875rem' }}
                              onClick={() => handleAnswer(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <button className="ws-skip-btn" onClick={handleSkip}>
                          Skip & Generate Architecture <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Generation Logic Visible ── */}
                  {step === 'GENERATING' && (
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
                      <p className="ws-empty-subtitle">Refining based on: "{prompt}"</p>
                    </motion.div>
                  )}

                  {/* ── Comparison View ── */}
                  {step === 'RESULTS' && isComparison && (
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
                  {step === 'RESULTS' && !isComparison && activeDesign && (
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

        {/* ── Insights Side Panel (Dynamic Drawer) ── */}
        <AnimatePresence>
          {step === 'RESULTS' && isInsightsManualOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="ws-insights-drawer-wrap"
              style={{ 
                width: `${panelWidth}px`,
                userSelect: isResizing ? 'none' : 'auto'
              }}
            >
              <div 
                className={`ws-resizer ${isResizing ? 'active' : ''}`} 
                onMouseDown={startResizing} 
              />
              <InsightsPanel design={activeDesign} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
