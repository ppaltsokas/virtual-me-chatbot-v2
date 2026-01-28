# Handwashing and Deaths at Childbirth - Technical Data Science Methods

## Project Overview

This project analyzes historical medical data from Vienna General Hospital (1840s) to demonstrate the impact of handwashing on maternal mortality rates. The analysis uses statistical methods and visualizations to prove that Dr. Semmelweis's handwashing intervention significantly reduced death rates in childbirth.

## Data Sources

### Primary Datasets
1. **annual_deaths_by_clinic.csv** - Yearly aggregated data by clinic
   - Contains births, deaths, and clinic identifiers
   - Time period: 1841-1846
   - Two clinics: Clinic 1 and Clinic 2

2. **monthly_deaths.csv** - Monthly granular data
   - Contains date, births, and deaths
   - Time period: 1841-1849
   - Includes data before and after handwashing intervention (June 1847)

### Historical Context
- **Intervention Date**: June 1, 1847 (handwashing made mandatory)
- **Location**: Vienna General Hospital
- **Physician**: Dr. Ignaz Semmelweis
- **Problem**: High maternal mortality from childbed fever (puerperal fever)

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions
- **Data Type Inspection**: `.info()` for structure understanding
- **Value Inspection**: `.values` to examine date/year formats
- **Missing Value Detection**: `.isna().values.any()` for quick NaN check
- **Duplicate Detection**: `.duplicated().values.any()` for data quality

### DateTime Handling
- **Parse Dates on Import**: Used `parse_dates=['date']` parameter in `pd.read_csv()` to automatically convert date column
- **DateTime Conversion**: `pd.to_datetime()` for intervention date: `pd.to_datetime('1847-06-01')`
- **Rationale**: Proper datetime objects enable time-based filtering and date axis formatting

### Data Quality Assessment
- **Missing Values**: Systematic checking across both datasets
- **Duplicates**: Verification of data integrity
- **Descriptive Statistics**: `.describe()` for initial data understanding

## Statistical Analysis Methods

### Proportion Calculations
- **Death Rate Calculation**: `pct_deaths = deaths / births`
- **Overall Death Rate**: `df_yearly.deaths.sum() / df_yearly.births.sum() * 100`
- **Clinic-Specific Rates**: 
  - Clinic 1: `clinic1.deaths.sum() / clinic1.births.sum() * 100`
  - Clinic 2: `clinic2.deaths.sum() / clinic2.births.sum() * 100`
- **Before/After Rates**:
  - Before: `before_washing.deaths.sum() / before_washing.births.sum() * 100`
  - After: `after_washing.deaths.sum() / after_washing.births.sum() * 100`

### Mean Calculations
- **Average Monthly Death Rate Before**: `before_washing.pct_deaths.mean() * 100`
- **Average Monthly Death Rate After**: `after_washing.pct_deaths.mean() * 100`
- **Difference Calculation**: `mean_diff = avg_prob_before - avg_prob_after`
- **Improvement Factor**: `times = avg_prob_before / avg_prob_after`

### Time Series Analysis
- **Rolling Averages**: 6-month moving average using `.rolling(window=6).mean()`
- **Purpose**: Smooth out monthly fluctuations to reveal underlying trends
- **Implementation**: 
  ```python
  roll_df = before_washing.set_index('date')
  roll_df = roll_df.rolling(window=6).mean()
  ```

### Statistical Significance Testing
- **Method**: Independent samples t-test
- **Library**: `scipy.stats.ttest_ind()`
- **Purpose**: Determine if the difference between before/after groups is statistically significant
- **Implementation**:
  ```python
  t_stat, p_value = stats.ttest_ind(a=before_washing.pct_deaths, 
                                     b=after_washing.pct_deaths)
  ```
- **Interpretation**: p-value < 0.01 indicates 99% confidence that handwashing made a difference
- **Result**: p-value of 0.0000002985 (highly statistically significant)

### Data Segmentation
- **Before/After Split**: Boolean indexing based on intervention date
  - Before: `df_monthly[df_monthly.date < handwashing_start]`
  - After: `df_monthly[df_monthly.date >= handwashing_start]`
- **Clinic Separation**: Filtering by clinic identifier
  - Clinic 1: `df_yearly[df_yearly.clinic == 'clinic 1']`
  - Clinic 2: `df_yearly[df_yearly.clinic == 'clinic 2']`

