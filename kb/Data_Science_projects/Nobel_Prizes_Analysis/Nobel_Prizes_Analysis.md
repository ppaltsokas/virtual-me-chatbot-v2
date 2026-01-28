# Setup and Context

### Introduction

On November 27, 1895, Alfred Nobel signed his last will in Paris. When it was opened after his death, the will caused a lot of controversy, as Nobel had left much of his wealth for the establishment of a prize.

Alfred Nobel dictates that his entire remaining estate should be used to endow “prizes to those who, during the preceding year, have conferred the greatest benefit to humankind”.

Every year the Nobel Prize is given to scientists and scholars in the categories chemistry, literature, physics, physiology or medicine, economics, and peace. 

Let's see what patterns we can find in the data of the past Nobel laureates. What can we learn about the Nobel prize and our world more generally?

### Import Statements


```python
import pandas as pd
import numpy as np
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt
```

### Notebook Presentation


```python
pd.options.display.float_format = '{:,.2f}'.format
```

### Read the Data


```python
df_data = pd.read_csv('nobel_prize_data.csv')
```

### Explore the DataFrame


```python
df_data.shape
```


```python
df_data.columns
```


```python
df_data.head()
```


```python
df_data.tail()
```

### Check for Duplicates


```python
df_data.duplicated().values.any()
```


```python
print(f"There are duplicates : {df_data.duplicated().values.any()}")
```

### Check for NaN Values


```python
print(f"There are NaN values : {df_data.isna().values.any()}")
```


```python
df_data.isna().sum()
```


```python
col_subset = ['year', 'category', 'laureate_type', 'birth_date', 'full_name', 'organization_name']
```


```python
df_data.loc[df_data.birth_date.isna()][col_subset]
```


```python
df_data.loc[df_data.organization_name.isna()][col_subset]
```

#### Convert Year and Birth Date to Datetime


```python
df_data.birth_date = pd.to_datetime(df_data.birth_date)
```


```python
df_data.info()
```

#### Add a Column with the Prize Share as a Percentage


```python
separated_values = df_data.prize_share.str.split('/', expand = True)
numerator = pd.to_numeric(separated_values[0])
denomerator = pd.to_numeric(separated_values[1])
df_data['share_pct'] = numerator / denomerator
```

# Plotly Donut Chart: Percentage of Male vs. Female Laureates


```python
sex = df_data.sex.value_counts()
```


```python
sex
```


```python

fig = px.pie(labels=sex.index, 
             values=sex.values,
             title="Percentage of Male vs. Female Winners",
             names=sex.index,
             hole=0.4,)
 
fig.update_traces(textposition='inside', textfont_size=15, textinfo='percent')
 
fig.show()
```

# Who were the first 3 Women to Win the Nobel Prize?



```python
df_data
```


```python
df_women.sort_values('year', ascending = True).head(3)
```

# Repeat Winners




```python
is_winner = df_data.duplicated(subset=['full_name'], keep=False)
```


```python
multiple_winners = df_data[is_winner]
```


```python
multiple_winners
```


```python
col_subset = ['year', 'category', 'laureate_type', 'full_name']
multiple_winners[col_subset]
```

# Number of Prizes per Category



```python
df_data.category.nunique()
```


```python
df_data.category.value_counts()
```


```python
prizes_per_category = df_data.category.value_counts()
v_bar = px.bar(x = prizes_per_category.index,
               y= prizes_per_category.values,
               color = prizes_per_category.values,
               color_continuous_scale='Aggrnyl',
               title = 'Number of Prizes Awarded per Category')
v_bar.update_layout(xaxis_title = 'Nobel Prize Category',
                    coloraxis_showscale = False, 
                    yaxis_title = 'Number of Prizes Awarded')
v_bar.show()
```

### When was the first prize in the field of Economics awarded?
### Who did the prize go to?


```python
df_data[df_data.category == 'Economics'].sort_values('year')[:3]
```


```python
cat_men_women = df_data.groupby(['category', 'sex'],as_index=False).agg({'prize': pd.Series.count})
```


```python
cat_men_women
```


```python
cat_men_women.sort_values('prize', ascending=False, inplace=True)
```


