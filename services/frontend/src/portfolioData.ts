export interface EvidenceMetric {
  value: string;
  label: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights?: string[];
  technologies: string[];
  secondary?: boolean;
}

export interface SelectedWork {
  title: string;
  description: string;
  technologies: string[];
  capabilities?: string[];
  evidence?: string[];
  link?: string;
}

export interface SkillGroup {
  name: string;
  summary: string;
  skills: string[];
}

export const PERSONAL_INFO = {
  name: 'Panagiotis Paltsokas',
  title: 'AI/ML Engineer',
  headline: 'Applied Machine Learning, Time-Series Systems & Federated/Edge AI',
  intro: [
    'I build end-to-end machine learning systems for real-world smart-city and IoT applications, working across data engineering, feature development, model training, evaluation, distributed learning, and deployable inference.',
    'At DOTSOFT, my work includes municipal parking forecasting, privacy-preserving federated learning, compact edge and browser models, and production-oriented ML pipelines built with Python, SQL, Docker, APIs, and relational databases.',
  ],
  email: 'ppaltsokas@gmail.com',
  location: 'Thessaloniki, GR',
  github: 'https://github.com/ppaltsokas',
  linkedin: 'https://linkedin.com/in/ppaltsokas',
  resume: 'https://drive.google.com/uc?export=download&id=1eFnqQbZt6Cj8YHXjcrKSMyYC2RuPZyVg',
} as const;

export const EVIDENCE: EvidenceMetric[] = [
  { value: '3M+', label: 'IoT sensor events processed' },
  { value: '20', label: 'Federated rounds validated' },
  { value: '2', label: 'Distributed municipal nodes' },
  { value: '~91%', label: 'Federated classification accuracy' },
  { value: 'Local', label: 'Browser & edge inference' },
];

export const PROFILE = [
  'AI/ML Engineer and Data Scientist with hands-on experience building end-to-end machine learning systems in Python and SQL, from ETL and feature engineering through model evaluation, inference, deployment, and monitoring. I work on real-world smart-city, time-series, IoT, federated learning, and edge AI use cases, with particular focus on reliable pipelines, reproducible experimentation, and production-oriented engineering for practical operational applications.',
];

export const ML_LIFECYCLE = [
  'Data ingestion',
  'Validation',
  'Feature engineering',
  'Modeling',
  'Evaluation',
  'Model packaging',
  'Inference',
  'Monitoring & technical validation',
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: 'AI/ML Engineer',
    company: 'DOTSOFT S.A.',
    period: 'February 2026 – Present',
    summary: 'Applied AI engineering for smart-city, IoT, federated, browser, and edge environments.',
    highlights: [
      'Develop end-to-end ML solutions for smart-city applications, spanning ETL, feature engineering, time-series modeling, evaluation, inference, and deployment-oriented workflows.',
      'Build federated and edge-AI demonstrators using Flower, Docker, ONNX, browser inference, and distributed clients across heterogeneous compute environments, validating latency, accuracy, privacy, and efficiency KPIs.',
      'Own experimentation and validation workflows, translating KPI requirements into reproducible benchmarks, technical evidence, reports, and deployment-oriented engineering decisions for stakeholders.',
    ],
    technologies: ['Python', 'SQL', 'PostgreSQL', 'MariaDB', 'Scikit-learn', 'Time Series', 'Flower', 'Federated Learning', 'ONNX', 'Docker', 'ML Pipelines', 'Edge AI'],
  },
  {
    role: 'AI Operations & Human Data',
    company: 'TaskUs',
    period: 'June 2024 – February 2026',
    summary: 'Supported human-data and AI operations through analytics, dashboarding, model-behavior analysis, and quality processes.',
    highlights: [
      'Built analytics views for label drift, policy hot-spots, engagement, and model-misalignment signals.',
      'Translated ambiguous requirements into clear rules, examples, and operational guidance with cross-functional teams.',
      'Contributed reliably to time-critical quality and operational initiatives.',
    ],
    technologies: ['Human Data', 'Analytics', 'Dashboarding', 'Model Evaluation', 'Quality Operations', 'Cross-functional Communication'],
  },
  {
    role: 'Mathematics Tutor',
    company: 'Self-Employed / Cramming Schools',
    period: 'September 2007 – Present',
    summary: 'Mathematics educator with extensive experience translating complex concepts into structured, understandable explanations. This background strengthened my analytical reasoning, stakeholder communication, mentoring, and ability to explain technical decisions to different audiences.',
    technologies: ['Mathematical Reasoning', 'Teaching', 'Communication', 'Mentoring'],
  },
  {
    role: 'Promotional Events Supervisor',
    company: 'PromoAction',
    period: 'June 2015 – September 2020 · Seasonal',
    summary: 'Coordinated promotional events, field teams, and structured data collection.',
    technologies: ['Team Coordination', 'Data Collection'],
    secondary: true,
  },
];

