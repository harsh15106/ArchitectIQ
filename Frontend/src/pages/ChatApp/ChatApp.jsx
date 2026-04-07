import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Columns2, LayoutPanelLeft, Layers, Sparkles, Cpu, Search, Zap, 
  CheckCircle2, ChevronRight, XCircle, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { MULTI_DESIGNS, CLARIFICATION_QUESTIONS, EXAMPLE_PROMPTS } from '../../data/mockData';
import { startDesignSession, answerDesignQuestions } from '../../lib/api';
import WorkspaceInput from './WorkspaceInput';
import DesignCard from './DesignCard';
import InsightsPanel from './InsightsPanel';
import './ChatApp.css';

export default function ChatApp() {
  const navigate = useNavigate();
  const [step, setStep] = useState('IDLE'); // IDLE | CLARIFY | GENERATING | RESULTS
  const [prompt, setPrompt] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Auth & Session Logic (Backend Logic - Keeping Remote)
  const [sessionId, setSessionId] = useState(null);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [dynamicDesign, setDynamicDesign] = useState(null);
  const [answers, setAnswers] = useState({});

  // Luxury UI States (Priority: Mine)
  const [activeTabId, setActiveTabId] = useState('scalable');
  const [isComparison, setIsComparison] = useState(false);
  const [isInsightsManualOpen, setIsInsightsManualOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  
  const sidebarRef = useRef(null);

  // Resizing Logic (Priority: Mine)
  const startResizing = useCallback((mouseDownEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing) {
      const minWidth = 280;
      const maxWidth = 600;
      const newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const activeDesign = dynamicDesign || MULTI_DESIGNS.find(d => d.id === activeTabId);

  // Backend Flow (Keeping Remote Logic)
  const handleStartClarification = async (text) => {
    if (!text.trim()) return;
    setPrompt(text);
    setStep('GENERATING');
    try {
      const res = await startDesignSession(text);
      setSessionId(res.session_id);
      setDynamicQuestions(res.questions.map((qObj, idx) => ({
        id: `q${idx}`,
        question: typeof qObj === 'string' ? qObj : qObj.question,
        options: qObj.options || ['Yes', 'No', 'Standard', 'Pro'] 
      })));
      setStep('CLARIFY');
      setCurrentQuestionIndex(0);
    } catch(err) {
      console.error(err);
      setStep('IDLE');
    }
  };

  const currentQuestionsList = dynamicQuestions.length > 0 ? dynamicQuestions : CLARIFICATION_QUESTIONS;

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentQuestionsList[currentQuestionIndex].id]: option }));
    if (currentQuestionIndex < currentQuestionsList.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
    } else {
      handleFinalGenerate();
    }
  };

  const handleFinalGenerate = async () => {
    setStep('GENERATING');
    try {
      const res = await answerDesignQuestions(sessionId, answers);
      const newDesign = {
        id: res.design_id,
        label: 'Gemini AI',
        name: 'Calculated Architecture',
        badge: 'AI Generated',
        badgeColor: 'purple',
        summary: res.architecture.scalability_notes + " " + res.architecture.security_notes,
        components: res.architecture.components.map(c => ({
          name: c.name, role: c.purpose, tech: c.type
        })),
        techStack: [res.architecture.tech_stack?.frontend, res.architecture.tech_stack?.backend, res.architecture.tech_stack?.database].filter(Boolean),
        pros: ['Intelligent logic', 'Auto-validated'],
        cons: ['Generated context'],
        scores: { 
          scalability: res.validation?.scalability_score || 85, 
          performance: 90, 
          security: res.validation?.security_score || 80, 
          reliability: 88, 
          maintainability: 85 
        },
        diagram: res.mermaid,
        validation: res.validation,
        cost: res.cost
      };
      setDynamicDesign(newDesign);
      setActiveTabId(res.design_id);
      setStep('RESULTS');
      setIsComparison(false);
      setIsInsightsManualOpen(true);
    } catch(err) {
      console.error(err);
      setStep('IDLE');
    }
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
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0 }}>

          {/* ── Tab Bar (only when designs exist) ── */}
          {step === 'RESULTS' && (
            <div className="ws-tabbar">
              {dynamicDesign ? (
                <button
                  key={dynamicDesign.id}
                  className={`ws-tab active`}
                  onClick={() => setIsComparison(false)}
                >
                  {dynamicDesign.label}
                  <span className="ws-tab-badge">{dynamicDesign.badge}</span>
                </button>
              ) : (
                MULTI_DESIGNS.map(d => (
                  <button
                    key={d.id}
                    className={`ws-tab ${!isComparison && activeTabId === d.id ? 'active' : ''}`}
                    onClick={() => { setActiveTabId(d.id); setIsComparison(false); }}
                  >
                    {d.label}
                    <span className="ws-tab-badge">{d.badge}</span>
                  </button>
                ))
              )}

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
                style={{ right: isInsightsManualOpen ? `${panelWidth - 16}px` : '0px' }}
              >
                {isInsightsManualOpen ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              </button>
            )}

            <div className="ws-design-area">
              <div className="workspace-content-wrapper">
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
                          <span>Step {currentQuestionIndex + 1} of {currentQuestionsList.length}</span>
                          <div className="ws-progress-dots">
                             {currentQuestionsList.map((_, i) => (
                               <div key={i} className={`ws-progress-dot ${i <= currentQuestionIndex ? 'active' : ''}`} />
                             ))}
                          </div>
                        </div>

                        <h2 className="ws-empty-title" style={{ fontSize: '1.5rem', minHeight: '60px' }}>
                          {currentQuestionsList[currentQuestionIndex].question}
                        </h2>

                        <div className="ws-example-prompts" style={{ gap: '12px' }}>
                          {currentQuestionsList[currentQuestionIndex].options.map((opt, i) => (
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

                  {/* ── Results View ── */}
                  {step === 'RESULTS' && (
                    <AnimatePresence mode="popLayout">
                      {isComparison ? (
                        <motion.div
                          key="comparison"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="ws-comparison-grid"
                        >
                          {MULTI_DESIGNS.map(d => (
                            <DesignCard key={d.id} design={d} />
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key={activeDesign?.id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <DesignCard design={activeDesign} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Insights Side Panel (Persistent Drawer) ── */}
        <motion.div
          animate={{ x: (step === 'RESULTS' && isInsightsManualOpen) ? 0 : '100%' }}
          initial={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="right-panel"
          style={{ 
            width: `${panelWidth}px`,
            userSelect: isResizing ? 'none' : 'auto',
            display: step === 'RESULTS' ? 'flex' : 'none'
          }}
        >
          <div 
            className={`ws-resizer ${isResizing ? 'active' : ''}`} 
            onMouseDown={startResizing} 
          />
          <button 
            className={`insight-toggle ${!isInsightsManualOpen ? 'collapsed' : ''}`}
            onClick={() => setIsInsightsManualOpen(o => !o)}
          >
            {isInsightsManualOpen ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          </button>
          
          <div className="right-panel-body custom-scrollbar">
            <InsightsPanel design={activeDesign} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
