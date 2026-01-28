# HW3 Problem 1: Decision Trees, Ensemble Models, and Dimensionality Reduction - Technical Analysis

## Overview
This project implements and compares Decision Trees, Gradient Boosting, and dimensionality reduction techniques on the MNIST dataset. The analysis explores model complexity, ensemble methods, and the impact of PCA on model performance.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: MNIST handwritten digits dataset
- **Source**: `sklearn.datasets.fetch_openml('mnist_784', as_frame=False)`
- **Sample Size**: 10,000 training samples, 2,000 test samples (subset of full dataset)
- **Features**: 784 features (28×28 pixel images)
- **Target**: 10 classes (digits 0-9)

### Data Preprocessing
- **Stratified Splitting**: 80% training, 20% test with stratification
- **Label Conversion**: String labels converted to 64-bit integers
- **Subset Selection**: First 10,000 training and 2,000 test samples retained
- **Random State**: 42 for reproducibility

## Machine Learning Techniques

### Model Architectures

#### 1. Decision Tree Classifier
- **Algorithm**: `DecisionTreeClassifier(criterion='entropy', random_state=42)`
- **Hyperparameter Tuning**: GridSearchCV with 5-fold cross-validation
- **Parameters Searched**:
  - `max_features`: [100, 150, 200]
  - `max_depth`: [2, 4, 5]
- **Scoring**: Accuracy as evaluation metric
- **Best Parameters**: Identified through grid search

#### 2. Decision Tree with PCA
- **Dimensionality Reduction**: PCA retaining 90% variance
- **Pipeline**: `make_pipeline(StandardScaler(), PCA(n_components=0.90), DecisionTreeClassifier())`
- **Preprocessing**: StandardScaler before PCA (essential for PCA)
- **Variance Retained**: 90% of original variance
- **Components**: Number determined automatically to retain variance threshold

#### 3. Gradient Boosting Classifier
- **Algorithm**: `GradientBoostingClassifier`
- **Architecture**:
  - `max_depth=2`: Shallow trees (weak learners)
  - `n_estimators=6`: 6 boosting iterations
  - `learning_rate=1.0`: Full contribution from each tree
- **Pipeline**: `Pipeline([('scaler', StandardScaler()), ('pca', PCA(n_components=0.90)), ('gbc', GradientBoostingClassifier())])`
- **Ensemble Method**: Boosting (sequential weak learners)

#### 4. K-Means Clustering (Unsupervised)
- **Algorithm**: `KMeans(n_clusters=20, random_state=42)`
- **Input**: PCA-transformed training data
- **Purpose**: Unsupervised clustering for label propagation
- **Representative Images**: Closest samples to cluster centroids

### Dimensionality Reduction

#### Principal Component Analysis (PCA)
- **Method**: `PCA(n_components=0.90, random_state=42)`
- **Variance Threshold**: Retains 90% of variance
- **Preprocessing**: StandardScaler required before PCA
- **Reconstruction**: `inverse_transform()` for image reconstruction
- **Visualization**: Original vs reconstructed images comparison

## Evaluation Metrics

### Classification Metrics
1. **Accuracy**: Overall classification correctness
2. **F1-Score (Macro)**: Harmonic mean of precision and recall, macro-averaged
3. **Training Time**: Computational efficiency measurement

### Model Comparison
- **Decision Tree**: Baseline performance
- **PCA + Decision Tree**: Impact of dimensionality reduction
- **Gradient Boosting (PCA)**: Ensemble method performance
- **Label Propagation (KMeans + PCA)**: Semi-supervised approach

### Performance Results
- **Decision Tree**: ~67.6% accuracy, ~0.66 F1-score
- **PCA + Decision Tree**: ~67.2% accuracy, ~0.67 F1-score (slight improvement)
- **Gradient Boosting**: ~79.4% accuracy, ~0.79 F1-score (best performance)
- **Label Propagation**: ~66.5% accuracy, ~0.65 F1-score (lowest performance)

## Python Libraries and Tools

### Core Libraries
- **NumPy**: Array operations, distance calculations
- **Pandas**: DataFrame operations, results organization
- **Scikit-learn**:
  - `fetch_openml`: Dataset loading
  - `train_test_split`: Stratified data splitting
  - `DecisionTreeClassifier`: Decision tree implementation
  - `GradientBoostingClassifier`: Gradient boosting ensemble
  - `KMeans`: K-means clustering
  - `PCA`: Principal Component Analysis
  - `StandardScaler`: Feature standardization
  - `GridSearchCV`: Hyperparameter tuning
  - `make_pipeline`, `Pipeline`: Pipeline construction
  - `accuracy_score`, `f1_score`: Evaluation metrics

### Visualization Libraries
- **Matplotlib**: Image display, reconstruction visualization, cluster visualization
- **Subplot Layouts**: 2×5 and 2×10 grids for image comparison

## Key Analytical Methods

### Hyperparameter Tuning
1. **Grid Search**: Systematic search over parameter space
2. **Cross-Validation**: 5-fold CV for robust parameter selection
3. **Parameter Analysis**: Understanding impact of max_depth and max_features
4. **Performance Trade-offs**: Depth vs feature selection

### Ensemble Methods
1. **Boosting**: Sequential weak learners (Gradient Boosting)
2. **Shallow Trees**: max_depth=2 prevents overfitting
3. **Learning Rate**: 1.0 allows full contribution from each tree
4. **Iterative Improvement**: Each tree corrects previous errors

### Dimensionality Reduction Analysis
1. **PCA Benefits**: Noise reduction, computational efficiency
2. **Variance Retention**: 90% threshold balances compression and information
3. **Reconstruction Quality**: Visual assessment of information loss
4. **Impact on Models**: Performance comparison with/without PCA

### Unsupervised Learning
1. **K-Means Clustering**: 20 clusters for digit grouping
2. **Centroid Analysis**: Representative images per cluster
3. **Label Propagation**: Manual labeling and cluster-based prediction
4. **Limitations**: Clustering doesn't consider class labels

## Insights and Findings

### Model Performance
- **Gradient Boosting**: Best performance (~79% accuracy) despite shallow trees
- **Decision Tree**: Moderate performance, limited by single tree complexity
- **PCA Impact**: Minimal improvement for Decision Trees, beneficial for computational efficiency
- **Label Propagation**: Poor performance due to unsupervised nature

### Key Observations
1. **Ensemble Power**: Gradient Boosting significantly outperforms single Decision Tree
2. **Shallow Trees Advantage**: Weak learners in ensemble prevent overfitting
3. **PCA for Trees**: Limited benefit since trees naturally select features
4. **Boosting Mechanism**: Sequential correction improves performance iteratively
5. **Training Time**: Gradient Boosting requires more computation (~23s vs ~0.2s)

### Theoretical Understanding
- **Bias-Variance Trade-off**: Shallow trees reduce variance, ensemble reduces bias
- **Boosting Principle**: Focus on difficult examples in each iteration
- **PCA Utility**: More beneficial for linear models than tree-based models
- **Clustering Limitations**: Unsupervised methods don't optimize for classification

## Best Practices Demonstrated

1. **Hyperparameter Tuning**: Systematic grid search with cross-validation
2. **Pipeline Construction**: Integrated preprocessing and modeling
3. **Ensemble Methods**: Proper use of boosting for improved performance
4. **Dimensionality Reduction**: Appropriate use of PCA with standardization
5. **Model Comparison**: Comprehensive evaluation across multiple approaches
6. **Visualization**: Image reconstruction and cluster visualization
7. **Performance Metrics**: Multiple metrics (accuracy, F1-score, training time)
8. **Reproducibility**: Fixed random states throughout
