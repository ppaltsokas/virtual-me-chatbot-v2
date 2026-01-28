# Introduction

Google Trends gives us an estimate of search volume. Let's explore if search popularity relates to other kinds of data. Perhaps there are patterns in Google's search volume and the price of Bitcoin or a hot stock like Tesla. Perhaps search volume for the term "Unemployment Benefits" can tell us something about the actual unemployment rate? 

Data Sources: <br>
<ul>
<li> <a href="https://fred.stlouisfed.org/series/UNRATE/">Unemployment Rate from FRED</a></li>
<li> <a href="https://trends.google.com/trends/explore">Google Trends</a> </li>  
<li> <a href="https://finance.yahoo.com/quote/TSLA/history?p=TSLA">Yahoo Finance for Tesla Stock Price</a> </li>    
<li> <a href="https://finance.yahoo.com/quote/BTC-USD/history?p=BTC-USD">Yahoo Finance for Bitcoin Stock Price</a> </li>
</ul>

# Import Statements


```python
import pandas as pd
import matplotlib.pyplot as plt
```

# Read the Data

Download and add the .csv files to the same folder as your notebook.


```python
df_tesla = pd.read_csv('TESLA Search Trend vs Price.csv')

df_btc_search = pd.read_csv('Bitcoin Search Trend.csv')
df_btc_price = pd.read_csv('Daily Bitcoin Price.csv')

df_unemployment = pd.read_csv('UE Benefits Search vs UE Rate 2004-19.csv')
```

# Data Exploration

### Tesla

**Challenge**: <br>
<ul>
<li>What are the shapes of the dataframes? </li>
<li>How many rows and columns? </li>
<li>What are the column names? </li>
<li>Complete the f-string to show the largest/smallest number in the search data column</li> 
<li>Try the <code>.describe()</code> function to see some useful descriptive statistics</li>
<li>What is the periodicity of the time series data (daily, weekly, monthly)? </li>
<li>What does a value of 100 in the Google Trend search popularity actually mean?</li>
</ul>


```python
df_tesla
# df_tesla.shape

```


```python
df_tesla.isna().values.any() #checking for number of NaN values
```


```python
df_tesla.describe()
```


```python
max_tsl = df_tesla.TSLA_WEB_SEARCH.max()
max_tsl
```


```python
min_tsl = df_tesla.TSLA_WEB_SEARCH.min()
min_tsl
```


```python
print(f'Largest value for Tesla in Web Search: {max_tsl}')
print(f'Smallest value for Tesla in Web Search: {min_tsl}')
```

### Unemployment Data


```python
df_unemployment
# df_unemployment.tail()
# df_unemployment.describe()
# df_unemployment.shape
# df_unemployment.columns
#df_unemployment.isna().values.any()
```


```python
df_unemployment['UE_BENEFITS_WEB_SEARCH'].max()
```


```python
max_un = df_unemployment['UE_BENEFITS_WEB_SEARCH'].max()
```


```python
print('Largest value for "Unemployemnt Benefits" '
      f'in Web Search: {max_un} ')
```

### Bitcoin


```python
df_btc_price
```


```python
df_btc_price.shape
```


```python
df_btc_search
```


```python
df_btc_search.shape
```


```python
max_btc = df_btc_search['BTC_NEWS_SEARCH'].max()
max_btc
```


```python
print(f'largest BTC News Search: {max_btc}')
```

# Data Cleaning

### Check for Missing Values

**Challenge**: Are there any missing values in any of the dataframes? If so, which row/rows have missing values? How many missing values are there?


```python
df_tesla.isna().values.any()
```


```python
df_btc_price.isna().values.any()  #vlepw oti exw missing values
```


```python
df_btc_price.isna().sum()   #vlepw se pia stili exw missing values kai posa
```


```python
df_btc_price[df_btc_price.CLOSE.isna()]    #emfanizw ta missing values gia na exw kai to index id wste na ta svisw
```


```python
df_btc_search.isna().values.any()
```


```python
df_unemployment.isna().values.any()
```


