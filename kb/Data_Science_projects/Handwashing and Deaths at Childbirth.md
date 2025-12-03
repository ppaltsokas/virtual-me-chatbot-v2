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

```
(12, 4)
```

```
    year  births  deaths    clinic
0   1841    3036     237  clinic 1
1   1842    3287     518  clinic 1
2   1843    3060     274  clinic 1
3   1844    3157     260  clinic 1
4   1845    3492     241  clinic 1
5   1846    4010     459  clinic 1
6   1841    2442      86  clinic 2
7   1842    2659     202  clinic 2
8   1843    2739     164  clinic 2
9   1844    2956      68  clinic 2
10  1845    3241      66  clinic 2
11  1846    3754     105  clinic 2```

```python
df_yearly.info()
```

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 12 entries, 0 to 11
Data columns (total 4 columns):
 #   Column  Non-Null Count  Dtype 
---  ------  --------------  ----- 
 0   year    12 non-null     int64 
 1   births  12 non-null     int64 
 2   deaths  12 non-null     int64 
 3   clinic  12 non-null     object
dtypes: int64(3), object(1)
memory usage: 516.0+ bytes
```

```python
df_yearly.year.values
```

```
array([1841, 1842, 1843, 1844, 1845, 1846, 1841, 1842, 1843, 1844, 1845,
       1846], dtype=int64)```

```python
print(df_monthly.shape)
df_monthly
```

```
(98, 3)
```

```
         date  births  deaths
0  1841-01-01     254      37
1  1841-02-01     239      18
2  1841-03-01     277      12
3  1841-04-01     255       4
4  1841-05-01     255       2
..        ...     ...     ...
93 1848-11-01     310       9
94 1848-12-01     373       5
95 1849-01-01     403       9
96 1849-02-01     389      12
97 1849-03-01     406      20

[98 rows x 3 columns]```

```python
df_monthly.info()
```

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 98 entries, 0 to 97
Data columns (total 3 columns):
 #   Column  Non-Null Count  Dtype         
---  ------  --------------  -----         
 0   date    98 non-null     datetime64[ns]
 1   births  98 non-null     int64         
 2   deaths  98 non-null     int64         
dtypes: datetime64[ns](1), int64(2)
memory usage: 2.4 KB
```

```python
df_monthly.date.values
```

