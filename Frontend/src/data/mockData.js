export const MOCK_HISTORY = [
  {
    id: '1',
    title: 'Twitter-like Social Platform',
    preview: 'High scale, real-time feed, 100M+ users',
    timestamp: '2h ago',
    stage: 4,
    tags: ['Microservices', 'Kafka', 'Redis'],
    rating: 4.8,
    complexity: 'High',
    isOptimized: true
  },
  {
    id: '2',
    title: 'Ride-sharing Backend',
    preview: 'Location tracking, driver matching, pricing engine',
    timestamp: 'Yesterday',
    stage: 3,
    tags: ['WebSockets', 'PostgreSQL', 'Redis'],
    rating: 4.5,
    complexity: 'Medium',
    isOptimized: false
  },
  {
    id: '3',
    title: 'URL Shortener Service',
    preview: 'Low latency, high read throughput, base62 encoding',
    timestamp: '3 days ago',
    stage: 4,
    tags: ['NoSQL', 'Caching', 'MVP'],
    rating: 4.9,
    complexity: 'Low',
    isOptimized: true
  },
  {
    id: '4',
    title: 'Video Streaming Platform',
    preview: 'CDN, transcoding, adaptive bitrate, DASH/HLS',
    timestamp: 'Last week',
    stage: 2,
    tags: ['S3', 'CloudFront', 'Transcoding'],
    rating: 4.2,
    complexity: 'Very High',
    isOptimized: false
  },
  {
    id: '5',
    title: 'E-commerce Inventory System',
    preview: 'Distributed locking, inventory sync, ACID compliance',
    timestamp: '2 weeks ago',
    stage: 4,
    tags: ['SQL', 'ACID', 'Strong Consistency'],
    rating: 4.7,
    complexity: 'High',
    isOptimized: true
  },
  {
    id: '6',
    title: 'Real-time Analytics Dashboard',
    preview: 'Stream processing, OLAP cubes, sub-second latency',
    timestamp: '1 month ago',
    stage: 4,
    tags: ['Clickhouse', 'Flink', 'Real-time'],
    rating: 5.0,
    complexity: 'High',
    isOptimized: true
  }
];

export const DESIGN_STAGES = [
  { id: 0, label: 'Understanding Requirements', shortLabel: 'Requirements', icon: '📋' },
  { id: 1, label: 'Analyzing Scale', shortLabel: 'Scale', icon: '📊' },
  { id: 2, label: 'Generating Architecture', shortLabel: 'Architecture', icon: '🏗️' },
  { id: 3, label: 'Validation Complete', shortLabel: 'Validation', icon: '✅' },
];

export const QUICK_REPLY_SETS = {
  scale: ['Low Scale (<1K users)', 'Medium Scale (~100K users)', 'High Scale (10M+ users)', 'Hyper Scale (1B+ users)'],
  budget: ['Low Budget', 'Moderate Budget', 'No Constraint'],
  consistency: ['Strong Consistency', 'Eventual Consistency', 'Availability First', 'Partition Tolerant'],
  latency: ['< 50ms (Real-time)', '< 200ms (Interactive)', '< 1s (Standard)', 'Batch Processing OK'],
  storage: ['Relational (SQL)', 'NoSQL / Document', 'Time-series DB', 'Graph Database', 'Multi-model'],
};

export const INITIAL_MESSAGES = [
  {
    id: 'init-welcome',
    role: 'assistant',
    content: "Hello! I'm your **AI System Design Assistant** — built to help you design scalable, resilient software architectures step by step.\n\nI'll ask you a series of focused questions to understand your needs, then generate a complete architecture diagram with validation and optimization insights.\n\n**To get started**, describe the system or product you want to build. Feel free to be high-level — we'll refine the details together.",
    timestamp: new Date(),
    chips: null,
  },
];

