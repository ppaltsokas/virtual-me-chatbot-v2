import { ResumeData } from './types';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "Panagiotis Paltsokas",
    title: "Data Scientist / AI Trust & Safety",
    bio: "I am a Data Scientist with a strong foundation in AI/ML, currently working in Trust & Safety/RLHF to fine-tune flagship conversational AI assistants. A mathematician turned AI practitioner, I combine deep mathematical understanding with solid ML fundamentals. I pivot quickly, contribute to calibrations for international teams, and thrive on building reliable, insight-driven workflows.",
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
      description: "Translating fast-changing client policies into production-ready labeling and fine-tuning conversational AI. I participate in calibrations, resolve edge cases, and provide structured feedback on model outputs to improve accuracy and safety. I support team analytics and identify trends in model–policy misalignment to guide targeted improvements. I have completed internal academies in Team Leadership and Data Science and have played a key role in winning new client work through rapid pilots under short notice.",
      technologies: ["RLHF", "Python", "Data Analysis", "SOP Development", "Quality Assurance"]
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
      id: "proj-4",
      title: "Virtual Persona CV",
      description: "This site! A React application featuring a Gemini-powered AI chatbot (Agent) that tools your questions and answers them based on my actual resume data and tone.",
      technologies: ["React", "Gemini API", "FastAPI", "Prompt Engineering"]
    },
    {
      id: "proj-5",
      title: "RAG Demo (afm_demo)",
      description: "A FastAPI + retrieval workflow application featuring local and containerized development environments and CI cleanup.",
      technologies: ["FastAPI", "RAG", "Docker", "Google Cloud Run"]
    },
    {
      id: "proj-6",
      title: "Nobel Prizes Analysis",
      description: "Comprehensive data analysis of Nobel Prize winners, exploring trends, demographics, and patterns across different categories and time periods.",
      technologies: ["Python", "Pandas", "Data Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Nobel_Prizes_Analysis.pdf"
    },
    {
      id: "proj-7",
      title: "Space Missions Analysis",
      description: "Analysis of space agencies, launch costs evolution, and mission outcomes over decades. Extracted actionable insights from historical space launch data.",
      technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Data Analysis"],
      pdfPath: "Data_Science_projects/Space_Missions_Analysis.pdf"
    },
    {
      id: "proj-8",
      title: "Movie Budget and Financial Records",
      description: "Analysis of movie budgets, box office performance, and financial records to identify patterns and correlations in the film industry.",
      technologies: ["Python", "Data Analysis", "Financial Analysis", "Visualization"],
      pdfPath: "Data_Science_projects/Movie_Budget_and_Financial_Records.pdf"
    },
    {
      id: "proj-9",
      title: "Multivariable Regression and Valuation Model",
      description: "Built regression models to analyze and predict house prices using multiple variables, implementing valuation models for real estate data.",
      technologies: ["Python", "Regression", "Machine Learning", "Statistical Analysis"],
      pdfPath: "Data_Science_projects/Multivariable_Regression_and_Valuation_Model.pdf"
    },
    {
      id: "proj-10",
      title: "Handwashing and Deaths at Childbirth",
      description: "Historical data analysis examining the relationship between handwashing practices and mortality rates in childbirth, demonstrating the impact of medical hygiene.",
      technologies: ["Python", "Data Analysis", "Statistical Analysis", "Historical Data"],
      pdfPath: "Data_Science_projects/Handwashing and Deaths at Childbirth.pdf"
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