```
array(['1841-01-01T00:00:00.000000000', '1841-02-01T00:00:00.000000000',
       '1841-03-01T00:00:00.000000000', '1841-04-01T00:00:00.000000000',
       '1841-05-01T00:00:00.000000000', '1841-06-01T00:00:00.000000000',
       '1841-07-01T00:00:00.000000000', '1841-08-01T00:00:00.000000000',
       '1841-09-01T00:00:00.000000000', '1841-10-01T00:00:00.000000000',
       '1841-11-01T00:00:00.000000000', '1842-01-01T00:00:00.000000000',
       '1842-02-01T00:00:00.000000000', '1842-03-01T00:00:00.000000000',
       '1842-04-01T00:00:00.000000000', '1842-05-01T00:00:00.000000000',
       '1842-06-01T00:00:00.000000000', '1842-07-01T00:00:00.000000000',
       '1842-08-01T00:00:00.000000000', '1842-09-01T00:00:00.000000000',
       '1842-10-01T00:00:00.000000000', '1842-11-01T00:00:00.000000000',
       '1842-12-01T00:00:00.000000000', '1843-01-01T00:00:00.000000000',
       '1843-02-01T00:00:00.000000000', '1843-03-01T00:00:00.000000000',
       '1843-04-01T00:00:00.000000000', '1843-05-01T00:00:00.000000000',
       '1843-06-01T00:00:00.000000000', '1843-07-01T00:00:00.000000000',
       '1843-08-01T00:00:00.000000000', '1843-09-01T00:00:00.000000000',
       '1843-10-01T00:00:00.000000000', '1843-11-01T00:00:00.000000000',
       '1843-12-01T00:00:00.000000000', '1844-01-01T00:00:00.000000000',
       '1844-02-01T00:00:00.000000000', '1844-03-01T00:00:00.000000000',
       '1844-04-01T00:00:00.000000000', '1844-05-01T00:00:00.000000000',
       '1844-06-01T00:00:00.000000000', '1844-07-01T00:00:00.000000000',
       '1844-08-01T00:00:00.000000000', '1844-09-01T00:00:00.000000000',
       '1844-10-01T00:00:00.000000000', '1844-11-01T00:00:00.000000000',
       '1844-12-01T00:00:00.000000000', '1845-01-01T00:00:00.000000000',
       '1845-02-01T00:00:00.000000000', '1845-03-01T00:00:00.000000000',
       '1845-04-01T00:00:00.000000000', '1845-05-01T00:00:00.000000000',
       '1845-06-01T00:00:00.000000000', '1845-07-01T00:00:00.000000000',
       '1845-08-01T00:00:00.000000000', '1845-09-01T00:00:00.000000000',
       '1845-10-01T00:00:00.000000000', '1845-11-01T00:00:00.000000000',
       '1845-12-01T00:00:00.000000000', '1846-01-01T00:00:00.000000000',
       '1846-02-01T00:00:00.000000000', '1846-03-01T00:00:00.000000000',
       '1846-04-01T00:00:00.000000000', '1846-05-01T00:00:00.000000000',
       '1846-06-01T00:00:00.000000000', '1846-07-01T00:00:00.000000000',
       '1846-08-01T00:00:00.000000000', '1846-09-01T00:00:00.000000000',
       '1846-10-01T00:00:00.000000000', '1846-11-01T00:00:00.000000000',
       '1846-12-01T00:00:00.000000000', '1847-01-01T00:00:00.000000000',
       '1847-02-01T00:00:00.000000000', '1847-03-01T00:00:00.000000000',
       '1847-04-01T00:00:00.000000000', '1847-05-01T00:00:00.000000000',
       '1847-06-01T00:00:00.000000000', '1847-07-01T00:00:00.000000000',
       '1847-08-01T00:00:00.000000000', '1847-09-01T00:00:00.000000000',
       '1847-10-01T00:00:00.000000000', '1847-11-01T00:00:00.000000000',
       '1847-12-01T00:00:00.000000000', '1848-01-01T00:00:00.000000000',
       '1848-02-01T00:00:00.000000000', '1848-03-01T00:00:00.000000000',
       '1848-04-01T00:00:00.000000000', '1848-05-01T00:00:00.000000000',
       '1848-06-01T00:00:00.000000000', '1848-07-01T00:00:00.000000000',
       '1848-08-01T00:00:00.000000000', '1848-09-01T00:00:00.000000000',
       '1848-10-01T00:00:00.000000000', '1848-11-01T00:00:00.000000000',
       '1848-12-01T00:00:00.000000000', '1849-01-01T00:00:00.000000000',
       '1849-02-01T00:00:00.000000000', '1849-03-01T00:00:00.000000000'],
      dtype='datetime64[ns]')```

### Check for Nan Values and Duplicates
```python
print(f'There are NaN values yearly  : {df_yearly.isna().values.any()}')
print(f'There are NaN values monthly : {df_monthly.isna().values.any()}')
```

```
There are NaN values yearly  : False
There are NaN values monthly : False
```

```python
print(f'There are duplicate values yearly  : {df_yearly.duplicated().values.any()}')
print(f'There are duplicate values monthly : {df_monthly.duplicated().values.any()}')
```

```
There are duplicate values yearly  : False
There are duplicate values monthly : False
```

### Descriptive Statistics
```python
df_yearly.describe()
```

```
          year   births  deaths
count    12.00    12.00   12.00
mean  1,843.50 3,152.75  223.33
std       1.78   449.08  145.38
min   1,841.00 2,442.00   66.00
25%   1,842.00 2,901.75  100.25
50%   1,843.50 3,108.50  219.50
75%   1,845.00 3,338.25  263.50
max   1,846.00 4,010.00  518.00```

```python
df_monthly.describe()
```

```
                                date  births  deaths
count                             98   98.00   98.00
mean   1845-02-11 04:24:29.387755008  267.00   22.47
min              1841-01-01 00:00:00  190.00    0.00
25%              1843-02-08 00:00:00  242.50    8.00
50%              1845-02-15 00:00:00  264.00   16.50
75%              1847-02-22 00:00:00  292.75   36.75
max              1849-03-01 00:00:00  406.00   75.00
std                              NaN   41.77   18.14```

