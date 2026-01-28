# Introduction

Since Jan. 1, 2015, [The Washington Post](https://www.washingtonpost.com/) has been compiling a database of every fatal shooting in the US by a police officer in the line of duty. 

<center><img src=https://i.imgur.com/sX3K62b.png></center>

While there are many challenges regarding data collection and reporting, The Washington Post has been tracking more than a dozen details about each killing. This includes the race, age and gender of the deceased, whether the person was armed, and whether the victim was experiencing a mental-health crisis. The Washington Post has gathered this supplemental information from law enforcement websites, local new reports, social media, and by monitoring independent databases such as "Killed by police" and "Fatal Encounters". The Post has also conducted additional reporting in many cases.

There are 4 additional datasets: US census data on poverty rate, high school graduation rate, median household income, and racial demographics. [Source of census data](https://factfinder.census.gov/faces/nav/jsf/pages/community_facts.xhtml).


```python
# %pip install --upgrade plotly

# # Need this to make map chart to png
# %conda install -c plotly plotly-orca
```

## Import Statements


```python
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import seaborn as sns

from collections import Counter

import matplotlib.patches as mpatches
import matplotlib.colors as colors

import random
```

## Notebook Presentation


```python
pd.options.display.float_format = '{:,.2f}'.format
```

## Load the Data


```python
df_hh_income = pd.read_csv('Median_Household_Income_2015.csv', encoding="windows-1252")
df_pct_poverty = pd.read_csv('Pct_People_Below_Poverty_Level.csv', encoding="windows-1252")
df_pct_completed_hs = pd.read_csv('Pct_Over_25_Completed_High_School.csv', encoding="windows-1252")
df_share_race_city = pd.read_csv('Share_of_Race_By_City.csv', encoding="windows-1252")
df_fatalities = pd.read_csv('Deaths_by_Police_US.csv', encoding="windows-1252")
```

# Preliminary Data Exploration

* What is the shape of the DataFrames? 
* How many rows and columns do they have?
* What are the column names?
* Are there any NaN values or duplicates?


```python
df_fatalities.info()
```


```python
df_hh_income.info()
```


```python
df_pct_completed_hs.info()
```


```python
df_pct_poverty.info()
```


```python
df_share_race_city.info()
```

## Data Cleaning - Check for Missing Values and Duplicates

Consider how to deal with the NaN values. Perhaps substituting 0 is appropriate. 

## Check for NaN values


```python
df_fatalities.isna().any()
```


```python
df_fatalities.isna().sum()
```


```python
df_hh_income.isna().any()
```


```python
#Replace NaN with 0
df_hh_income['Median Income'] = df_hh_income['Median Income'].replace(np.nan, 0)
```


```python
df_pct_completed_hs.isna().any()
```


```python
df_pct_poverty.isna().any()
```


```python
df_share_race_city.isna().any()
```

## Check Duplicate Rows


```python
df_fatalities.duplicated().any()
```


```python
df_hh_income.duplicated().any()
```


```python
df_pct_completed_hs.duplicated().any()
```


```python
df_pct_poverty.duplicated().any()
```


```python
df_share_race_city.duplicated().any()
```

# Chart the Poverty Rate in each US State

Create a bar chart that ranks the poverty rate from highest to lowest by US state. Which state has the highest poverty rate? Which state has the lowest poverty rate?  Bar Plot


```python
df_share_race_city.head(10)
```


```python
df_hh_income.head(10)
```


```python
df_pct_completed_hs.head(10)
```


```python
df_pct_poverty.head(10)
```


```python
df_pct_poverty.info()
```


```python
df_pct_poverty['Geographic Area'].unique()    
```


```python
df_pct_poverty['poverty_rate'].unique()
```


```python
df_pct_poverty[df_pct_poverty.poverty_rate == "-"]
```


```python
len(df_pct_poverty['poverty_rate'].unique())
```


```python
df_pct_poverty.poverty_rate.replace('-', np.nan, regex=True, inplace=True)
```


```python
df_pct_poverty[df_pct_poverty.poverty_rate.isna()]
```


```python
df_pct_poverty.poverty_rate = df_pct_poverty.poverty_rate.astype(float)
```


```python
df_pct_poverty.info()
```


```python
poverty = df_pct_poverty.groupby('Geographic Area')['poverty_rate'].mean().sort_values(ascending = False)
```


```python
poverty
```


```python
plt.style.use('seaborn-v0_8-deep')

plt.figure(figsize=(14,4))
plt.suptitle('Poverty Rate per US State')
plt.ylabel('Poverty Rate', fontsize = 15)
plt.xlabel('US State', fontsize = 15)

for n in range(len(poverty)):
    plt.xticks(fontsize = 10, rotation = 45)
    plt.yticks(fontsize = 15)
    plt.bar(poverty.index[n], poverty[n])

plt.show()
```

# Chart the High School Graduation Rate by US State

Show the High School Graduation Rate in ascending order of US States. Which state has the lowest high school graduation rate? Which state has the highest?


```python
df_pct_completed_hs.percent_completed_hs.replace('-', np.nan, regex = True, inplace = True)
df_pct_completed_hs.percent_completed_hs = df_pct_completed_hs.percent_completed_hs.astype(float)
```


```python
df_pct_completed_hs.info()
```


```python
graduation = df_pct_completed_hs.groupby('Geographic Area')['percent_completed_hs'].mean().sort_values(ascending = False)
```


```python
graduation
```


```python
plt.figure(figsize=(14,4))
plt.suptitle('High School Graduation Rate by US State')
plt.ylabel('High School Graduation Rate', fontsize=14)
plt.xlabel('US State', fontsize=14)

plt.xticks(fontsize = 10, rotation = 45)
plt.yticks(fontsize = 14)
plt.scatter(graduation.index, graduation)

plt.show()
```

# Visualise the Relationship between Poverty Rates and High School Graduation Rates

#### Create a line chart with two y-axes to show if the ratios of poverty and high school graduation move together.  


```python
graduation_vs = df_pct_completed_hs.groupby('Geographic Area')['percent_completed_hs'].mean()
graduation_vs
```


```python
poverty_vs = df_pct_poverty.groupby('Geographic Area')['poverty_rate'].mean()
```


```python
poverty_vs
```


```python
plt.figure(figsize=(14, 4))
plt.suptitle('Poverty Rates vs High School Graduation Rates')
plt.xlabel('US State', fontsize=14)
plt.xticks(fontsize=10, rotation=55)

ax1 = plt.gca()
ax2 = ax1.twinx()

ax1.set_ylabel('Poverty', color='#E5141E')
ax2.set_ylabel('Graduation', color='darkgreen')

ax1.plot(poverty_vs.index, poverty_vs, color='#E5141E', linewidth=3, linestyle='--')
ax2.plot(graduation_vs.index, graduation_vs, color='darkgreen', linewidth=3, marker='o')

# Reverse the y-axis for the graduation rate
ax2.invert_yaxis()

plt.show()
```

#### Now use a Seaborn .jointplot() with a Kernel Density Estimate (KDE) and/or scatter plot to visualise the same relationship


```python
df_pct_poverty
```


```python
df_pct_poverty.poverty_rate = pd.to_numeric(df_pct_poverty.poverty_rate)
df_pct_poverty.sort_values('poverty_rate', ascending=False, inplace=True)
poverty = df_pct_poverty.groupby('Geographic Area', as_index=False).agg({'poverty_rate': pd.Series.mean})
```


```python
poverty
```


```python
df_pct_completed_hs.percent_completed_hs = pd.to_numeric(df_pct_completed_hs.percent_completed_hs)
df_pct_completed_hs.sort_values('percent_completed_hs', ascending=False, inplace=True)
hs = df_pct_completed_hs.groupby('Geographic Area', as_index=False).agg({'percent_completed_hs': pd.Series.mean})
```


```python
merged = pd.merge(hs, poverty, on=['Geographic Area'], how='inner')
```


```python
merged
```


```python
sns.set_theme(style="ticks")

sns.jointplot(x='poverty_rate', y='percent_completed_hs', data=merged, kind='kde')
plt.show()
```

#### Seaborn's `.lmplot()` or `.regplot()` to show a linear regression between the poverty ratio and the high school graduation ratio. 


```python
sns.set_theme(color_codes=True)

sns.lmplot(x='poverty_rate', y='percent_completed_hs', data=merged)
plt.show()
```


```python
sns.regplot(x='poverty_rate', y='percent_completed_hs', data=merged)
plt.show()
```

# Create a Bar Chart with Subsections Showing the Racial Makeup of Each US State

Visualise the share of the white, black, hispanic, asian and native american population in each US State using a bar chart with sub sections. 


```python
df_share_race_city
```


```python
df_share_race_city[['share_white', 'share_black', 'share_native_american', 'share_asian', 'share_hispanic']] = df_share_race_city[['share_white', 'share_black', 'share_native_american', 'share_asian', 'share_hispanic']].apply(pd.to_numeric, errors='coerce')
```


```python
racial = df_share_race_city.groupby('Geographic area').agg({'share_white': 'mean', 'share_black': 'mean', 'share_native_american': 'mean', 'share_asian': 'mean', 'share_hispanic': 'mean'})
racial.info()
```


```python
racial.plot(kind='bar', stacked=True, figsize=(14,8))
plt.suptitle('Racial Makeup of Each US State')
plt.ylabel('%', fontsize=14)
plt.xlabel('US State', fontsize=14)

white_legend = mpatches.Patch(label='White', color='blue')
black_legend = mpatches.Patch(label='Black', color='orange')
native_american_legend = mpatches.Patch(label='Native American', color='green')
asian_legend = mpatches.Patch(label='Asian', color='red')
hispanic_legend = mpatches.Patch(label='Hispanic', color='purple')

plt.legend(handles=[white_legend, black_legend, native_american_legend, asian_legend, hispanic_legend], loc='best', frameon=False)

plt.xticks(fontsize=10, rotation=75)
plt.yticks(fontsize=10)

plt.show()
```

# Create Donut Chart by of People Killed by Race

Hint: Use `.value_counts()`


```python
killed = df_fatalities.race.value_counts()
```


```python
killed
```


```python
df_fatalities.race.unique()
```


```python
label_mapping = {
    'W': 'White',
    'B': 'Black',
    'H': 'Hispanic',
    'A': 'Asian',
    'N': 'Native American',
    'O': 'Other'
}

# Replace the index labels using the map function
killed.index = killed.index.map(label_mapping)
```


```python
import plotly.graph_objects as go

labels = killed.index
values = killed.values

fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=.6, textinfo='label+percent')])

fig.update_layout(title='People Killed by Race')
fig.show()
```

# Create a Chart Comparing the Total Number of Deaths of Men and Women

Use `df_fatalities` to illustrate how many more men are killed compared to women. 


```python
killed_gender = df_fatalities.gender.value_counts()
killed_gender
```


```python
gender = killed_gender.index
count = killed_gender.values

```


```python
plt.bar(gender, count)


plt.xlabel("Gender")
plt.ylabel("Number of Deaths")
plt.title("Total Number of Deaths by Gender")


plt.show()
```

# Create a Box Plot Showing the Age and Manner of Death

Break out the data by gender using `df_fatalities`. Is there a difference between men and women in the manner of death? 


```python
df_fatalities.age = df_fatalities.age.replace(np.nan, 0)
```


```python
df_fatalities.age.isnull().any()
```


```python
death_age = df_fatalities[['age', 'manner_of_death', 'gender']]
```


```python
death_age
```


```python
plt.figure(figsize=(10,10))
sns.boxplot(x="manner_of_death", y="age", data=death_age)

plt.xlabel("Manner of Death")
plt.ylabel("Age")
plt.title("Box Plot of Age and Manner of Death")

plt.show()
```

# Were People Armed? 

In what percentage of police killings were people armed? Create chart that show what kind of weapon (if any) the deceased was carrying. How many of the people killed by police were armed with guns versus unarmed? 


```python
weapons = df_fatalities.armed.unique()
```


```python
weapons
```


```python
df_fatalities.armed.unique()
```


```python
# Rename the 'armed' column to 'weapon'
df_fatalities.rename(columns={'armed': 'weapon'}, inplace=True)

# Create the 'armed' column
df_fatalities['armed'] = df_fatalities['weapon'] != 'unarmed'

# Print the updated dataframe
print(df_fatalities)
```


```python
armed_pctg = len(df_fatalities[df_fatalities.armed == True]) / len(df_fatalities) * 100
```


```python
armed_pctg=round(armed_pctg,2)
```


```python
print(f'In police killings, {armed_pctg}% of the victims were armed.')
```


```python
df_fatalities['armed'] = df_fatalities['armed'].map({True: 'armed', False: 'unarmed'})
```


```python
df_fatalities.armed
```


```python
percentage = df_fatalities.armed.value_counts()
```


```python
percentage
```


```python
plt.bar(percentage.index, percentage.values)


plt.xlabel("Armed/Unarmed")
plt.ylabel("Number of Deaths")
plt.title("Total Number of Armed and Unarmed Victims")


plt.show()
```


```python
percentage = df_fatalities['armed'].value_counts() * 100

plt.pie(percentage.values, labels=percentage.index, autopct='%1.1f%%')

plt.title("Distribution of Armed and Unarmed Victims")
plt.xlabel("Armed/Unarmed")

plt.show()
```


```python
weapon_counts = df_fatalities['weapon'].value_counts()
weapon_counts
```


```python
plt.figure(figsize=(10,16), dpi = 200)
plt.barh(weapon_counts.index, weapon_counts.values)

plt.xlabel("Weapon Type", fontsize = 14)
plt.ylabel("Number of Deaths", fontsize = 14)
plt.title("Number of Deaths by Weapon Type")

plt.xticks(fontsize=10, rotation=90)
plt.yticks(fontsize=10)

plt.show()
```

# How Old Were the People Killed?

Work out what percentage of people killed were under 25 years old.  


```python
u25 = df_fatalities[df_fatalities.age < 25]
```


```python
pct_u25 = round(len(u25) / len(df_fatalities) * 100, 2)
```


```python
print(f'{pct_u25}% of the people killed by the police, were under 25 years old.')
```

Create a histogram and KDE plot that shows the distribution of ages of the people killed by police. 


```python
plt.figure(figsize = (14,8))
sns.histplot(data=df_fatalities, x='age', bins=30, kde=True)

plt.xlabel("Age", fontsize=14)
plt.ylabel("Frequency", fontsize=14)
plt.title("Distribution of Ages of People Killed by Police", fontsize=16)

plt.xticks(fontsize=10)
plt.yticks(fontsize=10)

plt.show()
```

Create a seperate KDE plot for each race. Is there a difference between the distributions? 


```python
plt.figure(figsize = (14,8))
sns.histplot(data=df_fatalities, x='age', bins=50, kde=True, hue='race', element='step')

plt.xlabel("Age", fontsize=14)
plt.ylabel("Frequency", fontsize=14)
plt.title("Distribution of Ages of People Killed by Police per Race", fontsize=16)

plt.xticks(fontsize=10)
plt.yticks(fontsize=10)

plt.show()
```

# Race of People Killed

Create a chart that shows the total number of people killed by race. 


```python
race_kill = df_fatalities.race.value_counts()
race_kill
```


```python
plt.figure(figsize = (8,8))
plt.pie(race_kill.values, labels=race_kill.index, autopct='%1.1f%%',pctdistance=1.35, labeldistance=1.1)

plt.suptitle("Distribution of Victims by Race", fontsize = 15)
plt.xlabel("Race", fontsize = 15)

plt.show()
```

# Mental Illness and Police Killings

What percentage of people killed by police have been diagnosed with a mental illness?


```python
mental = df_fatalities.signs_of_mental_illness.value_counts()
mental
```


```python
plt.figure(figsize = (8,8))
plt.pie(mental.values, labels=mental.index, autopct='%1.1f%%',pctdistance=1.35, labeldistance=1.1)

plt.suptitle("Distribution of Victims That Suffered From Mental Illness", fontsize = 15)
plt.xlabel("Mental Illness", fontsize = 15)

plt.show()
```

# In Which Cities Do the Most Police Killings Take Place?

Create a chart ranking the top 10 cities with the most police killings. Which cities are the most dangerous?  


```python
cities = df_fatalities.city.value_counts().head(10)
cities
```


```python
plt.figure(figsize=(14,8))
plt.suptitle('The Top 10 Cities With The Most Police Killings', fontsize=16)
plt.ylabel('Police Killings', fontsize=14)
plt.xlabel('City', fontsize=14)
plt.xticks(fontsize=13, rotation=45)
plt.yticks(fontsize=13)
plt.bar(cities.index, cities, label=cities.index, linewidth=3, color = 'lightblue', edgecolor = 'gray')
plt.show()
```

# Rate of Death by Race

Find the share of each race in the top 10 cities. Contrast this with the top 10 cities of police killings to work out the rate at which people are killed by race for each city. 


```python
df_fatalities[['city', 'race']]
```


```python
cities
```


```python
top = df_fatalities[['city', 'race']]
for c in cities.index:
    top_cities = top.loc[top['city'] == c]
    city = top_cities.race.value_counts()
    plt.bar(city.index, city, label=c)
    plt.legend(loc='best')
    plt.show()

```

# Create a Choropleth Map of Police Killings by US State

Which states are the most dangerous? Compare your map with your previous chart. Are these the same states with high degrees of poverty? 


```python
states_to_map = df_fatalities.groupby('state').size().sort_values(ascending=False)
states_to_map
```


```python
import plotly.graph_objects as go
fig = go.Figure(data=go.Choropleth(locations=states_to_map.index, z = states_to_map, locationmode = 'USA-states', 
                                   colorscale = 'Oranges', colorbar_title = "Police Killings",))

fig.update_layout(title_text = 'Police Killings by US State', geo_scope='usa')

fig.show()
```

# Number of Police Killings Over Time

Analyse the Number of Police Killings over Time. Is there a trend in the data? 


```python
monthly_fatalities = df_fatalities.copy()
monthly_fatalities.date = pd.to_datetime(monthly_fatalities.date, infer_datetime_format=True).dt.to_period('m')
monthly_fatalities.date = monthly_fatalities.date.astype(str)
```


```python
history = monthly_fatalities.groupby('date').size()
history
```


```python
plt.figure(figsize=(14,8))
plt.plot(history.index, history, linewidth=3)
plt.xticks(ticks=history.index, fontsize=10, rotation=45)
plt.suptitle('Police Killings Over Time')
plt.xlabel('Month', fontsize=14)
plt.ylabel('Killings', fontsize=14)

plt.show()
```
