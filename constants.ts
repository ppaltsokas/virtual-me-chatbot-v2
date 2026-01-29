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
      description: `• Translate fast-changing client policies into production-ready labeling workflows,
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
      technologies: ["RLHF", "Trust & Safety", "Python", "Data Analysis", "SOP Development", "Quality Assurance", "Google Sheets", "Statistical Analysis", "Analytics", "Gemini API", "Prompt Engineering", "Model Evaluation"]
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
      credentialUrl: "https://media.licdn.com/dms/image/v2/D4D22AQE5yUTXeIlm7Q/feedshare-shrink_2048_1536/B4DZp_o36dGgAw-/0/1763078013451?e=1771459200&v=beta&t=6DqSSo_WlFVC0u-G_FgcFgTYRbj1M7Ly_oL-8W6uVVI"
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
    // ML Projects (DAMA61 Coursework) - Listed first
    {
      id: "proj-18",
      title: "HW1 Problem 1: Wine Quality Analysis",
      description: "Implemented linear regression models to analyze wine quality data. Explored feature engineering, model evaluation metrics, and cross-validation techniques on the wine quality dataset.",
      technologies: ["Scikit-learn", "Linear Regression", "Cross-Validation", "Feature Engineering", "Model Evaluation"],
      pdfPath: "ML_projects/HW1_Problem1/HW1_Problem1.pdf"
    },
    {
      id: "proj-19",
      title: "HW1 Problem 2: MNIST Classification",
      description: "Built classification models using SGDClassifier for MNIST digit recognition. Implemented data preprocessing, stratified splitting, and evaluated model performance with various metrics.",
      technologies: ["Scikit-learn", "SGDClassifier", "Classification", "MNIST", "Stratified Splitting"],
      pdfPath: "ML_projects/HW1_Problem2/HW1_Problem2.pdf"
    },
    {
      id: "proj-20",
      title: "HW2 Problem 1: Polynomial Regression",
      description: "Applied polynomial regression and learning curves to model non-linear sinusoidal data. Explored model complexity, overfitting, and regularization techniques.",
      technologies: ["Polynomial Regression", "Learning Curves", "Regularization", "Model Complexity", "Overfitting"],
      pdfPath: "ML_projects/HW2_Problem1/HW2_Problem1.pdf"
    },
    {
      id: "proj-21",
      title: "HW2 Problem 2: Breast Cancer Classification",
      description: "Implemented SVM classifiers (LinearSVC and SVC) for breast cancer classification. Applied feature scaling, hyperparameter tuning with GridSearchCV, and evaluated model performance.",
      technologies: ["SVM", "LinearSVC", "GridSearchCV", "Feature Scaling", "Classification"],
      pdfPath: "ML_projects/HW2_Problem2/HW2_Problem2.pdf"
    },
    {
      id: "proj-22",
      title: "HW3 Problem 1: Decision Trees & Ensembles",
      description: "Implemented Decision Trees, Gradient Boosting, and dimensionality reduction techniques on MNIST. Explored PCA for feature reduction and evaluated ensemble model performance.",
      technologies: ["Decision Trees", "Gradient Boosting", "PCA", "Dimensionality Reduction", "MNIST"],
      pdfPath: "ML_projects/HW3_Problem1/HW3_Problem1.pdf"
    },
    {
      id: "proj-23",
      title: "HW3 Problem 2: Ensemble Models & Semi-supervised Learning",
      description: "Applied ensemble methods (Random Forest, AdaBoost, Bagging) and semi-supervised learning on the Pima diabetes dataset. Evaluated model performance and compared different ensemble strategies.",
      technologies: ["Random Forest", "AdaBoost", "Bagging", "Semi-supervised Learning", "Ensemble Methods"],
      pdfPath: "ML_projects/HW3_Problem2/HW3_Problem2.pdf"
    },
    {
      id: "proj-24",
      title: "HW4 Problem 1: Neural Networks on Fashion MNIST",
      description: "Built and trained neural networks using TensorFlow/Keras on Fashion MNIST. Explored different feature subsets, network architectures, and hyperparameter optimization.",
      technologies: ["TensorFlow", "Keras", "Neural Networks", "Fashion MNIST", "Hyperparameter Tuning"],
      pdfPath: "ML_projects/HW4_Problem1/HW4_Problem1.pdf"
    },
    {
      id: "proj-25",
      title: "HW4 Problem 2: Overfitting Mitigation",
      description: "Explored strategies to mitigate overfitting in deep neural networks including dropout, regularization, and early stopping. Applied techniques to Fashion MNIST classification tasks.",
      technologies: ["Dropout", "Regularization", "Early Stopping", "Overfitting", "Deep Learning"],
      pdfPath: "ML_projects/HW4_Problem2/HW4_Problem2.pdf"
    },
    {
      id: "proj-26",
      title: "HW5 Problem 1: Clustering on MNIST",
      description: "Implemented and compared clustering algorithms (K-means, DBSCAN) on MNIST data. Applied dimensionality reduction with PCA and t-SNE for visualization and cluster evaluation.",
      technologies: ["K-means", "DBSCAN", "Clustering", "PCA", "t-SNE", "Unsupervised Learning"],
      pdfPath: "ML_projects/HW5_Problem1/HW5_Problem1.pdf"
    },
    {
      id: "proj-27",
      title: "HW5 Problem 2: Time Series Forecasting",
      description: "Built multilayer neural networks for time series forecasting on Monthly Mean Sunspots data. Implemented multi-step ahead forecasting and evaluated model performance on temporal data.",
      technologies: ["Time Series", "Neural Networks", "Forecasting", "Sunspots", "Temporal Analysis"],
      pdfPath: "ML_projects/HW5_Problem2/HW5_Problem2.pdf"
    },
    {
      id: "proj-28",
      title: "HW6 Problem 1: Autoencoders",
      description: "Implemented and evaluated autoencoder variants for image compression and reconstruction on Fashion MNIST. Compared different architectures and experimental setups for data compression.",
      technologies: ["Autoencoders", "Image Compression", "Fashion MNIST", "Reconstruction", "Deep Learning"],
      pdfPath: "ML_projects/HW6_Problem1/HW6_Problem1.pdf"
    },
    {
      id: "proj-29",
      title: "HW6 Problem 2: Generative Adversarial Networks",
      description: "Implemented GANs from scratch using TensorFlow to generate synthetic fashion item images. Trained generator and discriminator networks on Fashion MNIST data.",
      technologies: ["GANs", "Generative Models", "TensorFlow", "Fashion MNIST", "Image Generation"],
      pdfPath: "ML_projects/HW6_Problem2/HW6_Problem2.pdf"
    },
    // Data Science Projects - Listed after ML Projects
    {
      id: "proj-6",
      title: "Nobel Prizes Analysis",
      description: "Comprehensive data analysis of Nobel Prize winners, exploring trends, demographics, and patterns across different categories and time periods.",
      technologies: ["Python", "Pandas", "Data Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Nobel_Prizes_Analysis/Nobel_Prizes_Analysis.pdf",
      link: "https://github.com/ppaltsokas/Nobel_Prize_Analysis"
    },
    {
      id: "proj-7",
      title: "Space Missions Analysis",
      description: "Analysis of space agencies, launch costs evolution, and mission outcomes over decades. Extracted actionable insights from historical space launch data.",
      technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Data Analysis"],
      pdfPath: "Data_Science_projects/Space_Missions_Analysis/Space_Missions_Analysis.pdf",
      link: "https://github.com/ppaltsokas/The_Space_Race"
    },
    {
      id: "proj-8",
      title: "Movie Budget and Financial Records",
      description: "Analysis of movie budgets, box office performance, and financial records to identify patterns and correlations in the film industry.",
      technologies: ["Python", "Data Analysis", "Financial Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Movie_Budget_and_Financial_Records/Movie_Budget_and_Financial_Records.pdf",
      link: "https://github.com/ppaltsokas/Movie_Budgets_and_Financial_Performance"
    },
    {
      id: "proj-9",
      title: "Multivariable Regression and Valuation Model",
      description: "Built regression models to analyze and predict house prices using multiple variables, implementing valuation models for real estate data.",
      technologies: ["Python", "Regression", "Machine Learning", "Statistical Analysis"],
      pdfPath: "Data_Science_projects/Multivariable_Regression_and_House_Valuation_Model/Multivariable_Regression_and_House_Valuation_Model.pdf",
      link: "https://github.com/ppaltsokas/70s_Boston_House_Prices"
    },
    {
      id: "proj-10",
      title: "Handwashing and Deaths at Childbirth",
      description: "Historical data analysis examining the relationship between handwashing practices and mortality rates in childbirth, demonstrating the impact of medical hygiene.",
      technologies: ["Python", "Data Analysis", "Statistical Analysis", "Historical Data"],
      pdfPath: "Data_Science_projects/Handwashing_and_Deaths_ at_Childbirth/Handwashing and Deaths at Childbirth.pdf",
      link: "https://github.com/ppaltsokas/Handwashing_and_Death_at_Childbirth"
    },
    {
      id: "proj-11",
      title: "Fatal Force Analysis",
      description: "Data analysis project examining fatal force incidents, patterns, and trends in law enforcement data.",
      technologies: ["Python", "Data Analysis", "Statistical Analysis"],
      pdfPath: "Data_Science_projects/Fatal_Force/Fatal_Force.pdf"
    },
    {
      id: "proj-12",
      title: "Google Play Store App Analytics",
      description: "Comprehensive analysis of Google Play Store app data, exploring app categories, ratings, reviews, and market trends.",
      technologies: ["Python", "Pandas", "Data Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Google_Play_Store_App_Analytics/Google Play Store App Analytics.pdf"
    },
    {
      id: "proj-13",
      title: "Google Trends and Data Visualization",
      description: "Analysis of Google Trends data with advanced visualization techniques to identify patterns, seasonal trends, and search behavior insights.",
      technologies: ["Python", "Data Visualization", "Google Trends", "Time Series Analysis"],
      pdfPath: "Data_Science_projects/Google_Trends_and_Data_Visualisation/Google_Trends_and_Data_Visualisation.pdf"
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