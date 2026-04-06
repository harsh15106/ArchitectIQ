import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Brain, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const MESSAGES = [
  "Analyzing requirements...",
  "Thinking through scale...",
  "Designing distributed architecture...",
  "Validating system constraints...",
  "Optimizing latency paths...",
  "Finalizing blueprint..."
];

export default function FuturisticLoader({ isVisible, messageIndex: customIndex }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible]);

  const activeMessage = customIndex !== undefined ? MESSAGES[customIndex % MESSAGES.length] : MESSAGES[index];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
        >
          {/* --- Ambient Background Glows --- */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.15, 0.1],
                x: [0, -40, 0],
                y: [0, 60, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-[100px]"
            />
          </div>

          <div className="relative flex flex-col items-center">
            {/* --- Central Animated Core --- */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              
              {/* Pulsing Outer Ring */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              />

              {/* Rotating Dashed Middle Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-dashed border-purple-500/40"
              />

              {/* Counter-Rotating Inner Node Ring */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-white/5 flex items-center justify-center"
              >
                 {/* Orbiting Dots */}
                 {[0, 120, 240].map((deg) => (
                    <div 
                      key={deg}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                      style={{ 
                        transform: `rotate(${deg}deg) translateY(-32px)`
                      }}
                    />
                 ))}
              </motion.div>

              {/* Brain/Core Icon with Glow */}
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 10px rgba(139,92,246,0.3)", "0 0 30px rgba(139,92,246,0.6)", "0 0 10px rgba(139,92,246,0.3)"],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1a1a28] border border-white/10"
              >
                <Brain size={24} className="text-indigo-400" strokeWidth={1.5} />
                {/* Micro Sparks */}
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles size={12} className="text-amber-400" />
                </motion.div>
              </motion.div>
            </div>

            {/* --- Dynamic Text --- */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                 <Zap size={14} className="text-amber-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333]">ArchitectAI processing</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={activeMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-bold tracking-tight text-white/90 drop-shadow-lg"
                >
                  {activeMessage}
                </motion.p>
              </AnimatePresence>

              {/* Progress Bar Segment */}
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-2 border border-white/[0.03]">
                 <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                 />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