export const MOCK_DIAGRAM = `graph TB
    Client["🌐 Client Apps\\n(Web / Mobile)"]
    CDN["🌍 CDN\\n(CloudFront)"]
    LB["⚖️ Load Balancer\\n(AWS ALB)"]
    GW["🔧 API Gateway\\n(Rate Limiting / Auth)"]
    Auth["🔐 Auth Service\\n(JWT / OAuth2)"]
    Core["⚙️ Core Service\\n(Node.js Cluster)"]
    Cache["⚡ Redis Cluster\\n(L1 Cache)"]
    DB1["🗄️ Primary DB\\n(PostgreSQL)"]
    DB2["📋 Read Replica\\n(PostgreSQL)"]
    MQ["📨 Kafka\\n(Event Streaming)"]
    Worker["🔄 Worker Pool\\n(Background Jobs)"]
    S3["📦 Object Storage\\n(S3)"]
    Monitor["📈 Observability\\n(Prometheus + Grafana)"]

    Client -->|HTTPS| CDN
    CDN --> LB
    LB --> GW
    GW --> Auth
    GW --> Core
    Core --> Cache
    Core -->|Write| DB1
    DB1 -->|Replication| DB2
    Core -->|Read| DB2
    Core --> MQ
    MQ --> Worker
    Worker --> S3
    Core -.->|Metrics| Monitor

    style Client fill:#1e1b3a,stroke:#7c3aed,color:#e5e7eb
    style CDN fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style LB fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style GW fill:#1e1b3a,stroke:#3b82f6,color:#e5e7eb
    style Auth fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style Core fill:#5b21b6,stroke:#7c3aed,color:#fff
    style Cache fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style DB1 fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style DB2 fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style MQ fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style Worker fill:#1e1b3a,stroke:#6366f1,color:#e5e7eb
    style S3 fill:#1e1b3a,stroke:#ef4444,color:#e5e7eb
    style Monitor fill:#1e1b3a,stroke:#06b6d4,color:#e5e7eb
`;

export const VALIDATION_DATA = {
  issues: [
    {
      id: 1, severity: 'error',
      title: 'Single Point of Failure',
      description: 'The Auth Service has no redundancy. Deploy at least 2 replicas behind the load balancer with health checks.',
      component: 'Auth Service'
    },
    {
      id: 2, severity: 'warning',
      title: 'Cache Invalidation Undefined',
      description: 'No cache invalidation strategy is defined. Recommend TTL-based expiry combined with event-driven invalidation via Kafka.',
      component: 'Redis Cluster'
    },
  ],
  suggestions: [
    { id: 1, title: 'Circuit Breaker Pattern', description: 'Add circuit breakers (e.g., Hystrix/Resilience4j) between Core Service and DB to gracefully degrade under load.', impact: 'High' },
    { id: 2, title: 'PgBouncer Connection Pooling', description: 'Use PgBouncer to manage 10K+ concurrent DB connections efficiently, reducing PostgreSQL thread overhead.', impact: 'Medium' },
    { id: 3, title: 'OpenTelemetry Tracing', description: 'Integrate OpenTelemetry + Jaeger for distributed tracing across all microservices for faster debugging.', impact: 'Medium' },
  ],
  optimizations: [
    { id: 1, title: 'Kubernetes HPA', description: 'Configure Horizontal Pod Autoscaling on Core Service using CPU + custom Kafka consumer-lag metrics.', category: 'Scale' },
    { id: 2, title: 'DB Index Optimization', description: 'Add composite indexes on (user_id, created_at) for all high-frequency query paths — expected 8–12x read improvement.', category: 'Performance' },
    { id: 3, title: 'Async Fan-out via Kafka', description: 'Move email, push notifications, and analytics writes to Kafka consumers to unblock the main request thread.', category: 'Reliability' },
  ],
};

export const MOCK_SAVED_DESIGNS = [
  {
    id: 's1',
    title: 'Scalable E-commerce Core',
    summary: 'High-availability retail backbone with event-driven inventory sync and global CDN strategy.',
    tags: ['High Scale', 'Optimized', 'Kafka'],
    savedDate: 'Apr 12, 2024',
    modifiedTime: '2 days ago',
    isPinned: true,
    rating: 4.9,
    category: 'E-commerce'
  },
  {
    id: 's2',
    title: 'Real-time Chat Infra',
    summary: 'WebSocket-based notification system with Redis pub/sub and MongoDB message persistence.',
    tags: ['Real-time', 'MVP', 'WebSockets'],
    savedDate: 'Mar 28, 2024',
    modifiedTime: '1 week ago',
    isPinned: false,
    rating: 4.7,
    category: 'Communication'
  },
  {
    id: 's3',
    title: 'Payment Gateway V3',
    summary: 'PCI-compliant transaction pipeline with idempotent retries and multi-region failover.',
    tags: ['Optimized', 'Security', 'SQL'],
    savedDate: 'Feb 15, 2024',
    modifiedTime: '3 weeks ago',
    isPinned: true,
    rating: 5.0,
    category: 'Fintech'
  }
];