```python
cat_men_women
```


```python
v_bar_split = px.bar(x = cat_men_women.category, 
                     y = cat_men_women.prize,
                     color = cat_men_women.sex, 
                     title = 'Number of Prizes Awarded per Category split by Men and Women')
v_bar_split.update_layout(xaxis_title = 'Nobel Prize Category',
                          yaxis_title = 'Number of Prizes Awarded')
v_bar_split.show()
```

# Number of Prizes Awarded Over Time


```python
df_data.year.value_counts()
```


```python
prizes_per_year = df_data.groupby('year').count().prize
```


```python
prizes_per_year
```


```python
moving_average = prizes_per_year.rolling(window = 5).mean()
```


```python
plt.figure(figsize = (8,4), dpi=150)

plt.scatter(x = prizes_per_year.index, 
            y = prizes_per_year.values,
            alpha = 0.6,
            s = 100,)
plt.plot(prizes_per_year.index, 
         moving_average.values, 
         color = 'crimson',
         linewidth = 3,)
plt.show()
```


```python
plt.figure(figsize = (16,8), dpi=200)
plt.title('Number of Nobel Prizes Awarded per Year', fontsize = 20)


plt.yticks(fontsize = 15)
plt.xticks(ticks = np.arange(1900, 2021, step = 5),
           fontsize = 15,
           rotation = 45)

ax = plt.gca()

ax.set_xlim(1900, 2022)
ax.scatter(x = prizes_per_year.index, 
            y = prizes_per_year.values,
            color = 'dodgerblue',
            alpha = 0.6,
            s = 100,)
ax.plot(prizes_per_year.index, 
         moving_average.values, 
         color = 'crimson',
         linewidth = 3,)
ax.grid(True, linewidth = 0.3)

plt.show()
```

# Are More Prizes Shared Than Before?



```python
yearly_average_share = df_data.groupby('year').agg({'share_pct':pd.Series.mean})
```


```python
share_moving_average = yearly_average_share.rolling(window = 5).mean()
```


```python
plt.figure(figsize = (16,8), dpi=200)
plt.title('Number of Nobel Prizes Awarded per Year', fontsize = 20)


plt.yticks(fontsize = 15)
plt.xticks(ticks = np.arange(1900, 2021, step = 5),
           fontsize = 15,
           rotation = 45)

ax1 = plt.gca()
ax2 = ax1.twinx()

ax1.set_xlim(1900, 2022)
ax1.scatter(x = prizes_per_year.index, 
            y = prizes_per_year.values,
            color = 'dodgerblue',
            alpha = 0.6,
            s = 100,)
ax1.plot(prizes_per_year.index, 
         moving_average.values, 
         color = 'crimson',
         linewidth = 3,)

ax2.plot(prizes_per_year.index,
         share_moving_average.values,
         color = 'darkgreen',
         linewidth = 3,
         alpha = 0.7)

ax1.grid(True, linewidth = 0.3)

plt.show()
```

There is clearly an upward trend in the number of prizes being given out as more and more prizes are shared. Also, more prizes are being awarded from 1969 onwards because of the addition of the economics category. We also see that very few prizes were awarded during the first and second world wars. Note that instead of there being a zero entry for those years, we instead see the effect of the wars as missing blue dots.

# The Countries with the Most Nobel Prizes


```python
top_countries = df_data.groupby(['birth_country_current'], as_index=False).agg({'prize': pd.Series.count})
```


```python
top_countries.sort_values(by='prize', inplace=True)
top20_countries = top_countries[-20:]
```


```python
top20_countries
```


```python
h_bar = px.bar(x = top20_countries.prize,
               y = top20_countries.birth_country_current,
               orientation='h',
               color = top20_countries.prize,
               color_continuous_scale = 'Rainbow',
               title = 'Top 20 Countries by Number of Prizes')
 
h_bar.update_layout(xaxis_title = 'Number of Prizes', 
                    yaxis_title = 'Country',
                    coloraxis_showscale = False)
h_bar.show()
```

# Use a Choropleth Map to Show the Number of Prizes Won by Country


```python
df_countries = df_data.groupby(['birth_country_current', 'ISO'], as_index=False).agg({'prize': pd.Series.count})
```