### Categorical Variable Creation
- **Handwashing Indicator**: Created binary variable using `np.where()`
  ```python
  df_monthly['washing_hands'] = np.where(df_monthly.date < handwashing_start, 'No', 'Yes')
  ```
- **Purpose**: Enables group-based analysis and visualization

## Visualization Techniques and Rationale

### 1. Dual-Axis Line Charts (Matplotlib)
- **Purpose**: Compare births and deaths over time on same chart
- **Implementation**:
  - Primary axis: `ax1 = plt.gca()`
  - Secondary axis: `ax2 = ax1.twinx()`
  - Different colors: skyblue for births, crimson for deaths
  - Line styling: solid for births, dashed for deaths with alpha transparency
- **Date Formatting**: 
  - Year locators: `mdates.YearLocator()`
  - Month locators: `mdates.MonthLocator()`
  - Date formatter: `mdates.DateFormatter('%Y')`
- **Styling**: Grid lines, custom font sizes, rotated x-axis labels

### 2. Interactive Line Charts (Plotly Express)
- **Library**: `plotly.express.line()`
- **Applications**:
  - Yearly births by clinic
  - Yearly deaths by clinic
  - Proportion of yearly deaths by clinic
- **Features**:
  - Color coding by clinic
  - Interactive hover tooltips
  - Zoom and pan capabilities
- **Rationale**: Enables exploration and comparison between clinics

### 3. Multi-Line Charts with Highlighting (Matplotlib)
- **Purpose**: Show death rate over time with before/after periods highlighted
- **Components**:
  - 6-month moving average (dashed crimson line)
  - Before handwashing data (black dashed line)
  - After handwashing data (skyblue solid line with markers)
- **Legend**: Custom legend with `plt.legend(handles=[...])`
- **Styling**: Different line styles, colors, and markers to distinguish periods

### 4. Box Plots (Plotly Express)
- **Library**: `plotly.express.box()`
- **Purpose**: Compare distribution of death rates before and after handwashing
- **Parameters**:
  - `x='washing_hands'` - Categorical grouping
  - `y='pct_deaths'` - Continuous variable
  - `color='washing_hands'` - Color coding by group
- **Advantage**: Shows quartiles, median, and outliers for both groups
- **Insight**: Visual comparison of distribution centers and spreads

### 5. Histograms with Overlay (Plotly Express)
- **Library**: `plotly.express.histogram()`
- **Purpose**: Visualize distribution of monthly death rates
- **Parameters**:
  - `nbins=30` - Number of bins for granularity
  - `opacity=0.6` - Transparency for overlay
  - `barmode='overlay'` - Overlay both distributions
  - `histnorm='percent'` - Normalize to percentages
  - `marginal='box'` - Add box plot in margin
- **Advantage**: Shows distribution shape and overlap between groups

### 6. Kernel Density Estimation (KDE) Plots
- **Library**: Seaborn `sns.kdeplot()`
- **Purpose**: Smooth distribution estimation
- **Parameters**:
  - `fill=True` - Fill area under curve
  - `clip=(0,1)` - Constrain to valid probability range (0-1)
- **Applications**:
  - Before handwashing distribution
  - After handwashing distribution
  - Side-by-side comparison
- **Styling**:
  - `plt.xlim(0, 0.40)` - Focus on relevant range
  - High DPI: `dpi=200` for sharp output
- **Advantage**: Smooth curves reveal distribution shape better than histograms

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - DateTime handling: `parse_dates`, `pd.to_datetime()`
  - Time series operations: `.rolling()`, `.set_index()`
  - Boolean indexing for data segmentation
  - Aggregation: `.sum()`, `.mean()`

### Statistical Analysis
- **NumPy**: Numerical operations
  - `np.where()` for conditional variable creation
- **SciPy**: Statistical testing
  - `scipy.stats.ttest_ind()` for independent samples t-test

### Visualization
- **Matplotlib**: Primary plotting library
  - Dual-axis charts with `twinx()`
  - Date formatting with `matplotlib.dates`
  - Line plots with custom styling
  - Grid lines and legends
  - High-resolution output: `dpi=200`
- **Plotly Express**: Interactive visualizations
  - `px.line()` - Interactive line charts
  - `px.box()` - Box plots
  - `px.histogram()` - Histograms with advanced features
