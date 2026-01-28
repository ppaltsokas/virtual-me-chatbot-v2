# Nobel Prizes Analysis - Technical Data Science Methods

## Project Overview

This project performs comprehensive analysis of Nobel Prize laureates from 1901 onwards, exploring patterns in demographics, geography, categories, temporal trends, and institutional affiliations. The analysis combines statistical methods, time series analysis, and advanced visualizations to uncover insights about the Nobel Prize and its recipients.

## Data Source

- **Dataset**: `nobel_prize_data.csv`
- **Time Period**: 1901 onwards (historical Nobel Prize data)
- **Categories**: Chemistry, Literature, Physics, Physiology or Medicine, Economics, Peace
- **Variables**: Year, category, laureate information, birth details, organization affiliations, prize sharing

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions
- **Column Inspection**: `.columns` to identify available features
- **Data Preview**: `.head()` and `.tail()` for data examination
- **Missing Value Detection**: `.isna().values.any()` and `.isna().sum()` for systematic NaN identification
- **Duplicate Detection**: `.duplicated().values.any()` to check for duplicate entries

### Missing Value Analysis
- **Systematic Checking**: `.isna().sum()` to count missing values per column
- **Specific Column Analysis**: Boolean indexing to examine rows with missing values
  - `df_data.loc[df_data.birth_date.isna()][col_subset]`
  - `df_data.loc[df_data.organization_name.isna()][col_subset]`
- **Purpose**: Identify patterns in missing data (e.g., older records may lack birth dates)

### DateTime Conversion
- **Birth Date Conversion**: `pd.to_datetime(df_data.birth_date)` to enable temporal calculations
- **Purpose**: Enable age calculations and time-based analysis

### String Manipulation and Calculated Fields

#### Prize Share Percentage
- **Problem**: Prize share stored as fraction string (e.g., "1/3")
- **Solution**: Multi-step string manipulation:
  1. Split on '/': `.str.split('/', expand=True)`
  2. Convert numerator to numeric: `pd.to_numeric(separated_values[0])`
  3. Convert denominator to numeric: `pd.to_numeric(separated_values[1])`
  4. Calculate percentage: `numerator / denominator`
- **Result**: `df_data['share_pct']` - numeric percentage of prize share

#### Age Calculation
- **Method**: Extract birth year from datetime, subtract from award year
  ```python
  birth_years = df_data.birth_date.dt.year
  df_data['winning_age'] = df_data.year - birth_years
  ```
- **Purpose**: Analyze laureate age patterns

## Statistical Analysis Methods

### Descriptive Statistics
- **Value Counts**: Used extensively for categorical analysis:
  - Sex distribution
  - Category distribution
  - Country distribution
  - Organization distribution
  - City distribution
- **Summary Statistics**: `.describe()` for age distribution
- **Min/Max Identification**: `.nlargest()` and `.nsmallest()` for extreme values

### Aggregation Operations
- **Groupby Aggregations**:
  - `.groupby('year').count().prize` - Prizes per year
  - `.groupby(['category', 'sex'], as_index=False).agg({'prize': pd.Series.count})` - Category by gender
  - `.groupby(['birth_country_current'], as_index=False).agg({'prize': pd.Series.count})` - Prizes by country
  - `.groupby('year').agg({'share_pct': pd.Series.mean})` - Average share per year
  - `.groupby(['birth_country_current', 'category'], as_index=False).agg({'prize': pd.Series.count})` - Country by category
  - `.groupby(['organization_country', 'organization_city', 'organization_name'], as_index=False).agg({'prize': pd.Series.count})` - Multi-level organization grouping

### Time Series Analysis
- **Rolling Averages**: 5-year moving average using `.rolling(window=5).mean()`
  - Applied to prizes per year
  - Applied to average prize share percentage
- **Purpose**: Smooth out year-to-year fluctuations to reveal trends

### Cumulative Analysis
- **Cumulative Sums**: Calculate cumulative prizes by country over time
  ```python
  cumulative_prizes = prizes_by_year.groupby(by=['birth_country_current','year']).sum().groupby(level=[0]).cumsum()
  ```
- **Purpose**: Show how countries' prize counts accumulate over time

