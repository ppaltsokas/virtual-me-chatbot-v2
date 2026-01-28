# Google Trends and Data Visualization - Technical Data Science Methods

## Project Overview

This project explores relationships between Google search trends and real-world economic indicators, analyzing correlations between search volume and financial/economic data including Tesla stock prices, Bitcoin prices, and US unemployment rates.

## Data Sources

### Primary Datasets
1. **TESLA Search Trend vs Price.csv** - Tesla stock prices and Google search trends
2. **Bitcoin Search Trend.csv** - Bitcoin-related Google search trends
3. **Daily Bitcoin Price.csv** - Daily Bitcoin price data from Yahoo Finance
4. **UE Benefits Search vs UE Rate 2004-19.csv** - Unemployment benefits search trends vs actual unemployment rate (FRED data)
5. **UE Benefits Search vs UE Rate 2004-20.csv** - Extended dataset including 2020 data

### External Data Sources
- **FRED (Federal Reserve Economic Data)**: Official unemployment rate statistics
- **Google Trends**: Search volume estimates (normalized to 0-100 scale)
- **Yahoo Finance**: Stock and cryptocurrency price data

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions
- **Column Inspection**: `.columns` to identify available features
- **Missing Value Detection**: `.isna().values.any()` for quick NaN check
- **Descriptive Statistics**: `.describe()` for summary statistics
- **Min/Max Identification**: `.max()` and `.min()` for range analysis

### Missing Value Handling
- **Systematic Detection**: Used `.isna().sum()` to count missing values per column
- **Specific Row Identification**: Boolean indexing to locate rows with missing values: `df_btc_price[df_btc_price.CLOSE.isna()]`
- **Complete Row Removal**: Used `.dropna(inplace=True)` to remove rows with missing values
- **Impact Assessment**: Verified data completeness after cleaning

### DateTime Conversion
- **String to DateTime**: Converted date columns using `pd.to_datetime()`
- **Column-Level Conversion**: Applied to MONTH and DATE columns across all datasets
- **Verification**: Checked data types before and after conversion using `.head()` and `type()`
- **Rationale**: Essential for time series analysis and proper date axis formatting

### Time Series Resampling
- **Problem**: Bitcoin price data was daily, but search trend data was monthly
- **Solution**: Used Pandas `.resample()` method:
  - `df_btc_price.resample('M', on='DATE').last()`
  - Resampled daily data to monthly frequency
  - Used `.last()` to take the last value of each month
- **Result**: Aligned temporal frequencies for meaningful comparison

## Statistical Analysis Methods

### Descriptive Statistics
- **Summary Statistics**: `.describe()` for central tendency and spread
- **Min/Max Values**: Identified data ranges for axis scaling
- **Data Type Validation**: Ensured proper numeric types for calculations

### Rolling Averages
- **Purpose**: Smooth out short-term fluctuations to reveal trends
- **Method**: `.rolling(window=6).mean()` for 6-month rolling average
- **Application**: Applied to both search trends and unemployment rate
- **Rationale**: 
  - Reduces noise in time series data
  - Reveals underlying patterns
  - Helps identify leading/lagging relationships
- **Implementation**: 
  ```python
  roll_df = df_unemployment[['UE_BENEFITS_WEB_SEARCH', 'UNRATE']].rolling(window=6).mean()
  ```

### Correlation Analysis
- **Visual Correlation**: Dual-axis line charts to visually assess relationships
- **Temporal Alignment**: Ensured proper date alignment before comparison
- **Leading Indicators**: Identified which metric moves first (search trends vs actual rates)

## Visualization Techniques and Rationale

### 1. Dual-Axis Line Charts
- **Library**: Matplotlib with `twinx()` for secondary y-axis
- **Purpose**: Compare two metrics with different scales on same time axis
- **Applications**:
  - Tesla stock price vs search volume
  - Bitcoin price vs search volume
  - Unemployment search trends vs actual unemployment rate

