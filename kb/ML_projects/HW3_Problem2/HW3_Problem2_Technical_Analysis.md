# HW3 Problem 2: Ensemble Models and Semi-supervised Learning - Technical Analysis

## Overview
This project implements and compares multiple ensemble methods (Decision Tree, Random Forest, Bagging, AdaBoost) and explores semi-supervised learning using SelfTrainingClassifier on the Pima Indian Diabetes dataset.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Pima Indian Diabetes dataset (pima.csv)
- **Source**: Kaggle (originally diabetes.csv, renamed to pima.csv)
- **Sample Size**: 768 samples
- **Features**: 8 features (pregnancies, glucose, blood pressure, skin thickness, insulin, BMI, diabetes pedigree function, age)
- **Target**: Binary classification (0 = Negative, 1 = Positive for diabetes)

### Data Cleaning
- **Missing Value Detection**: Zero values in features that shouldn't be zero
- **Affected Features**: Glucose, BloodPressure, SkinThickness, Insulin, BMI
- **Imputation Method**: Median replacement (median of non-zero values)
- **Rationale**: Zero values represent missing data in this dataset's protocol
- **Verification**: Confirmed no remaining zero values in affected columns

### Data Exploration
- **Statistical Summary**: `describe()` for all features
- **Histogram Analysis**: Distribution visualization for all features
- **Target Distribution**: Class balance analysis (approximately 65% negative, 35% positive)
- **Data Types**: All numerical features

### Data Splitting
- **Stratified Split**: 700 training samples, 68 test samples
- **Stratification**: Maintains class distribution in both sets
- **Random State**: 42 for reproducibility
- **Feature-Target Separation**: X (features) and y (target) properly separated

## Machine Learning Techniques

### Model Architectures

#### 1. Decision Tree Classifier
- **Algorithm**: `DecisionTreeClassifier(random_state=42)`
- **Parameters**: Default values (no hyperparameter tuning)
- **Characteristics**: Single tree, prone to overfitting

#### 2. Random Forest Classifier
- **Algorithm**: `RandomForestClassifier(random_state=42)`
- **Ensemble Method**: Bagging with multiple Decision Trees
- **Default Parameters**: 
  - `n_estimators=100` (100 trees)
  - Bootstrap sampling
  - Feature subset selection
- **Characteristics**: Reduces overfitting through ensemble averaging

#### 3. Bagging Classifier with SVM
- **Base Estimator**: `SVC(kernel='linear', random_state=42)`
- **Ensemble Method**: `BaggingClassifier` with 10 estimators
- **Pipeline**: `make_pipeline(StandardScaler(), BaggingClassifier(SVC(...), n_estimators=10))`
- **Preprocessing**: StandardScaler essential for SVM
- **Characteristics**: Combines multiple SVM classifiers through bagging

#### 4. AdaBoost Classifier
- **Base Estimator**: `DecisionTreeClassifier(random_state=42)`
- **Ensemble Method**: `AdaBoostClassifier`
- **Parameters**:
  - `n_estimators=100`: 100 boosting iterations
  - `learning_rate=0.25`: Moderate learning rate
  - `algorithm='SAMME'`: Multi-class boosting algorithm
- **Characteristics**: Sequential boosting, focuses on difficult examples

#### 5. Self-Training Classifier (Semi-supervised)
- **Base Model**: `RandomForestClassifier` (best performing model)
- **Wrapper**: `SelfTrainingClassifier`
- **Parameters**:
  - `criterion='threshold'`: Uses prediction probability threshold
  - `threshold=0.99`: High confidence threshold for pseudo-labeling
- **Training Data**: 
  - 200 labeled samples (randomly selected)
  - 500 unlabeled samples (marked with -1)
- **Purpose**: Leverage unlabeled data to improve performance

## Evaluation Metrics

### Classification Reports
- **Metrics Computed**:
  - Precision: Correctness of positive predictions
  - Recall: Ability to identify positive cases
  - F1-Score: Harmonic mean of precision and recall
  - Support: Number of samples per class
- **Per-Class Metrics**: Separate metrics for class 0 and class 1
- **Macro Averages**: Overall performance across classes

### Confusion Matrices
- **Visualization**: Seaborn heatmaps for each model
- **Components**: True Positives, False Positives, True Negatives, False Negatives
- **Interpretation**: Understanding error patterns for each model

