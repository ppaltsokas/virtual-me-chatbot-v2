# Multivariable Regression and House Valuation Model - Technical Data Science Methods

## Project Overview

This project builds a multivariable linear regression model to predict house prices in 1970s Boston using 13 features including number of rooms, distance to employment centers, crime rates, pollution levels, and socioeconomic factors. The analysis includes data exploration, model training, evaluation, data transformation, and property valuation.

## Data Source

- **Dataset**: `boston.csv` (UCI ML Housing Dataset)
- **Source**: StatLib library (Carnegie Mellon University)
- **Original Research**: Harrison, D. and Rubinfeld, D.L.
- **Size**: 506 instances, 13 predictive features, 1 target variable
- **Target Variable**: PRICE - Median value of owner-occupied homes in $1000's

### Feature Description
1. **CRIM** - Per capita crime rate by town
2. **ZN** - Proportion of residential land zoned for lots over 25,000 sq.ft.
3. **INDUS** - Proportion of non-retail business acres per town
4. **CHAS** - Charles River dummy variable (1 if tract bounds river; 0 otherwise)
5. **NOX** - Nitric oxides concentration (parts per 10 million)
6. **RM** - Average number of rooms per dwelling
7. **AGE** - Proportion of owner-occupied units built prior to 1940
8. **DIS** - Weighted distances to five Boston employment centres
9. **RAD** - Index of accessibility to radial highways
10. **TAX** - Full-value property-tax rate per $10,000
11. **PTRATIO** - Pupil-teacher ratio by town
12. **B** - 1000(Bk - 0.63)² where Bk is proportion of blacks by town
13. **LSTAT** - % lower status of the population

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions (506 rows, 14 columns)
- **Data Type Inspection**: `.info()` for structure understanding
- **Data Preview**: `.head()` and `.tail()` for data examination
- **Row Count**: `.count()` to verify data completeness
- **Index Setting**: `index_col=0` to use first column as index

### Data Quality Assessment
- **Missing Value Detection**: `data.isna().values.any()` - No missing values found
- **Duplicate Detection**: `data.duplicated().values.any()` - No duplicates found
- **Data Completeness**: All 506 instances complete

### Descriptive Statistics
- **Summary Statistics**: `.describe()` for quartiles, min, max, mean, std
- **Specific Queries**:
  - Average pupil-teacher ratio: `data.PTRATIO.mean()`
  - Average home price: `data.PRICE.mean() * 1000`
  - Maximum/minimum rooms: `data.RM.max()`, `data.RM.min()`
- **Dummy Variable Analysis**: CHAS (0 or 1) indicates river proximity

## Statistical Analysis Methods

### Distribution Analysis
- **Skewness Calculation**: `.skew()` to measure distribution asymmetry
- **Mean Calculations**: For target variable and features
- **Purpose**: Identify non-normal distributions that may need transformation

### Quantile Analysis
- **Quantile Extraction**: `data.NOX.quantile(q=0.75)` for high pollution
- **Quantile Extraction**: `data.LSTAT.quantile(q=0.25)` for low poverty
- **Application**: Used in property valuation scenarios

### Correlation Analysis
- **Visual Correlation**: Pair plots and joint plots to identify relationships
- **Feature Relationships**: Examined relationships between features and target

## Visualization Techniques and Rationale

### 1. Distribution Plots with KDE (Seaborn)
- **Library**: `seaborn.displot()`
- **Purpose**: Visualize feature distributions with histogram and KDE overlay
- **Features Visualized**:
  - PRICE (target variable)
  - RM (number of rooms)
  - DIS (distance to employment)
  - RAD (highway accessibility)
- **Parameters**:
  - `bins=50` - Granular histogram bins
  - `aspect=2` - Wide aspect ratio for better visibility
  - `kde=True` - Superimpose kernel density estimate
  - Custom colors for each feature
- **Advantage**: Reveals distribution shape, skewness, and outliers

### 2. Bar Charts (Plotly Express)
- **Library**: `plotly.express.bar()`
- **Purpose**: Categorical variable visualization (CHAS - river proximity)
- **Parameters**:
  - `x=['No', 'Yes']` - Custom labels
  - `color=river_access.values` - Color intensity
  - `color_continuous_scale=px.colors.sequential.haline` - Color scheme
  - `coloraxis_showscale=False` - Hide color scale
- **Advantage**: Interactive visualization for binary categorical data