### Duplicate Detection for Repeat Winners
- **Method**: `.duplicated(subset=['full_name'], keep=False)` to find all occurrences of repeat winners
- **Filtering**: `df_data[is_winner]` to extract multiple winners
- **Purpose**: Identify laureates who won multiple prizes

## Visualization Techniques and Rationale

### 1. Donut Charts (Plotly Express)
- **Library**: `plotly.express.pie()` with `hole=0.4`
- **Purpose**: Gender distribution of laureates
- **Parameters**:
  - `labels` and `values` from value_counts
  - `textposition='inside'` for label placement
  - `textinfo='percent'` for percentage display
  - `textfont_size=15` for readability
- **Advantage**: Modern, interactive visualization

### 2. Vertical Bar Charts (Plotly Express)
- **Library**: `plotly.express.bar()`
- **Purpose**: Number of prizes per category
- **Parameters**:
  - `color=prizes_per_category.values` - Color intensity
  - `color_continuous_scale='Aggrnyl'` - Color scheme
  - `coloraxis_showscale=False` - Hide color scale
- **Advantage**: Clear ranking visualization

### 3. Grouped Bar Charts (Plotly Express)
- **Library**: `plotly.express.bar()` with color grouping
- **Purpose**: Prizes per category split by gender
- **Parameters**:
  - `color=cat_men_women.sex` - Different colors for men/women
  - Automatic grouping by category and sex
- **Advantage**: Direct comparison of gender distribution across categories

### 4. Horizontal Bar Charts (Plotly Express)
- **Library**: `plotly.express.bar()` with `orientation='h'`
- **Applications**:
  - Top 20 countries by prizes
  - Top 20 research institutions
  - Top 20 cities (birth cities and organization cities)
- **Parameters**:
  - `color_continuous_scale` - Various schemes (Rainbow, haline, Plasma)
  - Sorted ascending for better readability
- **Rationale**: Horizontal orientation better for long category names

### 5. Stacked Horizontal Bar Charts (Plotly Express)
- **Library**: `plotly.express.bar()` with `color=category`
- **Purpose**: Top countries by total prizes, split by category
- **Parameters**:
  - `orientation='h'` - Horizontal bars
  - `color=merged_df.category` - Stacked by category
- **Advantage**: Shows both total and category breakdown simultaneously

### 6. Scatter Plots with Moving Averages (Matplotlib)
- **Purpose**: Temporal trends in prizes awarded
- **Components**:
  - Scatter points: Year vs number of prizes
  - Line plot: 5-year moving average overlay
- **Styling**:
  - `figsize=(16,8), dpi=200` - Large, high-resolution
  - Custom tick formatting: `np.arange(1900, 2021, step=5)`
  - Grid lines for readability
  - Color coding: dodgerblue for scatter, crimson for moving average
- **Rationale**: Reveals long-term trends while showing year-to-year variation

### 7. Dual-Axis Line Charts (Matplotlib)
- **Purpose**: Compare prizes per year with average prize share percentage
- **Implementation**:
  - Primary axis: Number of prizes (scatter + moving average)
  - Secondary axis: Average share percentage (moving average line)
  - `ax2 = ax1.twinx()` for shared x-axis
- **Styling**:
  - Different colors for each metric
  - Grid lines for reference
- **Insight**: Reveals relationship between prize frequency and sharing trends

### 8. Choropleth Maps (Plotly Express)
- **Library**: `plotly.express.choropleth()`
- **Purpose**: Geographic visualization of prizes by country
- **Parameters**:
  - `locations='ISO'` - ISO country codes for mapping
  - `color='prize'` - Color intensity represents prize count
  - `hover_name='birth_country_current'` - Interactive country names
  - `color_continuous_scale=px.colors.sequential.matter` - Color scheme
- **Advantage**: Spatial understanding of global prize distribution

### 9. Line Charts (Plotly Express)
- **Library**: `plotly.express.line()`
- **Purpose**: Cumulative prizes by country over time
- **Parameters**:
  - `x='year'`, `y='prize'` - Time series
  - `color='birth_country_current'` - Different line for each country
  - `hover_name='birth_country_current'` - Interactive identification
- **Advantage**: Shows how countries' prize counts evolved over time