### Percentage of Women Dying in Childbirth

How dangerous was childbirth in the 1840s in Vienna? 

```python
dth_pct = round(df_yearly.deaths.sum() / df_yearly.births.sum() * 100, 2)
```

```python
print(f'The death in childbirth percentage was {dth_pct} %')
```

```
The death in childbirth percentage was 7.08 %
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

```
<Figure size 2800x1600 with 2 Axes>```

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

```
<Figure size 2800x1600 with 2 Axes>```

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

<details><summary>Output</summary>

<div>                            <div id="4e3ecde9-237c-40bd-b7ac-5b815dc999bc" class="plotly-graph-div" style="height:525px; width:100%;"></div>            <script type="text/javascript">                require(["plotly"], function(Plotly) {                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById("4e3ecde9-237c-40bd-b7ac-5b815dc999bc")) {                    Plotly.newPlot(                        "4e3ecde9-237c-40bd-b7ac-5b815dc999bc",                        [{"hovertemplate":"clinic=clinic 1\u003cbr\u003eyear=%{x}\u003cbr\u003ebirths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 1","line":{"color":"#636efa","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 1","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[3036,3287,3060,3157,3492,4010],"yaxis":"y","type":"scatter"},{"hovertemplate":"clinic=clinic 2\u003cbr\u003eyear=%{x}\u003cbr\u003ebirths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 2","line":{"color":"#EF553B","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 2","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[2442,2659,2739,2956,3241,3754],"yaxis":"y","type":"scatter"}],                        {"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"year"}},"yaxis":{"anchor":"x","domain":[0.0,1.0],"title":{"text":"births"}},"legend":{"title":{"text":"clinic"},"tracegroupgap":0},"title":{"text":"Total Yearly Births by Clinic"}},                        {"responsive": true}                    ).then(function(){
                            
var gd = document.getElementById('4e3ecde9-237c-40bd-b7ac-5b815dc999bc');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };                });            </script>        </div>

</details>

```python
line = px.line(df_yearly, 
               x='year', 
               y='deaths',
               color='clinic',
               title='Total Yearly Deaths by Clinic')
 
line.show()
```

<details><summary>Output</summary>

<div>                            <div id="ab242f69-2de4-436b-9f10-bd2c6847bba3" class="plotly-graph-div" style="height:525px; width:100%;"></div>            <script type="text/javascript">                require(["plotly"], function(Plotly) {                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById("ab242f69-2de4-436b-9f10-bd2c6847bba3")) {                    Plotly.newPlot(                        "ab242f69-2de4-436b-9f10-bd2c6847bba3",                        [{"hovertemplate":"clinic=clinic 1\u003cbr\u003eyear=%{x}\u003cbr\u003edeaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 1","line":{"color":"#636efa","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 1","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[237,518,274,260,241,459],"yaxis":"y","type":"scatter"},{"hovertemplate":"clinic=clinic 2\u003cbr\u003eyear=%{x}\u003cbr\u003edeaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 2","line":{"color":"#EF553B","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 2","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[86,202,164,68,66,105],"yaxis":"y","type":"scatter"}],                        {"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"year"}},"yaxis":{"anchor":"x","domain":[0.0,1.0],"title":{"text":"deaths"}},"legend":{"title":{"text":"clinic"},"tracegroupgap":0},"title":{"text":"Total Yearly Deaths by Clinic"}},                        {"responsive": true}                    ).then(function(){
                            
var gd = document.getElementById('ab242f69-2de4-436b-9f10-bd2c6847bba3');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };                });            </script>        </div>

</details>

### Calculate the Proportion of Deaths at Each Clinic
```python
df_yearly['pct_deaths'] = df_yearly.deaths / df_yearly.births
```

```python
df_yearly
```

```
    year  births  deaths    clinic  pct_deaths