- **Seaborn**: Statistical visualization
  - `sns.kdeplot()` - Kernel density estimation

### Date Handling
- **matplotlib.dates**: Date axis formatting
  - `YearLocator()`, `MonthLocator()` - Tick locators
  - `DateFormatter()` - Date format specification
- **Pandas Plotting**: Date converter registration
  - `register_matplotlib_converters()` - Avoid warnings

## Analysis Workflow

### 1. Data Loading and Exploration
- CSV file reading with date parsing
- Shape and structure examination
- Missing value and duplicate detection
- Descriptive statistics

### 2. Data Quality Assessment
- Systematic data quality checks
- Data type validation
- Value range inspection

### 3. Initial Analysis
- Overall death rate calculation
- Clinic-specific comparisons
- Temporal pattern identification

### 4. Intervention Analysis
- Before/after data segmentation
- Proportion and mean calculations
- Difference quantification
- Improvement factor calculation

### 5. Statistical Validation
- Rolling average calculation for trend smoothing
- T-test for statistical significance
- P-value interpretation

### 6. Visualization
- Multiple chart types for different insights
- Before/after comparisons
- Distribution analysis
- Interactive exploration

## Key Analytical Insights Techniques

### Before/After Comparison
- **Data Segmentation**: Split data at intervention point (June 1847)
- **Rate Calculation**: Calculate death rates for each period
- **Difference Measurement**: Quantify improvement in percentage points
- **Improvement Factor**: Express as multiplicative factor

### Statistical Significance
- **Hypothesis Testing**: T-test to determine if difference is statistically significant
- **Confidence Level**: 99% confidence threshold (p < 0.01)
- **Result Interpretation**: Highly significant p-value validates intervention effectiveness

### Distribution Analysis
- **Box Plots**: Compare quartiles and medians
- **Histograms**: Visualize frequency distributions
- **KDE Plots**: Smooth distribution estimation
- **Insight**: Reveals not just mean differences but distribution shifts

### Time Series Analysis
- **Rolling Averages**: Smooth monthly fluctuations
- **Trend Identification**: Reveal underlying patterns
- **Visual Highlighting**: Different colors/styles for before/after periods

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value and duplicate checks
2. **Proper DateTime Handling**: Parse dates on import, use datetime objects
3. **Statistical Rigor**: Use appropriate tests (t-test) for significance
4. **Multiple Visualization Types**: Different charts for different insights
5. **Before/After Methodology**: Clear intervention-based analysis
6. **Distribution Analysis**: Beyond means, examine full distributions
7. **Professional Formatting**: Date locators, grid lines, proper labeling
8. **High-Quality Output**: High DPI, large figure sizes
9. **Reproducible Analysis**: Clear code structure with logical flow
10. **Statistical Validation**: Quantify significance, not just visual differences

## Technical Challenges Addressed

1. **Temporal Segmentation**: Properly split data at intervention point
2. **Proportion Calculations**: Accurate death rate calculations
3. **Distribution Clipping**: KDE plots constrained to valid probability range (0-1)
4. **Date Axis Formatting**: Professional formatting for historical dates
5. **Dual-Axis Charts**: Proper scaling and color coding for clarity
6. **Statistical Testing**: Appropriate test selection (independent samples t-test)
7. **Rolling Averages**: Time series smoothing for trend analysis
8. **Interactive vs Static**: Balance between Plotly interactivity and Matplotlib control

## Summary

This project demonstrates proficiency in:
- **Historical Data Analysis**: Working with 19th-century medical records
- **Intervention Analysis**: Before/after comparison methodology
- **Statistical Testing**: T-tests for significance validation
- **Proportion Calculations**: Accurate rate calculations
- **Time Series Analysis**: Rolling averages and temporal patterns
- **Distribution Analysis**: Box plots, histograms, KDE plots
- **Data Visualization**: Multiple chart types (dual-axis, line, box, histogram, KDE)
- **Python Ecosystem**: Effective use of Pandas, NumPy, SciPy, Matplotlib, Plotly, Seaborn
- **Statistical Rigor**: Proper hypothesis testing and p-value interpretation
- **Analysis Workflow**: From data loading through cleaning, analysis, visualization, to statistical validation

The analysis provides compelling statistical evidence for the effectiveness of handwashing in reducing maternal mortality, demonstrating how data science techniques can validate historical medical interventions and inform evidence-based healthcare practices.
