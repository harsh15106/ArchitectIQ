import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import InputBar from './InputBox';
import ProgressStepper from './ProgressBar';
import { Bot, Brain } from 'lucide-react';

export default function ChatPanel({ messages, isTyping, currentStage, onSend, onChipSelect }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient orbs in chat area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb" style={{
          width: '400px', height: '400px',
          background: 'rgba(139,92,246,0.03)',
          top: '10%', left: '20%',
        }} />
        <div className="orb" style={{
          width: '300px', height: '300px',
          background: 'rgba(99,102,241,0.025)',
          bottom: '15%', right: '10%',
        }} />
      </div>

      {/* Progress stepper */}
      <ProgressStepper currentStage={currentStage} />

      {/* Chat header */}
      <div
        className="relative z-10 flex items-center gap-3 px-6 py-3.5"
        style={{
          background: 'rgba(8,8,13,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-ultra-subtle)',
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          <Brain size={15} style={{ color: 'var(--accent-bright)' }} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            System Design Assistant
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 4px var(--green)' }} />
            <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
              AI-powered · GPT-4 Architecture Engine
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: 'var(--green)',
              fontSize: '10px',
            }}
          >
            Online
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div
        className="relative z-10 flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-7">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onChipSelect={onChipSelect}
                isLast={i === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {/* Typing bubble */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.28 }}
                className="flex items-start gap-3"
              >
                {/* AI avatar mini */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a28, #1f1f30)',
                    border: '1px solid rgba(139,92,246,0.2)',
                  }}
                >
                  <Bot size={15} style={{ color: 'var(--accent-bright)' }} strokeWidth={1.8} />
                </div>
                <div
                  className="rounded-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26,26,40,0.9), rgba(20,20,32,0.85))',
                    border: '1px solid rgba(139,92,246,0.12)',
                    borderTopLeftRadius: '6px',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar — full-width sticky container */}
      <div
        className="relative z-20 w-full shrink-0"
        style={{
          background: 'rgba(8,8,13,0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-ultra-subtle)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <InputBar onSend={onSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