### 10. Sunburst Charts (Plotly Express)
- **Library**: `plotly.express.sunburst()`
- **Purpose**: Hierarchical visualization of organization locations
- **Parameters**:
  - `path=['organization_country', 'organization_city', 'organization_name']` - Hierarchy levels
  - `values='prize'` - Size represents prize count
- **Advantage**: Shows nested relationships (country → city → organization)

### 11. Histograms (Seaborn)
- **Library**: `seaborn.histplot()`
- **Purpose**: Age distribution of laureates
- **Parameters**:
  - `bins=30` - Granularity
  - `dpi=200` - High resolution
- **Advantage**: Reveals age distribution patterns

### 12. Box Plots (Seaborn)
- **Library**: `seaborn.boxplot()`
- **Purpose**: Age distribution by category
- **Parameters**:
  - `x='category'`, `y='winning_age'` - Categorical vs continuous
  - `sns.axes_style("whitegrid")` - Theme
- **Advantage**: Shows quartiles, median, and outliers for each category

### 13. Regression Plots (Seaborn)
- **Library**: `seaborn.regplot()` and `seaborn.lmplot()`
- **Purpose**: Age trends over time
- **Applications**:

#### a) Single Regression Plot
- **Method**: `sns.regplot()`
- **Parameters**:
  - `x='year'`, `y='winning_age'` - Temporal trend
  - `lowess=True` - Locally weighted scatterplot smoothing
  - `scatter_kws={'alpha': 0.4}` - Transparency
  - `line_kws={'color': 'crimson', 'alpha': 0.8}` - Regression line styling

#### b) Faceted Regression Plots
- **Method**: `sns.lmplot()` with `row='category'`
- **Parameters**:
  - `aspect=2` - Wide aspect ratio
  - `lowess=True` - Smooth trend lines
- **Purpose**: Compare age trends across all 6 categories separately

#### c) Multi-Category Regression Plot
- **Method**: `sns.lmplot()` with `hue='category'`
- **Parameters**:
  - `lowess=True` - Smooth trend lines
  - `line_kws={'linewidth': 3, 'alpha': 0.9}` - Prominent lines
  - `scatter_kws={'alpha': 0.5}` - Transparency
- **Purpose**: Compare age trends across categories on same chart

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - DateTime operations: `.dt.year` for year extraction
  - String manipulation: `.str.split()`, `.str.replace()`
  - Type conversion: `pd.to_datetime()`, `pd.to_numeric()`
  - Aggregation: `.groupby()` with multiple functions
  - Sorting: `.sort_values()`, `.nlargest()`, `.nsmallest()`
  - Data merging: `pd.merge()`

### Statistical Analysis
- **NumPy**: Numerical operations
  - `np.arange()` for tick generation
  - Array operations for calculations

### Visualization
- **Matplotlib**: Base plotting library
  - Scatter plots and line plots
  - Dual-axis charts with `twinx()`
  - Grid lines and custom tick formatting
  - High-resolution output: `dpi=200`
- **Seaborn**: Statistical visualization
  - `sns.histplot()` - Histograms
  - `sns.boxplot()` - Box plots
  - `sns.regplot()` - Single regression plots
  - `sns.lmplot()` - Faceted and multi-category regression plots
  - `sns.axes_style()` - Theme customization
  - `lowess=True` - Locally weighted smoothing
- **Plotly Express**: Interactive visualizations
  - `px.pie()` - Donut charts
  - `px.bar()` - Bar charts (vertical and horizontal)
  - `px.choropleth()` - Geographic maps
  - `px.line()` - Line charts
  - `px.sunburst()` - Hierarchical sunburst charts

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Data Loading and Exploration
- CSV file reading
- Shape and structure examination
- Missing value and duplicate detection

### 2. Data Cleaning
- DateTime conversion
- String manipulation for prize share calculation
- Missing value analysis

### 3. Feature Engineering
- Prize share percentage calculation
- Age at award calculation
- Cumulative prize calculations

### 4. Descriptive Analysis
- Value counts for categorical variables
- Summary statistics for continuous variables
- Extreme value identification

### 5. Temporal Analysis
- Prizes per year aggregation
- Rolling averages for trend smoothing
- Cumulative analysis by country