#### Technical Implementation:
- **Primary Axis**: `ax1 = plt.gca()` - Gets current axes
- **Secondary Axis**: `ax2 = ax1.twinx()` - Creates shared x-axis, independent y-axis
- **Color Coding**: Different colors for each axis and line for clarity
- **Axis Limits**: Custom limits using `.set_ylim()` and `.set_xlim()` for optimal display
- **Line Styling**: 
  - `linewidth=3` for visibility
  - `linestyle='--'` for dashed lines (Bitcoin price)
  - `marker='o'` for data point markers (search trends)

### 2. Date Formatting and Locators
- **Library**: `matplotlib.dates` (mdates)
- **Purpose**: Professional date axis formatting
- **Components**:
  - **Year Locator**: `mdates.YearLocator()` - Major ticks at year intervals
  - **Month Locator**: `mdates.MonthLocator()` - Minor ticks at month intervals
  - **Date Formatter**: `mdates.DateFormatter('%Y')` - Format as 4-digit year
- **Implementation**:
  ```python
  years = mdates.YearLocator()
  months = mdates.MonthLocator()
  years_fmt = mdates.DateFormatter('%Y')
  ax1.xaxis.set_major_locator(years)
  ax1.xaxis.set_major_formatter(years_fmt)
  ax1.xaxis.set_minor_locator(months)
  ```
- **Rationale**: Improves readability of time series charts with proper date labeling

### 3. Chart Styling and Formatting

#### Figure Configuration
- **Size**: `figsize=(14,8)` for large, readable charts
- **Resolution**: `dpi=120` for sharp output
- **Title**: Custom titles with `fontsize=18`
- **Axis Labels**: Custom labels with color coding and `fontsize=14`
- **Tick Formatting**: 
  - `fontsize=14` for readability
  - `rotation=45` for date labels to prevent overlap

#### Color Schemes
- **Tesla**: Red (`#E6232E`) for stock price, skyblue for search trend
- **Bitcoin**: Orange (`#F08F2E`) for price, skyblue for search trend
- **Unemployment**: Purple for unemployment rate, skyblue for search trend
- **Rationale**: Consistent color coding helps distinguish metrics

### 4. Grid Lines
- **Purpose**: Improve readability of time series data
- **Implementation**: `ax1.grid(color='grey', linestyle='--')`
- **Styling**: Dashed grey lines for subtle reference
- **Rationale**: Helps align data points with time periods and values

### 5. Rolling Average Visualization
- **Purpose**: Show smoothed trends vs raw data
- **Method**: Plot rolling averages alongside or instead of raw data
- **Insight**: Reveals whether search trends lead or lag actual economic indicators
- **Application**: 6-month rolling average for unemployment analysis

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - DateTime conversion: `pd.to_datetime()`
  - Time series resampling: `.resample()`
  - Rolling calculations: `.rolling().mean()`
  - Missing value handling: `.isna()`, `.dropna()`

### Visualization
- **Matplotlib**: Primary plotting library
  - `plt.figure()` - Figure creation with size and DPI
  - `plt.gca()` - Get current axes
  - `ax.twinx()` - Create secondary y-axis
  - `ax.plot()` - Line plotting with styling options
  - `ax.set_ylabel()`, `ax.set_ylim()`, `ax.set_xlim()` - Axis configuration
  - `plt.xticks()`, `plt.yticks()` - Tick formatting
  - `plt.grid()` - Grid line addition
  - `plt.show()` - Display charts

### Date Handling
- **matplotlib.dates**: Date formatting utilities
  - `YearLocator()`, `MonthLocator()` - Tick locators
  - `DateFormatter()` - Date format specification
  - `set_major_locator()`, `set_minor_locator()` - Locator assignment
  - `set_major_formatter()` - Format assignment

## Time Series Analysis Methods

### Temporal Alignment
- **Problem**: Different datasets had different temporal frequencies (daily vs monthly)
- **Solution**: Resampling daily data to monthly using `.resample('M').last()`
- **Rationale**: Enables meaningful comparison between datasets

