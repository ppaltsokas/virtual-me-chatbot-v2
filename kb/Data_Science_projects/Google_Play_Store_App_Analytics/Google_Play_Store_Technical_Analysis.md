# Google Play Store App Analytics - Technical Data Science Methods

## Project Overview

This project performs comprehensive analysis of the Android app market using Google Play Store data from 2018, examining app categories, pricing strategies, user engagement metrics, and market dynamics through statistical analysis and interactive visualizations.

## Data Source

- **Dataset**: Google Play Store Apps (scraped by Lavanya Gupta, 2018)
- **Source**: Kaggle dataset
- **Primary File**: `apps.csv` containing app metadata, ratings, reviews, installs, pricing, and categorization

## Data Cleaning and Preprocessing Techniques

### Initial Data Exploration
- **Shape Analysis**: `.shape` to determine dataset dimensions
- **Column Inspection**: `.columns` to identify available features
- **Random Sampling**: `.sample(5)` for quick data preview
- **Missing Value Detection**: `.isna().sum()` for systematic NaN identification
- **Data Type Inspection**: `.info()` and `.describe()` for data structure understanding

### Column Removal
- **Unused Column Dropping**: Removed `Last_Updated` and `Android_Ver` columns using `.drop(['Last_Updated', 'Android_Ver'], axis=1, inplace=True)`
- **Rationale**: Columns not relevant to analysis objectives

### Missing Value Handling
- **NaN Detection in Ratings**: Identified missing ratings using `.Rating.isna().sum()`
- **Complete Row Removal**: Created `df_apps_clean` using `.dropna()` to remove all rows with missing ratings
- **Impact Assessment**: Compared original shape vs cleaned shape to quantify data loss

### Duplicate Detection and Removal
- **Duplicate Identification**: Used `.duplicated()` to find exact duplicates
- **Specific App Analysis**: Examined duplicates for specific apps (e.g., Instagram) using boolean indexing
- **Subset-Based Deduplication**: Used `.drop_duplicates(subset=['App', 'Type', 'Price'])` to remove duplicates based on key identifying columns
- **Rationale**: Some apps may have legitimate differences in other columns, so deduplication focused on core identifying features

## Data Type Conversion and Transformation

### String to Numeric Conversion

#### Installs Column
- **Problem**: Installs stored as strings with comma separators (e.g., "1,000,000+")
- **Solution**: Two-step process:
  1. Remove commas: `.astype(str).str.replace(',', "")`
  2. Convert to numeric: `pd.to_numeric()`
- **Result**: Enables mathematical operations and sorting

#### Price Column
- **Problem**: Prices stored as strings with dollar signs (e.g., "$4.99")
- **Solution**: 
  1. Remove dollar signs: `.astype(str).str.replace('$', "")`
  2. Convert to numeric: `pd.to_numeric()`
- **Application**: Enables price-based filtering and calculations

### Data Filtering
- **Outlier Removal**: Filtered apps with price > $250 using boolean indexing: `df_apps_clean[df_apps_clean['Price'] < 250]`
- **Rationale**: Extremely expensive apps likely represent data errors or edge cases not representative of typical market

## Statistical Analysis Methods

### Descriptive Statistics
- **Value Counts**: Used extensively for categorical analysis:
  - Content ratings distribution
  - Category distribution
  - App type (Free vs Paid)
  - Genre analysis
- **Sorting Operations**: `.sort_values()` used for ranking:
  - Highest rated apps
  - Largest apps by size
  - Most reviewed apps
  - Highest priced apps

### Aggregation Operations
- **Groupby Aggregations**:
  - `.groupby('Category').agg({'Installs': pd.Series.sum})` - Total installs per category
  - `.groupby('Category').agg({'App': pd.Series.count})` - Number of apps per category
  - `.groupby(['Category', 'Type'], as_index=False).agg({'App': pd.Series.count})` - Multi-level grouping for free vs paid analysis

### Calculated Metrics
- **Revenue Estimation**: Created new column using vectorized multiplication:
  - `df_apps_clean['Revenue Estimate'] = df_apps_clean.Installs.mul(df_apps_clean.Price)`
  - Ballpark estimate of potential revenue for paid apps
- **Median Calculations**: `.median()` for central tendency in pricing analysis

### Data Merging
- **Inner Joins**: Used `pd.merge()` to combine category-level statistics:
  - Merged app count and install totals: `pd.merge(cat_number, category_installs, on='Category', how='inner')`
  - Created comprehensive category analysis DataFrame

## Advanced Data Extraction Techniques