### 3. Pair Plots (Seaborn)
- **Library**: `seaborn.pairplot()`
- **Purpose**: Comprehensive relationship visualization across all features
- **Parameters**:
  - `kind='reg'` - Include regression lines
  - `plot_kws={'scatter_kws':{'alpha': 0.5}, 'line_kws':{'color': 'cyan'}}` - Styling
- **Custom Annotations**: Loop through axes to add variable name labels
- **Advantage**: 
  - Shows all pairwise relationships simultaneously
  - Identifies correlations and patterns
  - Diagonal shows univariate distributions
- **Note**: Computationally intensive (1-2 minutes for full dataset)

### 4. Joint Plots (Seaborn)
- **Library**: `seaborn.jointplot()`
- **Purpose**: Detailed bivariate relationship analysis
- **Relationships Examined**:
  - DIS vs NOX (Distance vs Pollution)
  - INDUS vs NOX (Industry vs Pollution)
  - LSTAT vs RM (Poverty vs Rooms)
  - LSTAT vs PRICE (Poverty vs Price)
  - RM vs PRICE (Rooms vs Price)
- **Parameters**:
  - `height=8` or `height=7` - Chart size
  - `kind='scatter'` - Scatter plot type
  - `joint_kws={'alpha': 0.5}` - Transparency for overlapping points
  - Custom colors for each relationship
- **Styling**: `sns.axes_style('darkgrid')` for consistent theme
- **Advantage**: Shows both marginal distributions and joint relationship

### 5. Scatter Plots (Matplotlib)
- **Purpose**: Model evaluation and residual analysis
- **Applications**:

#### a) Actual vs Predicted Values
- **Purpose**: Evaluate prediction accuracy
- **Components**:
  - Scatter plot: Actual prices (x) vs Predicted prices (y)
  - Reference line: `y_train` vs `y_train` (perfect prediction line)
  - Color: Indigo or navy for different models
- **Interpretation**: Distance from diagonal line = prediction error

#### b) Residuals vs Predicted Values
- **Purpose**: Check for systematic bias in residuals
- **Components**:
  - Scatter plot: Predicted values (x) vs Residuals (y)
  - Horizontal reference at y=0
- **Interpretation**: Random scatter = good model; patterns = systematic bias

#### c) Log Transformation Visualization
- **Purpose**: Show how log transformation affects price distribution
- **Components**: Scatter plot of original prices vs log prices
- **Insight**: Demonstrates compression of large values

### 6. Residual Distribution Plots (Seaborn)
- **Library**: `seaborn.displot()` with KDE
- **Purpose**: Assess residual normality
- **Parameters**:
  - `kde=True` - Superimpose density estimate
  - Custom colors (indigo for original, navy for log model)
- **Metrics Displayed**: Skewness and mean in title
- **Rationale**: Normal distribution (skew≈0, mean≈0) indicates good model fit

## Machine Learning: Multivariable Linear Regression

### Model Formulation
- **Equation**: $\hat{PRICE} = \theta_0 + \theta_1 RM + \theta_2 NOX + \theta_3 DIS + \theta_4 CHAS + ... + \theta_{13} LSTAT$
- **Library**: `sklearn.linear_model.LinearRegression`
- **Features**: 13 independent variables
- **Target**: PRICE (continuous variable)

### Train-Test Split
- **Method**: `train_test_split()` from sklearn
- **Split Ratio**: 80% training, 20% testing
- **Random State**: `random_state=10` for reproducibility
- **Implementation**:
  ```python
  target = data['PRICE']
  features = data.drop('PRICE', axis=1)
  X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=10)
  ```
- **Rationale**: Evaluate model on unseen data for realistic performance assessment

### Model Training
- **Fitting**: `regr.fit(X_train, y_train)`
- **Parameters Extracted**:
  - **Intercept** ($\theta_0$): `regr.intercept_` - Base price when all features are zero
  - **Coefficients** ($\theta_1$ to $\theta_{13}$): `regr.coef_` - Feature weights
- **Coefficient DataFrame**: Created for readable output:
  ```python
  regr_coef = pd.DataFrame(data=regr.coef_, index=X_train.columns, columns=['Coefficient'])
  ```

### Model Evaluation

#### R-Squared (Coefficient of Determination)
- **Method**: `regr.score(X_train, y_train)`
- **Interpretation**: Proportion of variance in target explained by features
- **Training R²**: Initial model performance on training data
- **Test R²**: Performance on unseen test data
- **Comparison**: Test R² typically lower than training R² (indicates generalization)

