# Setup and Context


### Introduction

Dr Ignaz Semmelweis was a Hungarian physician born in 1818 who worked in the Vienna General Hospital. In the past people thought of illness as caused by "bad air" or evil spirits. But in the 1800s Doctors started looking more at anatomy, doing autopsies and started making arguments based on data. Dr Semmelweis suspected that something was going wrong with the procedures at Vienna General Hospital. Semmelweis wanted to figure out why so many women in maternity wards were dying from childbed fever (i.e., [puerperal fever](https://en.wikipedia.org/wiki/Postpartum_infections)).


### Import Statements


```python
import pandas as pd
import numpy as np
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
```

### Notebook Presentation


```python
pd.options.display.float_format = '{:,.2f}'.format

# Create locators for ticks on the time axis


from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
```

### Read the Data


```python
df_yearly = pd.read_csv('annual_deaths_by_clinic.csv')
# parse_dates avoids DateTime conversion later
df_monthly = pd.read_csv('monthly_deaths.csv', 
                      parse_dates=['date'])
```

# Preliminary Data Exploration



```python
print(df_yearly.shape)
df_yearly
```


```python
df_yearly.info()
```


```python
df_yearly.year.values
```


```python
print(df_monthly.shape)
df_monthly
```


```python
df_monthly.info()
```


```python
df_monthly.date.values
```

### Check for Nan Values and Duplicates


```python
print(f'There are NaN values yearly  : {df_yearly.isna().values.any()}')
print(f'There are NaN values monthly : {df_monthly.isna().values.any()}')
```


```python
print(f'There are duplicate values yearly  : {df_yearly.duplicated().values.any()}')
print(f'There are duplicate values monthly : {df_monthly.duplicated().values.any()}')
```

### Descriptive Statistics


```python
df_yearly.describe()
```


```python
df_monthly.describe()
```

### Percentage of Women Dying in Childbirth

How dangerous was childbirth in the 1840s in Vienna? 



```python
dth_pct = round(df_yearly.deaths.sum() / df_yearly.births.sum() * 100, 2)
```


```python
print(f'The death in childbirth percentage was {dth_pct} %')
```

# Visualise the Total Number of Births 🤱 and Deaths 💀 over Time


```python
plt.figure(figsize = (14,8), dpi=200)
plt.title('Total Number of Monthly Births and Deaths', fontsize = 18)

plt.yticks(fontsize = 14)
plt.xticks(fontsize = 14, rotation = 45)

ax1 = plt.gca()
ax2 = ax1.twinx()

plt.yticks(fontsize = 14) #without this my ax2 yticks were not enlarged.


ax1.set_ylabel('Births', fontsize = 14, color = 'skyblue')
ax2.set_ylabel('Deaths', fontsize = 14, color = 'Crimson')

ax1.set_xlim([df_monthly.date.min(), df_monthly.date.max()])

ax1.plot(df_monthly.date, 
         df_monthly.births, 
         color = 'skyblue', 
         linewidth = 3)

ax2.plot(df_monthly.date, 
         df_monthly.deaths, 
         color = 'crimson', 
         linewidth = 2, 
         linestyle = '--', 
         alpha = 0.7)

ax1.grid(True, linestyle = '--', linewidth = 1 )

plt.show()
```

## Adding the x axis tickmarks :


```python
years = mdates.YearLocator()
months = mdates.MonthLocator()
years_fmt = mdates.DateFormatter('%Y')
```


```python
plt.figure(figsize=(14,8), dpi=200)
plt.title('Total Number of Monthly Births and Deaths', fontsize=18)
plt.yticks(fontsize=14)
plt.xticks(fontsize=14, rotation=45)
 
ax1 = plt.gca()
ax2 = ax1.twinx()

plt.yticks(fontsize = 14) # ax2 font size hack.

ax1.set_ylabel('Births', color='skyblue', fontsize=18)
ax2.set_ylabel('Deaths', color='crimson', fontsize=18)
 
# Use Locators
ax1.set_xlim([df_monthly.date.min(), df_monthly.date.max()])
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)
 
ax1.grid(True, linestyle = '--', linewidth = 1 )
 
ax1.plot(df_monthly.date, 
         df_monthly.births, 
         color='skyblue', 
         linewidth=3)
 
ax2.plot(df_monthly.date, 
         df_monthly.deaths, 
         color='crimson', 
         linewidth=2, 
         linestyle='--',
         alpha = 0.7)
 
plt.show()
```

# The Yearly Data Split by Clinic

Now let's look at the annual data instead. 


```python
line = px.line(df_yearly, 
               x='year', 
               y='births',
               color='clinic',
               title='Total Yearly Births by Clinic')
 
line.show()
```


```python
line = px.line(df_yearly, 
               x='year', 
               y='deaths',
               color='clinic',
               title='Total Yearly Deaths by Clinic')
 
line.show()
```

### Calculate the Proportion of Deaths at Each Clinic


```python
df_yearly['pct_deaths'] = df_yearly.deaths / df_yearly.births
```


```python
df_yearly
```


```python
clinic1 = df_yearly[df_yearly.clinic == 'clinic 1']
```


```python
clinic1
```


```python
clinic2 = df_yearly[df_yearly.clinic == 'clinic 2']
```


```python
clinic2
```


```python
avg_c1 = clinic1.deaths.sum() / clinic1.births.sum() * 100
```


```python
avg_c2 = clinic2.deaths.sum() / clinic2.births.sum() * 100
```


```python
print(f'The average death rate in clinic 1 is {round(avg_c1, 3)}%')
```


```python
print(f'The average death rate in clinic 2 is {round(avg_c2, 3)}%')
```

### Plotting the Proportion of Yearly Deaths by Clinic


```python
line = px.line(df_yearly,
               x = 'year',
               y = 'pct_deaths',
               color = 'clinic',
               title = 'Proportion of Yearly Deaths by Clinic')
line.show()
```

# The Effect of Handwashing

Dr Semmelweis made handwashing obligatory in the summer of 1947. In fact, he ordered people to wash their hands with clorine (instead of water).


```python
# Date when handwashing was made mandatory
handwashing_start = pd.to_datetime('1847-06-01')
```


```python
df_monthly['pct_deaths'] = df_monthly.deaths / df_monthly.births
```


```python
df_monthly
```


```python
before_washing = df_monthly[df_monthly.date < handwashing_start]
```


```python
after_washing = df_monthly[df_monthly.date >= handwashing_start]
```


```python
before_washing
```


```python
after_washing
```


```python
bw_rate = before_washing.deaths.sum() / before_washing.births.sum() * 100
```


```python
aw_rate = after_washing.deaths.sum() / after_washing.births.sum() * 100
```


```python
print(f'The percentage of deaths before 1847 was {bw_rate:.4}%')
```


```python
print(f'The percentage of deaths after 1847 was {aw_rate:.3}%')
```

### Calculate a Rolling Average of the Death Rate


```python
roll_df = before_washing.set_index('date')
```


```python
roll_df = roll_df.rolling(window=6).mean()
```


```python
roll_df
```

### Highlighting Subsections of a Line Chart



```python
plt.figure(figsize=(14,8), dpi=200)
plt.title('Percentage of Monthly Deaths over Time', fontsize=18)
plt.yticks(fontsize=14)
plt.xticks(fontsize=14, rotation=45)
 
plt.ylabel('Percentage of Deaths', color='crimson', fontsize=18)
 
ax = plt.gca()
ax.xaxis.set_major_locator(years)
ax.xaxis.set_major_formatter(years_fmt)
ax.xaxis.set_minor_locator(months)
ax.set_xlim([df_monthly.date.min(), df_monthly.date.max()])
 
plt.grid(color='grey', linestyle='--')
 
ma_line, = plt.plot(roll_df.index, 
                    roll_df.pct_deaths, 
                    color='crimson', 
                    linewidth=3, 
                    linestyle='--',
                    label='6m Moving Average')
bw_line, = plt.plot(before_washing.date, 
                    before_washing.pct_deaths,
                    color='black', 
                    linewidth=1, 
                    linestyle='--', 
                    label='Before Handwashing')
aw_line, = plt.plot(after_washing.date, 
                    after_washing.pct_deaths, 
                    color='skyblue', 
                    linewidth=3, 
                    marker='o',
                    label='After Handwashing')
 
plt.legend(handles=[ma_line, bw_line, aw_line],
           fontsize=14)
 
plt.show()
```

### Statistics - Calculate the Difference in the Average Monthly Death Rate



```python
avg_prob_before = before_washing.pct_deaths.mean() * 100
```


```python
print(f'The chance of death during childbirth before handwashing was {avg_prob_before:.3}%')
```


```python
avg_prob_after = after_washing.pct_deaths.mean() * 100
```


```python
print(f'The chance of death during childbirth after handwashing was {avg_prob_after:.3}%')
```


```python
mean_diff = avg_prob_before - avg_prob_after
```


```python
print(f'Handwashing reduced the risk of dying in childbirth by {mean_diff:.3}%')
```


```python
times = avg_prob_before / avg_prob_after
```


```python
print(f'This is a x{round(times)} improvement')
```

### Use Box Plots to Show How the Death Rate Changed Before and After Handwashing




```python
df_monthly['washing_hands'] = np.where(df_monthly.date < handwashing_start, 'No', 'Yes')
```


```python
box = px.box(df_monthly,
             x = 'washing_hands',
             y = 'pct_deaths',
             color = 'washing_hands',
             title = 'How Has Handwashing Affect Deathcount')

box.update_layout(xaxis_title = 'Washing Hands?',
                  yaxis_title = 'Monthly Deaths Percentage')

box.show()
```

### Use Histograms to Visualise the Monthly Distribution of Outcomes



```python
hist = px.histogram(df_monthly, 
                   x='pct_deaths', 
                   color='washing_hands',
                   nbins=30,
                   opacity=0.6,
                   barmode='overlay',
                   histnorm='percent',
                   marginal='box',)
 
hist.update_layout(xaxis_title='Proportion of Monthly Deaths',
                   yaxis_title='Count',)
 
hist.show()
```

### Use a Kernel Density Estimate (KDE) to visualise a smooth distribution



```python
plt.figure(dpi=200)
# By default the distribution estimate includes a negative death rate!
sns.kdeplot(before_washing.pct_deaths, fill=True)
sns.kdeplot(after_washing.pct_deaths, fill=True)
plt.title('Est. Distribution of Monthly Death Rate Before and After Handwashing')
plt.show()
```


```python
plt.figure(dpi=200)
sns.kdeplot(before_washing.pct_deaths, 
            fill=True,
            clip=(0,1))
sns.kdeplot(after_washing.pct_deaths, 
            fill=True,
            clip=(0,1))
plt.title('Est. Distribution of Monthly Death Rate Before and After Handwashing')
plt.xlim(0, 0.40)
plt.show()
```

### Use a T-Test to Show Statistical Significance

If the p-value is less than 1% then we can be 99% certain that handwashing has made a difference to the average monthly death rate. 




```python
import scipy.stats as stats
```


```python
t_stat, p_value = stats.ttest_ind(a = before_washing.pct_deaths, 
                                  b = after_washing.pct_deaths)
print(f'p-value is {p_value:.10f}')
print(f't-statistic is {t_stat:.4}')
```

## When we calculate the p_value we see that it is 0.0000002985 or .00002985% which is far below even 1%. In other words, the difference in means is highly statistically significant and we can go ahead on publish our research paper
