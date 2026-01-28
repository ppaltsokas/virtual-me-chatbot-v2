# HW2 Problem 2: Breast Cancer Classification with SVM - Technical Analysis

## Overview
This project implements Support Vector Machine (SVM) classifiers for binary classification of breast cancer data. The analysis explores linear SVMs with different regularization parameters and RBF kernel SVMs with hyperparameter tuning using GridSearchCV.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Breast Cancer Wisconsin dataset
- **Source**: `sklearn.datasets.load_breast_cancer()`
- **Sample Size**: 569 samples
- **Features**: 30 features (mean, standard error, worst values for 10 measurements)
- **Target**: Binary classification (0 = Malignant, 1 = Benign)

### Feature Selection
- **Selected Features**: 
  - "Worst Area" (index 7)
  - "Mean Concave Points" (index 23)
- **Rationale**: Two-feature analysis for visualization and understanding
- **Data Conversion**: NumPy array to Pandas DataFrame for EDA

### Data Exploration
- **Target Distribution**: Class balance analysis using count plots
- **Correlation Matrix**: Full 30-feature correlation heatmap with triangular mask
- **Statistical Summary**: Descriptive statistics for all features

### Data Preprocessing
- **Standardization**: StandardScaler applied to selected features
- **Purpose**: Ensure features contribute equally to SVM decision boundary
- **Visualization**: Scatter plot of standardized features colored by class

## Machine Learning Techniques

### Model Architectures

#### 1. Linear SVM (C=0.1)
- **Algorithm**: `SVC(kernel='linear', C=0.1)`
- **Pipeline**: `make_pipeline(StandardScaler(), SVC(kernel='linear', C=0.1))`
- **Regularization**: Low C value (0.1) = softer margin, more regularization
- **Characteristics**: May underfit, allows more margin violations

#### 2. Linear SVM (C=1000)
- **Algorithm**: `SVC(kernel='linear', C=1000)`
- **Pipeline**: `make_pipeline(StandardScaler(), SVC(kernel='linear', C=1000))`
- **Regularization**: High C value (1000) = harder margin, less regularization
- **Characteristics**: May overfit, tries to classify all training points correctly

#### 3. RBF Kernel SVM (Grid Search)
- **Algorithm**: `SVC(kernel='rbf')`
- **Hyperparameters**: 
  - C: [0.1, 1, 10, 100]
  - gamma: [0.1, 1, 10, 100]
- **Grid Search**: `GridSearchCV` with 5-fold cross-validation
- **Scoring**: F1-score as evaluation metric

### Decision Boundary Visualization

#### Linear SVM Visualization
- **Method**: Custom function `plot_svc_decision_boundary()`
- **Components**:
  - Decision boundary line (w·x + b = 0)
  - Margin lines (w·x + b = ±1)
  - Support vectors (highlighted)
  - Data points (colored by class)
- **Mathematical Derivation**: 
  - Decision boundary: `x1 = -w[0]/w[1] * x0 - b/w[1]`
  - Margin width: `1 / ||w||`

#### RBF Kernel Visualization
- **Method**: Contour plots using `decision_function()`
- **Grid Generation**: Mesh grid covering feature space
- **Visualization**: 
  - Filled contours showing decision regions
  - Black contour line at decision boundary (Z=0)
  - Data points overlaid

## Evaluation Metrics

### Support Vector Analysis
- **Support Vectors Count**: Number of data points defining the margin
- **C=0.1**: More support vectors (wider margin)
- **C=1000**: Fewer support vectors (narrower margin)
- **RBF Best Model**: Support vector count for optimal hyperparameters

### Performance Metrics
- **F1-Score**: Harmonic mean of precision and recall
- **Grid Search Scoring**: F1-score used to select best hyperparameters
- **Comparison**: F1-scores for C=0.1, C=1000, and best RBF model

## Python Libraries and Tools

### Core Libraries
- **NumPy**: Array operations, mathematical computations
- **Pandas**: DataFrame operations, data manipulation
- **Scikit-learn**:
  - `load_breast_cancer`: Dataset loading
  - `SVC`: Support Vector Classifier (linear and RBF kernels)
  - `LinearSVC`: Alternative linear SVM (not used)
  - `StandardScaler`: Feature standardization
  - `make_pipeline`: Pipeline construction
  - `GridSearchCV`: Hyperparameter tuning with cross-validation
  - `f1_score`: F1-score computation

### Visualization Libraries
- **Matplotlib**: Scatter plots, contour plots, decision boundaries
- **Seaborn**: Count plots, correlation heatmaps

## Key Analytical Methods

### Hyperparameter Tuning
1. **Grid Search**: Exhaustive search over hyperparameter grid
2. **Cross-Validation**: 5-fold CV for robust hyperparameter selection
3. **Scoring Metric**: F1-score balances precision and recall
4. **Best Parameters**: Optimal C and gamma values identified

### SVM Theory Application
1. **Margin Maximization**: SVM finds maximum margin hyperplane
2. **Support Vectors**: Data points on or within margin boundaries
3. **Regularization**: C parameter controls margin hardness
4. **Kernel Trick**: RBF kernel enables non-linear decision boundaries

### Decision Boundary Analysis
1. **Linear Boundaries**: Straight lines separating classes
2. **Non-linear Boundaries**: Curved boundaries from RBF kernel
3. **Margin Visualization**: Distance between decision boundary and support vectors
4. **Geometric Interpretation**: Understanding SVM's geometric intuition

## Insights and Findings

### Model Performance
- **Linear SVM (C=0.1)**: Lower F1-score, more support vectors, wider margin
- **Linear SVM (C=1000)**: Higher F1-score, fewer support vectors, narrower margin
- **RBF SVM**: Best F1-score, non-linear decision boundary, optimal hyperparameters

### Key Observations
1. **C Parameter Impact**: Higher C = tighter margin, better training fit, risk of overfitting
2. **Support Vectors**: Number inversely related to C value
3. **Kernel Selection**: RBF kernel captures non-linear patterns better than linear
4. **Feature Scaling**: Critical for SVM performance (StandardScaler essential)

### Decision Boundary Characteristics
- **Linear (C=0.1)**: Wide margin, more tolerant of misclassifications
- **Linear (C=1000)**: Narrow margin, tries to classify all points correctly
- **RBF**: Complex non-linear boundary adapting to data distribution

### Grid Search Results
- **Best Hyperparameters**: Optimal C and gamma values identified
- **Performance Improvement**: RBF kernel outperforms linear SVMs
- **Computational Cost**: Grid search evaluates 16 combinations (4×4)

## Best Practices Demonstrated

1. **Feature Scaling**: StandardScaler essential for SVM
2. **Hyperparameter Tuning**: Systematic grid search with cross-validation
3. **Visualization**: Clear decision boundary and margin visualization
4. **Multiple Models**: Comparison of different regularization strengths
5. **Kernel Selection**: Appropriate kernel choice (linear vs RBF)
6. **Support Vector Analysis**: Understanding model complexity through support vectors
7. **Pipeline Construction**: Integrated preprocessing and modeling
8. **Reproducibility**: Fixed random states throughout
