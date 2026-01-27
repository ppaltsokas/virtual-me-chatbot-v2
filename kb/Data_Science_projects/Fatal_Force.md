# Fatal Force Analysis

## Project Overview

**Fatal Force Analysis** is a comprehensive data analysis project examining fatal force incidents involving law enforcement in the United States. This project analyzes patterns, trends, and demographic factors in fatal force encounters, providing insights through statistical analysis and data visualization.

The **Fatal Force Analysis** project investigates fatal force incidents, police shootings, and law enforcement use of force data to understand patterns and trends in these critical events.

### Import Statements

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from datetime import datetime
```

### Notebook Presentation

```python
pd.options.display.float_format = '{:,.2f}'.format
```

### Load the Data

```python
df = pd.read_csv('fatal_force_data.csv')
```

### Data Exploration

```python
print(f"Dataset shape: {df.shape}")
print(f"\nColumns: {df.columns.tolist()}")
df.head()
```

### Data Cleaning and Preparation

```python
# Check for missing values
print("Missing values per column:")
print(df.isnull().sum())

# Check data types
print("\nData types:")
print(df.dtypes)
```

### Descriptive Statistics

```python
df.describe()
```

### Key Findings and Analysis

The **Fatal Force Analysis** project examines fatal force incidents across multiple dimensions:

1. **Temporal Trends**: Analysis of fatal force incidents over time to identify patterns and changes in frequency
2. **Demographic Patterns**: Examination of demographic factors (race, age, gender) in fatal force encounters
3. **Geographic Distribution**: Spatial analysis of where fatal force incidents occur across different states and regions
4. **Circumstance Analysis**: Investigation of the circumstances surrounding fatal force incidents, including weapons involved, threat level, and context

### Fatal Force Analysis Methodology

The **Fatal Force Analysis** employs a systematic approach:
- Data collection and cleaning of fatal force incident records
- Exploratory data analysis to identify key patterns
- Statistical analysis to test hypotheses about factors influencing fatal force
- Visualization to communicate findings effectively

### Visualizations

The project includes various visualizations such as:
- Time series plots showing trends over time
- Demographic breakdowns by race, age, and gender
- Geographic heatmaps showing incident distribution
- Comparative analyses across different categories

### Statistical Analysis

The analysis employs statistical methods to:
- Identify significant patterns and trends
- Compare rates across different demographic groups
- Examine correlations between variables
- Test hypotheses about factors influencing fatal force incidents

### Insights

Key insights from the analysis include:
- Patterns in fatal force incidents over time
- Demographic disparities in fatal force encounters
- Geographic variations in incident rates
- Circumstances most commonly associated with fatal force

### Conclusion

The **Fatal Force Analysis** project provides a comprehensive examination of fatal force incidents, using data science techniques to uncover patterns and trends in law enforcement data. This analysis contributes to understanding the complex dynamics of fatal force encounters through rigorous statistical analysis and data visualization.

## Project Keywords

Fatal Force Analysis, fatal force incidents, police shootings, law enforcement data, use of force analysis, statistical analysis of fatal force, demographic patterns in fatal force, geographic distribution of fatal force incidents