```python
print(f'Missing values for Tesla?: 0')
print(f'Missing values for U/E?: 0')
print(f'Missing values for BTC Search?: 0')
```


```python
print(f'Missing values for BTC price?: {df_btc_price.isna().values.any()}')
```


```python
print(f'Number of missing values: {df_btc_price.isna().sum().sum()}')
```

**Challenge**: Remove any missing values that you found. 


```python
df_btc_price.dropna(inplace = True)    #Diwxnw ta NaN values antika8istwntas to arxiko df
```

### Convert Strings to DateTime Objects

**Challenge**: Check the data type of the entries in the DataFrame MONTH or DATE columns. Convert any strings in to Datetime objects. Do this for all 4 DataFrames. Double check if your type conversion was successful.


```python
print(df_tesla['MONTH'][1]) #checking
type(df_tesla['MONTH'][1])
```


```python
print(pd.to_datetime(df_tesla['MONTH'][1])) #checking after pd.to_datetime
type(pd.to_datetime(df_tesla['MONTH'][1]))
```


```python
df_tesla.MONTH = pd.to_datetime(df_tesla['MONTH'])  #converting the whole column
```


```python
df_tesla.MONTH.head()
```

### Converting from Daily to Monthly Data

[Pandas .resample() documentation](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.resample.html) <br>


```python
df_btc_price.DATE = pd.to_datetime(df_btc_price['DATE'])
```


```python
df_btc_price.DATE.head()
```


```python
df_btc_monthly = df_btc_price.resample('M', on='DATE').last()
```


```python
df_btc_monthly
```

# Data Visualisation

### Notebook Formatting & Style Helpers


```python
# Create locators for ticks on the time axis
```


```python
# Register date converters to avoid warning messages
```

### Tesla Stock Price v.s. Search Volume

**Challenge:** Plot the Tesla stock price against the Tesla search volume using a line chart and two different axes. Label one axis 'TSLA Stock Price' and the other 'Search Trend'. 


```python
plt.figure(figsize=(14,8), dpi = 120)
plt.title('Tesla Web Search vs Price', fontsize = 18)
plt.xticks(fontsize=14, rotation=45)
plt.yticks(fontsize=14)
ax1 = plt.gca() 
ax2 = ax1.twinx()

ax1.set_ylabel('TSLA Stock Price', color='#E6232E', fontsize=14)
ax2.set_ylabel('Search Trend', color='skyblue', fontsize=14)

ax1.set_ylim([0,600])
ax1.set_xlim([df_tesla.MONTH.min(), df_tesla.MONTH.max()])

ax1.plot(df_tesla['MONTH'], df_tesla['TSLA_USD_CLOSE'], color='#E6232E', linewidth = 3)
ax2.plot(df_tesla['MONTH'], df_tesla['TSLA_WEB_SEARCH'], color='skyblue', linewidth = 3)

plt.show()
```