```python
df_countries
```


```python
world_map = px.choropleth(df_countries,
                          locations='ISO',
                          color='prize', 
                          hover_name='birth_country_current', 
                          color_continuous_scale=px.colors.sequential.matter)
 
world_map.update_layout(coloraxis_showscale=True,)
 
world_map.show()
```


```python
cat_country = df_data.groupby(['birth_country_current', 'category'], as_index=False).agg({'prize': pd.Series.count})
cat_country.sort_values(by='prize', ascending=False, inplace=True)
```


```python
cat_country
```


```python
merged_df = pd.merge(cat_country, top20_countries, on='birth_country_current')

```


```python
merged_df
```


```python
merged_df.columns = ['birth_country_current', 'category', 'cat_prize', 'total_prize'] 
merged_df.sort_values(by='total_prize', inplace=True)
```


```python
merged_df
```


```python
cat_country_bar = px.bar(x=merged_df.cat_prize,
                         y=merged_df.birth_country_current,
                         color=merged_df.category,
                         orientation='h',
                         title='Top 20 Countries by Number of Prizes and Category')
 
cat_country_bar.update_layout(xaxis_title='Number of Prizes',
                              yaxis_title='Country')
cat_country_bar.show()
```

Splitting the country bar chart by category allows us to get a very granular look at the data and answer a whole bunch of questions. For example, we see is that the US has won an incredible proportion of the prizes in the field of Economics. In comparison, Japan and Germany have won very few or no economics prize at all. Also, the US has more prizes in physics or medicine alone than all of France's prizes combined. On the chart, we also see that Germany won more prizes in physics than the UK and that France has won more prizes in peace and literature than Germany, even though Germany has been awarded a higher total number of prizes than France.

# In Which Categories are the Different Countries Winning Prizes? 



```python
prizes_by_year = df_data.groupby(by=['birth_country_current', 'year'], as_index=False).count()
prizes_by_year = prizes_by_year.sort_values('year')[['year', 'birth_country_current', 'prize']]
```


```python
prizes_by_year
```


```python
cumulative_prizes = prizes_by_year.groupby(by=['birth_country_current','year']).sum().groupby(level=[0]).cumsum()
cumulative_prizes.reset_index(inplace=True) 
```


```python
cumulative_prizes
```


```python
l_chart = px.line(cumulative_prizes,
                  x='year', 
                  y='prize',
                  color='birth_country_current',
                  hover_name='birth_country_current')
 
l_chart.update_layout(xaxis_title='Year',
                      yaxis_title='Number of Prizes')
 
l_chart.show()

```

What we see is that the United States really started to take off after the Second World War which decimated Europe. Prior to that, the Nobel prize was pretty much a European affair. Very few laureates were chosen from other parts of the world. This has changed dramatically in the last 40 years or so. There are many more countries represented today than in the early days. Interestingly we also see that the UK and Germany traded places in the 70s and 90s on the total number of prizes won. Sweden being 5th place pretty consistently over many decades is quite interesting too. Perhaps this reflects a little bit of home bias?

### Number of Prizes Won by Each Country Over Time



```python
top20_orgs = df_data.organization_name.value_counts()[:20]
top20_orgs.sort_values(ascending=True, inplace=True)
```


```python
top20_orgs
```

# What are the Top Research Organisations?


```python
org_bar = px.bar(x = top20_orgs.values,
                 y = top20_orgs.index,
                 orientation='h',
                 color=top20_orgs.values,
                 color_continuous_scale=px.colors.sequential.haline,
                 title='Top 20 Research Institutions by Number of Prizes')
 
org_bar.update_layout(xaxis_title='Number of Prizes', 
                      yaxis_title='Institution',
                      coloraxis_showscale=False)
org_bar.show()
```

# Which Cities Make the Most Discoveries? 


```python
top20_org_cities = df_data.organization_city.value_counts()[:20]
top20_org_cities.sort_values(ascending=True, inplace=True)
city_bar2 = px.bar(x = top20_org_cities.values,
                   y = top20_org_cities.index,
                   orientation='h',
                   color=top20_org_cities.values,
                   color_continuous_scale=px.colors.sequential.Plasma,
                   title='Which Cities Do the Most Research?')
 
city_bar2.update_layout(xaxis_title='Number of Prizes', 
                        yaxis_title='City',
                        coloraxis_showscale=False)
city_bar2.show()
```

