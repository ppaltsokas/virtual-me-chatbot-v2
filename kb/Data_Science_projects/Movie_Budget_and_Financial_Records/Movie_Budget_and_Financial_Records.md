# -------------------------- Movie Budgets and Financial Performance --------------------
## Do higher film budgets lead to more box office revenue? Let's find out if there's a relationship using the movie budgets and financial performance data scraped from [the-numbers.com](https://www.the-numbers.com/movie/budgets)

# Import Statements


```python
import pandas as pd
import matplotlib.pyplot as plt

```

# Notebook Presentation


```python
pd.options.display.float_format = '{:,.2f}'.format

from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
```

# Read the Data


```python
data = pd.read_csv('cost_revenue_dirty.csv')
```

# Explore and Clean the Data


```python
data
```

## Rows and columns


```python
data.shape
```

## NaN values 


```python
data.isna().values.any()
```

## Duplicate rows


```python
data.duplicated().any()  #will return True id there are duplicates
```


```python
data[data.duplicated()] #show the duplicated rows
```

## Columns Data Types


```python
data.info()
```

## Data Type Conversions

### Will convert the `USD_Production_Budget`, `USD_Worldwide_Gross`, and `USD_Domestic_Gross` columns to a numeric format by removing `$` signs and `,`. 
<br>
<br>
Note that *domestic* in this context refers to the United States.


```python
data.USD_Domestic_Gross = data.USD_Domestic_Gross.astype(str).str.replace('$', "")
```


```python
data.USD_Domestic_Gross = data.USD_Domestic_Gross.astype(str).str.replace(',', "")
```


```python
data.USD_Domestic_Gross = pd.to_numeric(data.USD_Domestic_Gross)
```


```python
data.USD_Worldwide_Gross = data.USD_Worldwide_Gross.astype(str).str.replace('$', "")
```


```python
data.USD_Worldwide_Gross = data.USD_Worldwide_Gross.astype(str).str.replace(',', "")
```


```python
data.USD_Worldwide_Gross = pd.to_numeric(data.USD_Worldwide_Gross)
```


```python
data.USD_Production_Budget = data.USD_Production_Budget.astype(str).str.replace('$', "")
```


```python
data.USD_Production_Budget = data.USD_Production_Budget.astype(str).str.replace(',', "")
```


```python
data.USD_Production_Budget = pd.to_numeric(data.USD_Production_Budget)
```


```python
data
```

### Seek and Destroy


```python
chars_to_remove = [',', '$']
columns_to_clean = ['USD_Production_Budget', 
                    'USD_Worldwide_Gross',
                    'USD_Domestic_Gross']
 
for col in columns_to_clean:
    for char in chars_to_remove:
        # Replace each character with an empty string
        data[col] = data[col].astype(str).str.replace(char, "")
    # Convert column to a numeric data type
    data[col] = pd.to_numeric(data[col])
```


```python
data
```

### Will convert the `Release_Date` column to a Pandas Datetime type. 


```python
data.Release_Date = pd.to_datetime(data.Release_Date)
```


```python
data.info()
```

## Descriptive Statistics

### What is the average production budget of the films in the data set?


```python
avg_budget = data.USD_Production_Budget.mean()
avg_budget
```


```python
print(f"The average production budget of the films is {round(avg_budget, 2)}")
```

###  What is the average worldwide gross revenue of films?


```python
avg_gross = data.USD_Worldwide_Gross.mean()
avg_gross
```


```python
    print(f"The average worldwide gross revenue of the films is {round(avg_gross, 2)}")
```

### Are the bottom 25% of films actually profitable or do they lose money?
### What are the highest production budget and highest worldwide gross revenue of any film?
### How much revenue did the lowest and highest budget films make?


```python
data.describe()
```


```python
data[data.USD_Production_Budget == 1100]
```


```python
data[data.USD_Production_Budget == 425000000]
```

# Investigating the Zero Revenue Films


```python
zero_domestic = data[data.USD_Domestic_Gross == 0]
zero_domestic
```


```python
zero_domestic.sort_values('USD_Production_Budget', ascending = False)
```


```python
zero_worldwide = data[data.USD_Worldwide_Gross == 0]
zero_worldwide
```


```python
zero_worldwide.sort_values('USD_Production_Budget', ascending = False)
```

### Filtering on Multiple Conditions


```python
international_releases = data.loc[(data.USD_Domestic_Gross == 0) & (data.USD_Worldwide_Gross != 0)]
international_releases
```

# or ...


```python
international_releases2 = data.query('USD_Domestic_Gross == 0 and USD_Worldwide_Gross != 0')
international_releases2
```

### Unreleased Films


```python
# Date of Data Collection
scrape_date = pd.Timestamp('2018-5-1')
```


```python
future_releases = data[data.Release_Date >= scrape_date]
future_releases
```


```python
data_clean = data.drop(future_releases.index)
data_clean

```

