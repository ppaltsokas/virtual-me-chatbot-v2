import { ResumeData } from './types';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "Panagiotis Paltsokas",
    title: "Data Scientist | AI Operations & Human Data",
    bio: "Data Scientist who actively practices data science, analytics, and AI engineering through hands-on work, self-initiated projects, and continuous online training. I independently build dashboards, develop AI tools and automations, and analyze complex datasets to sharpen my technical skills. I am seeking a role that enables daily application and sustained upskilling in data, machine learning, and AI-driven problem solving.",
    email: "ppaltsokas@gmail.com",
    location: "Thessaloniki, GR",
    socials: {
      github: "github.com/ppaltsokas",
      linkedin: "linkedin.com/in/ppaltsokas"
    }
  },
  experience: [
    {
      id: "exp-1",
      role: "AI Operations | RLHF & Model Optimization",
      company: "TaskUs",
      period: "Jun 2024 - Ongoing",
      description: `Translate fast-changing client policies into production-ready labeling workflows,
delivering updates under tight timelines while keeping SLAs on track.
• Act as de-facto Subject Matter Expert, resolving complex edge cases and driving
cross-geo alignment through regular calibration sessions.
• Provide structured model feedback to improve safety coverage, policy precision, and
FP/FN balance, maintaining consistently top-tier QA performance.
• Build and maintain a live analytics dashboard tracking label drift, policy hot-spots,
chat engagement, and misalignment signals, used directly in calibrations.
• Partner with QAs, team leads, and clients to translate ambiguous requirements into
clear rules, examples, and SOP updates.
• Trusted contributor on high-stakes, time-critical initiatives due to rapid
comprehension, technical depth, and operational reliability.
• Continuous development through completion of internal Team Leader Preparatory
Academy and Data Science Preparatory Academy.`,
      technologies: ["RLHF", "Trust & Safety", "Python", "Data Analysis", "SOP Development", "Quality Assurance", "Google Sheets", "Statistical Analysis", "Analytics", "Blender", "Gemini API", "Prompt Engineering", "Model Evaluation"]
    },
    {
      id: "exp-2",
      role: "Mathematics Tutor",
      company: "Self-Employed / Cramming Schools",
      period: "Sep 2007 - Ongoing",
      description: "Helping students achieve academic goals by leveraging deep mathematical concepts and breaking complex ideas down to a manageable level. I have years of experience managing tight schedules, collaborating with colleagues, and delivering results in demanding environments.",
      technologies: ["Mathematics", "Teaching", "Communication", "Problem Solving"]
    },
    {
      id: "exp-3",
      role: "Promotional Events Supervisor",
      company: "PromoAction",
      period: "Jun 2015 - Sep 2020 (Seasonal)",
      description: "Oversaw promotional events, managed data collection, and collaborated on insight analysis to support data-driven decisions.",
      technologies: ["Team Leadership", "Data Collection", "Event Management"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "MSc, Data Science & Machine Learning",
      school: "Hellenic Open University",
      year: "2025",
      grade: "9.98/10"
    },
    {
      id: "edu-2",
      degree: "BSc, Mathematics",
      school: "University of Ioannina",
      year: "2014"
    }
  ],
  certifications: [
    {
      id: "cert-0",
      title: "AI Engineering Agentic Track – The Complete Agents Course by Ed Donner",
      issuer: "Udemy",
      year: "2025 (In Progress)",
      icon: "/autonomy.png",
      credentialUrl: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/"
    },
    {
      id: "cert-1",
      title: "Hugging Face AI Agents Course",
      issuer: "Hugging Face",
      year: "2025",
      icon: "/huggingface-icon.png",
      credentialUrl: "https://cas-bridge.xethub.hf.co/xet-bridge-us/6800ea554845e4edbca48825/12e11668ea3406870f808fff75513db533a2b4bf0e8687a86108ae7776b01e51?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260123%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260123T221550Z&X-Amz-Expires=3600&X-Amz-Signature=3d1991bc54e97bcb6f4826dbde5133dcb960ca17809f47fd3ba6f9e59770169e&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=652f0bb7821e30c4c03d9947&response-content-disposition=inline%3B+filename*%3DUTF-8%27%272025-11-13.png%3B+filename%3D%222025-11-13.png%22%3B&response-content-type=image%2Fpng&x-id=GetObject&Expires=1769210150&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc2OTIxMDE1MH19LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82ODAwZWE1NTQ4NDVlNGVkYmNhNDg4MjUvMTJlMTE2NjhlYTM0MDY4NzBmODA4ZmZmNzU1MTNkYjUzM2EyYjRiZjBlODY4N2E4NjEwOGFlNzc3NmIwMWU1MSoifV19&Signature=qcA5uDuH68Gv0-jSbxgki1JYnqBczp3ZpvBmQf2j%7ECF1%7EgqaPi-6FKgdJXkl-eTFhFj%7EJpUROyTUbnjXUUwt2xrvyblbSybg8vXYMGrI4ENm4VNRYB5K6h1MianKVfAXPdQ3gyRJZFLijuToooow5xCIDYTTRZGi78bpGjOwmKN3AqwuIos36s1Xj-9hRTPyitQkmrNfNKtUs08VHI%7Ex%7E3fCqXws35d-t33xPesXw1lVG9jjd3Qb3qkF6zESN3KYRPiny2m6hdVw3%7Edoy-h5aFvVo5eaZo5wLLpMn0RSJ%7Es7TuKCgY3ocWgnHj6M%7Ed0OqZYp0Luo4tsGeQvfwP9jug__&Key-Pair-Id=K2L8F4GPSG1IFC"
    },
    {
      id: "cert-2",
      title: "Large Language Models: Application Through Production",
      issuer: "edX & Databricks",
      year: "2024",
      icon: "/openai logo.png",
      credentialUrl: "https://courses.edx.org/certificates/c89a6cf2b6ed481c9e2539453aa4ac13"
    },
    {
      id: "cert-3",
      title: "100 Days of Code: The Complete Python Pro Bootcamp",
      issuer: "Udemy",
      year: "2024",
      icon: "/python_logo.png",
      credentialUrl: "https://udemy-certificate.s3.amazonaws.com/image/UC-c0bed077-fb93-4836-913f-59f27094d88e.jpg?v=1693949589000"
    },
    {
      id: "cert-4",
      title: "R Programming A-Z: R for Data Science",
      issuer: "Udemy",
      year: "2023",
      icon: "/Rlogo.png",
      credentialUrl: "https://udemy-certificate.s3.amazonaws.com/image/UC-7c067816-0391-42e0-a1d4-5c85b114b0e9.jpg?v=1689802685000"
    },
    {
      id: "cert-5",
      title: "15 Days of SQL: The Complete SQL Masterclass",
      issuer: "Udemy",
      year: "2023",
      icon: "/sqllogo.png",
      credentialUrl: "https://udemy-certificate.s3.amazonaws.com/image/UC-41633ad7-89c3-4161-8066-b391cd135f0d.jpg?v=1705661249000"
    }
  ],
  latestProjects: [
    {
      id: "latest-1",
      title: "Virtual-Me RAG Chatbot",
      description: "This site! A React application featuring a Gemini-powered AI chatbot (Agent) that tools your questions and answers them based on my actual resume data and tone.",
      link: "https://www.ppaltsokas.com",
      technologies: ["RAG", "FastAPI", "React", "Docker", "Embeddings", "Gemini API"]
    },
    {
      id: "latest-2",
      title: "AI Photo Library (Multimodal Retrieval)",
      description: "Created an image indexing and semantic search system allowing natural-language queries over personal photo collections.",
      technologies: ["Multimodal AI", "Image Embeddings", "Semantic Search", "Python"],
      link: "https://github.com/ppaltsokas/ai-photo-manager"
    },
    {
      id: "latest-3",
      title: "AI News Automation (n8n + Discord)",
      description: "Built a workflow that aggregates AI news from multiple sources, processes them, and publishes curated updates to a Discord server via bot integration.",
      technologies: ["n8n", "Discord API", "Automation", "Web Scraping"]
    },
    {
      id: "latest-4",
      title: "Hugging Face AI Agents (Applied)",
      description: "Designed agentic AI systems to tackle GAIA benchmark tasks, emphasizing complex reasoning, tool selection, retrieval-augmented generation (RAG), and answer verification. Implemented dynamic tool routing, fallback strategies, and constrained local inference to improve accuracy on adversarial, multi-modal questions.",
      technologies: ["AI Agents", "RAG", "Tool Calling", "LlamaIndex", "Hugging Face", "Agent Evaluation", "Python"],
      link: "https://huggingface.co/spaces/ppaltsokas/ppaltsokas_GAIA_agent/tree/main"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Generative AI (GANs & Autoencoders)",
      description: "Built and trained GANs on Fashion MNIST from scratch (TensorFlow/Keras), achieving a realistic generation capability with 0.68 discriminator accuracy. Implemented Sparse Autoencoders for data compression.",
      technologies: ["TensorFlow", "Keras", "GANs", "Autoencoders", "Python"]
    },
    {
      id: "proj-2",
      title: "Time Series Forecasting (Sunspots)",
      description: "Analyzed 270 years of sunspot data using FFT to identify the 11-year cycle. Compared MLP vs GRU models, demonstrating GRU's superior ability to handle long-term dependencies in sequence data.",
      technologies: ["RNN", "GRU", "Time Series", "FFT", "Matplotlib"]
    },
    {
      id: "proj-3",
      title: "Advanced Classification Pipelines",
      description: "Extensive analysis on MNIST & Breast Cancer datasets. Utilized SVMs (RBF vs Linear), PCA for dimensionality reduction, and Gradient Boosting (79% acc). Implemented semi-supervised Label Propagation.",
      technologies: ["Scikit-learn", "SVM", "PCA", "Gradient Boosting", "GridSearch"]
    },
    {
      id: "proj-5",
      title: "RAG Demo (afm_demo)",
      description: "A FastAPI + retrieval workflow application featuring local and containerized development environments and CI cleanup.",
      technologies: ["FastAPI", "RAG", "Docker", "Google Cloud Run"],
      link: "https://github.com/ppaltsokas/afm-demo"
    },
    {
      id: "proj-6",
      title: "Nobel Prizes Analysis",
      description: "Comprehensive data analysis of Nobel Prize winners, exploring trends, demographics, and patterns across different categories and time periods.",
      technologies: ["Python", "Pandas", "Data Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Nobel_Prizes_Analysis.pdf",
      link: "https://github.com/ppaltsokas/Nobel_Prize_Analysis"
    },
    {
      id: "proj-7",
      title: "Space Missions Analysis",
      description: "Analysis of space agencies, launch costs evolution, and mission outcomes over decades. Extracted actionable insights from historical space launch data.",
      technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Data Analysis"],
      pdfPath: "Data_Science_projects/Space_Missions_Analysis.pdf",
      link: "https://github.com/ppaltsokas/The_Space_Race"
    },
    {
      id: "proj-8",
      title: "Movie Budget and Financial Records",
      description: "Analysis of movie budgets, box office performance, and financial records to identify patterns and correlations in the film industry.",
      technologies: ["Python", "Data Analysis", "Financial Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Movie_Budget_and_Financial_Records.pdf",
      link: "https://github.com/ppaltsokas/Movie_Budgets_and_Financial_Performance"
    },
    {
      id: "proj-9",
      title: "Multivariable Regression and Valuation Model",
      description: "Built regression models to analyze and predict house prices using multiple variables, implementing valuation models for real estate data.",
      technologies: ["Python", "Regression", "Machine Learning", "Statistical Analysis"],
      pdfPath: "Data_Science_projects/Multivariable_Regression_and_Valuation_Model.pdf",
      link: "https://github.com/ppaltsokas/70s_Boston_House_Prices"
    },
    {
      id: "proj-10",
      title: "Handwashing and Deaths at Childbirth",
      description: "Historical data analysis examining the relationship between handwashing practices and mortality rates in childbirth, demonstrating the impact of medical hygiene.",
      technologies: ["Python", "Data Analysis", "Statistical Analysis", "Historical Data"],
      pdfPath: "Data_Science_projects/Handwashing and Deaths at Childbirth.pdf",
      link: "https://github.com/ppaltsokas/Handwashing_and_Death_at_Childbirth"
    },
    {
      id: "proj-11",
      title: "Fatal Force Analysis",
      description: "Data analysis project examining fatal force incidents, patterns, and trends in law enforcement data.",
      technologies: ["Python", "Data Analysis", "Statistical Analysis"],
      pdfPath: "Data_Science_projects/Fatal_Force.pdf"
    },
    {
      id: "proj-12",
      title: "Linear Models & Classification (DAMA61 WA1)",
      description: "Implemented and evaluated linear regression, logistic regression, and support vector machines. Explored regularization techniques (Ridge, Lasso) and compared model performance across different datasets with cross-validation.",
      technologies: ["Scikit-learn", "Linear Models", "SVM", "Regularization", "Cross-Validation"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_WA1.pdf"
    },
    {
      id: "proj-13",
      title: "Neural Networks & Deep Learning (DAMA61 WA2)",
      description: "Built and trained feedforward neural networks from scratch and using TensorFlow/Keras. Implemented backpropagation, explored different activation functions, and optimized hyperparameters. Applied to image classification tasks.",
      technologies: ["TensorFlow", "Keras", "Neural Networks", "Backpropagation", "Hyperparameter Tuning"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_WA2.pdf"
    },
    {
      id: "proj-14",
      title: "Convolutional & Recurrent Neural Networks (DAMA61 WA3)",
      description: "Designed and implemented CNNs for image processing and RNNs/GRUs for sequence modeling. Applied transfer learning, explored architectures like VGG and ResNet, and handled sequential data with attention mechanisms.",
      technologies: ["CNNs", "RNNs", "GRU", "Transfer Learning", "Image Processing", "Sequence Modeling"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_WA3.pdf"
    },
    {
      id: "proj-15",
      title: "Advanced ML Techniques & Optimization (DAMA61 WA4)",
      description: "Explored advanced optimization algorithms (Adam, RMSprop), implemented ensemble methods, and applied dimensionality reduction techniques. Built end-to-end ML pipelines with proper preprocessing, feature engineering, and model deployment considerations.",
      technologies: ["Optimization", "Ensemble Methods", "Feature Engineering", "ML Pipelines", "Model Deployment"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_WA4.pdf"
    },
    {
      id: "proj-16",
      title: "Unsupervised Learning & Clustering (DAMA61 HW5)",
      description: "Implemented and compared clustering algorithms (K-means, DBSCAN, Hierarchical). Applied dimensionality reduction with PCA and t-SNE for visualization. Explored anomaly detection techniques and evaluated clustering performance metrics.",
      technologies: ["Clustering", "K-means", "DBSCAN", "PCA", "t-SNE", "Anomaly Detection"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_HW5_reduced_final.pdf"
    },
    {
      id: "proj-17",
      title: "Generative Models & Advanced Architectures (DAMA61 HW6)",
      description: "Implemented generative models including Variational Autoencoders (VAEs) and explored advanced neural architectures. Applied techniques for data generation, representation learning, and evaluated model interpretability and fairness.",
      technologies: ["VAEs", "Generative Models", "Representation Learning", "Model Interpretability"],
      pdfPath: "ML_projects/std163861_Paltsokas_DAMA61_HW6_full_size.pdf"
    }
  ],
  skills: [
    {
      name: "AI & Machine Learning",
      skills: ["Python", "TensorFlow", "Keras", "Scikit-learn", "Hugging Face", "RLHF", "LLMs", "RAG", "GANs", "RNNs", "CNNs", "Ensemble Methods", "Feature Engineering", "Prompt Engineering"]
    },
    {
      name: "Data Science & Viz",
      skills: ["Pandas", "NumPy", "SQL", "Matplotlib", "Seaborn", "Power BI", "PCA", "Statistical Analysis"]
    },
    {
      name: "DevOps & Cloud",
      skills: ["Docker", "FastAPI", "Git", "Google Cloud Run", "Railway", "CI/CD", "Jupyter", "PyCharm", "Cursor"]
    },
    {
      name: "Languages",
      skills: ["Greek (Native)", "English (C2)", "French (B2)"]
    }
  ]
};

export const INITIAL_CHAT_MESSAGE = `Hi! I'm Panos's virtual persona. You can ask me about my Generative AI projects (GANs), my Time Series analysis on Sunspots, or my experience in RLHF at TaskUs. How can I help?`;