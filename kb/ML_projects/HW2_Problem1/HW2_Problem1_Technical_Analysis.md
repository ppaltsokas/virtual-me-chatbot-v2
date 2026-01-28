# HW2 Problem 1: Polynomial Regression and Learning Curves - Technical Analysis

## Overview
This project explores polynomial regression, learning curves, and regularization techniques on synthetic sinusoidal data. The analysis compares linear regression, high-degree polynomial regression, and Ridge regularization to understand bias-variance trade-offs.

## Data Sources and Preprocessing

### Data Generation
- **Dataset Type**: Synthetic non-linear data
- **Generation Method**: `y = sin(X) * 100 + noise`
- **Sample Size**: 1,000 data points
- **Feature Range**: X values from -2.5 to 2.5 (uniformly distributed)
- **Noise**: Gaussian noise added (`np.random.randn`)
- **Random Seed**: 42 for reproducibility

### Data Characteristics
- **Non-linearity**: Sinusoidal relationship between X and y
- **Noise Level**: Random noise added to simulate real-world data
- **Visualization**: Scatter plot showing non-linear pattern

## Machine Learning Techniques

### Model Architectures

#### 1. Linear Regression
- **Algorithm**: `sklearn.linear_model.LinearRegression`
- **Preprocessing**: StandardScaler
- **Pipeline**: `make_pipeline(StandardScaler(), LinearRegression())`
- **Characteristics**: Simple linear model, assumes linear relationship

#### 2. Polynomial Regression (Degree 50)
- **Feature Engineering**: `PolynomialFeatures(degree=50, include_bias=False)`
- **Preprocessing**: StandardScaler (critical for polynomial features)
- **Pipeline**: `make_pipeline(PolynomialFeatures(degree=50), StandardScaler(), LinearRegression())`
- **Characteristics**: Very high degree polynomial, captures complex patterns

#### 3. Ridge Regression (Regularized)
- **Regularization**: L2 regularization with `alpha=0.001`
- **Pipeline**: `make_pipeline(PolynomialFeatures(degree=50), StandardScaler(), Ridge(alpha=0.001))`
- **Characteristics**: Polynomial features with regularization to prevent overfitting

### Learning Curves Analysis

#### Methodology
- **Function**: `sklearn.model_selection.learning_curve`
- **Training Sizes**: 40 values from 1% to 100% of data (`np.linspace(0.01, 1.0, 40)`)
- **Cross-Validation**: 5-fold CV
- **Scoring Metric**: Negative Root Mean Squared Error (negated to get RMSE)
- **Visualization**: Training error vs Validation error curves

#### Key Insights from Learning Curves

**Linear Regression:**
- High training and validation errors (underfitting)
- Small gap between curves (low variance, high bias)
- Errors plateau at high values

**Polynomial Regression (Degree 50):**
- Training error near zero (perfect fit on training data)
- Large gap between training and validation errors (overfitting)
- High variance, low bias

**Ridge Regression:**
- Moderate training error (higher than polynomial, lower than linear)
- Validation error significantly lower than polynomial
- Better balance between bias and variance

## Evaluation Metrics

### Cross-Validation
- **Method**: 10-fold Cross-Validation
- **Scoring**: Negative RMSE (converted to positive RMSE)
- **Metrics Computed**:
  - Mean RMSE across folds
  - Standard deviation of RMSE

### Performance Comparison
1. **Linear Regression**: Highest RMSE (underfitting)
2. **Polynomial Regression**: Lower RMSE but high variance
3. **Ridge Regression**: Best RMSE with controlled variance

## Python Libraries and Tools

### Core Libraries
- **NumPy**: Data generation, array operations, mathematical functions
- **Scikit-learn**:
  - `LinearRegression`: Linear model
  - `Ridge`: Regularized linear regression
  - `PolynomialFeatures`: Polynomial feature transformation
  - `StandardScaler`: Feature standardization
  - `make_pipeline`: Pipeline construction
  - `learning_curve`: Learning curve computation
  - `cross_val_score`: Cross-validation scoring

### Visualization Libraries
- **Matplotlib**: Learning curve plots, scatter plots
- **Dual Subplots**: Zoomed views for detailed analysis

## Key Analytical Methods

### Bias-Variance Trade-off Analysis
1. **Bias (Underfitting)**: Linear regression shows high bias
2. **Variance (Overfitting)**: Polynomial regression shows high variance
3. **Balance**: Ridge regression achieves better trade-off

### Learning Curve Interpretation
1. **Training Error Evolution**: How model fits training data as more samples added
2. **Validation Error Evolution**: How model generalizes as more samples added
3. **Gap Analysis**: Difference between training and validation errors indicates overfitting

### Regularization Analysis
1. **L2 Regularization**: Ridge regression penalizes large coefficients
2. **Alpha Parameter**: Controls regularization strength (0.001 = weak regularization)
3. **Effect**: Prevents overfitting while maintaining model flexibility

## Insights and Findings

### Model Performance
- **Linear Regression**: RMSE ~1.0, consistent but high error (underfitting)
- **Polynomial Regression**: Very low training RMSE but high validation RMSE (overfitting)
- **Ridge Regression**: Best validation RMSE (~0.8-1.5 range), balanced performance

### Key Observations
1. **Polynomial Degree**: Degree 50 is extremely high, leading to overfitting
2. **Standardization Critical**: Essential for polynomial features to prevent numerical instability
3. **Regularization Benefits**: Ridge regression successfully reduces overfitting
4. **Learning Curves**: Clear visualization of bias-variance trade-offs

### Theoretical Understanding
- **Underfitting**: Linear model too simple for non-linear data
- **Overfitting**: High-degree polynomial memorizes training data
- **Regularization**: L2 penalty prevents excessive model complexity
- **Optimal Model**: Ridge with polynomial features balances complexity and generalization

## Best Practices Demonstrated

1. **Learning Curves**: Systematic analysis of model behavior across training sizes
2. **Multiple Models**: Comparison of different approaches
3. **Regularization**: Proper use of L2 regularization to control overfitting
4. **Feature Scaling**: StandardScaler essential for polynomial features
5. **Cross-Validation**: Robust performance estimation
6. **Visualization**: Clear plots showing training/validation error evolution
7. **Reproducibility**: Fixed random seeds throughout