### Trend Analysis
- **Visual Inspection**: Dual-axis charts to identify correlations
- **Rolling Averages**: Smoothing to reveal underlying trends
- **Leading Indicators**: Identification of which metric moves first

### Seasonality Detection
- **Method**: Visual inspection of time series patterns
- **Application**: Unemployment benefits search trends
- **Insight**: Seasonal patterns in search behavior related to economic cycles

## Analysis Workflow

### 1. Data Loading
- CSV file reading for multiple datasets
- Initial shape and structure examination

### 2. Data Exploration
- Missing value detection
- Data type inspection
- Min/max value identification
- Descriptive statistics

### 3. Data Cleaning
- Missing value removal
- DateTime conversion
- Temporal alignment through resampling

### 4. Data Transformation
- Time series resampling (daily to monthly)
- Rolling average calculations
- Date formatting for visualization

### 5. Visualization
- Dual-axis line chart creation
- Professional date formatting
- Color coding and styling
- Grid addition for readability

### 6. Analysis and Interpretation
- Visual correlation assessment
- Leading indicator identification
- Trend and seasonality detection

## Key Analytical Insights Techniques

### Correlation Discovery
- **Visual Correlation**: Dual-axis charts reveal relationships between search trends and real-world metrics
- **Temporal Patterns**: Identify whether search trends lead or lag actual events
- **Magnitude Analysis**: Compare relative changes in search volume vs price/rate changes

### Leading Indicator Analysis
- **Search Trends as Predictors**: Investigate if search volume predicts price movements or economic changes
- **Rolling Averages**: Use smoothed data to identify clearer patterns
- **Temporal Alignment**: Proper date alignment crucial for accurate analysis

### Market Sentiment Analysis
- **Tesla**: Relationship between search interest and stock price movements
- **Bitcoin**: Cryptocurrency search trends vs price volatility
- **Unemployment**: Public concern (search volume) vs actual economic conditions

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value detection and removal
2. **Proper DateTime Handling**: Conversion and formatting for time series analysis
3. **Temporal Alignment**: Resampling to align different frequency datasets
4. **Appropriate Visualization**: Dual-axis charts for multi-metric comparison
5. **Professional Formatting**: Date locators, grid lines, proper labeling
6. **Statistical Smoothing**: Rolling averages to reveal trends
7. **Color Coding**: Consistent color schemes for clarity
8. **High-Quality Output**: Large figure size, high DPI for presentations
9. **Reproducible Analysis**: Clear code structure with logical flow
10. **Data Validation**: Verification steps after transformations

## Technical Challenges Addressed

1. **Temporal Frequency Mismatch**: Resolved by resampling daily Bitcoin data to monthly
2. **Missing Values**: Systematic detection and removal in Bitcoin price data
3. **DateTime Conversion**: Converted string dates to proper datetime objects
4. **Dual-Scale Visualization**: Implemented twin axes for metrics with different scales
5. **Date Axis Formatting**: Professional formatting using matplotlib.dates locators
6. **Noise Reduction**: Rolling averages to smooth volatile time series data
7. **Visual Clarity**: Color coding, grid lines, and proper sizing for readability

## Summary

This project demonstrates proficiency in:
- **Time Series Analysis**: Proper handling of temporal data, resampling, and alignment
- **Data Cleaning**: Missing value detection and removal, DateTime conversion
- **Statistical Methods**: Rolling averages for trend analysis
- **Advanced Visualization**: Dual-axis charts with professional date formatting
- **Correlation Analysis**: Visual identification of relationships between metrics
- **Python Ecosystem**: Effective use of Pandas for time series manipulation and Matplotlib for visualization
- **Data Integration**: Combining multiple data sources (Google Trends, financial data, economic indicators)
- **Analysis Workflow**: From data loading through cleaning, transformation, visualization, to interpretation

The analysis provides insights into how search behavior correlates with real-world economic and financial indicators, demonstrating the value of Google Trends data as a potential leading indicator for market movements and economic conditions.