### Nested Data Handling
- **Problem**: Genres column contained multiple genres separated by semicolons (e.g., "Action;Adventure")
- **Solution**: Used string splitting and stacking:
  1. Split: `.str.split(';', expand=True)`
  2. Stack: `.stack()` to create single-column Series
  3. Value counts: `.value_counts()` to get unique genre frequencies
- **Result**: Extracted individual genres from nested format for accurate genre analysis

## Visualization Techniques and Rationale

### 1. Pie Charts (Plotly Express)
- **Library**: `plotly.express.pie()`
- **Purpose**: Content rating distribution
- **Parameters**:
  - `labels` and `values` from value_counts
  - `textposition='outside'` for label placement
  - `textinfo='percent+label'` for display format
- **Advantage**: Interactive hover tooltips, easy to understand proportions

### 2. Donut Charts
- **Library**: `plotly.express.pie()` with `hole=0.6`
- **Purpose**: Same as pie charts but with modern donut style
- **Rationale**: More visually appealing, allows for center annotations if needed

### 3. Vertical Bar Charts
- **Library**: `plotly.express.bar()`
- **Purpose**: Top 10 categories by number of apps (competition analysis)
- **Parameters**:
  - `x` and `y` from value_counts
  - Custom axis titles via `update_layout()`
- **Rationale**: Clear ranking visualization, easy comparison

### 4. Horizontal Bar Charts
- **Library**: `plotly.express.bar()` with `orientation='h'`
- **Purpose**: Category popularity by total downloads
- **Parameters**:
  - Sorted ascending for better readability
  - `xaxis=dict(type='log')` for logarithmic scale
- **Rationale**: 
  - Horizontal orientation better for long category names
  - Log scale handles wide range of download values (millions to billions)

### 5. Scatter Plots
- **Library**: `plotly.express.scatter()`
- **Purpose**: Category concentration analysis (Downloads vs Competition)
- **Parameters**:
  - `size='App'` - Bubble size represents number of apps
  - `hover_name` - Interactive category identification
  - `color='Installs'` - Color intensity represents total installs
  - `yaxis=dict(type='log')` - Logarithmic scale for installs
- **Insight**: Reveals market concentration - categories with few apps but high downloads vs. crowded categories

### 6. Grouped Bar Charts
- **Library**: `plotly.express.bar()` with `barmode='group'`
- **Purpose**: Free vs Paid apps comparison by category
- **Parameters**:
  - `color='Type'` - Different colors for Free/Paid
  - `barmode='group'` - Side-by-side bars
  - `xaxis={'categoryorder': 'total descending'}` - Sort by total apps
  - `yaxis=dict(type='log')` - Log scale for wide range
  - `xaxis_tickangle=45` - Rotated labels for readability
- **Rationale**: Direct comparison of monetization strategies across categories

### 7. Box Plots
- **Library**: `plotly.express.box()`
- **Applications**:

#### a) Free vs Paid Installs
- **Purpose**: Compare download distributions
- **Parameters**:
  - `notched=True` - Shows confidence intervals
  - `points='all'` - Shows all data points
  - `yaxis=dict(type='log')` - Log scale for installs
- **Insight**: Reveals median difference and distribution spread

#### b) Revenue by Category
- **Purpose**: Revenue distribution analysis for paid apps
- **Parameters**:
  - `xaxis={'categoryorder': 'min ascending'}` - Sort by median revenue
  - `yaxis=dict(type='log')` - Log scale for revenue
  - `box.add_hline(y=30000)` - Reference line for development cost threshold
- **Insight**: Identifies categories where apps can recoup development costs

#### c) Pricing by Category
- **Purpose**: Price distribution analysis
- **Parameters**:
  - `xaxis={'categoryorder': 'max descending'}` - Sort by maximum price
  - `yaxis=dict(type='log')` - Log scale for prices
  - `box.add_hline(y=2.99)` - Reference line for typical app price
- **Insight**: Reveals pricing strategies and premium categories

### 8. Color Scales
- **Library**: Plotly built-in color scales
- **Purpose**: Enhanced bar chart visualization
- **Parameters**:
  - `color_continuous_scale='Agsunset'` - Gradient color scheme
  - `coloraxis_showscale=False` - Hide color scale legend
- **Rationale**: Visual intensity represents magnitude, improves chart aesthetics

## Python Libraries and Tools

### Core Data Manipulation
- **Pandas**: Primary data manipulation library
  - DataFrame operations, filtering, sorting
  - Groupby aggregations
  - Data merging and joining
  - String manipulation methods (`.str.replace()`, `.str.split()`)
  - Type conversion (`pd.to_numeric()`, `.astype()`)