### Films that Lost Money



```python
losing_money = data_clean.loc[data_clean.USD_Worldwide_Gross < data_clean.USD_Production_Budget]
losing_money
```


```python
len(losing_money)/len(data_clean)
```

# Seaborn for Data Viz: Bubble Charts


```python
import seaborn as sns
```


```python
plt.figure(figsize = (8,4), dpi=150)

with sns.axes_style('darkgrid'):
    ax = sns.scatterplot(data=data_clean, 
                     x='Release_Date', 
                     y='USD_Production_Budget', 
                     hue = 'USD_Worldwide_Gross',
                     size = 'USD_Worldwide_Gross')
    ax.set(ylim = (0, 450000000),
       xlim = (data_clean.Release_Date.min(), data_clean.Release_Date.max()),
       ylabel = 'Budget in $100Billions',
       xlabel = 'Year')
    
plt.show()
```

# Converting Years to Decades


```python
dt_index = pd.DatetimeIndex(data_clean.Release_Date)
dt_index
```

### Turn dates into years


```python
years = dt_index.year
years
```

### Turn years into decades with floor division. 1995 / 10 = 199.5 , but 1995 // 10 = 199. So 199 * 10 = 1990


```python
decades = (years // 10)*10
decades
```

### Add a "Decades" column in the data frame


```python
data_clean['Decade'] = decades
data_clean
```

### Separate the "old" (before 1969) and "New" (1970s onwards) Films



```python
old_films = data_clean[data_clean.Decade <= 1969]
new_films = data_clean[data_clean.Decade > 1969]
old_films
```


```python
new_films
```


```python
old_films.describe()
```


```python
old_films.sort_values('USD_Production_Budget', ascending = False).head(10)
```

# Seaborn Regression Plots


```python
plt.figure(figsize = (10,4), dpi=200)


with sns.axes_style('whitegrid'):
    ax = sns.regplot(data = old_films, 
                     x = 'USD_Production_Budget', 
                     y = 'USD_Worldwide_Gross', 
                     scatter_kws = {'alpha' : 0.4}, 
                     line_kws = {'color' : 'black'})
```


```python
plt.figure(figsize = (10,4), dpi=200)


with sns.axes_style('darkgrid'):
    ax = sns.regplot(data = new_films, 
                     x = 'USD_Production_Budget', 
                     y = 'USD_Worldwide_Gross', 
                     color = '#2f4b7c',
                     scatter_kws = {'alpha' : 0.4}, 
                     line_kws = {'color' : '#ff7c43'})
    
    ax.set(ylim = (0, 3000000000),
           xlim = (0, 450000000),
           ylabel = 'Revenue in $ Billions',
           xlabel = 'Budget in $100 Millions')
```

# Running Regression with scikit-learn

$$ REV \hat ENUE = \theta _0 + \theta _1 BUDGET$$


```python
from sklearn.linear_model import LinearRegression
```

### Will run a linear regression for the `old_films` and Calculate the intercept, slope and r-squared. 
### How much of the variance in movie revenue does the linear model explain in this case?


```python
regression = LinearRegression()
```

### Explanatory variable (Feature in ML)


```python
X = pd.DataFrame(new_films, columns = ['USD_Production_Budget'])
```

### Response variable (Target in ML)



```python
y = pd.DataFrame(new_films, columns = ['USD_Worldwide_Gross'])
```

### Creating DataFrames because LinearRegression doesn't like to receive Pandas Series

# Will find the best fit line


```python
regression.fit(X, y)
```


```python
regression.intercept_    #Theta zero
```


```python
regression.coef_         #Theta one
```


```python
regression.score(X, y)   #R²
```

Our model explains about 56% of the variance in movie revenue.

### Regression


```python
X = pd.DataFrame(old_films, columns = ['USD_Production_Budget'])
y = pd.DataFrame(old_films, columns = ['USD_Worldwide_Gross'])
```


```python
regression.fit(X, y)
```


```python
regression.intercept_
```


```python
regression.coef_
```


```python
regression.score(X, y)
```


```python
print(f'The intercept is : {regression.intercept_}')
print(f'The slope is : {regression.coef_}')
print(f'The R² is : {regression.score(X, y)}')
print(f'That means our model explains {round(regression.score(X, y) * 100)}% of the variance in movie revenue.')
```

### How much global revenue does our model estimate for a film with a budget of i.e. $350 million? 


```python
budget = 350000000
```


```python
revenue_estimate = regression.intercept_[0] + regression.coef_[0,0] * budget
```


```python
revenue_estimate
```


```python
revenue_estimate = round(revenue_estimate, -6)   # me to -6 can round stin 6h taxi aristera tis ypodiastolis. Sto ekatommyrio dld, 10^6
```


```python

revenue_estimate
```


```python
print(f'The revenue estimate for a movie with a budget of ${budget} is expected to be around ${revenue_estimate:.10}')
```