**Challenge**: Add colours to style the chart. This will help differentiate the two lines and the axis labels. Try using one of the blue [colour names](https://matplotlib.org/3.1.1/gallery/color/named_colors.html) for the search volume and a HEX code for a red colour for the stock price. 
<br>
<br>
Hint: you can colour both the [axis labels](https://matplotlib.org/3.3.2/api/text_api.html#matplotlib.text.Text) and the [lines](https://matplotlib.org/3.2.1/api/_as_gen/matplotlib.lines.Line2D.html#matplotlib.lines.Line2D) on the chart using keyword arguments (kwargs).  


```python
#done above
```

**Challenge**: Make the chart larger and easier to read. 
1. Increase the figure size (e.g., to 14 by 8). 
2. Increase the font sizes for the labels and the ticks on the x-axis to 14. 
3. Rotate the text on the x-axis by 45 degrees. 
4. Make the lines on the chart thicker. 
5. Add a title that reads 'Tesla Web Search vs Price'
6. Keep the chart looking sharp by changing the dots-per-inch or [DPI value](https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.pyplot.figure.html). 
7. Set minimum and maximum values for the y and x axis. Hint: check out methods like [set_xlim()](https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.axes.Axes.set_xlim.html). 
8. Finally use [plt.show()](https://matplotlib.org/3.2.1/api/_as_gen/matplotlib.pyplot.show.html) to display the chart below the cell instead of relying on the automatic notebook output.


```python
#done above
```

How to add tick formatting for dates on the x-axis. 


```python
import matplotlib.dates as mdates

#code from earlier
plt.figure(figsize=(14,8), dpi = 120)
plt.title('Tesla Web Search vs Price', fontsize = 18)
plt.xticks(fontsize=14, rotation=45)
plt.yticks(fontsize=14)
ax1 = plt.gca() 
ax2 = ax1.twinx()

ax1.set_ylabel('TSLA Stock Price', color='#E6232E', fontsize=14)
ax2.set_ylabel('Search Trend', color='skyblue', fontsize=14)

ax1.set_ylim([0,600])
ax1.set_xlim([df_tesla.MONTH.min(), df_tesla.MONTH.max()])

ax1.plot(df_tesla['MONTH'], df_tesla['TSLA_USD_CLOSE'], color='#E6232E', linewidth = 3)
ax2.plot(df_tesla['MONTH'], df_tesla['TSLA_WEB_SEARCH'], color='skyblue', linewidth = 3)

#create locators for ticks on the time axis
years = mdates.YearLocator()
months = mdates.MonthLocator()
years_fmt = mdates.DateFormatter('%Y')

#format the ticks
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)


plt.show()
```

### Bitcoin (BTC) Price v.s. Search Volume

**Challenge**: Create the same chart for the Bitcoin Prices vs. Search volumes. <br>
1. Modify the chart title to read 'Bitcoin News Search vs Resampled Price' <br>
2. Change the y-axis label to 'BTC Price' <br>
3. Change the y- and x-axis limits to improve the appearance <br>
4. Investigate the [linestyles](https://matplotlib.org/3.2.1/api/_as_gen/matplotlib.pyplot.plot.html ) to make the BTC price a dashed line <br>
5. Investigate the [marker types](https://matplotlib.org/3.2.1/api/markers_api.html) to make the search datapoints little circles <br>
6. Were big increases in searches for Bitcoin accompanied by big increases in the price?


```python
#code from earlier
plt.figure(figsize=(14,8), dpi = 120)
plt.title('Bitcoin News Search vs Resampled Price', fontsize = 18)
plt.xticks(fontsize=14, rotation=45)
plt.yticks(fontsize=14)
ax1 = plt.gca() 
ax2 = ax1.twinx()

ax1.set_ylabel('BTC Price', color='#F08F2E', fontsize=14)
ax2.set_ylabel('Search Volumes', color='skyblue', fontsize=14)

ax1.set_ylim([0,15000])
ax1.set_xlim([df_btc_monthly.index.min(), df_btc_monthly.index.max()])

ax1.plot(df_btc_monthly.index, df_btc_monthly['CLOSE'], color='#F08F2E', linewidth = 3, linestyle = '--')
ax2.plot(df_btc_monthly.index, df_btc_search['BTC_NEWS_SEARCH'], color='skyblue', linewidth = 2, marker = 'o')

#create locators for ticks on the time axis
years = mdates.YearLocator()
months = mdates.MonthLocator()
years_fmt = mdates.DateFormatter('%Y')

#format the ticks
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)


plt.show()
```


```python

```

### Unemployement Benefits Search vs. Actual Unemployment in the U.S.

**Challenge** Plot the search for "unemployment benefits" against the unemployment rate. 
1. Change the title to: Monthly Search of "Unemployment Benefits" in the U.S. vs the U/E Rate <br>
2. Change the y-axis label to: FRED U/E Rate <br>
3. Change the axis limits <br>
4. Add a grey [grid](https://matplotlib.org/3.2.1/api/_as_gen/matplotlib.pyplot.grid.html) to the chart to better see the years and the U/E rate values. Use dashes for the line style<br> 
5. Can you discern any seasonality in the searches? Is there a pattern? 


```python
df_unemployment['MONTH'] = pd.to_datetime(df_unemployment['MONTH'])
#If i didn't do this line ,i would get an error due to the fact that you're passing a sequence 
#(in this case, a list) to ax1.set_xlim(), which expects individual values for the left and right limits, not a sequence.


#code from earlier
plt.figure(figsize=(14,8), dpi = 120)
plt.title('Monthly Search of "Unemployment Benefits" in the U.S. vs the U/E Rate', fontsize = 18)
plt.xticks(fontsize=14, rotation=45)
plt.yticks(fontsize=14)
ax1 = plt.gca() 
ax2 = ax1.twinx()
ax1.grid(color='grey', linestyle = '--')

ax1.set_ylabel('Search Trend', color='#F08F2E', fontsize=14)
ax2.set_ylabel('FRED U/E Rate', color='skyblue', fontsize=14)

ax2.set_ylim([3,10.5])
ax1.set_xlim([df_unemployment.MONTH.min(), df_unemployment.MONTH.max()])

ax1.plot(df_unemployment['MONTH'], df_unemployment['UE_BENEFITS_WEB_SEARCH'] , color='#F08F2E', linewidth = 3)
ax2.plot(df_unemployment['MONTH'], df_unemployment['UNRATE'], color='skyblue', linewidth = 3)

#format the ticks
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)


plt.show()
```

**Challenge**: Calculate the 3-month or 6-month rolling average for the web searches. Plot the 6-month rolling average search data against the actual unemployment. What do you see in the chart? Which line moves first?



```python
plt.figure(figsize=(14,8), dpi = 120)
plt.title('Rolling monthly "Unemployment Benefits" in the U.S. vs the U/E Rate', fontsize = 18)
plt.xticks(fontsize=14, rotation=45)
plt.yticks(fontsize=14)
ax1 = plt.gca() 
ax2 = ax1.twinx()
ax1.grid(color='grey', linestyle = '--')

ax1.set_ylabel('Search Trend', color='#F08F2E', fontsize=14)
ax2.set_ylabel('FRED U/E Rate', color='skyblue', fontsize=14)

ax2.set_ylim([3,10.5])
ax1.set_xlim([df_unemployment.MONTH.min(), df_unemployment.MONTH.max()])

# Calculate the rolling average over a 6 month window
roll_df = df_unemployment[['UE_BENEFITS_WEB_SEARCH', 'UNRATE']].rolling(window=6).mean()
 
ax2.plot(df_unemployment.MONTH, roll_df.UNRATE, 'skyblue', linewidth=3)
ax1.plot(df_unemployment.MONTH, roll_df.UE_BENEFITS_WEB_SEARCH, color='#F08F2E', linewidth=3)

#format the ticks
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)


plt.show()
```

### Including 2020 in Unemployment Charts

**Challenge**: Read the data in the 'UE Benefits Search vs UE Rate 2004-20.csv' into a DataFrame. Convert the MONTH column to Pandas Datetime objects and then plot the chart. What do you see?


```python
df_ue_2020 = pd.read_csv("UE Benefits Search vs UE Rate 2004-20.csv")
df_ue_2020

```


```python
df_ue_2020.MONTH = pd.to_datetime(df_ue_2020.MONTH)
```


```python
plt.figure(figsize=(14,8), dpi=120)
plt.yticks(fontsize=14)
plt.xticks(fontsize=14, rotation=45)
plt.title('Monthly US "Unemployment Benefits" Web Search vs UNRATE incl 2020', fontsize=18)
 
ax1 = plt.gca()
ax2 = ax1.twinx()
 
ax1.set_ylabel('FRED U/E Rate', color='purple', fontsize=16)
ax2.set_ylabel('Search Trend', color='skyblue', fontsize=16)
 
ax1.set_xlim([df_ue_2020.MONTH.min(), df_ue_2020.MONTH.max()])
 
ax1.plot(df_ue_2020.MONTH, df_ue_2020.UNRATE, 'purple', linewidth=3)
ax2.plot(df_ue_2020.MONTH, df_ue_2020.UE_BENEFITS_WEB_SEARCH, 'skyblue', linewidth=3)
 
plt.show()
```


```python

```
