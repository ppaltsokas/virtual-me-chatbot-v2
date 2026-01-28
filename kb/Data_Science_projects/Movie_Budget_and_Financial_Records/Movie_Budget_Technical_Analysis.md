# Movie Budget and Financial Records - Technical Data Science Methods

## Project Overview

This project analyzes the relationship between movie production budgets and box office revenue using financial data from the-numbers.com. The analysis employs data cleaning, exploratory analysis, visualization, and linear regression to determine if higher budgets correlate with greater revenue.

## Data Source

- **Dataset**: `cost_revenue_dirty.csv`
- **Source**: the-numbers.com (scraped movie budget and financial performance data)
- **Variables**: Production budget, worldwide gross revenue, domestic gross revenue, release dates
- **Note**: "Domestic" refers to United States box office revenue

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions
- **Missing Value Detection**: `.isna().values.any()` for quick NaN check
- **Duplicate Detection**: `.duplicated().any()` and `data[data.duplicated()]` to identify duplicate rows
- **Data Type Inspection**: `.info()` to examine column types and structure

### String to Numeric Conversion

#### Manual Approach (Step-by-Step)
- **Problem**: Financial columns stored as strings with currency symbols and comma separators (e.g., "$100,000,000")
- **Solution**: Three-step process for each column:
  1. Remove dollar signs: `.astype(str).str.replace('$', "")`
  2. Remove commas: `.astype(str).str.replace(',', "")`
  3. Convert to numeric: `pd.to_numeric()`
- **Columns Converted**:
  - `USD_Production_Budget`
  - `USD_Worldwide_Gross`
  - `USD_Domestic_Gross`

#### Automated Approach (Loop-Based)
- **Efficiency Improvement**: Used nested loops to clean multiple columns
- **Implementation**:
  ```python
  chars_to_remove = [',', '$']
  columns_to_clean = ['USD_Production_Budget', 'USD_Worldwide_Gross', 'USD_Domestic_Gross']
  for col in columns_to_clean:
      for char in chars_to_remove:
          data[col] = data[col].astype(str).str.replace(char, "")
      data[col] = pd.to_numeric(data[col])
  ```
- **Advantage**: Scalable approach for cleaning multiple similar columns

### DateTime Conversion
- **Method**: `pd.to_datetime(data.Release_Date)`
- **Purpose**: Enable temporal analysis and date-based filtering
- **Verification**: `.info()` to confirm datetime type conversion

### Data Filtering and Segmentation

#### Zero Revenue Films
- **Domestic Zero Revenue**: `data[data.USD_Domestic_Gross == 0]`
- **Worldwide Zero Revenue**: `data[data.USD_Worldwide_Gross == 0]`
- **Sorting**: `.sort_values('USD_Production_Budget', ascending=False)` to identify high-budget films with zero revenue
- **Purpose**: Identify data quality issues or unreleased films

#### International-Only Releases
- **Method 1**: Boolean indexing with `&` operator
  ```python
  international_releases = data.loc[(data.USD_Domestic_Gross == 0) & (data.USD_Worldwide_Gross != 0)]
  ```
- **Method 2**: Query method
  ```python
  international_releases2 = data.query('USD_Domestic_Gross == 0 and USD_Worldwide_Gross != 0')
  ```
- **Purpose**: Identify films released only internationally

#### Unreleased Films
- **Date Filtering**: Removed films with release dates after data collection date
  ```python
  scrape_date = pd.Timestamp('2018-5-1')
  future_releases = data[data.Release_Date >= scrape_date]
  data_clean = data.drop(future_releases.index)
  ```
- **Rationale**: Unreleased films skew revenue analysis

#### Films That Lost Money
- **Condition**: `data_clean.USD_Worldwide_Gross < data_clean.USD_Production_Budget`
- **Calculation**: `len(losing_money)/len(data_clean)` to determine percentage of unprofitable films
- **Purpose**: Assess financial risk in film industry

## Statistical Analysis Methods

### Descriptive Statistics
- **Mean Calculations**:
  - Average production budget: `data.USD_Production_Budget.mean()`
  - Average worldwide gross: `data.USD_Worldwide_Gross.mean()`
- **Summary Statistics**: `.describe()` for quartiles, min, max, mean, std
- **Specific Queries**:
  - Bottom 25% profitability analysis
  - Highest budget and revenue identification
  - Revenue of lowest/highest budget films