export const SELECTED_WORK: SelectedWork[] = [
  {
    title: 'Municipal Parking Forecasting Pipeline',
    description: 'Developed a production-oriented time-series machine learning workflow for municipal parking data, covering database extraction, validation, 15-minute feature generation, chronological model evaluation, baseline comparison, scheduled retraining, and multi-horizon inference.',
    capabilities: ['Large-scale IoT data processing', 'Temporal feature engineering', 'Chronological validation', 'Multi-horizon forecasting', 'Scheduled ML workflows'],
    technologies: ['Python', 'SQL', 'PostgreSQL', 'MariaDB', 'Pandas', 'Scikit-learn', 'Docker'],
  },
  {
    title: 'DARIUS Federated and Edge AI',
    description: 'Contributed to a privacy-preserving federated learning workflow for municipal parking classification. This validated applied R&D demonstrator trains a compact neural network across distributed city nodes, aggregates updates through Flower, and exports the global model for local browser and edge inference.',
    evidence: ['20 completed federated rounds', 'Two distributed clients', 'Approximately 91% final classification accuracy', 'Raw municipal feature rows remain local', 'Global model exported for local inference'],
    technologies: ['Python', 'Flower', 'Federated Learning', 'ONNX', 'TypeScript', 'WebAssembly', 'WebGPU', 'Docker'],
  },
  {
    title: 'Browser and Edge Inference Validation',
    description: 'Developed and evaluated local inference workflows using compact JSON and ONNX model artifacts. Validation included prediction parity, latency measurement, model-size verification, privacy inspection, model hashing, and reproducible evidence generation.',
    technologies: ['ONNX', 'ONNX Runtime', 'TypeScript', 'WebAssembly', 'WebGPU', 'Python'],
  },
  {
    title: 'Virtual Panos — Resume RAG Assistant',
    description: 'Built an AI portfolio assistant that answers questions about my professional experience and projects using resume-grounded retrieval, tool-based question handling, and a React interface.',
    technologies: ['React', 'FastAPI', 'Docker', 'Embeddings', 'RAG', 'Gemini API'],
    link: 'https://www.ppaltsokas.com',
  },
  {
    title: 'AI Photo Library — Multimodal Retrieval',
    description: 'Built an image indexing and semantic retrieval system that supports natural-language search over personal image collections using multimodal embeddings.',
    technologies: ['Python', 'Image Embeddings', 'Semantic Search', 'Multimodal AI'],
    link: 'https://github.com/ppaltsokas/ai-photo-manager',
  },
];

export const SKILLS: SkillGroup[] = [
  { name: 'Applied Machine Learning', summary: 'Models designed and evaluated against real operating conditions.', skills: ['Classification', 'Regression', 'Time-series forecasting', 'Feature engineering', 'Model selection', 'Chronological validation', 'Baseline design', 'Hyperparameter optimization', 'Error analysis', 'Model evaluation'] },
  { name: 'ML Systems Engineering', summary: 'Repeatable paths from source data to packaged inference.', skills: ['Modular Python', 'ETL pipelines', 'Training pipelines', 'Batch inference', 'APIs', 'Docker', 'Scheduled execution', 'Artifact management', 'Monitoring', 'Reproducible experimentation'] },
  { name: 'Federated and Edge AI', summary: 'Privacy-aware distributed training and compact local inference.', skills: ['Flower', 'FedAvg', 'Distributed evaluation', 'Privacy-preserving workflows', 'ONNX', 'ONNX Runtime', 'Browser inference', 'WebAssembly', 'WebGPU', 'Compact neural networks'] },
  { name: 'Data Engineering and Analytics', summary: 'Validated, analysis-ready IoT and relational data.', skills: ['Python', 'SQL', 'PostgreSQL', 'MariaDB', 'Pandas', 'NumPy', 'Data-quality validation', 'Temporal aggregation', 'IoT data processing', 'Statistical analysis'] },
  { name: 'Generative AI', summary: 'Grounded retrieval and tool-enabled AI applications.', skills: ['Retrieval-augmented generation', 'Embeddings', 'Semantic search', 'Tool calling', 'Agentic workflows', 'Gemini API', 'Hugging Face', 'LlamaIndex'] },
  { name: 'Developer Tools', summary: 'Tools used to develop, validate, and ship systems.', skills: ['Git', 'Docker', 'FastAPI', 'React', 'Postman', 'PyCharm', 'Cursor', 'Jupyter'] },
];