0   1841    3036     237  clinic 1        0.08
1   1842    3287     518  clinic 1        0.16
2   1843    3060     274  clinic 1        0.09
3   1844    3157     260  clinic 1        0.08
4   1845    3492     241  clinic 1        0.07
5   1846    4010     459  clinic 1        0.11
6   1841    2442      86  clinic 2        0.04
7   1842    2659     202  clinic 2        0.08
8   1843    2739     164  clinic 2        0.06
9   1844    2956      68  clinic 2        0.02
10  1845    3241      66  clinic 2        0.02
11  1846    3754     105  clinic 2        0.03```

```python
clinic1 = df_yearly[df_yearly.clinic == 'clinic 1']
```

```python
clinic1
```

```
   year  births  deaths    clinic  pct_deaths
0  1841    3036     237  clinic 1        0.08
1  1842    3287     518  clinic 1        0.16
2  1843    3060     274  clinic 1        0.09
3  1844    3157     260  clinic 1        0.08
4  1845    3492     241  clinic 1        0.07
5  1846    4010     459  clinic 1        0.11```

```python
clinic2 = df_yearly[df_yearly.clinic == 'clinic 2']
```

```python
clinic2
```

```
    year  births  deaths    clinic  pct_deaths
6   1841    2442      86  clinic 2        0.04
7   1842    2659     202  clinic 2        0.08
8   1843    2739     164  clinic 2        0.06
9   1844    2956      68  clinic 2        0.02
10  1845    3241      66  clinic 2        0.02
11  1846    3754     105  clinic 2        0.03```

```python
avg_c1 = clinic1.deaths.sum() / clinic1.births.sum() * 100
```

```python
avg_c2 = clinic2.deaths.sum() / clinic2.births.sum() * 100
```

```python
print(f'The average death rate in clinic 1 is {round(avg_c1, 3)}%')
```

```
The average death rate in clinic 1 is 9.924%
```

```python
print(f'The average death rate in clinic 2 is {round(avg_c2, 3)}%')
```

```
The average death rate in clinic 2 is 3.884%
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

<details><summary>Output</summary>

