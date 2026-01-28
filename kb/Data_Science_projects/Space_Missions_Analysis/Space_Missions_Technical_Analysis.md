# Space Missions Analysis - Technical Data Science Methods

## Project Overview

This project analyzes space mission launch data from 1957 onwards, covering the entire Space Race era and beyond. The analysis explores launch patterns, mission success rates, costs, geographic distribution, organizational dominance, and temporal trends in space exploration.

## Data Source

- **Dataset**: `mission_launches.csv`
- **Source**: nextspaceflight.com (scraped data)
- **Time Period**: 1957 onwards (beginning of Space Race)
- **Size**: 4,324 missions, 9 columns
- **Variables**: Date, Organisation, Location, Detail, Rocket_Status, Mission_Status, Price, etc.

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions (4,324 rows, 9 columns)
- **Column Inspection**: `.columns.values` to identify available features
- **Data Preview**: `.head()` and `.tail()` for data examination
- **Missing Value Detection**: `.isna().values.any()` and `.isna().any()` for systematic NaN identification
- **Duplicate Detection**: `.duplicated().values.any()` to check for duplicate entries

### Column Removal
- **Unused Column Dropping**: Removed `'Unnamed: 0'` and `'Unnamed: 0.1'` columns
  - `df_data.drop(['Unnamed: 0', 'Unnamed: 0.1'], inplace=True, axis=1)`
- **Rationale**: Index columns not needed for analysis

### DateTime Conversion
- **Method**: `pd.to_datetime()` with advanced parameters
  ```python
  df_data["Date"] = pd.to_datetime(df_data["Date"], format="mixed", errors="coerce", utc=True)
  ```
- **Parameters**:
  - `format="mixed"` - Handles multiple date formats
  - `errors="coerce"` - Converts unparseable dates to NaN instead of raising error
  - `utc=True` - Standardizes to UTC timezone
- **Unparsed Date Analysis**: `.isna().sum()` to count unparseable dates
- **Purpose**: Enable temporal analysis and date-based filtering

### Price Data Cleaning
- **Problem**: Price stored as strings with comma separators
- **Solution**: Lambda function with string replacement
  ```python
  df_data.Price = df_data.Price.apply(lambda x: str(x).replace(',', '')).astype('float64')
  ```
- **Method**: 
  1. Convert to string: `str(x)`
  2. Remove commas: `.replace(',', '')`
  3. Convert to float: `.astype('float64')`
- **Missing Value Check**: `.isna().sum()` to quantify missing prices

### Geographic Data Wrangling

#### Country Extraction
- **Method**: String splitting on location data
  ```python
  df_data['Country'] = df_data['Location'].apply(lambda x: x.split(',')[-1].strip())
  ```
- **Rationale**: Last element after comma split is typically country name

#### Country Name Standardization
- **Problem**: Inconsistent country names, historical names, location-based names
- **Solution**: Systematic replacement dictionary
  ```python
  df_data['Country'].replace({
      'Russia': 'Russian Federation',
      'Iran': 'Iran, Islamic Republic of',
      'New Mexico': 'USA',
      'Barents Sea': 'Russian Federation',
      'Gran Canaria': 'USA',
      'Yellow Sea': 'China',
      'Shahrud Missile Test Site': 'Iran, Islamic Republic of',
      'Pacific Missile Range Facility': 'USA',
      'North Korea': "Korea, Democratic People's Republic of",
      'Pacific Ocean': 'Kiribati',
      'South Korea': 'Korea, Republic of'
  }, inplace=True)
  ```
- **Rationale**: Standardize to ISO 3166 country names for mapping

#### ISO Code Conversion
- **Library**: `iso3166` package
- **Method**: `countries.get(x).alpha3` to convert country names to 3-letter ISO codes
  ```python
  df_data['Country'] = df_data['Country'].apply(lambda x: countries.get(x).alpha3)
  ```
- **Purpose**: Required for Plotly choropleth maps (use ISO codes)

#### Historical Country Handling
- **Cold War Analysis**: Kazakhstan (KAZ) replaced with Russia (RUS) for USSR analysis
  ```python
  cold_war_df['Country'].replace({'KAZ': 'RUS'}, inplace=True)
  ```
- **Rationale**: Kazakhstan was part of Soviet Union during Cold War period

