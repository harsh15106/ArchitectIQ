import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { DESIGN_STAGES } from '../../data/mockData';

export default function ProgressStepper({ currentStage }) {
  return (
    <div
      className="relative flex items-center justify-between px-8 py-4"
      style={{
        background: 'rgba(8,8,13,0.95)',
        borderBottom: '1px solid var(--border-ultra-subtle)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Background gradient sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(139,92,246,0.04) 0%, transparent 60%)',
        }}
      />

      {DESIGN_STAGES.map((stage, i) => {
        const isCompleted = i < currentStage;
        const isActive = i === currentStage;
        const isLast = i === DESIGN_STAGES.length - 1;

        return (
          <div key={stage.id} className="flex items-center flex-1 relative z-10">
            {/* Step node */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                {/* Glow ring for active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
                    }}
                  />
                )}
                <motion.div
                  animate={isActive ? { boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 18px rgba(139,92,246,0.75)', '0 0 8px rgba(139,92,246,0.45)'] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    background: isCompleted
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : isActive
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                      : 'var(--bg-elevated)',
                    border: isActive
                      ? '1.5px solid rgba(139,92,246,0.7)'
                      : isCompleted
                      ? '1.5px solid rgba(16,185,129,0.5)'
                      : '1.5px solid var(--border-default)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Check size={13} color="#fff" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="num"
                        className="text-xs font-bold"
                        style={{ color: isActive ? '#fff' : 'var(--text-muted)', fontSize: '11px' }}
                      >
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Label */}
              <div className="hidden sm:block">
                <motion.p
                  animate={{ color: isCompleted ? '#10b981' : isActive ? '#a78bfa' : '#3e3e5a' }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-semibold whitespace-nowrap tracking-wide"
                  style={{ fontSize: '11px' }}
                >
                  {stage.shortLabel}
                </motion.p>
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mx-3 relative" style={{ height: '2px' }}>
                {/* Track */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--border-subtle)' }}
                />
                {/* Fill */}
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.1 }}
                  style={{
                    background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                    boxShadow: isCompleted ? '0 0 8px rgba(139,92,246,0.5)' : 'none',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
