# HW1 Problem 1: Wine Quality Analysis - Technical Analysis

## Overview
This project implements a comprehensive machine learning pipeline for predicting wine quality using linear regression. The analysis covers data exploration, preprocessing, model training, and evaluation using multiple metrics.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Wine Quality Red Wine dataset from UCI Machine Learning Repository
- **Source**: `https://archive.ics.uci.edu/static/public/186/wine+quality.zip`
- **Data Format**: CSV with semicolon delimiter
- **Sample Size**: 1,599 red wine samples
- **Features**: 11 continuous numerical features + 1 ordinal categorical target (quality)

### Data Exploration
- **Missing Values**: No missing values detected (all 1,599 entries complete)
- **Feature Types**: 
  - 11 continuous numerical features (fixed acidity, volatile acidity, citric acid, residual sugar, chlorides, free sulfur dioxide, total sulfur dioxide, density, pH, sulphates, alcohol)
  - 1 ordinal categorical target (quality: 3-8 scale)
- **Descriptive Statistics**: Comprehensive analysis using `pandas.describe()` to understand distributions, ranges, and central tendencies

### Data Transformation
- **Distribution Analysis**: Histogram analysis revealed right-skewed distributions for several features (Total Sulfur Dioxide, Chlorides, Residual Sugar)
- **Normalization Recommendations**: Identified need for logarithmic transformation and standardization for skewed features
- **Feature Correlation**: Computed correlation matrix and heatmap visualization to identify features most affecting quality

## Machine Learning Techniques

### Model Architecture
- **Algorithm**: Linear Regression (`sklearn.linear_model.LinearRegression`)
- **Preprocessing**: StandardScaler for feature standardization (mean=0, std=1)
- **Model Type**: Supervised learning regression model

### Training Methodology
- **Data Splitting**: Stratified train-test split (80% training, 20% test)
- **Stratification**: Maintained quality distribution across splits using `stratify` parameter
- **Random State**: Fixed to 42 for reproducibility
- **Feature Scaling**: StandardScaler fitted only on training data to prevent data leakage

### Cross-Validation
- **Method**: 10-fold K-Fold Cross-Validation
- **Configuration**: `KFold(n_splits=10, shuffle=True, random_state=42)`
- **Scoring Metric**: R² score (coefficient of determination)
- **Purpose**: Assess model stability and generalization across different data splits

## Evaluation Metrics

### Regression Metrics
1. **R² Score (Coefficient of Determination)**: Measures proportion of variance explained
   - Training CV: Mean and standard deviation calculated
   - Test set: Final evaluation metric
   - Interpretation: 0.37 indicates 37% variance explained

2. **Mean Absolute Error (MAE)**: Average absolute prediction error
   - Units: Same as target variable (quality scale)
   - Interpretation: Average deviation from actual quality

3. **Mean Absolute Percentage Error (MAPE)**: Error as percentage of actual values
   - Interpretation: Relative error magnitude

4. **Mean Squared Error (MSE)**: Penalizes larger errors more heavily
   - Interpretation: Squared error units

5. **Accuracy**: Classification-style metric after rounding predictions
   - Method: Predictions rounded to nearest integer and clipped to valid range [3,8]
   - Result: ~59.7% accuracy

### Visualization
- **Actual vs Predicted Scatter Plot**: Diagonal reference line (y=x) for perfect predictions
- **Learning Curves**: Training and validation error evolution (not implemented but recommended)

## Python Libraries and Tools

### Core Libraries
- **Pandas**: Data loading, manipulation, and descriptive statistics
- **NumPy**: Numerical operations and array manipulation
- **Scikit-learn**:
  - `LinearRegression`: Model implementation
  - `StandardScaler`: Feature standardization
  - `train_test_split`: Stratified data splitting
  - `cross_val_score`: Cross-validation implementation
  - `KFold`: K-fold cross-validation strategy
  - `r2_score`, `mean_absolute_error`, `mean_absolute_percentage_error`, `mean_squared_error`, `accuracy_score`: Evaluation metrics

### Visualization Libraries
- **Matplotlib**: Scatter plots and general plotting
- **Seaborn**: Correlation heatmaps with triangular mask

## Key Analytical Methods

### Statistical Analysis
1. **Correlation Analysis**: Pearson correlation coefficients between features and target
2. **Distribution Analysis**: Histogram examination for skewness detection
3. **Descriptive Statistics**: Mean, median, standard deviation, min, max for all features

### Model Validation
1. **Cross-Validation**: 10-fold CV to assess model stability
2. **Test Set Evaluation**: Final performance assessment on unseen data
3. **Confidence Intervals**: Mean ± Standard Deviation from CV to validate test performance

## Insights and Findings

### Model Performance
- **R² Score**: 0.37 indicates moderate predictive power
- **Accuracy**: 59.7% suggests linear model may not capture all quality-determining factors
- **Limitations**: Linear regression assumes linear relationships, which may not fully capture wine quality complexity

### Data Insights
- **Feature Importance**: Correlation analysis identified features most affecting quality
- **Distribution Characteristics**: Right-skewed features suggest need for transformation
- **Quality Range**: Most wines rated 5-6, with extremes (3 and 8) being rare

### Recommendations
- **Feature Engineering**: Consider polynomial features or interactions
- **Model Alternatives**: Non-linear models (Random Forest, Gradient Boosting) may improve performance
- **Data Transformation**: Apply logarithmic transformation to skewed features
- **Feature Selection**: Use correlation insights to focus on most impactful features

## Best Practices Demonstrated

1. **Data Leakage Prevention**: Scaler fitted only on training data
2. **Stratified Splitting**: Maintained class distribution in train/test splits
3. **Comprehensive Evaluation**: Multiple metrics provide different perspectives on performance
4. **Reproducibility**: Fixed random states throughout
5. **Cross-Validation**: Robust model evaluation methodology
6. **Visualization**: Clear plots for model interpretation