### Temporal Feature Engineering
- **Year Extraction**: `df_data['Year'] = df_data['Date'].dt.year`
- **Month Extraction**: `df_data['Date'].dt.month` for monthly analysis
- **Purpose**: Enable temporal aggregations and trend analysis

## Statistical Analysis Methods

### Descriptive Statistics
- **Value Counts**: Used extensively for categorical analysis:
  - Launches per organization
  - Rocket status (Active vs Retired)
  - Mission status (Success vs Failure)
  - Launches per country
  - Launches per month
- **Summary Statistics**: `.describe()` for numeric variables (Price)
- **Percentage Calculations**: 
  - Success rate: `(successful_missions / total_missions) * 100`
  - Failure percentage: Manual calculation from value counts

### Aggregation Operations
- **Groupby Aggregations**:
  - `.groupby('Organisation')['Price'].sum()` - Total spending per organization
  - `.groupby('Organisation').agg({'Price': np.mean})` - Average price per organization
  - `.groupby('Year')['Detail'].count()` - Launches per year
  - `.groupby(df_data['Date'].dt.month)['Detail'].count()` - Launches per month
  - `.groupby('Date')['Price'].mean()` - Average price over time
  - `.groupby(['Year', 'Country'])['Mission_Status'].count()` - Launches by country per year
  - `.groupby(['Year', 'Organisation'])['Detail'].count()` - Launches by organization per year
  - `.groupby(['Year', 'Country'])['Mission_Status'].count()` - Mission status by country/year

### Time Series Analysis
- **Rolling Averages**: 
  - 30-day rolling average for prices: `price_over_time.rolling(30).mean()`
  - Purpose: Smooth out daily fluctuations to reveal price trends
- **Temporal Aggregation**: Groupby operations on year and month for trend analysis

### Percentage Calculations
- **Failure Rate**: 
  ```python
  cold_war_failpct_by_year = cold_war_mission_failures_by_year / cold_war_launch_by_year * 100
  ```
- **Purpose**: Compare failure rates between countries over time
- **Missing Value Handling**: `.fillna(0)` for years with no failures

### Data Pivoting
- **Unstack Operations**: Convert multi-index groupby results to wide format
  ```python
  launches_by_top_10 = df_data.groupby(['Year','Organisation'])['Detail'].count().unstack(level=1)
  ```
- **Purpose**: Create time series data with organizations as columns for line chart plotting
- **Missing Value Handling**: `.fillna(0)` to handle years where organization had no launches

### Data Filtering
- **Cold War Period**: `df_data[df_data['Year'] <= 1991]` - Filter to Cold War era
- **Top Organizations**: `df_data[df_data['Organisation'].isin(top_10_organisations)]` - Filter to top 10
- **Success/Failure Filtering**: `df_data[df_data['Mission_Status'] == 'Success']` or `== 'Failure'`
- **Non-Zero Values**: `money_spent_by_organization[money_spent_by_organization != 0]` - Exclude zero spending

## Visualization Techniques and Rationale

### 1. Pie Charts (Pandas Plotting)
- **Library**: Pandas `.plot(kind='pie')`
- **Applications**:
  - Number of launches per organization (top 10)
  - Active vs Retired rockets
  - Mission status distribution
- **Parameters**:
  - `autopct='%1.1f%%'` or `'%1.2f%%'` - Percentage display
  - `figsize=(6,6)` or `(10,10)` - Chart size
  - `colors=color_palette` - Custom color schemes (Seaborn Set2)
  - `labels=None` with separate legend - Cleaner appearance
- **Advantage**: Clear proportion visualization

### 2. Bar Charts (Pandas Plotting)
- **Library**: Pandas `.plot(kind='bar')` or `.plot(kind='barh')`
- **Applications**:
  - Active vs Retired rockets
  - Total money spent by organization (horizontal)
  - Average money spent per organization (horizontal)
- **Parameters**:
  - `rot=0` - Horizontal x-axis labels
  - `figsize=(10,16)` - Large size for horizontal bars
  - `title` - Descriptive titles
- **Rationale**: Horizontal bars better for long organization names

### 3. Histograms (Pandas Plotting)
- **Library**: Pandas `.plot(kind='hist')`
- **Purpose**: Price distribution visualization
- **Parameters**:
  - `figsize=(10,10)` - Large square format
  - `alpha=0.8` - Transparency
