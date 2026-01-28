# Introduction

This dataset was scraped from [nextspaceflight.com](https://nextspaceflight.com/launches/past/?page=1) and includes all the space missions since the beginning of Space Race between the USA and the Soviet Union in 1957!

### Install Package with Country Codes


```python
# pip install iso3166
```

### Upgrade Plotly

Run the cell below if you are working with Google Colab.


```python
# %pip install --upgrade plotly
```

### Import Statements


```python
import numpy as np
import pandas as pd
import plotly.express as px
import matplotlib.pyplot as plt
import seaborn as sns

# These might be helpful:
from iso3166 import countries
from datetime import datetime, timedelta
```

### Notebook Presentation


```python
pd.options.display.float_format = '{:,.2f}'.format
```

### Load the Data


```python
df_data = pd.read_csv('mission_launches.csv')
```

# Preliminary Data Exploration

* What is the shape of `df_data`? 
* How many rows and columns does it have?
* What are the column names?
* Are there any NaN values or duplicates?


```python
df_data.shape
```

There are 4324 rows and 9 columns


```python
print(f'The columns names are : {df_data.columns.values}')
```


```python
print(f'There are NaN values : {df_data.isna().values.any()}')
```


```python
df_data.isna().any()
```


```python
print(f'There are duplicated values : {df_data.duplicated().values.any()}')
```

## Data Cleaning - Check for Missing Values and Duplicates

Consider removing columns containing junk data. 


```python
df_data.head()
```


```python
df_data.tail()
```


```python
df_data.info()
```


```python
df_data.drop(['Unnamed: 0', 'Unnamed: 0.1'], inplace=True, axis = 1)
df_data.head()
```


```python
df_data["Date"] = pd.to_datetime(
    df_data["Date"],
    format="mixed",
    errors="coerce",
    utc=True
)
```


```python
print("Unparsed dates:", df_data["Date"].isna().sum())
df_data.loc[df_data["Date"].isna(), ["Date"]].head(10)
```


```python
df_data.Date
```


```python
df_data.Price = df_data.Price.apply(lambda x:str(x).replace(',','')).astype('float64')
```


```python
df_data.Price
```


```python
df_data.Price.isna().sum()
```

## Descriptive Statistics


```python
df_data.info()
```


```python
df_data.describe()
```

# Number of Launches per Company

Create a chart that shows the number of space mission launches by organisation.


```python
launches_per_company = df_data.Organisation.value_counts()
launches_per_company
```


```python
color_palette = sns.color_palette("Set2")
launches_per_company[:10].plot(
    kind='pie', 
    title='Number of Launches per Organisation (Top 10)',  
    figsize=(6,6),
    autopct='%1.1f%%',
    colors=color_palette
)
plt.ylabel('Organisation')  # Set the y-axis label

plt.show()
```

# Number of Active versus Retired Rockets

How many rockets are active compared to those that are decomissioned? 


```python
df_data.Rocket_Status.value_counts()
```


```python
df_data.Rocket_Status.value_counts().plot(
    kind='bar',
    title='Number of Active vs Decomissioned Rockets',
    rot=0,
)
```


```python
df_data.Rocket_Status.value_counts().plot(
    kind='pie',
    title='Number of Active vs Decomissioned Rockets',
    figsize = (5,5),
    autopct = '%1.2f%%',
    labels = None
)

plt.legend(labels = df_data.Rocket_Status.value_counts().index)
plt.show()
```

18.27% of the rockets are still active.

# Distribution of Mission Status

How many missions were successful?
How many missions failed?


```python
mission_status_df = df_data.Mission_Status.value_counts()
```


```python
mission_status_df
```


```python
mission_status_df.plot(
    kind='pie',
    figsize=(10,10),
    autopct='%1.1f%%',
    title = 'Distribution of Mission Status',
    labels=None
)

plt.legend(labels=mission_status_df.index)
plt.show()
```

89.7% of the missions were succesful while 7.8% failed to launch.

# How Expensive are the Launches? 

Create a histogram and visualise the distribution. The price column is given in USD millions (careful of missing values). 


```python
cost_distribution = df_data.Price.value_counts()
```


```python
cost_distribution
```


```python
df_data.Price.plot(
    kind='hist',
    title = "Distribution of the Mission's Expenses (in USD millions)",
    figsize = (10,10),
    alpha=0.8
)
```


```python

```

# Use a Choropleth Map to Show the Number of Launches by Country

* Create a choropleth map using [the plotly documentation](https://plotly.com/python/choropleth-maps/)
* Experiment with [plotly's available colours](https://plotly.com/python/builtin-colorscales/). I quite like the sequential colour `matter` on this map. 
* You'll need to extract a `country` feature as well as change the country names that no longer exist.

Wrangle the Country Names

You'll need to use a 3 letter country code for each country. You might have to change some country names.

* Russia is the Russian Federation
* New Mexico should be USA
* Yellow Sea refers to China
* Shahrud Missile Test Site should be Iran
* Pacific Missile Range Facility should be USA
* Barents Sea should be Russian Federation
* Gran Canaria should be USA


You can use the iso3166 package to convert the country names to Alpha3 format.


```python
df_data['Country'] = df_data['Location'].apply(lambda x: x.split(',')[-1].strip())
df_data['Country'].value_counts()
```


```python
df_data['Country'].replace(
    {
        'Russia':'Russian Federation',
        'Iran':'Iran, Islamic Republic of',
        'New Mexico':'USA',
        'Barents Sea':'Russian Federation',
        'Gran Canaria':'USA',
        'Yellow Sea':'China',
        'Shahrud Missile Test Site':'Iran, Islamic Republic of',
        'Pacific Missile Range Facility':'USA',
        'North Korea':"Korea, Democratic People's Republic of",
        'Pacific Ocean':'Kiribati',
        'South Korea':'Korea, Republic of'
    }, 
    inplace=True
)
df_data['Country'] = df_data['Country'].apply(lambda x: countries.get(x).alpha3)
df_data['Country'].value_counts()
```


```python
launches_per_country = df_data['Country'].value_counts()
launches_per_country
```


```python
px.choropleth(
    launches_per_country,
    locations=launches_per_country.index,
    color=launches_per_country,
    title = 'Number of Launches by Country'
)
```

# Use a Choropleth Map to Show the Number of Failures by Country



```python
failures_per_country = df_data[df_data['Mission_Status'] == 'Failure']['Country'].value_counts()
failures_per_country
```


```python
px.choropleth(
    failures_per_country,
    locations=failures_per_country.index,
    color=failures_per_country,
    title = 'Number of Failures by Country'
)
```

# Create a Plotly Sunburst Chart of the countries, organisations, and mission status. 


```python
px.sunburst(df_data, path=['Country', 'Organisation', 'Mission_Status'], title='Mission Status by Country and Organization')
```

# Analyse the Total Amount of Money Spent by Organisation on Space Missions


```python
money_spent_by_organization = df_data.groupby('Organisation')['Price'].sum()
money_spent_by_organization[money_spent_by_organization!=0]
```


```python
money_spent_by_organization[money_spent_by_organization!=0].sort_values().plot(
    kind='barh',
    title = 'Total Money Spent by Organization',
    figsize=(10,16)
)

plt.xlabel('Money Spent (USD Million Dollars)')
plt.show()
```

# Analyse the Amount of Money Spent by Organisation per Launch


```python
avg_money_spent = df_data.groupby('Organisation').agg({'Price':np.mean})
avg_money_spent.dropna()
```


```python
avg_money_spent.dropna().sort_values('Price').plot(
    kind='barh',
    figsize=(10,16),
    title='Average Money Spent per Organisation',
)

plt.xlabel('Average Price (USD Million Dollars')
plt.show()
```

# Chart the Number of Launches per Year


```python
df_data['Year'] = df_data['Date'].dt.year
launches_per_year = df_data.groupby('Year')['Detail'].count()
launches_per_year
```


```python
launches_per_year.plot(
    title='Number of Launches over the years',
    figsize = (16,8)
)

plt.ylabel('Number of Missions') 
plt.show()
```

# Chart the Number of Launches Month-on-Month until the Present

Which month has seen the highest number of launches in all time? Superimpose a rolling average on the month on month time series chart. 


```python
launches_per_month = df_data.groupby(df_data['Date'].dt.month)['Detail'].count()
launches_per_month
```


```python
plt.figsize = (16,8)
launches_per_month.plot(title = 'Number of Launches per month')

plt.ylabel('Number of Missions') 
plt.show()
```

# Launches per Month: Which months are most popular and least popular for launches?

Some months have better weather than others. Which time of year seems to be best for space missions?


```python
launches_per_month[launches_per_month == launches_per_month.max()]
```


```python
launches_per_month[launches_per_month == launches_per_month.min()]
```

It appears that most launches take place in December

# How has the Launch Price varied Over Time? 

Create a line chart that shows the average price of rocket launches over time. 


```python
price_over_time = df_data.dropna().groupby('Date')['Price'].mean()
price_over_time
```


```python
price_over_time.rolling(30).mean().plot(
    figsize = (16,8),
    title = 'Average Launch Price over Time'
)
```

# Chart the Number of Launches over Time by the Top 10 Organisations. 

How has the dominance of launches changed over time between the different players? 


```python
top_10_organisations = df_data['Organisation'].value_counts().sort_values(ascending=False)[:10].index.tolist()
top_10_organisations
```


```python
launches_by_top_10 = df_data[df_data['Organisation'].isin(top_10_organisations)].groupby(['Year','Organisation'])['Detail'].count().unstack(level=1)
launches_by_top_10.fillna(0, inplace=True) 
launches_by_top_10
```


```python
launches_by_top_10.plot(
    figsize=(16,8),
    title = 'Number of Launches over time by Top 10 Organisations',
)

plt.ylabel('Number of Launches')
plt.show()
```

USAF was realising the most launches up until the beginning of the 60s when RVSN USSR took helm on the race until the beginning of the 90s. That's when the RVSN rapidly lost ground up until they completely stoped launching. After that Arianespace, Boeing and VKS RF seemed to lead the race, up until mid 2010s when CASC surpassed them and has been leading since.

# Cold War Space Race: USA vs USSR

The cold war lasted from the start of the dataset up until 1991. 


```python
cold_war_df = df_data[df_data['Year']<=1991].sort_values('Year').reset_index(drop=True)
```


```python
cold_war_df.head()
```


```python
cold_war_df.shape
```


```python
cold_war_df['Country'].duplicated().any()
```


```python
for country in cold_war_df['Country'].drop_duplicates():
  print(countries.get(country))
```

## Create a Plotly Pie Chart comparing the total number of launches of the USSR and the USA

Hint: Remember to include former Soviet Republics like Kazakhstan when analysing the total number of launches. 


```python
cold_war_df['Country'].replace(
    {'KAZ':'RUS'},
    inplace=True
)
cold_war_df['Country'].value_counts()
```


```python
ussr_vs_usa = cold_war_df[cold_war_df['Country'].isin(['RUS','USA'])]
ussr_vs_usa
```


```python
px.pie(
    title = 'Total Number of Launches (USSR vs USA)',
    values = ussr_vs_usa['Country'].value_counts(),
    names = ussr_vs_usa['Country'].value_counts().index,
)
```

## Create a Chart that Shows the Total Number of Launches Year-On-Year by the Two Superpowers


```python
cold_war_launch_by_year = ussr_vs_usa.groupby(['Year','Country'])['Mission_Status'].count().unstack(level=1)
cold_war_launch_by_year
```


```python
cold_war_launch_by_year.plot(
    figsize = (16,8),
    title = 'Total Launches by Year (USSR vs USA)'
)
```

## Chart the Total Number of Mission Failures Year on Year.


```python
cold_war_mission_failures_by_year = ussr_vs_usa[ussr_vs_usa['Mission_Status']!='Success'].groupby(['Year', 'Country'])['Mission_Status'].count().unstack(level=1)
cold_war_mission_failures_by_year.fillna(0, inplace=True)
cold_war_mission_failures_by_year
```


```python
cold_war_mission_failures_by_year.plot(
    figsize = (16,8),
    title = 'Total Mission Failures by Year (USSR vs USA)',
    colormap='spring'
)
```

## Chart the Percentage of Failures over Time

Did failures go up or down over time? Did the countries get better at minimising risk and improving their chances of success over time? 


```python
cold_war_failpct_by_year = cold_war_mission_failures_by_year/cold_war_launch_by_year * 100
cold_war_failpct_by_year.fillna(0, inplace=True)
cold_war_failpct_by_year
```


```python
cold_war_failpct_by_year.plot(
    figsize = (16,8),
    title = 'Mission Failure Percentage by Year (USSR vs USA)',
    colormap='plasma'
)
```

# For Every Year Show which Country was in the Lead in terms of Total Number of Launches up to and including including 2020)

Do the results change if we only look at the number of successful launches? 


```python
launches_by_country_per_year = df_data.groupby(['Year', 'Country'])['Mission_Status'].count().unstack(level=1)
launches_by_country_per_year.fillna(0, inplace=True)
launches_by_country_per_year
```


```python
launches_by_country_per_year.plot(
    title = 'Number of Launches by Country over the Years',
    figsize = (16,10),
)
```

# Create a Year-on-Year Chart Showing the Organisation Doing the Most Number of Launches

Which organisation was dominant in the 1970s and 1980s? Which organisation was dominant in 2018, 2019 and 2020? 


```python
launches_by_organisation_per_year = df_data.groupby(['Year', 'Organisation'])['Mission_Status'].count().unstack(level=1)
launches_by_organisation_per_year.fillna(0, inplace=True)
launches_by_organisation_per_year
```


```python
launches_by_organisation_per_year.plot(
    title = 'Number of Launches by Organisation over the Years',
    figsize = (16,10),
)

plt.ylabel('Number of Missions')
plt.xlim(1957, 2020)
plt.legend(loc="upper right", ncol=4)
plt.show()
```
