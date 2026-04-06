import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, UserPlus, Mail, Lock, User, 
  Briefcase, ArrowRight, Sparkles, Eye, EyeOff 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AI Architect'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name || 'AI Architect', formData.email, formData.password, formData.role);
      }
      
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            <LogIn size={14} />
            <span>Login</span>
          </button>
          <button 
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            <UserPlus size={14} />
            <span>Sign Up</span>
          </button>
          <div className={`auth-tab-indicator ${mode}`} />
        </div>

        <div className="auth-header">
          <div className="auth-logo">
             <Sparkles size={20} color="var(--accent)" />
          </div>
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{mode === 'login' ? 'Continue your architectural journey' : 'Join the elite system designers'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error-msg">{error}</div>}

          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div 
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="auth-signup-only"
              >
                <div className="auth-input-group">
                  <label><User size={12} /> Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="auth-input-group">
                  <label><Briefcase size={12} /> Your Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option>AI Architect</option>
                    <option>Senior Developer</option>
                    <option>DevOps Lead</option>
                    <option>CTO / Engineering Manager</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="auth-input-group">
            <label><Mail size={12} /> Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="auth-input-group">
            <label><Lock size={12} /> Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-input-group">
              <label><Lock size={12} /> Confirm Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  required 
                  placeholder="Confirm password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <div className="auth-actions">
            <button className="auth-submit-btn" disabled={isLoading} style={{ flex: 1 }}>
              {isLoading ? (
                <div className="auth-loader" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Enter Workspace' : 'Initialize Profile'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
            <span>New here? <button onClick={() => setMode('signup')}>Request Access</button></span>
          ) : (
            <span>Already specialized? <button onClick={() => setMode('login')}>Login</button></span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