- **Advantage**: Reveals price distribution shape and outliers

### 4. Choropleth Maps (Plotly Express)
- **Library**: `plotly.express.choropleth()`
- **Applications**:
  - Number of launches by country
  - Number of failures by country
- **Parameters**:
  - `locations` - ISO country codes (Alpha-3 format)
  - `color` - Numeric values (launch counts or failure counts)
  - `title` - Chart title
- **Data Preparation**: Country name standardization and ISO code conversion required
- **Advantage**: Spatial understanding of global launch distribution

### 5. Sunburst Charts (Plotly Express)
- **Library**: `plotly.express.sunburst()`
- **Purpose**: Hierarchical visualization of mission status
- **Parameters**:
  - `path=['Country', 'Organisation', 'Mission_Status']` - Three-level hierarchy
  - `title` - Chart title
- **Advantage**: Shows nested relationships (country → organization → status)

### 6. Line Charts (Pandas Plotting)
- **Library**: Pandas `.plot()` for time series
- **Applications**:
  - Number of launches per year
  - Number of launches per month
  - Average launch price over time (with rolling average)
  - Launches by top 10 organizations over time
  - Cold War launches by year (USA vs USSR)
  - Mission failures by year
  - Failure percentage over time
  - Launches by country over time
  - Launches by organization over time
- **Styling**:
  - `figsize=(16,8)` or `(16,10)` - Large, wide format
  - `title` - Descriptive titles
  - `ylabel` - Axis labels
  - `xlim(1957, 2020)` - Custom x-axis limits
  - `colormap='spring'` or `'plasma'` - Color schemes
  - `plt.legend(loc="upper right", ncol=4)` - Multi-column legend for many series
- **Rolling Averages**: `.rolling(30).mean()` overlay for price trends

### 7. Interactive Pie Charts (Plotly Express)
- **Library**: `plotly.express.pie()`
- **Purpose**: USA vs USSR launch comparison during Cold War
- **Parameters**:
  - `values` - Launch counts
  - `names` - Country codes (RUS, USA)
  - `title` - Chart title
- **Advantage**: Interactive exploration

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations and filtering
  - DateTime operations: `.dt.year`, `.dt.month`
  - String manipulation: `.apply(lambda x: x.split(',')[-1].strip())`
  - Type conversion: `pd.to_datetime()`, `.astype('float64')`
  - Aggregation: `.groupby()` with multiple functions
  - Data pivoting: `.unstack()`
  - Sorting: `.sort_values()`
  - Value replacement: `.replace()` with dictionaries

### Geographic Data
- **iso3166**: Country code conversion
  - `countries.get(x).alpha3` - Convert country names to ISO Alpha-3 codes
  - Required for choropleth map creation

### Statistical Analysis
- **NumPy**: Numerical operations
  - `np.mean` for average calculations in aggregations
  - Array operations

### Visualization
- **Matplotlib**: Base plotting library
  - Figure sizing and DPI control
  - Axis labels and titles
  - Legend customization
- **Seaborn**: Color palettes
  - `sns.color_palette("Set2")` - Color schemes for pie charts
- **Plotly Express**: Interactive visualizations
  - `px.choropleth()` - Geographic maps
  - `px.sunburst()` - Hierarchical charts
  - `px.pie()` - Interactive pie charts
- **Pandas Plotting**: Built-in plotting methods
  - `.plot(kind='pie')` - Pie charts
  - `.plot(kind='bar')` / `.plot(kind='barh')` - Bar charts
  - `.plot(kind='hist')` - Histograms
  - `.plot()` - Line charts for time series

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Data Loading and Exploration
- CSV file reading
- Shape and structure examination
- Missing value and duplicate detection
- Column removal (unused index columns)

### 2. Data Cleaning
- DateTime conversion with error handling
- Price string to numeric conversion
- Country name extraction and standardization
- ISO code conversion

### 3. Feature Engineering
- Year and month extraction from dates
- Country code conversion for mapping
- Historical country adjustments (Cold War analysis)

### 4. Descriptive Analysis
- Value counts for categorical variables
- Summary statistics for numeric variables
- Percentage calculations

### 5. Temporal Analysis
- Launches per year aggregation
- Launches per month aggregation
- Price trends over time with rolling averages
- Organization dominance over time

### 6. Geographic Analysis
- Country-level aggregations
- Choropleth map creation
- Historical country grouping (USSR analysis)

