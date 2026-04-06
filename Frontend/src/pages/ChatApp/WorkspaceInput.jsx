import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ChevronRight } from 'lucide-react';
import './WorkspaceInput.css';

const EXAMPLE_PROMPTS = [
  'Design a Twitter-scale social media feed system',
  'Build a real-time ride-sharing backend for 5M users',
  'Create a payment gateway with PCI compliance',
  'Design a video streaming platform like YouTube',
];

export default function WorkspaceInput({ onGenerate, isGenerating }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!value.trim() || isGenerating) return;
    onGenerate(value.trim());
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fillExample = (prompt) => {
    setValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="ws-input-bar">
      <div className="ws-input-wrap">
        <Sparkles size={15} className="ws-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="ws-input-field"
          placeholder="Describe your system — e.g. 'Design a Twitter-scale social platform for 50M users'"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isGenerating}
        />
      </div>

      {/* Example chips — shown only when empty */}
      {!value && !isGenerating && (
        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
          {EXAMPLE_PROMPTS.slice(0, 2).map((p, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fillExample(p)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.625rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                display: 'none',
              }}
            />
          ))}
        </div>
      )}

      <motion.button
        whileHover={!isGenerating ? { scale: 1.03 } : {}}
        whileTap={!isGenerating ? { scale: 0.96 } : {}}
        onClick={handleSubmit}
        disabled={!value.trim() || isGenerating}
        className={`ws-generate-btn ${isGenerating ? 'generating' : ''}`}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Zap size={15} />
            </motion.div>
            Generating…
          </>
        ) : (
          <>
            <Zap size={15} />
            Generate Architectures
            <ChevronRight size={14} />
          </>
        )}
      </motion.button>

      {isGenerating && (
        <div className="ws-progress-bar">
          <div className="ws-progress-fill" />
        </div>
      )}
    </div>
  );
}