### Performance Comparison
- **Metrics DataFrame**: Organized comparison of all models
- **Metrics**: Accuracy, Precision, Recall, F1-score
- **Best Performer**: Random Forest identified as top model

## Python Libraries and Tools

### Core Libraries
- **Pandas**: Data loading, manipulation, DataFrame operations
- **NumPy**: Array operations, random sampling
- **Scikit-learn**:
  - `DecisionTreeClassifier`: Single decision tree
  - `RandomForestClassifier`: Random forest ensemble
  - `BaggingClassifier`: Bagging ensemble method
  - `AdaBoostClassifier`: AdaBoost ensemble method
  - `SVC`: Support Vector Classifier
  - `SelfTrainingClassifier`: Semi-supervised learning wrapper
  - `StandardScaler`: Feature standardization
  - `train_test_split`: Stratified data splitting
  - `make_pipeline`, `Pipeline`: Pipeline construction
  - `classification_report`: Comprehensive classification metrics
  - `confusion_matrix`: Confusion matrix computation
  - `accuracy_score`, `precision_score`, `recall_score`, `f1_score`: Individual metrics

### Visualization Libraries
- **Matplotlib**: Histograms, count plots
- **Seaborn**: Count plots, confusion matrix heatmaps

## Key Analytical Methods

### Ensemble Method Comparison
1. **Bagging (Random Forest)**: Parallel training of multiple trees
2. **Bagging (SVM)**: Parallel training of multiple SVMs
3. **Boosting (AdaBoost)**: Sequential training focusing on errors
4. **Single Model (Decision Tree)**: Baseline comparison

### Semi-supervised Learning
1. **Self-Training**: Iterative pseudo-labeling of unlabeled data
2. **Threshold Criterion**: High confidence (0.99) for pseudo-labeling
3. **Labeled vs Unlabeled**: Comparison of supervised vs semi-supervised performance
4. **Data Efficiency**: Performance with limited labeled data (200 samples)

### Model Evaluation
1. **Comprehensive Metrics**: Precision, recall, F1-score for detailed analysis
2. **Confusion Matrix**: Visual representation of classification errors
3. **Per-Class Analysis**: Understanding performance for each class
4. **Comparative Analysis**: Side-by-side model comparison

## Insights and Findings

### Model Performance
- **Random Forest**: Best performance (81% accuracy, balanced precision/recall)
- **Bagging (SVM)**: Good performance (74% accuracy, 62% F1-score)
- **Decision Tree**: Moderate performance (72% accuracy, low recall 50%)
- **AdaBoost**: Worst performance (low recall 46%, F1-score 52%)
- **Self-Training**: Near-supervised performance with only 200 labeled samples

### Key Observations
1. **Ensemble Advantage**: Random Forest significantly outperforms single Decision Tree
2. **Bagging Effectiveness**: Both Random Forest and Bagging(SVM) show improvements
3. **AdaBoost Underperformance**: Surprisingly poor performance, may need hyperparameter tuning
4. **Semi-supervised Value**: Self-training achieves competitive results with limited labels
5. **Class Imbalance**: Models struggle with positive class (diabetes) detection (low recall)

### Theoretical Understanding
- **Bagging**: Reduces variance through model averaging
- **Boosting**: Reduces bias through sequential error correction
- **Random Forest**: Combines bagging with random feature selection
- **Semi-supervised Learning**: Leverages unlabeled data structure
- **Threshold Selection**: High threshold (0.99) ensures quality pseudo-labels

### Data Insights
- **Missing Value Handling**: Median imputation appropriate for this dataset
- **Feature Importance**: All 8 features contribute to diabetes prediction
- **Class Distribution**: Slight imbalance (65/35) affects model performance

## Best Practices Demonstrated

1. **Data Cleaning**: Proper handling of missing values (zero imputation)
2. **Stratified Splitting**: Maintains class distribution
3. **Multiple Ensemble Methods**: Comprehensive comparison
4. **Pipeline Construction**: Integrated preprocessing (StandardScaler for SVM)
5. **Comprehensive Evaluation**: Multiple metrics and confusion matrices
6. **Semi-supervised Learning**: Exploration of unlabeled data utilization
7. **Model Selection**: Best model identified for semi-supervised wrapper
8. **Reproducibility**: Fixed random states throughout
9. **Visualization**: Clear confusion matrices and distribution plots