### 7. Organizational Analysis
- Total spending per organization
- Average spending per organization
- Launch counts per organization
- Temporal trends by organization

### 8. Comparative Analysis
- USA vs USSR during Cold War
- Top 10 organizations over time
- Success vs failure rates
- Failure percentage trends

### 9. Visualization
- Multiple chart types for different insights
- Interactive Plotly charts for exploration
- Static Pandas/Matplotlib for publication-quality output

## Key Analytical Insights Techniques

### Temporal Trend Analysis
- **Yearly Trends**: Line charts showing launches per year
- **Monthly Patterns**: Identify seasonal launch patterns
- **Rolling Averages**: Smooth price trends over time
- **Historical Periods**: Cold War era analysis (1957-1991)

### Geographic Distribution
- **Choropleth Maps**: Visualize global launch distribution
- **Country Standardization**: Handle historical country names
- **ISO Code Conversion**: Enable geographic mapping

### Organizational Dominance
- **Top 10 Analysis**: Identify leading organizations
- **Temporal Shifts**: Track dominance changes over decades
- **Financial Analysis**: Total and average spending per organization

### Success Rate Analysis
- **Mission Status Distribution**: Overall success rates
- **Failure Analysis**: Geographic and temporal failure patterns
- **Percentage Calculations**: Failure rates over time
- **Comparative Analysis**: USA vs USSR failure rates

### Cost Analysis
- **Price Distribution**: Histogram of launch costs
- **Organization Spending**: Total and average costs
- **Temporal Price Trends**: Price evolution over time with smoothing

### Hierarchical Analysis
- **Sunburst Charts**: Country → Organization → Status hierarchy
- **Multi-Level Grouping**: Complex aggregations across dimensions

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value and duplicate checks
2. **Robust DateTime Handling**: Error handling with `errors="coerce"` for mixed formats
3. **Geographic Data Standardization**: Country name normalization and ISO code conversion
4. **Temporal Feature Engineering**: Year and month extraction for analysis
5. **Appropriate Visualization Selection**: Chart types chosen based on data characteristics
6. **Time Series Smoothing**: Rolling averages to reveal trends
7. **Data Pivoting**: Unstack operations for time series visualization
8. **Historical Context Handling**: Country name adjustments for historical periods
9. **Missing Value Handling**: `.fillna(0)` for temporal aggregations
10. **Reproducible Analysis**: Clear code structure with logical flow

## Technical Challenges Addressed

1. **Mixed Date Formats**: `format="mixed"` parameter to handle various date formats
2. **Unparseable Dates**: `errors="coerce"` to handle invalid dates gracefully
3. **Country Name Inconsistencies**: Systematic replacement dictionary
4. **Historical Country Names**: Handling USSR, Kazakhstan, etc. for Cold War analysis
5. **ISO Code Conversion**: Using iso3166 library for choropleth map compatibility
6. **Price String Conversion**: Lambda function for comma removal
7. **Multi-Level Aggregations**: Complex groupby operations with unstack
8. **Temporal Smoothing**: Rolling averages for noisy time series data
9. **Percentage Calculations**: Division operations with missing value handling
10. **Data Pivoting**: Converting long format to wide format for multi-series line charts

## Summary

This project demonstrates proficiency in:
- **Data Cleaning**: DateTime conversion with error handling, string manipulation, geographic standardization
- **Geographic Analysis**: Country name wrangling, ISO code conversion, choropleth mapping
- **Temporal Analysis**: Yearly and monthly aggregations, rolling averages, trend identification
- **Statistical Analysis**: Aggregations, value counts, percentage calculations
- **Data Visualization**: 7+ different chart types (pie, bar, histogram, choropleth, sunburst, line)
- **Time Series Analysis**: Multi-organization and multi-country temporal comparisons
- **Comparative Analysis**: USA vs USSR, top organizations, success rates
- **Python Ecosystem**: Effective use of Pandas, NumPy, Matplotlib, Seaborn, Plotly, iso3166
- **Analysis Workflow**: From data loading through cleaning, transformation, analysis, to visualization

The analysis provides comprehensive insights into space mission patterns, revealing temporal trends, geographic distributions, organizational dominance shifts, cost patterns, and success rates, demonstrating how data science techniques can uncover meaningful patterns in historical space exploration data.
