import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="px-5 pb-6 pt-3"
      style={{ background: 'transparent' }}
    >
      {/* Input container */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
        className="input-container relative flex items-end gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(20,20,32,0.85)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${focused ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: focused
            ? '0 0 0 3px rgba(139,92,246,0.1), 0 0 30px rgba(139,92,246,0.08), inset 0 1px 2px rgba(0,0,0,0.4)'
            : 'inset 0 1px 2px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        {/* Sparkle icon */}
        <div className="shrink-0 mb-1 transition-all duration-200">
          <Sparkles
            size={15}
            strokeWidth={1.8}
            style={{ color: focused ? 'var(--accent-bright)' : 'var(--text-muted)' }}
            className="transition-colors duration-300"
          />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="Describe the system you want to design…"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            maxHeight: '150px',
            overflowY: 'auto',
          }}
        />

        {/* Hint badges */}
        {!value && !focused && (
          <div className="shrink-0 mb-0.5 hidden sm:flex items-center gap-1.5">
            <span
              className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontSize: '10px',
              }}
            >
              <CornerDownLeft size={9} />
              Send
            </span>
          </div>
        )}

        {/* Send button */}
        <AnimatePresence>
          {canSend && (
            <motion.button
              key="send"
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 45 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                boxShadow: '0 2px 12px rgba(139,92,246,0.5), 0 0 0 1px rgba(139,92,246,0.3)',
              }}
            >
              <Send size={13} color="#fff" strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer hint */}
      <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
        ArchitectAI ·{' '}
        <span style={{ color: 'var(--text-tertiary)' }}>
          Shift+Enter for new line · Enter to send
        </span>
      </p>
    </div>
  );
}
