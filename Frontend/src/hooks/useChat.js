import { useState, useCallback, useRef } from 'react';
import { INITIAL_MESSAGES, QUICK_REPLY_SETS, DESIGN_STAGES, MOCK_DIAGRAM, VALIDATION_DATA } from '../data/mockData';

const AI_FLOW = [
  {
    content: "Got it! Let me understand the **scale requirements** first.\n\n**How many users do you expect this system to serve at peak?** This directly influences our infrastructure choices — from monolith vs microservices to database sharding strategy.",
    chips: 'scale',
    delay: 1100,
  },
  {
    content: "Perfect. Now let's talk about **response time expectations**.\n\nLatency requirements have a huge impact on caching strategy, database choice, and whether we need real-time infrastructure like WebSockets or SSE.\n\n**What kind of user-facing latency is acceptable?**",
    chips: 'latency',
    delay: 1300,
  },
  {
    content: "Excellent. Now, **data storage and consistency**.\n\nThe type of data you store — relational, document, time-series, or graph — determines your persistence layer. This also affects how we handle distributed consistency.\n\n**What's your primary data model?**",
    chips: 'storage',
    delay: 1200,
  },
  {
    content: "Great choice. One final question — **consistency model**.\n\nFor distributed systems, we must choose between consistency and availability (CAP theorem). This affects how we design replication, failover, and write paths.\n\n**Which tradeoff fits your product requirements?**",
    chips: 'consistency',
    delay: 1100,
  },
  {
    content: "I have everything I need. Generating your architecture now.\n\n**🏗️ Architecture Design Summary:**\n- **Pattern:** Microservices with API Gateway\n- **Caching:** Redis Cluster (L1) for sub-50ms reads\n- **Database:** PostgreSQL primary + read replicas\n- **Queue:** Kafka for async event processing\n- **CDN:** CloudFront for static and edge caching\n- **Observability:** Prometheus + Grafana + OpenTelemetry\n\nThe full diagram and validation report are now visible in the panel on the right →",
    chips: null,
    delay: 2200,
    triggerDiagram: true,
  },
];

export function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [diagram, setDiagram] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('New Session');
  const flowRef = useRef(0);

  const addMessage = useCallback((role, content, chips = null) => {
    const msg = { id: `msg-${Date.now()}-${Math.random()}`, role, content, chips, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    if (flowRef.current === 0) {
      setSessionTitle(text.slice(0, 42) + (text.length > 42 ? '…' : ''));
    }

    addMessage('user', text);

    const stageMap = [0, 1, 1, 2, 3];
    setCurrentStage(stageMap[Math.min(flowRef.current, stageMap.length - 1)]);

    const step = AI_FLOW[flowRef.current];
    if (!step) return;

    setIsTyping(true);
    await new Promise(r => setTimeout(r, step.delay));
    setIsTyping(false);

    if (step.triggerDiagram) {
      setCurrentStage(3);
      setDiagram(MOCK_DIAGRAM);
      setTimeout(() => setValidationData(VALIDATION_DATA), 1800);
    }

    addMessage('assistant', step.content, step.chips ? QUICK_REPLY_SETS[step.chips] : null);
    flowRef.current += 1;
  }, [addMessage, isTyping]);

  const newSession = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
    setCurrentStage(0);
    setDiagram(null);
    setValidationData(null);
    setSessionTitle('New Session');
    flowRef.current = 0;
  }, []);

  return { messages, isTyping, currentStage, diagram, validationData, sessionTitle, sendMessage, newSession, stages: DESIGN_STAGES };
}