### 6. Geographic Analysis
- Country-level aggregations
- City-level aggregations
- Organization-level aggregations
- Multi-level geographic grouping

### 7. Category Analysis
- Prizes per category
- Category by gender breakdown
- Category by country analysis

### 8. Age Analysis
- Age distribution visualization
- Age trends over time
- Age by category comparison

### 9. Visualization
- Multiple chart types for different insights
- Interactive Plotly charts for exploration
- Static Matplotlib/Seaborn for publication-quality output

## Key Analytical Insights Techniques

### Demographic Analysis
- **Gender Distribution**: Value counts and donut charts
- **First Women Winners**: Sorting by year to identify pioneers
- **Category Gender Breakdown**: Grouped bar charts

### Temporal Trend Analysis
- **Prizes Over Time**: Scatter plots with moving averages
- **Prize Sharing Trends**: Dual-axis charts comparing frequency and sharing
- **Cumulative Country Performance**: Line charts showing evolution
- **Age Trends**: Regression plots to identify increasing/decreasing age patterns

### Geographic Analysis
- **Country Rankings**: Horizontal bar charts for top countries
- **Spatial Distribution**: Choropleth maps for global visualization
- **City Analysis**: Birth cities vs organization cities
- **Institutional Analysis**: Top research organizations

### Category-Specific Analysis
- **Category Distribution**: Bar charts and value counts
- **Category by Country**: Stacked bar charts
- **Category Age Patterns**: Box plots and regression plots

### Hierarchical Analysis
- **Sunburst Charts**: Country → City → Organization hierarchy
- **Multi-Level Grouping**: Groupby operations with multiple levels

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value and duplicate checks
2. **Feature Engineering**: Calculated fields (age, share percentage)
3. **Temporal Analysis**: Rolling averages and cumulative sums
4. **Appropriate Visualization Selection**: Chart types chosen based on data characteristics
5. **Interactive Visualizations**: Plotly for exploration
6. **Statistical Smoothing**: LOWESS for trend identification
7. **Geographic Visualization**: Choropleth maps for spatial data
8. **Hierarchical Visualization**: Sunburst charts for nested relationships
9. **Multi-Dimensional Analysis**: Combining multiple variables in single visualizations
10. **Reproducible Analysis**: Clear code structure with logical flow

## Technical Challenges Addressed

1. **String Fraction Conversion**: Split and convert "1/3" format to numeric percentage
2. **Age Calculation**: Extract year from datetime and calculate age at award
3. **Temporal Smoothing**: Rolling averages to reveal trends in noisy data
4. **Cumulative Calculations**: Multi-level groupby with cumsum for country trends
5. **Geographic Mapping**: ISO code matching for choropleth maps
6. **Hierarchical Data**: Sunburst charts for multi-level organization data
7. **Missing Data Handling**: Systematic identification and analysis of missing values
8. **Repeat Winner Detection**: Duplicate detection on specific columns
9. **Multi-Category Comparison**: Faceted and grouped visualizations
10. **Trend Analysis**: Regression plots with LOWESS smoothing

## Summary

This project demonstrates proficiency in:
- **Data Cleaning**: String manipulation, DateTime conversion, missing value analysis
- **Feature Engineering**: Calculated fields (age, percentages)
- **Statistical Analysis**: Aggregations, value counts, descriptive statistics
- **Time Series Analysis**: Rolling averages, cumulative sums, temporal trends
- **Geographic Analysis**: Country, city, and organization-level analysis
- **Data Visualization**: 13+ different chart types (donut, bar, choropleth, line, sunburst, histogram, box, regression)
- **Interactive Visualization**: Plotly for exploration
- **Statistical Smoothing**: LOWESS for trend identification
- **Python Ecosystem**: Effective use of Pandas, NumPy, Matplotlib, Seaborn, and Plotly
- **Analysis Workflow**: From data loading through cleaning, transformation, analysis, to visualization

The analysis provides comprehensive insights into Nobel Prize patterns, revealing demographic trends, geographic distributions, temporal changes, and category-specific characteristics, demonstrating how data science techniques can uncover meaningful patterns in historical award data.