export const MULTI_DESIGNS = [
  {
    id: 'mvp',
    label: 'Option A',
    name: 'MVP / Monolithic',
    badge: 'Fastest to ship',
    badgeColor: 'green',
    summary: 'A well-structured monolithic application deployed on a single scalable instance. Ideal for rapid iteration, early-stage products, and teams under 10 engineers. Vertical scaling handles growth to ~50K users before requiring migration.',
    components: [
      { name: 'Single App Server', role: 'Handles all business logic', tech: 'Node.js / Django' },
      { name: 'PostgreSQL', role: 'Primary relational store', tech: 'Managed RDS' },
      { name: 'Redis', role: 'Session store & simple cache', tech: 'ElastiCache' },
      { name: 'S3 + CloudFront', role: 'Static assets & CDN', tech: 'AWS' },
      { name: 'PM2 / Gunicorn', role: 'Process management', tech: 'Multi-process' },
    ],
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'S3', 'CloudFront', 'Nginx', 'Docker'],
    pros: ['Simplest to develop & debug', 'No distributed system complexity', 'Fastest time-to-market', 'Low operational overhead'],
    cons: ['Single scaling bottleneck', 'Hard to scale specific components', 'Deployment risk is higher', 'Tech debt accumulates faster'],
    scores: { scalability: 45, performance: 70, security: 65, reliability: 60, maintainability: 75 },
    diagram: `graph TB
    Client["🌐 Client\\n(Web / Mobile)"]
    CDN["🌍 CDN\\n(CloudFront)"]
    App["⚙️ Monolith App\\n(Node.js)"]
    DB["🗄️ PostgreSQL\\n(Primary)"]
    Cache["⚡ Redis\\n(Cache/Sessions)"]
    S3["📦 S3\\n(Assets)"]

    Client -->|HTTPS| CDN
    CDN --> App
    App --> Cache
    App -->|Read/Write| DB
    App --> S3

    style Client fill:#1e1b3a,stroke:#7c3aed,color:#e5e7eb
    style CDN fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style App fill:#5b21b6,stroke:#7c3aed,color:#fff
    style DB fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style Cache fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style S3 fill:#1e1b3a,stroke:#ef4444,color:#e5e7eb`,
  },
  {
    id: 'scalable',
    label: 'Option B',
    name: 'Scalable / Microservices',
    badge: 'Recommended',
    badgeColor: 'purple',
    summary: 'A microservices architecture decomposed by domain, communicating via async events on Kafka. Each service scales independently. Designed for 1M+ concurrent users with full observability and zero-downtime deployment capability.',
    components: [
      { name: 'API Gateway', role: 'Auth, rate limiting, routing', tech: 'AWS API GW / Kong' },
      { name: 'Auth Service', role: 'JWT/OAuth2, RBAC', tech: 'Node.js' },
      { name: 'Core Services (N)', role: 'Domain-specific business logic', tech: 'Node.js / Go' },
      { name: 'Kafka', role: 'Async event streaming between services', tech: 'Confluent Cloud' },
      { name: 'PostgreSQL + Replicas', role: 'Per-service databases', tech: 'RDS Multi-AZ' },
      { name: 'Redis Cluster', role: 'Distributed caching & pub/sub', tech: 'ElastiCache' },
    ],
    techStack: ['Node.js', 'Go', 'Kafka', 'PostgreSQL', 'Redis', 'Kubernetes', 'Prometheus', 'Grafana'],
    pros: ['Independent service scaling', 'Fault isolation per domain', 'Multiple team autonomy', 'Technology flexibility per service'],
    cons: ['High operational complexity', 'Network latency between services', 'Distributed tracing required', 'More infrastructure cost'],
    scores: { scalability: 92, performance: 85, security: 80, reliability: 88, maintainability: 70 },
    diagram: `graph TB
    Client["🌐 Client Apps\\n(Web / Mobile)"]
    CDN["🌍 CDN\\n(CloudFront)"]
    LB["⚖️ Load Balancer\\n(AWS ALB)"]
    GW["🔧 API Gateway\\n(Rate Limiting / Auth)"]
    Auth["🔐 Auth Service\\n(JWT / OAuth2)"]
    Core["⚙️ Core Service\\n(Node.js Cluster)"]
    Cache["⚡ Redis Cluster\\n(L1 Cache)"]
    DB1["🗄️ Primary DB\\n(PostgreSQL)"]
    DB2["📋 Read Replica\\n(PostgreSQL)"]
    MQ["📨 Kafka\\n(Event Streaming)"]
    Worker["🔄 Worker Pool\\n(Background Jobs)"]
    Monitor["📈 Observability\\n(Prometheus + Grafana)"]

    Client -->|HTTPS| CDN
    CDN --> LB
    LB --> GW
    GW --> Auth
    GW --> Core
    Core --> Cache
    Core -->|Write| DB1
    DB1 -->|Replication| DB2
    Core -->|Read| DB2
    Core --> MQ
    MQ --> Worker
    Core -.->|Metrics| Monitor

    style Client fill:#1e1b3a,stroke:#7c3aed,color:#e5e7eb
    style CDN fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style LB fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style GW fill:#1e1b3a,stroke:#3b82f6,color:#e5e7eb
    style Auth fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style Core fill:#5b21b6,stroke:#7c3aed,color:#fff
    style Cache fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style DB1 fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style DB2 fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style MQ fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style Worker fill:#1e1b3a,stroke:#6366f1,color:#e5e7eb
    style Monitor fill:#1e1b3a,stroke:#06b6d4,color:#e5e7eb`,
  },
  {
    id: 'serverless',
    label: 'Option C',
    name: 'Optimized / Serverless',
    badge: 'Cost efficient',
    badgeColor: 'blue',
    summary: 'A fully serverless, event-driven architecture where you pay per execution. Zero infrastructure management. Scales from 0 to millions of requests automatically. Best for spiky/unpredictable traffic patterns and teams wanting to avoid Kubernetes complexity.',
    components: [
      { name: 'API Gateway + Lambda', role: 'Stateless request handlers', tech: 'AWS Lambda / Vercel' },
      { name: 'DynamoDB', role: 'Serverless NoSQL at any scale', tech: 'AWS DynamoDB' },
      { name: 'SQS / EventBridge', role: 'Async event routing', tech: 'AWS' },
      { name: 'Cognito', role: 'Managed auth & identity', tech: 'AWS Cognito' },
      { name: 'CloudFront + S3', role: 'Edge delivery & static hosting', tech: 'AWS' },
      { name: 'Step Functions', role: 'Orchestration of long workflows', tech: 'AWS' },
    ],
    techStack: ['AWS Lambda', 'DynamoDB', 'SQS', 'EventBridge', 'Cognito', 'CloudFront', 'Step Functions'],
    pros: ['Zero server management', 'Pay-per-execution pricing', 'Auto-scales to zero', 'Fastest deployment cycle'],
    cons: ['Cold start latency (~200-800ms)', 'Vendor lock-in (AWS)', 'Complex long-running job handling', 'Hard to debug locally'],
    scores: { scalability: 88, performance: 72, security: 85, reliability: 82, maintainability: 80 },
    diagram: `graph TB
    Client["🌐 Client\\n(Web / Mobile)"]
    CF["🌍 CloudFront\\n(Edge Cache)"]
    S3["📦 S3\\n(Static Hosting)"]
    APIGW["🔀 API Gateway\\n(HTTP Endpoints)"]
    Cognito["🔐 Cognito\\n(Auth / Identity)"]
    Lambda["⚡ Lambda Functions\\n(Stateless Handlers)"]
    DDB["🗄️ DynamoDB\\n(NoSQL / Auto-scale)"]
    SQS["📨 SQS\\n(Async Queue)"]
    StepFn["🔄 Step Functions\\n(Orchestration)"]
    EB["📡 EventBridge\\n(Event Bus)"]

    Client -->|HTTPS| CF
    CF --> S3
    CF --> APIGW
    APIGW --> Cognito
    APIGW --> Lambda
    Lambda --> DDB
    Lambda --> SQS
    Lambda --> EB
    SQS --> StepFn
    EB --> Lambda

    style Client fill:#1e1b3a,stroke:#7c3aed,color:#e5e7eb
    style CF fill:#1e1b3a,stroke:#4f46e5,color:#e5e7eb
    style S3 fill:#1e1b3a,stroke:#ef4444,color:#e5e7eb
    style APIGW fill:#1e1b3a,stroke:#3b82f6,color:#e5e7eb
    style Cognito fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style Lambda fill:#1c3a5b,stroke:#3b82f6,color:#fff
    style DDB fill:#1e1b3a,stroke:#10b981,color:#e5e7eb
    style SQS fill:#1e1b3a,stroke:#f59e0b,color:#e5e7eb
    style StepFn fill:#1e1b3a,stroke:#6366f1,color:#e5e7eb
    style EB fill:#1e1b3a,stroke:#06b6d4,color:#e5e7eb`,
  },
];

export const DESIGN_SCORES_LABELS = ['Scalability', 'Performance', 'Security', 'Reliability', 'Maintainability'];

export const CLARIFICATION_QUESTIONS = [
  {
    question: "What is your target user base for the initial launch?",
    options: ["< 10k users", "100k - 1M users", "1M+ users (High Scale)", "Internal team only"]
  },
  {
    question: "Which aspect is most critical for your application?",
    options: ["Low Latency", "Strong Consistency", "Highest Availability", "Cost Efficiency"]
  },
  {
    question: "What is your preferred primary database type?",
    options: ["Relational (PostgreSQL/MySQL)", "NoSQL (MongoDB/DynamoDB)", "NewSQL (CockroachDB)", "Not sure, need suggestion"]
  }
];

export const EXAMPLE_PROMPTS = [
  "Build a real-time food delivery app like UberEats",
  "Design a global video streaming platform like Netflix",
  "Create a secure payment gateway for a high-traffic e-commerce store",
  "Architect a distributed social media feed with sub-second latency"
];