### Visualization
- **Plotly Express**: Interactive visualization library
  - `px.pie()` - Pie and donut charts
  - `px.bar()` - Bar charts (vertical and horizontal)
  - `px.scatter()` - Scatter plots with advanced features
  - `px.box()` - Box plots with customization
  - `.update_layout()` - Layout customization
  - `.update_traces()` - Trace-level customization
  - `.add_hline()` - Reference line addition

### Data Presentation
- **Pandas Display Options**: `pd.options.display.float_format = '{:,.2f}'.format` for readable numeric output

## Analysis Workflow

### 1. Data Loading and Initial Exploration
- CSV file reading
- Shape and structure examination
- Column identification
- Random sampling for preview

### 2. Data Quality Assessment
- Missing value detection and quantification
- Duplicate identification
- Data type validation
- Outlier detection (high prices)

### 3. Data Cleaning
- Column removal (unused features)
- Missing value removal (ratings)
- Duplicate removal (subset-based)
- Outlier filtering (price > $250)

### 4. Data Transformation
- String to numeric conversion (installs, prices)
- Calculated field creation (revenue estimates)
- Nested data extraction (genres)

### 5. Aggregation and Grouping
- Category-level aggregations
- Multi-level grouping (category + type)
- Merging aggregated datasets

### 6. Statistical Analysis
- Descriptive statistics (value counts, medians)
- Ranking and sorting operations
- Distribution analysis (box plots)

### 7. Visualization and Communication
- Interactive Plotly charts
- Multiple chart types for different insights
- Custom styling and layout
- Reference lines for context

## Key Analytical Insights Techniques

### Market Competition Analysis
- **App Count per Category**: Identifies crowded vs. niche markets
- **Category Concentration Scatter**: Reveals market structure (concentrated vs. fragmented)

### User Engagement Analysis
- **Total Installs per Category**: Measures category popularity
- **Reviews Analysis**: Identifies most engaging apps
- **Rating Distribution**: Quality assessment

### Monetization Strategy Analysis
- **Free vs Paid Comparison**: Market monetization patterns
- **Revenue Estimation**: Potential earnings analysis
- **Pricing Strategy**: Price point optimization by category

### Market Opportunity Identification
- **Low Competition, High Demand**: Categories with few apps but high installs
- **Revenue Potential**: Categories where paid apps can recoup costs
- **Pricing Insights**: Optimal price points by category

## Data Science Best Practices Demonstrated

1. **Systematic Data Cleaning**: Comprehensive missing value and duplicate handling
2. **Appropriate Visualization Selection**: Chart types chosen based on data characteristics and analysis goals
3. **Interactive Visualizations**: Plotly enables exploration and engagement
4. **Data Integration**: Proper merging of aggregated statistics
5. **Calculated Metrics**: Revenue estimation for business insights
6. **Outlier Handling**: Filtering extreme values that represent data errors
7. **Nested Data Extraction**: Advanced string manipulation for complex data structures
8. **Logarithmic Scaling**: Appropriate use for wide-ranging numeric data
9. **Reference Lines**: Contextual markers (development costs, typical prices)
10. **Reproducible Analysis**: Clear code structure with logical flow

## Technical Challenges Addressed

1. **String-Based Numeric Data**: Converted comma-separated numbers and currency-formatted prices
2. **Nested Categorical Data**: Extracted individual genres from semicolon-separated values
3. **Wide Data Ranges**: Used logarithmic scaling for installs, revenue, and prices
4. **Missing Values**: Systematic identification and removal strategy
5. **Duplicate Handling**: Subset-based deduplication for accurate app counts
6. **Data Merging**: Combined multiple aggregation results for comprehensive analysis
7. **Interactive Visualization**: Leveraged Plotly for engaging, explorable charts

## Summary

This project demonstrates proficiency in:
- **Data Cleaning**: Systematic handling of missing values, duplicates, type conversions, and outliers
- **Data Transformation**: String manipulation, numeric conversion, calculated fields
- **Statistical Analysis**: Descriptive statistics, aggregations, distribution analysis
- **Advanced Data Extraction**: Nested data handling using string splitting and stacking
- **Interactive Visualization**: Comprehensive use of Plotly Express for multiple chart types
- **Business Analysis**: Revenue estimation, market opportunity identification, pricing strategy analysis
- **Python Ecosystem**: Effective use of Pandas for data manipulation and Plotly for visualization
- **Analysis Workflow**: From data loading through cleaning, transformation, analysis, to visualization

The analysis provides actionable insights into Android app market dynamics, helping identify opportunities, understand competition, and inform pricing and monetization strategies.