### Temporal Analysis
- **Decade Conversion**:
  1. Extract years: `pd.DatetimeIndex(data_clean.Release_Date).year`
  2. Convert to decades: `(years // 10) * 10` using floor division
  3. Add as column: `data_clean['Decade'] = decades`
- **Rationale**: Floor division (//) truncates to integer, then multiply by 10 to get decade start year
- **Example**: 1995 // 10 = 199, then 199 * 10 = 1990

### Data Segmentation by Era
- **Old Films**: `data_clean[data_clean.Decade <= 1969]` (pre-1970s)
- **New Films**: `data_clean[data_clean.Decade > 1969]` (1970s onwards)
- **Purpose**: Compare budget-revenue relationships across different film eras
- **Analysis**: Separate descriptive statistics and regression models for each era

## Machine Learning: Linear Regression

### Model Formulation
- **Equation**: $REVENUE = \theta_0 + \theta_1 \times BUDGET$
- **Library**: `sklearn.linear_model.LinearRegression`
- **Purpose**: Quantify relationship between production budget and worldwide revenue

### Implementation
- **Feature (X)**: `USD_Production_Budget` - explanatory variable
- **Target (y)**: `USD_Worldwide_Gross` - response variable
- **DataFrame Conversion**: Created DataFrames (not Series) as LinearRegression requires 2D arrays
  ```python
  X = pd.DataFrame(new_films, columns=['USD_Production_Budget'])
  y = pd.DataFrame(new_films, columns=['USD_Worldwide_Gross'])
  ```

### Model Training
- **Fitting**: `regression.fit(X, y)`
- **Parameters Extracted**:
  - **Intercept** ($\theta_0$): `regression.intercept_` - base revenue when budget is zero
  - **Slope** ($\theta_1$): `regression.coef_` - revenue increase per dollar of budget
- **Model Evaluation**:
  - **R-squared**: `regression.score(X, y)` - proportion of variance explained
  - **Interpretation**: R² of ~0.56 means model explains 56% of revenue variance

### Model Application
- **Revenue Prediction**: 
  ```python
  revenue_estimate = regression.intercept_[0] + regression.coef_[0,0] * budget
  ```
- **Rounding**: `round(revenue_estimate, -6)` to round to nearest million
- **Use Case**: Estimate expected revenue for a given production budget

### Separate Models for Different Eras
- **Old Films Model**: Trained on pre-1970s data
- **New Films Model**: Trained on 1970s+ data
- **Rationale**: Budget-revenue relationship may differ across eras
- **Comparison**: Compare R², intercepts, and slopes between eras

## Visualization Techniques and Rationale

### 1. Bubble Charts (Seaborn)
- **Library**: `seaborn.scatterplot()`
- **Purpose**: Multi-dimensional visualization showing budget, revenue, and time
- **Parameters**:
  - `x='Release_Date'` - Time axis
  - `y='USD_Production_Budget'` - Budget axis
  - `hue='USD_Worldwide_Gross'` - Color intensity represents revenue
  - `size='USD_Worldwide_Gross'` - Bubble size represents revenue
- **Styling**:
  - `sns.axes_style('darkgrid')` - Dark grid background
  - `figsize=(8,4), dpi=150` - High-resolution output
  - Custom axis limits and labels
- **Advantage**: Shows three dimensions (time, budget, revenue) in single chart

### 2. Regression Plots (Seaborn)
- **Library**: `seaborn.regplot()`
- **Purpose**: Visualize linear relationship with fitted regression line
- **Applications**:
  - Old films budget vs revenue
  - New films budget vs revenue
- **Parameters**:
  - `scatter_kws={'alpha': 0.4}` - Transparency for data points
  - `line_kws={'color': 'black'}` or `{'color': '#ff7c43'}` - Regression line color
  - `color='#2f4b7c'` - Scatter point color
- **Styling**:
  - `sns.axes_style('whitegrid')` or `'darkgrid'` - Background style
  - Custom axis limits: `ax.set(ylim=(0, 3000000000), xlim=(0, 450000000))`
  - Descriptive axis labels
- **Advantage**: Shows both data distribution and fitted model simultaneously

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - String manipulation: `.str.replace()`
  - Type conversion: `pd.to_numeric()`, `pd.to_datetime()`
  - Boolean indexing and query methods
  - DateTime operations: `pd.DatetimeIndex()`, `.year`
  - Aggregation: `.mean()`, `.describe()`, `.sort_values()`

### Machine Learning
- **Scikit-learn**: Linear regression modeling
  - `LinearRegression()` - Model class
  - `.fit()` - Model training
  - `.intercept_` - Model intercept
  - `.coef_` - Model coefficients (slope)
  - `.score()` - R-squared calculation

### Visualization
- **Matplotlib**: Base plotting library
  - Figure creation: `plt.figure(figsize, dpi)`
  - High-resolution output
- **Seaborn**: Statistical visualization
  - `sns.scatterplot()` - Bubble charts with multiple aesthetics
  - `sns.regplot()` - Regression plots with fitted lines
  - `sns.axes_style()` - Theme customization

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Data Loading and Initial Exploration
- CSV file reading
- Shape and structure examination
- Missing value and duplicate detection

### 2. Data Cleaning
- String to numeric conversion (currency formatting)
- DateTime conversion
- Data type validation

### 3. Data Quality Assessment
- Zero revenue identification
- Unreleased film removal
- International-only release identification

### 4. Data Segmentation
- Temporal segmentation (old vs new films)
- Decade conversion for era analysis
- Profitability filtering

### 5. Descriptive Analysis
- Mean calculations
- Summary statistics
- Specific query analysis

### 6. Visualization
- Bubble charts for multi-dimensional exploration
- Regression plots for relationship visualization

### 7. Statistical Modeling
- Linear regression model training
- Parameter extraction (intercept, slope)
- Model evaluation (R-squared)
- Revenue prediction

## Key Analytical Insights Techniques

### Budget-Revenue Relationship
- **Visual Analysis**: Regression plots show correlation strength
- **Quantitative Analysis**: R-squared measures relationship strength
- **Era Comparison**: Separate models reveal changing industry dynamics

### Financial Risk Assessment
- **Profitability Analysis**: Percentage of films that lose money
- **Bottom Quartile Analysis**: Assess profitability of low-budget films
- **High-Budget Risk**: Identify expensive films with zero revenue

### Temporal Trends
- **Decade Analysis**: Budget and revenue trends over time
- **Era Comparison**: Old vs new film financial dynamics
- **Bubble Charts**: Visualize evolution of budget-revenue relationship

### Predictive Modeling
- **Revenue Estimation**: Use regression model to predict revenue for given budget
- **Model Interpretation**: Understand intercept (base revenue) and slope (budget impact)
- **Variance Explanation**: R² indicates how much revenue variance is explained by budget

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive string manipulation and type conversion
2. **Data Quality Assessment**: Identification and handling of edge cases (zero revenue, unreleased films)
3. **Automated Cleaning**: Loop-based approach for cleaning multiple similar columns
4. **Temporal Analysis**: Decade conversion and era-based segmentation
5. **Multiple Filtering Methods**: Boolean indexing and query methods
6. **Appropriate Visualization**: Bubble charts for multi-dimensional data, regression plots for relationships
7. **Statistical Modeling**: Linear regression with proper evaluation metrics
8. **Model Interpretation**: Understanding coefficients and R-squared
9. **Era Comparison**: Separate models for different time periods
10. **Reproducible Analysis**: Clear code structure with logical flow

## Technical Challenges Addressed

1. **Currency String Conversion**: Removed dollar signs and commas, converted to numeric
2. **Multiple Column Cleaning**: Automated approach using loops
3. **Temporal Segmentation**: Decade conversion using floor division
4. **Data Quality Issues**: Identified and removed unreleased films, zero-revenue outliers
5. **Multi-Dimensional Visualization**: Bubble charts showing time, budget, and revenue
6. **Regression Modeling**: Proper DataFrame conversion for scikit-learn
7. **Model Interpretation**: Extracted and interpreted intercept, slope, and R-squared
8. **Era Comparison**: Separate models to account for industry changes over time

## Summary

This project demonstrates proficiency in:
- **Data Cleaning**: String manipulation, type conversion, automated cleaning approaches
- **Data Quality Assessment**: Identification of edge cases and data issues
- **Temporal Analysis**: Decade conversion and era-based segmentation
- **Statistical Analysis**: Descriptive statistics, mean calculations, quartile analysis
- **Machine Learning**: Linear regression implementation and evaluation
- **Data Visualization**: Bubble charts and regression plots
- **Predictive Modeling**: Revenue estimation based on budget
- **Python Ecosystem**: Effective use of Pandas, Scikit-learn, Matplotlib, and Seaborn
- **Analysis Workflow**: From data loading through cleaning, exploration, visualization, to modeling

The analysis provides insights into the film industry's financial dynamics, quantifying the relationship between production budgets and box office revenue, and demonstrating how data science techniques can inform business decisions in the entertainment industry.
