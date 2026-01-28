# Fatal Force Analysis - Technical Data Science Methods

## Project Overview

This project performs comprehensive data analysis on fatal police shootings in the United States from 2015 onwards, combining multiple datasets including Washington Post fatal shooting records and US Census Bureau demographic and economic data.

## Data Sources and Structure

### Primary Datasets
1. **Deaths_by_Police_US.csv** - Washington Post database of fatal police shootings
   - Contains race, age, gender, armed status, mental illness indicators, location data
   - Time series data from January 2015 onwards

2. **Census Data** (4 separate datasets):
   - Median Household Income by city
   - Poverty rate by city
   - High school graduation rate by city
   - Racial demographics by city

### Data Integration Strategy
- Multiple CSV files loaded with proper encoding handling (windows-1252)
- Data merged using geographic keys (city/state) to combine shooting data with census demographics
- Groupby operations used extensively for aggregating city and state-level statistics

## Data Cleaning and Preprocessing Techniques

### Missing Value Handling
- **NaN Detection**: Systematic checking using `.isna().any()` and `.isna().sum()` across all datasets
- **Replacement Strategy**: NaN values in median income replaced with 0 (appropriate for missing economic data)
- **String to Numeric Conversion**: Poverty rates and graduation rates contained '-' characters, replaced with NaN then converted to float using `pd.to_numeric()`
- **Age Data Cleaning**: Missing age values replaced with 0 for analysis purposes

### Data Type Conversion
- String-based numeric columns converted using `pd.to_numeric()` with `errors='coerce'` parameter
- Date columns converted using `pd.to_datetime()` with `infer_datetime_format=True`
- Period conversion for time series: `.dt.to_period('m')` for monthly aggregation

### Duplicate Detection
- Systematic duplicate checking using `.duplicated().any()` across all datasets
- No duplicates found in primary datasets

## Statistical Analysis Methods

### Descriptive Statistics
- **Value Counts**: Used extensively for categorical analysis (race, gender, armed status, weapon type)
- **Groupby Aggregations**: 
  - `.groupby('Geographic Area').mean()` for state-level poverty and graduation rates
  - `.groupby('state').size()` for counting fatalities by state
  - `.groupby('date').size()` for temporal analysis

### Percentage Calculations
- Manual percentage calculations: `round(len(subset) / len(total) * 100, 2)`
- Used to determine proportions (e.g., percentage under 25 years old)

### Correlation Analysis
- **Linear Regression**: Seaborn's `lmplot()` and `regplot()` to analyze relationship between poverty rates and high school graduation rates
- **Kernel Density Estimation (KDE)**: Used in joint plots to visualize bivariate distributions

## Visualization Techniques and Rationale

### 1. Bar Charts
- **Purpose**: Ranking and comparison of categorical data
- **Applications**:
  - Poverty rates by state (ranked highest to lowest)
  - Top 10 cities with most police killings
  - Deaths by gender
  - Armed vs unarmed victims
- **Styling**: Custom colors, edge colors, rotated x-axis labels for readability

### 2. Scatter Plots
- **Purpose**: High school graduation rate visualization by state
- **Rationale**: Shows distribution and allows identification of outliers

### 3. Dual-Axis Line Charts
- **Purpose**: Comparing poverty rates vs high school graduation rates
- **Technique**: 
  - Primary y-axis for poverty (red, dashed line)
  - Secondary y-axis for graduation (green, solid line with markers)
  - Inverted graduation axis to show inverse relationship visually
- **Rationale**: Allows direct visual comparison of two metrics with different scales

### 4. Joint Plots with KDE
- **Library**: Seaborn `jointplot()` with `kind='kde'`
- **Purpose**: Visualize bivariate distribution of poverty and graduation rates
- **Advantage**: Shows both marginal distributions and joint density

### 5. Linear Regression Visualization
- **Methods**: 
  - `sns.lmplot()` - Faceted regression plots
  - `sns.regplot()` - Single regression plot with confidence intervals
- **Purpose**: Quantify and visualize correlation between socioeconomic factors

### 6. Stacked Bar Charts
- **Purpose**: Racial makeup of each US state
- **Technique**: Multiple race categories (White, Black, Native American, Asian, Hispanic) stacked
- **Custom Legend**: Using `matplotlib.patches.Patch` for color-coded legend

### 7. Donut Charts (Plotly)
- **Library**: Plotly `go.Pie()` with `hole=.6` parameter
- **Purpose**: Race distribution of victims
- **Advantage**: More modern, interactive visualization compared to standard pie charts

### 8. Box Plots
- **Library**: Seaborn `boxplot()`
- **Purpose**: Age distribution by manner of death
- **Advantage**: Shows quartiles, median, and outliers for age distributions

### 9. Histograms with KDE Overlay
- **Library**: Seaborn `histplot()` with `kde=True`
- **Purpose**: Age distribution of victims
- **Parameters**: 
  - `bins=30` or `bins=50` for granularity
  - `hue='race'` for multi-category comparison
  - `element='step'` for clearer separation between categories

