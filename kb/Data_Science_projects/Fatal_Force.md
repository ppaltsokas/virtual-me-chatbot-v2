# Fatal Force Analysis

## Introduction

This project examines fatal force incidents involving law enforcement in the United States. The analysis explores patterns, trends, and demographic factors in fatal force encounters, providing insights into the data through statistical analysis and visualization.

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

This analysis examines fatal force incidents across multiple dimensions:

1. **Temporal Trends**: Analysis of incidents over time to identify patterns and changes
2. **Demographic Patterns**: Examination of demographic factors in fatal force encounters
3. **Geographic Distribution**: Spatial analysis of where incidents occur
4. **Circumstance Analysis**: Investigation of the circumstances surrounding incidents

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

This data analysis project provides a comprehensive examination of fatal force incidents, using data science techniques to uncover patterns and trends in law enforcement data. The analysis contributes to understanding the complex dynamics of fatal force encounters through rigorous statistical analysis and data visualization.