#### Residual Analysis
- **Residual Calculation**: `residuals = y_train - predicted_values`
- **Metrics**:
  - **Mean**: `residuals.mean()` - Should be close to 0
  - **Skewness**: `residuals.skew()` - Should be close to 0 for normality
- **Purpose**: 
  - Check for systematic bias (mean ≠ 0)
  - Assess distribution normality (skew ≈ 0)
  - Identify patterns indicating model inadequacy

#### Coefficient Interpretation
- **Sign Analysis**: Check if coefficients have expected signs (positive/negative)
- **Magnitude Analysis**: Understand feature impact on price
- **Example**: RM coefficient * 1000 = price premium per additional room
- **Validation**: Compare coefficient signs with scatter plot relationships

## Data Transformation Techniques

### Log Transformation
- **Problem**: Target variable (PRICE) had high skewness, residuals non-normal
- **Solution**: Apply natural logarithm to target variable
- **Method**: `np.log(data['PRICE'])`
- **Rationale**: 
  - Reduces skewness (brings distribution closer to normal)
  - Compresses large values more than small values
  - Maintains linear model structure while improving fit

### Transformation Comparison
- **Original Skewness**: High positive skew
- **Log Skewness**: Much closer to zero
- **Visual Comparison**: Side-by-side distribution plots
- **Decision**: Log transformation selected based on skewness improvement

### Transformed Model
- **New Equation**: $\log(\hat{PRICE}) = \theta_0 + \theta_1 RM + \theta_2 NOX + ... + \theta_{13} LSTAT$
- **Training**: Same train-test split with `random_state=10` for comparability
- **Target**: `np.log(data['PRICE'])` instead of original prices
- **Improvement**: Better R² and residual distribution

## Model Comparison and Selection

### Performance Metrics Comparison
- **Original Model**:
  - Training R²
  - Test R²
  - Residual skewness
  - Residual mean
- **Log-Transformed Model**:
  - Training R² (typically improved)
  - Test R² (typically improved)
  - Residual skewness (closer to 0)
  - Residual mean (still ≈ 0)
- **Selection Criteria**: 
  - Higher R² (both training and test)
  - Residual skewness closer to 0
  - Better residual distribution

### Out-of-Sample Performance
- **Test Set Evaluation**: `regr.score(X_test, y_test)` vs `log_regr.score(X_test, log_y_test)`
- **Rationale**: True test of model generalization
- **Expected Result**: Test R² typically lower than training R² (indicates overfitting risk)

## Property Valuation Methodology

### Average Property Valuation
- **Starting Point**: Mean values for all features
  ```python
  average_vals = features.mean().values
  property_stats = pd.DataFrame(data=average_vals.reshape(1, len(features.columns)), 
                                columns=features.columns)
  ```
- **Prediction**: `log_regr.predict(property_stats)[0]`
- **Log to Dollar Conversion**: `np.exp(log_estimate) * 1000`
- **Rationale**: Convert log price back to actual dollar value

### Custom Property Valuation
- **Feature Customization**: Modify specific features while keeping others at average
- **Example Scenario**:
  - Next to river: `CHAS = 1`
  - 8 rooms: `RM = 8`
  - 20 students per classroom: `PTRATIO = 20`
  - Distance to town: `DIS = 5`
  - High pollution: `NOX = data.NOX.quantile(q=0.75)`
  - Low poverty: `LSTAT = data.LSTAT.quantile(q=0.25)`
- **Prediction Process**:
  1. Set custom feature values
  2. Predict log price
  3. Convert to dollar value using exponential transformation

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - Descriptive statistics: `.describe()`, `.mean()`, `.skew()`
  - Data splitting: `.drop()` for feature/target separation
  - Quantile extraction: `.quantile()`
  - DataFrame creation for predictions

### Machine Learning
- **Scikit-learn**: Machine learning library
  - `LinearRegression()` - Model class
  - `train_test_split()` - Data splitting
  - `.fit()` - Model training
  - `.predict()` - Price prediction
  - `.score()` - R-squared calculation
  - `.intercept_` - Model intercept
  - `.coef_` - Model coefficients

### Statistical Analysis
- **NumPy**: Numerical operations
  - `np.log()` - Natural logarithm transformation
  - `np.exp()` - Exponential transformation (reverse log)
  - Array operations for predictions

### Visualization
- **Matplotlib**: Base plotting library
  - Scatter plots for model evaluation
  - Figure creation with DPI control
  - Reference lines for perfect predictions