### 10. Pie Charts
- **Applications**:
  - Armed vs unarmed distribution
  - Mental illness distribution
  - Race distribution
- **Styling**: Custom percentage formatting with `autopct='%1.1f%%'`, adjusted label distances

### 11. Horizontal Bar Charts
- **Purpose**: Weapon type analysis
- **Rationale**: Better readability for many categories (weapon types)
- **Parameters**: `figsize=(10,16), dpi=200` for high-resolution output

### 12. Choropleth Maps
- **Library**: Plotly `go.Choropleth()`
- **Purpose**: Geographic visualization of police killings by state
- **Parameters**:
  - `locationmode='USA-states'` for US state mapping
  - `colorscale='Oranges'` for intensity visualization
  - `geo_scope='usa'` for US map context
- **Advantage**: Spatial understanding of data distribution

### 13. Time Series Line Plots
- **Purpose**: Trend analysis of police killings over time
- **Data Preparation**: 
  - Date conversion to monthly periods
  - Groupby by date for aggregation
- **Styling**: Line width=3, rotated x-axis labels for date readability

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations, merging, grouping, aggregation
  - Time series handling with datetime conversion
- **NumPy**: Numerical operations and NaN handling

### Visualization Libraries
- **Matplotlib**: Base plotting library
  - Custom styling with `plt.style.use('seaborn-v0_8-deep')`
  - Figure sizing: `figsize=(14,4)` or `(14,8)` for different chart types
  - Font size control for readability
- **Seaborn**: Statistical visualization
  - `jointplot()`, `lmplot()`, `regplot()`, `boxplot()`, `histplot()`
  - Theme setting: `sns.set_theme(style="ticks")` and `sns.set_theme(color_codes=True)`
- **Plotly**: Interactive visualizations
  - `plotly.express` and `plotly.graph_objects`
  - Choropleth maps and interactive pie charts

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Exploratory Data Analysis (EDA)
- Shape and structure examination using `.info()`
- Head inspections for data preview
- Unique value analysis for categorical variables

### 2. Data Quality Assessment
- Systematic missing value detection
- Duplicate identification
- Data type validation

### 3. Data Transformation
- String cleaning and conversion
- Geographic aggregation (city → state level)
- Temporal aggregation (daily → monthly)

### 4. Statistical Analysis
- Descriptive statistics (counts, percentages, means)
- Correlation analysis (poverty vs education)
- Distribution analysis (age, race, demographics)

### 5. Visualization and Communication
- Multiple chart types selected based on data characteristics
- Consistent styling and formatting
- High-resolution output for presentations

## Key Analytical Insights Techniques

### Comparative Analysis
- State-by-state comparisons using groupby operations
- Temporal trends using time series aggregation
- Demographic breakdowns using value counts and filtering

### Rate Calculations
- Manual percentage calculations for specific subgroups
- Rate comparisons (e.g., killing rate by race in top cities)

### Geographic Analysis
- State-level aggregation and ranking
- City-level analysis for top 10 cities
- Choropleth mapping for spatial patterns

### Demographic Profiling
- Age distribution analysis with histograms and KDE
- Race-based comparisons using filtering and grouping
- Gender-based breakdowns

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value and duplicate checks
2. **Appropriate Visualization Selection**: Chart types chosen based on data characteristics and analysis goals
3. **Reproducible Analysis**: Clear code structure with comments and logical flow
4. **Data Integration**: Proper merging of multiple data sources using geographic keys
5. **Statistical Rigor**: Use of appropriate statistical methods (regression, KDE, descriptive stats)
6. **Presentation Quality**: High-resolution outputs, proper labeling, readable formatting

## Technical Challenges Addressed

1. **Encoding Issues**: Handled windows-1252 encoding for CSV files
2. **Mixed Data Types**: Converted string numbers with special characters ('-') to numeric
3. **Temporal Aggregation**: Converted dates to monthly periods for trend analysis
4. **Geographic Matching**: Merged data from different sources using geographic identifiers
5. **Large Categorical Variables**: Used horizontal bar charts and appropriate binning for readability

## Summary

This project demonstrates proficiency in:
- **Data Cleaning**: Systematic handling of missing values, type conversions, and data quality checks
- **Statistical Analysis**: Descriptive statistics, correlation analysis, distribution analysis
- **Visualization**: Appropriate selection of 13+ different chart types based on data characteristics
- **Data Integration**: Merging multiple datasets from different sources
- **Python Ecosystem**: Effective use of Pandas, NumPy, Matplotlib, Seaborn, and Plotly
- **Analysis Workflow**: From EDA through cleaning, transformation, analysis, to visualization

The analysis provides comprehensive insights into fatal police shootings through multiple analytical lenses: temporal trends, geographic patterns, demographic breakdowns, and socioeconomic correlations.
