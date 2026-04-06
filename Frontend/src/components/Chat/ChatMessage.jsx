import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';

function formatTime(date) {
  return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(date);
}

/* ── Typing Indicator ── */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-4">
      <div className="w-1.5 h-1.5 rounded-full dot-1" style={{ background: 'var(--accent)' }} />
      <div className="w-1.5 h-1.5 rounded-full dot-2" style={{ background: 'var(--indigo)' }} />
      <div className="w-1.5 h-1.5 rounded-full dot-3" style={{ background: 'var(--blue)' }} />
    </div>
  );
}

/* ── Markdown renderer ── */
function MarkdownContent({ content }) {
  return (
    <div className="flex flex-col gap-2.5">
      {content.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        const html = line
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c4b5fd;font-weight:600">$1</strong>')
          .replace(/`(.*?)`/g, '<code style="background:rgba(139,92,246,0.15);padding:2px 6px;border-radius:4px;font-size:0.82em;color:#a78bfa">$1</code>');
        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
          const text = line.replace(/^[\s\-•]+/, '');
          const htmlText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c4b5fd;font-weight:600">$1</strong>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(139,92,246,0.15);padding:2px 6px;border-radius:4px;font-size:0.82em;color:#a78bfa">$1</code>');
          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-bright)', opacity: 0.7 }} />
              <p dangerouslySetInnerHTML={{ __html: htmlText }} style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.875rem' }} />
            </div>
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: html }}
            style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.875rem' }} />
        );
      })}
    </div>
  );
}

/* ── Quick Chips ── */
function QuickChips({ chips, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="flex flex-wrap gap-2.5 pl-12 pt-2.5"
    >
      {chips.map((chip, i) => (
        <motion.button
          key={chip}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28 + i * 0.04 }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(chip)}
          className="relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 overflow-hidden group"
          style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.22)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.18)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.55)';
            e.currentTarget.style.color = '#c4b5fd';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span className="relative z-10">{chip}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ── AI Avatar ── */
function AIAvatar() {
  return (
    <div className="relative shrink-0 mt-0.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1a28 0%, #1f1f30 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 0 16px rgba(139,92,246,0.12)',
        }}
      >
        <Bot size={16} style={{ color: 'var(--accent-bright)' }} strokeWidth={1.8} />
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0c0c14]"
        style={{ background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }} />
    </div>
  );
}

/* ── User Avatar ── */
function UserAvatar() {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
      style={{
        background: 'linear-gradient(135deg, #5b21b6, #4338ca)',
        boxShadow: '0 2px 10px rgba(91,33,182,0.4)',
      }}
    >
      <User size={15} color="#fff" strokeWidth={2} />
    </div>
  );
}

/* ── Message Bubble ── */
function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser ? <UserAvatar /> : <AIAvatar />}

      <div className={`flex flex-col gap-2 ${isUser ? 'items-end max-w-[65%]' : 'items-start max-w-[78%]'}`}>
        {isUser ? (
          /* User bubble */
          <div
            className="px-5 py-3.5 rounded-2xl text-sm"
            style={{
              background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 50%, #4338ca 100%)',
              color: '#fff',
              borderTopRightRadius: '6px',
              boxShadow: '0 4px 20px rgba(91,33,182,0.35), 0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              lineHeight: '1.7',
              fontSize: '0.875rem',
            }}
          >
            {message.content}
          </div>
        ) : (
          /* AI bubble */
          <div
            className="px-6 py-5 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,40,0.9) 0%, rgba(20,20,32,0.85) 100%)',
              border: '1px solid rgba(139,92,246,0.14)',
              borderTopLeftRadius: '6px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.04) 0%, transparent 60%)',
              }}
            />
            <div className="relative z-10">
              <MarkdownContent content={message.content} />
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Export ── */
export default function ChatMessage({ message, onChipSelect, isLast }) {
  return (
    <div className="flex flex-col gap-4">
      <MessageBubble message={message} />
      {isLast && message.chips && (
        <QuickChips chips={message.chips} onSelect={onChipSelect} />
      )}
    </div>
  );
}
