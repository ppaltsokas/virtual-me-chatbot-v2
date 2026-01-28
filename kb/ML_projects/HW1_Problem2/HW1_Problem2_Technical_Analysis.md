# HW1 Problem 2: MNIST Classification - Technical Analysis

## Overview
This project implements a binary classification system to distinguish between even and odd digits in the MNIST dataset using SGDClassifier. The analysis demonstrates pipeline construction, cross-validation, and comprehensive evaluation metrics.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: MNIST (Modified National Institute of Standards and Technology) dataset
- **Source**: `sklearn.datasets.fetch_openml('mnist_784', as_frame=False)`
- **Data Format**: NumPy arrays (images as flattened 784-dimensional vectors)
- **Sample Size**: 70,000 handwritten digit images (0-9)
- **Image Dimensions**: 28×28 pixels (784 features per image)

### Data Splitting
- **Split Ratio**: 85% training, 15% test
- **Stratification**: Maintained class distribution using `stratify=y`
- **Random State**: 42 for reproducibility
- **Class Balance Verification**: Bar charts showing class distribution in both sets

### Data Visualization
- **Image Display**: First 8 images from training and test sets in 2×4 grid layouts
- **Visualization Method**: `matplotlib.imshow()` with grayscale colormap
- **Image Reshaping**: 784-dimensional vectors reshaped to 28×28 for display

## Machine Learning Techniques

### Model Architecture
- **Algorithm**: Stochastic Gradient Descent Classifier (`SGDClassifier`)
- **Preprocessing**: StandardScaler for feature normalization
- **Pipeline**: `Pipeline([('scaler', StandardScaler()), ('sgd_clf', SGDClassifier(random_state=42))])`
- **Model Type**: Binary classification (even vs. odd digits)

### Binary Label Creation
- **Transformation**: `y_binary = (y.astype(int) % 2 == 0)`
- **Even Numbers**: Labeled as 1 (True)
- **Odd Numbers**: Labeled as 0 (False)
- **Classes**: Binary classification problem

### Training Methodology
- **Pipeline Approach**: Integrated preprocessing and model training
- **Feature Scaling**: StandardScaler ensures all pixel values contribute equally
- **SGD Characteristics**: Online learning algorithm, efficient for large datasets

## Evaluation Metrics

### Cross-Validation Metrics
- **Method**: 3-fold Cross-Validation
- **Metrics Computed**:
  1. **Accuracy**: Overall classification correctness
  2. **Recall**: Ability to identify even digits (sensitivity)
  3. **Precision**: Correctness when predicting even digits

### Baseline Comparison
- **Dummy Classifier**: Always predicts "even" class
- **Strategy**: `DummyClassifier(strategy='constant', constant=True)`
- **Purpose**: Establish baseline performance for comparison
- **Mathematical Analysis**: Theoretical precision and recall calculations for dummy model

### Confusion Matrix Analysis
- **Training Set**: 3-fold CV predictions using `cross_val_predict`
- **Test Set**: Final model predictions
- **Components Extracted**: True Positives (TP), False Positives (FP), True Negatives (TN), False Negatives (FN)
- **Visualization**: Seaborn heatmaps for both training and test sets

### Error Analysis
- **False Positives**: Odd digits incorrectly classified as even
- **False Negatives**: Even digits incorrectly classified as odd
- **Visualization**: Random selection and display of FP and FN instances
- **Purpose**: Understand model failure modes

## Python Libraries and Tools

### Core Libraries
- **NumPy**: Array operations and mathematical computations
- **Scikit-learn**:
  - `fetch_openml`: Dataset loading
  - `train_test_split`: Stratified data splitting
  - `SGDClassifier`: Stochastic gradient descent classifier
  - `StandardScaler`: Feature standardization
  - `Pipeline`: Preprocessing and model pipeline
  - `cross_val_score`: Cross-validation scoring
  - `cross_val_predict`: Cross-validation predictions
  - `confusion_matrix`: Confusion matrix computation
  - `accuracy_score`, `recall_score`, `precision_score`: Evaluation metrics
  - `DummyClassifier`: Baseline model

### Visualization Libraries
- **Matplotlib**: Image display, bar charts, scatter plots
- **Seaborn**: Confusion matrix heatmaps

## Key Analytical Methods

### Statistical Analysis
1. **Class Distribution**: Verification of balanced classes in train/test splits
2. **Stratified Splitting**: Ensures proportional representation of all digit classes
3. **Cross-Validation**: Robust performance estimation across multiple folds

### Model Evaluation
1. **Multiple Metrics**: Accuracy, precision, recall provide comprehensive view
2. **Baseline Comparison**: Dummy classifier establishes minimum acceptable performance
3. **Confusion Matrix**: Detailed breakdown of prediction errors
4. **Error Analysis**: Visual inspection of misclassified instances

### Pipeline Design
1. **Preprocessing Integration**: StandardScaler embedded in pipeline
2. **Reproducibility**: Fixed random states throughout
3. **Modularity**: Pipeline allows easy model swapping

## Insights and Findings

### Model Performance
- **Accuracy**: ~88.33% on training set (3-fold CV)
- **Performance vs Baseline**: Significantly outperforms dummy classifier (~50% accuracy)
- **Generalization**: Model successfully learns even/odd digit patterns

### Key Observations
1. **Feature Learning**: SGDClassifier learns meaningful patterns despite binary task
2. **Stratification Importance**: Ensures balanced evaluation across all digit classes
3. **Pipeline Benefits**: Integrated preprocessing ensures consistent data transformation
4. **Error Patterns**: Visual analysis reveals which digit types cause confusion

### Model Characteristics
- **SGD Advantages**: Efficient for large datasets, supports online learning
- **Scalability**: Can handle full MNIST dataset efficiently
- **Regularization**: SGDClassifier supports various regularization options (not used here)

## Best Practices Demonstrated

1. **Stratified Splitting**: Maintains class distribution in train/test splits
2. **Pipeline Construction**: Integrated preprocessing and modeling
3. **Baseline Establishment**: Dummy classifier provides performance reference
4. **Comprehensive Evaluation**: Multiple metrics and confusion matrix analysis
5. **Error Analysis**: Visual inspection of misclassifications
6. **Cross-Validation**: Robust performance estimation methodology
7. **Reproducibility**: Fixed random states ensure consistent results
8. **Data Visualization**: Clear plots for understanding data and model behavior