# Where are Nobel Laureates Born?


```python
top20_cities = df_data.birth_city.value_counts()[:20]
top20_cities.sort_values(ascending=True, inplace=True)
city_bar = px.bar(x=top20_cities.values,
                  y=top20_cities.index,
                  orientation='h',
                  color=top20_cities.values,
                  color_continuous_scale=px.colors.sequential.Plasma,
                  title='Where were the Nobel Laureates Born?')
 
city_bar.update_layout(xaxis_title='Number of Prizes', 
                       yaxis_title='City of Birth',
                       coloraxis_showscale=False)
city_bar.show()
```

# Plotly Sunburst Chart Combining Country, City, and Organisation



```python
country_city_org = df_data.groupby(by=['organization_country', 'organization_city', 'organization_name'], 
                                   as_index=False).agg({'prize': pd.Series.count})
 
country_city_org = country_city_org.sort_values('prize', ascending=False)
```


```python
country_city_org
```


```python
burst = px.sunburst(country_city_org, 
                    path=['organization_country', 'organization_city', 'organization_name'], 
                    values='prize',
                    title='Where do Discoveries Take Place?',)
 
burst.update_layout(xaxis_title='Number of Prizes', 
                    yaxis_title='City',
                    coloraxis_showscale=False)
 
burst.show()
```

# Patterns in the Laureate Age at the Time of the Award

How Old Are the Laureates When the Win the Prize?





```python
birth_years = df_data.birth_date.dt.year
```


```python
birth_years
```


```python
df_data['winning_age'] = df_data.year - birth_years
```


```python
df_data.winning_age
```

### Who were the oldest and youngest winners?




```python
display(df_data.nlargest(n=1, columns='winning_age'))
```


```python
display(df_data.nsmallest(n=1, columns='winning_age'))
```

### Descriptive Statistics for the Laureate Age at Time of Award



```python
df_data.winning_age.describe()
```


```python
plt.figure(figsize=(8, 4), dpi=200)

sns.histplot(data=df_data,
             x=df_data.winning_age,
             bins=30)

plt.xlabel('Age')
plt.title('Distribution of Age on Receipt of Prize')

plt.show()
```

### Age at Time of Award throughout History



```python
plt.figure(figsize=(8,4), dpi=200)

with sns.axes_style("whitegrid"):
    sns.regplot(data=df_data,
                x='year',
                y='winning_age',
                lowess=True, 
                scatter_kws = {'alpha': 0.4},
                line_kws={'color': 'crimson', 'alpha' : 0.8})
plt.show()
```

### Winning Age Across the Nobel Prize Categories

How does the age of laureates vary by category? 



```python
plt.figure(figsize=(8,4), dpi=200)

with sns.axes_style("whitegrid"):
    sns.boxplot(data=df_data,
                x='category',
                y='winning_age')
plt.show()
```

Let's create 6 separate charts for each prize category using `.lmplot()`.
* What are the winning age trends in each category? 
* Which category has the age trending up and which category has the age trending down? 
* Is this `.lmplot()` telling a different story from the `.boxplot()`?
* Let's create another chart with Seaborn. This time let's use `.lmplot()` to put all 6 categories on the same chart using the `hue` parameter. 



```python
with sns.axes_style('whitegrid'):
    sns.lmplot(data=df_data,
               x='year', 
               y='winning_age',
               row = 'category',
               lowess=True, 
               aspect=2,
               scatter_kws = {'alpha': 0.6},
               line_kws = {'color': 'crimson', 'alpha' : 0.8},)

plt.show()
```


```python
with sns.axes_style("whitegrid"):
    sns.lmplot(data=df_data,
               x='year',
               y='winning_age',
               hue='category',
               lowess=True, 
               aspect=2,
               scatter_kws={'alpha': 0.5},
               line_kws={'linewidth': 3, 'alpha' : 0.9})

plt.show()
```