- **Seaborn**: Statistical visualization
  - `sns.displot()` - Distribution plots with KDE
  - `sns.pairplot()` - Comprehensive relationship visualization
  - `sns.jointplot()` - Bivariate relationship analysis
  - `sns.axes_style()` - Theme customization
- **Plotly Express**: Interactive visualizations
  - `px.bar()` - Interactive bar charts

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Data Loading and Exploration
- CSV file reading with index column
- Shape and structure examination
- Missing value and duplicate detection
- Descriptive statistics

### 2. Data Visualization
- Distribution plots for key features
- Pair plots for comprehensive relationship analysis
- Joint plots for detailed bivariate relationships
- Categorical variable visualization

### 3. Data Preparation
- Feature/target separation
- Train-test split (80/20)
- Random state for reproducibility

### 4. Model Training
- Linear regression on training data
- Coefficient extraction and interpretation
- R-squared calculation

### 5. Model Evaluation
- Residual calculation
- Residual distribution analysis (skewness, mean)
- Actual vs predicted scatter plots
- Residual vs predicted scatter plots

### 6. Data Transformation
- Log transformation of target variable
- Skewness comparison (original vs log)
- Visual comparison of distributions

### 7. Improved Model Training
- Retrain with log-transformed target
- Evaluate improved metrics
- Compare residuals

### 8. Model Comparison
- Compare R² (training and test)
- Compare residual distributions
- Select best model

### 9. Property Valuation
- Average property prediction
- Custom property scenarios
- Log to dollar conversion

## Key Analytical Insights Techniques

### Feature Impact Analysis
- **Coefficient Interpretation**: Each coefficient represents price change per unit change in feature
- **Sign Validation**: Verify coefficients match expected relationships (e.g., RM positive, LSTAT negative)
- **Magnitude Comparison**: Compare relative importance of features

### Model Diagnostics
- **Residual Analysis**: Check for normality, zero mean, random patterns
- **R-Squared Interpretation**: Proportion of variance explained
- **Overfitting Detection**: Compare training vs test R²

### Data Transformation Impact
- **Skewness Reduction**: Log transformation brings distribution closer to normal
- **Model Improvement**: Better R² and residual distribution
- **Interpretation Change**: Model predicts log prices, requires exponential transformation

### Predictive Modeling
- **Average Property**: Baseline prediction using mean feature values
- **Custom Scenarios**: Modify specific features to estimate property value
- **Log Conversion**: Transform log predictions back to dollar values

## Data Science Best Practices Demonstrated

1. **Systematic Data Exploration**: Comprehensive EDA before modeling
2. **Train-Test Split**: Proper data separation for realistic evaluation
3. **Model Diagnostics**: Residual analysis beyond just R²
4. **Data Transformation**: Log transformation to improve model fit
5. **Model Comparison**: Side-by-side evaluation of original vs transformed models
6. **Out-of-Sample Testing**: Test set evaluation for generalization assessment
7. **Coefficient Interpretation**: Understanding what model parameters mean
8. **Visualization**: Multiple chart types for different insights
9. **Reproducibility**: Random state for consistent results
10. **Practical Application**: Property valuation using trained model

## Technical Challenges Addressed

1. **Multivariable Modeling**: Handling 13 features simultaneously
2. **Non-Normal Distributions**: Log transformation to address skewness
3. **Residual Analysis**: Identifying and fixing systematic bias
4. **Model Selection**: Comparing original vs transformed models
5. **Prediction Interpretation**: Converting log predictions to dollar values
6. **Feature Engineering**: Using quantiles for realistic property scenarios
7. **Overfitting Detection**: Training vs test R² comparison
8. **Coefficient Validation**: Ensuring signs match domain knowledge

## Summary

This project demonstrates proficiency in:
- **Multivariable Regression**: Handling multiple features in linear model
- **Data Exploration**: Comprehensive EDA with multiple visualization types
- **Model Evaluation**: R-squared, residual analysis, coefficient interpretation
- **Data Transformation**: Log transformation to improve model fit
- **Model Comparison**: Systematic evaluation of model variants
- **Predictive Modeling**: Property valuation using trained model
- **Python Ecosystem**: Effective use of Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn, Plotly
- **Statistical Rigor**: Proper train-test split, residual diagnostics, out-of-sample evaluation
- **Practical Application**: Real-world property valuation scenarios

The analysis provides a complete machine learning workflow from data exploration through model training, evaluation, improvement, and practical application, demonstrating how multivariable regression can be used for real estate valuation and decision-making.