<div>                            <div id="97502d2d-b05b-4293-92c3-05d45571a1bc" class="plotly-graph-div" style="height:525px; width:100%;"></div>            <script type="text/javascript">                require(["plotly"], function(Plotly) {                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById("97502d2d-b05b-4293-92c3-05d45571a1bc")) {                    Plotly.newPlot(                        "97502d2d-b05b-4293-92c3-05d45571a1bc",                        [{"hovertemplate":"clinic=clinic 1\u003cbr\u003eyear=%{x}\u003cbr\u003epct_deaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 1","line":{"color":"#636efa","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 1","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[0.07806324110671936,0.15759050806206268,0.08954248366013072,0.08235666772252138,0.06901489117983964,0.1144638403990025],"yaxis":"y","type":"scatter"},{"hovertemplate":"clinic=clinic 2\u003cbr\u003eyear=%{x}\u003cbr\u003epct_deaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"clinic 2","line":{"color":"#EF553B","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"clinic 2","orientation":"v","showlegend":true,"x":[1841,1842,1843,1844,1845,1846],"xaxis":"x","y":[0.03521703521703522,0.0759684091763821,0.059875867104782765,0.023004059539918808,0.020364085158901573,0.02797016515716569],"yaxis":"y","type":"scatter"}],                        {"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"year"}},"yaxis":{"anchor":"x","domain":[0.0,1.0],"title":{"text":"pct_deaths"}},"legend":{"title":{"text":"clinic"},"tracegroupgap":0},"title":{"text":"Proportion of Yearly Deaths by Clinic"}},                        {"responsive": true}                    ).then(function(){
                            
var gd = document.getElementById('97502d2d-b05b-4293-92c3-05d45571a1bc');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };                });            </script>        </div>

</details>

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

```
         date  births  deaths  pct_deaths
0  1841-01-01     254      37        0.15
1  1841-02-01     239      18        0.08
2  1841-03-01     277      12        0.04
3  1841-04-01     255       4        0.02
4  1841-05-01     255       2        0.01
..        ...     ...     ...         ...
93 1848-11-01     310       9        0.03
94 1848-12-01     373       5        0.01
95 1849-01-01     403       9        0.02
96 1849-02-01     389      12        0.03
97 1849-03-01     406      20        0.05

[98 rows x 4 columns]```

```python
before_washing = df_monthly[df_monthly.date < handwashing_start]
```

```python
after_washing = df_monthly[df_monthly.date >= handwashing_start]
```

```python
before_washing
```

```
         date  births  deaths  pct_deaths
0  1841-01-01     254      37        0.15
1  1841-02-01     239      18        0.08
2  1841-03-01     277      12        0.04
3  1841-04-01     255       4        0.02
4  1841-05-01     255       2        0.01
..        ...     ...     ...         ...
71 1847-01-01     311      10        0.03
72 1847-02-01     312       6        0.02
73 1847-03-01     305      11        0.04
74 1847-04-01     312      57        0.18
75 1847-05-01     294      36        0.12

[76 rows x 4 columns]```

```python
after_washing
```

```
         date  births  deaths  pct_deaths
76 1847-06-01     268       6        0.02
77 1847-07-01     250       3        0.01
78 1847-08-01     264       5        0.02
79 1847-09-01     262      12        0.05
80 1847-10-01     278      11        0.04
81 1847-11-01     246      11        0.04
82 1847-12-01     273       8        0.03
83 1848-01-01     283      10        0.04
84 1848-02-01     291       2        0.01
85 1848-03-01     276       0        0.00
86 1848-04-01     305       2        0.01
87 1848-05-01     313       3        0.01
88 1848-06-01     264       3        0.01
89 1848-07-01     269       1        0.00
90 1848-08-01     261       0        0.00
91 1848-09-01     312       3        0.01
92 1848-10-01     299       7        0.02
93 1848-11-01     310       9        0.03
94 1848-12-01     373       5        0.01
95 1849-01-01     403       9        0.02
96 1849-02-01     389      12        0.03
97 1849-03-01     406      20        0.05```

```python
bw_rate = before_washing.deaths.sum() / before_washing.births.sum() * 100
```

```python
aw_rate = after_washing.deaths.sum() / after_washing.births.sum() * 100
```

```python
print(f'The percentage of deaths before 1847 was {bw_rate:.4}%')
```

```
The percentage of deaths before 1847 was 10.53%
```

```python
print(f'The percentage of deaths after 1847 was {aw_rate:.3}%')
```

```
The percentage of deaths after 1847 was 2.15%
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

```
            births  deaths  pct_deaths
date                                  
1841-01-01     NaN     NaN         NaN
1841-02-01     NaN     NaN         NaN
1841-03-01     NaN     NaN         NaN
1841-04-01     NaN     NaN         NaN
1841-05-01     NaN     NaN         NaN
...            ...     ...         ...
1847-01-01  274.50   29.00        0.11
1847-02-01  290.50   23.50        0.08
1847-03-01  296.17   18.83        0.07
1847-04-01  305.83   22.00        0.07
1847-05-01  305.33   22.67        0.07

[76 rows x 3 columns]```

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

```
<Figure size 2800x1600 with 1 Axes>```

### Statistics - Calculate the Difference in the Average Monthly Death Rate

```python
avg_prob_before = before_washing.pct_deaths.mean() * 100
```

```python
print(f'The chance of death during childbirth before handwashing was {avg_prob_before:.3}%')
```

```
The chance of death during childbirth before handwashing was 10.5%
```

```python
avg_prob_after = after_washing.pct_deaths.mean() * 100
```

```python
print(f'The chance of death during childbirth after handwashing was {avg_prob_after:.3}%')
```

```
The chance of death during childbirth after handwashing was 2.11%
```

```python
mean_diff = avg_prob_before - avg_prob_after
```

```python
print(f'Handwashing reduced the risk of dying in childbirth by {mean_diff:.3}%')
```

```
Handwashing reduced the risk of dying in childbirth by 8.4%
```

```python
times = avg_prob_before / avg_prob_after
```

```python
print(f'This is a x{round(times)} improvement')
```

```
This is a x5 improvement
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

<details><summary>Output</summary>

<div>                            <div id="22eaacb1-8e3f-4db4-83d7-8accb634f7d2" class="plotly-graph-div" style="height:525px; width:100%;"></div>            <script type="text/javascript">                require(["plotly"], function(Plotly) {                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById("22eaacb1-8e3f-4db4-83d7-8accb634f7d2")) {                    Plotly.newPlot(                        "22eaacb1-8e3f-4db4-83d7-8accb634f7d2",                        [{"alignmentgroup":"True","hovertemplate":"washing_hands=%{x}\u003cbr\u003epct_deaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"No","marker":{"color":"#636efa"},"name":"No","notched":false,"offsetgroup":"No","orientation":"v","showlegend":true,"x":["No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No"],"x0":" ","xaxis":"x","y":[0.14566929133858267,0.07531380753138076,0.04332129963898917,0.01568627450980392,0.00784313725490196,0.05,0.08421052631578947,0.013513513513513514,0.018779342723004695,0.11016949152542373,0.225531914893617,0.20846905537459284,0.12218649517684887,0.10227272727272728,0.10743801652892562,0.03225806451612903,0.06593406593406594,0.2077922077922078,0.25462962962962965,0.18385650224215247,0.29338842975206614,0.22966507177033493,0.3138075313807531,0.19117647058823528,0.1596958174904943,0.12406015037593984,0.11929824561403508,0.06097560975609756,0.04081632653061224,0.005235602094240838,0.015544041450777202,0.02262443438914027,0.176,0.07142857142857142,0.08050847457627118,0.15163934426229508,0.11284046692607004,0.17028985507246377,0.17307692307692307,0.058333333333333334,0.026785714285714284,0.043689320388349516,0.06319702602230483,0.012244897959183673,0.03225806451612903,0.11020408163265306,0.10546875,0.07590759075907591,0.04744525547445255,0.04452054794520548,0.04230769230769231,0.04391891891891892,0.07142857142857142,0.061224489795918366,0.035856573705179286,0.10548523206751055,0.14840989399293286,0.10943396226415095,0.10486891385767791,0.13392857142857142,0.18088737201365188,0.15434083601286175,0.18972332015810275,0.13442622950819672,0.10150375939849623,0.13095238095238096,0.18055555555555555,0.14391143911439114,0.14960629921259844,0.10774410774410774,0.053691275167785234,0.03215434083601286,0.019230769230769232,0.036065573770491806,0.18269230769230768,0.12244897959183673],"y0":" ","yaxis":"y","type":"box"},{"alignmentgroup":"True","hovertemplate":"washing_hands=%{x}\u003cbr\u003epct_deaths=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"Yes","marker":{"color":"#EF553B"},"name":"Yes","notched":false,"offsetgroup":"Yes","orientation":"v","showlegend":true,"x":["Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes","Yes"],"x0":" ","xaxis":"x","y":[0.022388059701492536,0.012,0.01893939393939394,0.04580152671755725,0.039568345323741004,0.044715447154471545,0.029304029304029304,0.0353356890459364,0.006872852233676976,0.0,0.006557377049180328,0.009584664536741214,0.011363636363636364,0.0037174721189591076,0.0,0.009615384615384616,0.023411371237458192,0.02903225806451613,0.013404825737265416,0.022332506203473945,0.030848329048843187,0.04926108374384237],"y0":" ","yaxis":"y","type":"box"}],                        {"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"Washing Hands?"},"categoryorder":"array","categoryarray":["No","Yes"]},"yaxis":{"anchor":"x","domain":[0.0,1.0],"title":{"text":"Monthly Deaths Percentage"}},"legend":{"title":{"text":"washing_hands"},"tracegroupgap":0},"title":{"text":"How Has Handwashing Affect Deathcount"},"boxmode":"overlay"},                        {"responsive": true}                    ).then(function(){
                            
var gd = document.getElementById('22eaacb1-8e3f-4db4-83d7-8accb634f7d2');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };                });            </script>        </div>

</details>

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

<details><summary>Output</summary>

<div>                            <div id="85d846c5-0b83-48e0-8090-4360a10afdd1" class="plotly-graph-div" style="height:525px; width:100%;"></div>            <script type="text/javascript">                require(["plotly"], function(Plotly) {                    window.PLOTLYENV=window.PLOTLYENV || {};                                    if (document.getElementById("85d846c5-0b83-48e0-8090-4360a10afdd1")) {                    Plotly.newPlot(                        "85d846c5-0b83-48e0-8090-4360a10afdd1",                        [{"alignmentgroup":"True","bingroup":"x","histnorm":"percent","hovertemplate":"washing_hands=No\u003cbr\u003epct_deaths=%{x}\u003cbr\u003epercent=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"No","marker":{"color":"#636efa","opacity":0.6,"pattern":{"shape":""}},"name":"No","nbinsx":30,"offsetgroup":"No","orientation":"v","showlegend":true,"x":[0.14566929133858267,0.07531380753138076,0.04332129963898917,0.01568627450980392,0.00784313725490196,0.05,0.08421052631578947,0.013513513513513514,0.018779342723004695,0.11016949152542373,0.225531914893617,0.20846905537459284,0.12218649517684887,0.10227272727272728,0.10743801652892562,0.03225806451612903,0.06593406593406594,0.2077922077922078,0.25462962962962965,0.18385650224215247,0.29338842975206614,0.22966507177033493,0.3138075313807531,0.19117647058823528,0.1596958174904943,0.12406015037593984,0.11929824561403508,0.06097560975609756,0.04081632653061224,0.005235602094240838,0.015544041450777202,0.02262443438914027,0.176,0.07142857142857142,0.08050847457627118,0.15163934426229508,0.11284046692607004,0.17028985507246377,0.17307692307692307,0.058333333333333334,0.026785714285714284,0.043689320388349516,0.06319702602230483,0.012244897959183673,0.03225806451612903,0.11020408163265306,0.10546875,0.07590759075907591,0.04744525547445255,0.04452054794520548,0.04230769230769231,0.04391891891891892,0.07142857142857142,0.061224489795918366,0.035856573705179286,0.10548523206751055,0.14840989399293286,0.10943396226415095,0.10486891385767791,0.13392857142857142,0.18088737201365188,0.15434083601286175,0.18972332015810275,0.13442622950819672,0.10150375939849623,0.13095238095238096,0.18055555555555555,0.14391143911439114,0.14960629921259844,0.10774410774410774,0.053691275167785234,0.03215434083601286,0.019230769230769232,0.036065573770491806,0.18269230769230768,0.12244897959183673],"xaxis":"x","yaxis":"y","type":"histogram"},{"alignmentgroup":"True","hovertemplate":"washing_hands=No\u003cbr\u003epct_deaths=%{x}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"No","marker":{"color":"#636efa"},"name":"No","notched":true,"offsetgroup":"No","showlegend":false,"x":[0.14566929133858267,0.07531380753138076,0.04332129963898917,0.01568627450980392,0.00784313725490196,0.05,0.08421052631578947,0.013513513513513514,0.018779342723004695,0.11016949152542373,0.225531914893617,0.20846905537459284,0.12218649517684887,0.10227272727272728,0.10743801652892562,0.03225806451612903,0.06593406593406594,0.2077922077922078,0.25462962962962965,0.18385650224215247,0.29338842975206614,0.22966507177033493,0.3138075313807531,0.19117647058823528,0.1596958174904943,0.12406015037593984,0.11929824561403508,0.06097560975609756,0.04081632653061224,0.005235602094240838,0.015544041450777202,0.02262443438914027,0.176,0.07142857142857142,0.08050847457627118,0.15163934426229508,0.11284046692607004,0.17028985507246377,0.17307692307692307,0.058333333333333334,0.026785714285714284,0.043689320388349516,0.06319702602230483,0.012244897959183673,0.03225806451612903,0.11020408163265306,0.10546875,0.07590759075907591,0.04744525547445255,0.04452054794520548,0.04230769230769231,0.04391891891891892,0.07142857142857142,0.061224489795918366,0.035856573705179286,0.10548523206751055,0.14840989399293286,0.10943396226415095,0.10486891385767791,0.13392857142857142,0.18088737201365188,0.15434083601286175,0.18972332015810275,0.13442622950819672,0.10150375939849623,0.13095238095238096,0.18055555555555555,0.14391143911439114,0.14960629921259844,0.10774410774410774,0.053691275167785234,0.03215434083601286,0.019230769230769232,0.036065573770491806,0.18269230769230768,0.12244897959183673],"xaxis":"x2","yaxis":"y2","type":"box"},{"alignmentgroup":"True","bingroup":"x","histnorm":"percent","hovertemplate":"washing_hands=Yes\u003cbr\u003epct_deaths=%{x}\u003cbr\u003epercent=%{y}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"Yes","marker":{"color":"#EF553B","opacity":0.6,"pattern":{"shape":""}},"name":"Yes","nbinsx":30,"offsetgroup":"Yes","orientation":"v","showlegend":true,"x":[0.022388059701492536,0.012,0.01893939393939394,0.04580152671755725,0.039568345323741004,0.044715447154471545,0.029304029304029304,0.0353356890459364,0.006872852233676976,0.0,0.006557377049180328,0.009584664536741214,0.011363636363636364,0.0037174721189591076,0.0,0.009615384615384616,0.023411371237458192,0.02903225806451613,0.013404825737265416,0.022332506203473945,0.030848329048843187,0.04926108374384237],"xaxis":"x","yaxis":"y","type":"histogram"},{"alignmentgroup":"True","hovertemplate":"washing_hands=Yes\u003cbr\u003epct_deaths=%{x}\u003cextra\u003e\u003c\u002fextra\u003e","legendgroup":"Yes","marker":{"color":"#EF553B"},"name":"Yes","notched":true,"offsetgroup":"Yes","showlegend":false,"x":[0.022388059701492536,0.012,0.01893939393939394,0.04580152671755725,0.039568345323741004,0.044715447154471545,0.029304029304029304,0.0353356890459364,0.006872852233676976,0.0,0.006557377049180328,0.009584664536741214,0.011363636363636364,0.0037174721189591076,0.0,0.009615384615384616,0.023411371237458192,0.02903225806451613,0.013404825737265416,0.022332506203473945,0.030848329048843187,0.04926108374384237],"xaxis":"x2","yaxis":"y2","type":"box"}],                        {"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"sequentialminus":[[0.0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1.0,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"Proportion of Monthly Deaths"}},"yaxis":{"anchor":"x","domain":[0.0,0.7326],"title":{"text":"Count"}},"xaxis2":{"anchor":"y2","domain":[0.0,1.0],"matches":"x","showticklabels":false,"showgrid":true},"yaxis2":{"anchor":"x2","domain":[0.7426,1.0],"matches":"y2","showticklabels":false,"showline":false,"ticks":"","showgrid":false},"legend":{"title":{"text":"washing_hands"},"tracegroupgap":0},"margin":{"t":60},"barmode":"overlay"},                        {"responsive": true}                    ).then(function(){
                            
var gd = document.getElementById('85d846c5-0b83-48e0-8090-4360a10afdd1');
var x = new MutationObserver(function (mutations, observer) {{
        var display = window.getComputedStyle(gd).display;
        if (!display || display === 'none') {{
            console.log([gd, 'removed!']);
            Plotly.purge(gd);
            observer.disconnect();
        }}
}});

// Listen for the removal of the full notebook cells
var notebookContainer = gd.closest('#notebook-container');
if (notebookContainer) {{
    x.observe(notebookContainer, {childList: true});
}}

// Listen for the clearing of the current output cell
var outputEl = gd.closest('.output');
if (outputEl) {{
    x.observe(outputEl, {childList: true});
}}

                        })                };                });            </script>        </div>

</details>

### Use a Kernel Density Estimate (KDE) to visualise a smooth distribution

```python
plt.figure(dpi=200)
# By default the distribution estimate includes a negative death rate!
sns.kdeplot(before_washing.pct_deaths, fill=True)
sns.kdeplot(after_washing.pct_deaths, fill=True)
plt.title('Est. Distribution of Monthly Death Rate Before and After Handwashing')
plt.show()
```

```
<Figure size 1280x960 with 1 Axes>```

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

```
<Figure size 1280x960 with 1 Axes>```

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

```
p-value is 0.0000002985
t-statistic is 5.512
```

## When we calculate the p_value we see that it is 0.0000002985 or .00002985% which is far below even 1%. In other words, the difference in means is highly statistically significant and we can go ahead on publish our research paper
