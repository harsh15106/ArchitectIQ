import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  BarChart3, 
  Network,
  Database,
  Lock,
  Server,
  Activity,
  Cloud
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [aiStatus, setAiStatus] = useState("Generating architecture...");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const statusInterval = setInterval(() => {
      setAiStatus(prev => prev === "Generating architecture..." ? "Optimizing components..." : "Generating architecture...");
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(statusInterval);
    };
  }, []);

  const FEATURES = [
    {
      icon: <Zap size={24} />,
      title: "AI-Powered Generation",
      desc: "ArchitectIQ builds scalable systems from your high-level requirements in seconds, delivering production-ready architecture drafts."
    },
    {
      icon: <Layers size={24} />,
      title: "Visual Blueprints",
      desc: "Receive interactive Mermaid diagrams for every design, allowing you to visualize data flow and service relationships instantly."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Expert Validation",
      desc: "Every design is vetted against industry best practices with performance scoring, security auditing, and bottleneck detection."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Optimization Insights",
      desc: "Get deep-dive AI critiques that suggest specific cloud services, caching strategies, and database optimizations for your scale."
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* ── Dynamic Background ── */}
      <div className="landing-bg">
        <div className="landing-grid-overlay" />
        <div className="landing-glow glow-1" />
        <div className="landing-glow glow-2" />
        <div className="landing-glow glow-3" />
      </div>

      {/* ── Minimal Premium Navbar (Centered Brand) ── */}
      <nav className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-left">
           {/* Hamburger for mobile landing navigation if needed, or just spacers */}
           <div className="mobile-only">
             {/* We can add a simple menu if needed later */}
           </div>
        </div>
        
        <div className="nav-center">
          <button className="nav-brand-centered" onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            ARCHITECTIQ
          </button>
        </div>

        <div className="nav-right">
          <button className="nav-btn-login" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="nav-btn-signup" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* ── Hero Section (Centered Alignment) ── */}
      <section className="landing-section landing-hero" id="hero">
        <div className="max-container-centered">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-tagline"
          >
            Engineering Intelligence Redefined
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title-centered"
          >
            Design Systems <br /> At The <span className="gold-text">Speed Of Light.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-desc-centered"
          >
            ArchitectIQ is the high-end workspace for AI-powered system design. 
            Describe your requirements and generate production-grade architectures, 
            complete with diagrams, expert validation, and cost-optimization paths.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-cta-centered"
          >
            <button className="btn-primary-outline" onClick={() => navigate('/signup')}>
              Start Designing
            </button>
            <button className="btn-secondary-link" onClick={() => navigate('/login')}>
              View Demo
            </button>
          </motion.div>

          {/* ── Live System Diagram Animation ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hero-visual-container"
          >
            <div className="diagram-canvas">
              {/* AI Badge Overlay */}
              <div className="ai-status-overlay">
                <div className="ai-status-pulse" />
                <span className="ai-status-text">{aiStatus}</span>
              </div>

              {/* Connection SVG */}
              <svg className="diagram-svg" viewBox="0 0 800 480">
                {/* Gateway -> Services */}
                <path d="M400,80 L200,200" className="flow-line" />
                <path d="M400,80 L400,200" className="flow-line" />
                <path d="M400,80 L600,200" className="flow-line" />
                
                <path d="M400,80 L200,200" className="flow-glow" />
                <path d="M400,80 L400,200" className="flow-glow" />
                <path d="M400,80 L600,200" className="flow-glow" />

                {/* Core -> DB/Cache */}
                <path d="M400,240 L300,360" className="flow-line" />
                <path d="M400,240 L500,360" className="flow-line" />
                
                <path d="M400,240 L300,360" className="flow-glow" />
                <path d="M400,240 L500,360" className="flow-glow" />
              </svg>

              {/* Nodes Layer */}
              <div className="diagram-node" style={{ top: '60px', left: '50%', transform: 'translateX(-50%)' }}>
                <Cloud className="node-icon" size={16} />
                <span>API Gateway</span>
              </div>

              <div className="diagram-node" style={{ top: '200px', left: '200px', transform: 'translateX(-50%)' }}>
                <Lock className="node-icon" size={16} />
                <span>Auth Service</span>
              </div>

              <div className="diagram-node" style={{ top: '200px', left: '50%', transform: 'translateX(-50%)', borderColor: 'var(--accent)' }}>
                <Server className="node-icon" size={16} />
                <span>Core Analytics</span>
              </div>

              <div className="diagram-node" style={{ top: '200px', left: '600px', transform: 'translateX(-50%)' }}>
                <Activity className="node-icon" size={16} />
                <span>Event Bus</span>
              </div>

              <div className="diagram-node" style={{ bottom: '80px', left: '300px', transform: 'translateX(-50%)' }}>
                <Database className="node-icon" size={16} />
                <span>PostgreSQL</span>
              </div>

              <div className="diagram-node" style={{ bottom: '80px', left: '500px', transform: 'translateX(-50%)' }}>
                <Cpu className="node-icon" size={16} />
                <span>Redis Cluster</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="landing-section" id="features">
        <div className="max-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              Advanced Engineering. Simplified.
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              ArchitectIQ combines deep engineering expertise with generative AI to output reliable, scalable, and secure infrastructures.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="feature-card"
              >
                <div className="f-icon-box">{f.icon}</div>
                <h3 className="f-title">{f.title}</h3>
                <p className="f-desc">{f.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                  <span>LEARN MORE</span>
                  <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
