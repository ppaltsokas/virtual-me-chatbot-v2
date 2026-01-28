# Introduction

In this notebook, we will do a comprehensive analysis of the Android app market by comparing thousands of apps in the Google Play store.

# About the Dataset of Google Play Store Apps & Reviews

**Data Source:** <br>
App and review data was scraped from the Google Play Store by Lavanya Gupta in 2018. Original files listed [here](
https://www.kaggle.com/lava18/google-play-store-apps).

# Import Statements


```python

import pandas as pd

```

# Notebook Presentation


```python
# Show numeric output in decimal format e.g., 2.15
pd.options.display.float_format = '{:,.2f}'.format
```

# Read the Dataset


```python
df_apps = pd.read_csv('apps.csv')
```

# Data Cleaning

**Challenge**: How many rows and columns does `df_apps` have? What are the column names? Look at a random sample of 5 different rows with [.sample()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sample.html).


```python
#df_apps
# df_apps.tail()
# df_apps.describe()
# df_apps.shape
df_apps.columns
#  df_apps.isna().values.any():
# df_apps.sample(5)  
```


```python
df_apps.sample(5)  
```


```python
df_apps.isna().sum()
```


```python
df_apps[df_apps.Rating.isna()]
```

### Drop Unused Columns

**Challenge**: Remove the columns called `Last_Updated` and `Android_Version` from the DataFrame. We will not use these columns. 


```python
df_apps.drop(['Last_Updated', 'Android_Ver'], axis = 1, inplace = True)
```


```python
df_apps
```

### Find and Remove NaN values in Ratings

**Challenge**: How may rows have a NaN value (not-a-number) in the Ratings column? Create DataFrame called `df_apps_clean` that does not include these rows. 


```python
df_apps.isna().sum()
```


```python
print(f"There are {df_apps.Rating.isna().sum()} NaN values in the Ratings column")
```


```python
df_apps_clean = df_apps.dropna()
```


```python
df_apps.shape
```


```python
df_apps_clean.shape
```


```python
df_apps_clean
```

### Find and Remove Duplicates

**Challenge**: Are there any duplicates in data? Check for duplicates using the [.duplicated()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.duplicated.html) function. How many entries can you find for the "Instagram" app? Use [.drop_duplicates()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.drop_duplicates.html) to remove any duplicates from `df_apps_clean`. 



```python
df_apps_clean.duplicated()
```


```python
df_apps_clean[df_apps_clean.duplicated()]
```


```python
duplicates_instagram = df_apps_clean[df_apps_clean['App'] == 'Instagram']
```


```python
duplicates_instagram
```


```python
# df_apps_clean = df_apps_clean.drop_duplicates() Will not work ok because if some other column is different they won't be cleared
```


```python
#instead do this : 
df_apps_clean = df_apps_clean.drop_duplicates(subset = ['App', 'Type', 'Price'])
```


```python
duplicates_instagram = df_apps_clean[df_apps_clean['App'] == 'Instagram']
```


```python
duplicates_instagram
```


```python
df_apps_clean.shape #Itan (9367,10)
```

# Find Highest Rated Apps

**Challenge**: Identify which apps are the highest rated. What problem might you encounter if you rely exclusively on ratings alone to determine the quality of an app?


```python
apps_5_stars = df_apps_clean[df_apps_clean['Rating'] == 5]
```


```python
apps_5_stars
```


```python
apps_5_stars.sort_values('Reviews', ascending = False)  #All 5 star reviews apps have a very small ammount of votes
```

# Find 5 Largest Apps in terms of Size (MBs)

**Challenge**: What's the size in megabytes (MB) of the largest Android apps in the Google Play Store. Based on the data, do you think there could be limit in place or can developers make apps as large as they please? 


```python
df_apps_clean.sort_values('Size_MBs', ascending = False)
```

# Find the 5 App with Most Reviews

**Challenge**: Which apps have the highest number of reviews? Are there any paid apps among the top 50?


```python
df_apps_clean.sort_values('Reviews', ascending = False)
```

# Plotly Pie and Donut Charts - Visualise Categorical Data: Content Ratings


```python
ratings = df_apps_clean.Content_Rating.value_counts()
```


```python
ratings
```


```python
import plotly.express as px
```


```python
piechart = px.pie(labels = ratings.index, values = ratings.values, title = 'Content Rating', names = ratings.index,)
piechart.update_traces(textposition = 'outside', textinfo='percent+label')
piechart.show()
```


```python
#add the parameter hole = (0 to 1) to create a donut chart
piechart = px.pie(labels = ratings.index, values = ratings.values, title = 'Content Rating', names = ratings.index, hole = 0.6)
piechart.update_traces(textposition = 'outside', textinfo='percent+label')
piechart.show()
```

# Numeric Type Conversion: Examine the Number of Installs

**Challenge**: How many apps had over 1 billion (that's right - BILLION) installations? How many apps just had a single install? 

Check the datatype of the Installs column.

Count the number of apps at each level of installations. 

Convert the number of installations (the Installs column) to a numeric data type. Hint: this is a 2-step process. You'll have make sure you remove non-numeric characters first. 


```python
df_apps_clean.Installs.describe()
```


```python
df_apps_clean.info() #enallaktika
```


```python
df_apps_clean[['App', 'Installs']].groupby('Installs').count()   #de mas aresoun ta komma
```


```python
df_apps_clean.info()
```


```python
df_apps_clean.Installs = df_apps_clean.Installs.astype(str).str.replace(',',"")

```


```python
df_apps_clean.Installs = pd.to_numeric(df_apps_clean.Installs)
```


```python
df_apps_clean[['App', 'Installs']].groupby('Installs').count()
```

# Find the Most Expensive Apps, Filter out the Junk, and Calculate a (ballpark) Sales Revenue Estimate

Let's examine the Price column more closely.

**Challenge**: Convert the price column to numeric data. Then investigate the top 20 most expensive apps in the dataset.

Remove all apps that cost more than $250 from the `df_apps_clean` DataFrame.

Add a column called 'Revenue_Estimate' to the DataFrame. This column should hold the price of the app times the number of installs. What are the top 10 highest grossing paid apps according to this estimate? Out of the top 10 highest grossing paid apps, how many are games?



```python
df_apps_clean['Price'].describe()
```


```python
df_apps_clean.Price = df_apps_clean.Price.astype(str).str.replace('$',"")
df_apps_clean.Price = pd.to_numeric(df_apps_clean.Price)
df_apps_clean.sort_values('Price', ascending = False).head(20)
```

### The most expensive apps sub $250


```python
df_apps_clean = df_apps_clean[df_apps_clean['Price'] < 250]
df_apps_clean.sort_values('Price', ascending=False).head(5)
```

### Highest Grossing Paid Apps (ballpark estimate)


```python
df_apps_clean['Revenue Estimate'] = df_apps_clean.Installs.mul(df_apps_clean.Price)
df_apps_clean.sort_values('Revenue Estimate', ascending = False)[:10]
```

# Plotly Bar Charts & Scatter Plots: Analysing App Categories


```python
df_apps_clean.Category.nunique()
```


```python
df_apps_clean.Category.value_counts()
```


```python
top10_category = df_apps_clean.Category.value_counts()[:10]
```


```python
top10_category
```

### Vertical Bar Chart - Highest Competition (Number of Apps)


```python
bar = px.bar(x = top10_category.index, y = top10_category.values, title = 'Top 10 Categories (per Number of Apps)')
bar.update_layout(xaxis_title = 'Category', yaxis_title = 'Number of Apps')
bar.show()
```

### Horizontal Bar Chart - Most Popular Categories (Highest Downloads)


```python
category_installs = df_apps_clean.groupby('Category').agg({'Installs':pd.Series.sum})
category_installs.sort_values('Installs', ascending = True, inplace = True)
category_installs.head(5)
```


```python
h_bar = px.bar(x = category_installs.Installs, y = category_installs.index, orientation='h', title = 'Category Popularity')
h_bar.update_layout(xaxis_title = 'Number of Downloads', yaxis_title = 'Category', xaxis = dict(type='log'))
h_bar.show()

```

### Category Concentration - Downloads vs. Competition

**Challenge**: 
* First, create a DataFrame that has the number of apps in one column and the number of installs in another:

<img src=https://imgur.com/uQRSlXi.png width="350">

* Then use the [plotly express examples from the documentation](https://plotly.com/python/line-and-scatter/) alongside the [.scatter() API reference](https://plotly.com/python-api-reference/generated/plotly.express.scatter.html)to create scatter plot that looks like this. 

<img src=https://imgur.com/cHsqh6a.png>

*Hint*: Use the size, hover_name and color parameters in .scatter(). To scale the yaxis, call .update_layout() and specify that the yaxis should be on a log-scale like so: yaxis=dict(type='log') 


```python
cat_number = df_apps_clean.groupby('Category').agg({'App':pd.Series.count})
```


```python
cat_number.head(5)
```


```python
cat_merged_df = pd.merge(cat_number, category_installs, on = 'Category', how = "inner")
```


```python
print(f'The dimensions of the DataFrame are: {cat_merged_df.shape}')
```


```python
cat_merged_df.sort_values('Installs', ascending=False)
```


```python
scatter = px.scatter(cat_merged_df, 
                     x = 'App', 
                     y = 'Installs', 
                     title = 'Category Concectration', 
                     size = 'App', 
                     hover_name = cat_merged_df.index,
                     color = 'Installs')
scatter.update_layout(xaxis_title = "Number of Apps(Lower = More Concentrated)",
                         yaxis_title = "Installs", 
                         yaxis = dict(type='log'))
scatter.show()
```

# Extracting Nested Data from a Column

**Challenge**: How many different types of genres are there? Can an app belong to more than one genre? Check what happens when you use .value_counts() on a column with nested values? See if you can work around this problem by using the .split() function and the DataFrame's [.stack() method](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.stack.html). 



```python
df_apps_clean.Genres.describe()
# print(f"There are {df_apps_clean.Genres.nunique} different genres")
df_apps_clean.Genres.value_counts()
```


```python
genres = len(df_apps_clean.Genres.value_counts())
print(f"There are {genres} different genres or combinations of genres. I want to find the number of the unique single genres")
```

### We need to separate the multiple genres at the colon separator.


```python
stack = df_apps_clean.Genres.str.split(';', expand = True).stack()
print(f"We now have a single column with shape: {stack.shape}")
```


```python
num_genres = stack.value_counts()
num_genres
```


```python
print(f"Number of genres : {len(num_genres)}")
```

# Colour Scales in Plotly Charts - Competition in Genres

**Challenge**: Can you create this chart with the Series containing the genre data? 

<img src=https://imgur.com/DbcoQli.png width=400>

Try experimenting with the built in colour scales in Plotly. You can find a full list [here](https://plotly.com/python/builtin-colorscales/). 

* Find a way to set the colour scale using the color_continuous_scale parameter. 
* Find a way to make the color axis disappear by using coloraxis_showscale. 


```python
top_15_genres = num_genres[:15]
bar = px.bar(x = top_15_genres.index, 
             y = top_15_genres.values, 
             title = 'Top Genres', 
             color = top_15_genres.values, 
             hover_name = top_15_genres.index,
             color_continuous_scale='Agsunset')

bar.update_layout(xaxis_title = 'Genre', yaxis_title = 'Number of Apps', coloraxis_showscale=False)

bar.show()

```

# Grouped Bar Charts: Free vs. Paid Apps per Category


```python
df_apps_clean.Type.value_counts()
```

# We see that the majority of apps are free on the Google Play Store. But perhaps some categories have more paid apps than others. Let’s investigate. We can group our data first by Category and then by Type. Then we can add up the number of apps per each type. Using as_index=False we push all the data into columns rather than end up with our Categories as the index.


```python
df_free_vs_paid = df_apps_clean.groupby(['Category', 'Type'], as_index = False).agg({'App' : pd.Series.count})
df_free_vs_paid
```


```python
df_free_vs_paid.sort_values('App')
```

**Challenge**: Use the plotly express bar [chart examples](https://plotly.com/python/bar-charts/#bar-chart-with-sorted-or-ordered-categories) and the [.bar() API reference](https://plotly.com/python-api-reference/generated/plotly.express.bar.html#plotly.express.bar) to create this bar chart: 

<img src=https://imgur.com/LE0XCxA.png>

You'll want to use the `df_free_vs_paid` DataFrame that you created above that has the total number of free and paid apps per category. 

See if you can figure out how to get the look above by changing the `categoryorder` to 'total descending' as outlined in the documentation here [here](https://plotly.com/python/categorical-axes/#automatically-sorting-categories-by-name-or-total-value). 


```python
g_bar = px.bar(df_free_vs_paid,
               x = 'Category',
               y = 'App',
               title = 'Free vs Paid Apps by Category',
               color = 'Type',
               barmode = 'group')

g_bar.update_layout(xaxis_title = 'Category',
                    yaxis_title = 'Number of Apps',
                    xaxis_tickangle = 45,
                    xaxis = {'categoryorder' : 'total descending'},
                    yaxis = dict(type = 'log'))

g_bar.show()
```


```python

```

# Plotly Box Plots: Lost Downloads for Paid Apps

**Challenge**: Create a box plot that shows the number of Installs for free versus paid apps. How does the median number of installations compare? Is the difference large or small?

Use the [Box Plots Guide](https://plotly.com/python/box-plots/) and the [.box API reference](https://plotly.com/python-api-reference/generated/plotly.express.box.html) to create the following chart. 

<img src=https://imgur.com/uVsECT3.png>



```python
box = px.box(df_apps_clean,
             x = 'Type',
             y = 'Installs', 
             color = 'Type',
             notched = True,
             points = 'all',
             title = 'How Many Downloads Are Paid Apps Giving Up?')
box.update_layout(yaxis = dict(type = 'log'))

box.show()

```

# Plotly Box Plots: Revenue by App Category

**Challenge**: See if you can generate the chart below: 

<img src=https://imgur.com/v4CiNqX.png>

Looking at the hover text, how much does the median app earn in the Tools category? If developing an Android app costs $30,000 or thereabouts, does the average photography app recoup its development costs?

Hint: I've used 'min ascending' to sort the categories. 


```python
df_paid_apps = df_apps_clean[df_apps_clean['Type'] == 'Paid']
df_paid_apps
```


```python
box = px.box(df_paid_apps,
             x = 'Category',
             y = 'Revenue Estimate',
             title = 'How Much Paid Apps Earn?')

box.update_layout(xaxis_title = 'Category',
                  yaxis_title = 'Paid App Ballpark Revenue',
                  xaxis_tickangle = 45,
                  xaxis = {'categoryorder' : 'min ascending'},
                  yaxis = dict(type = 'log'))
box.add_hline(y=30000, line_color='red', line_width=3, opacity = 0.3)

box.show()


```

# How Much Can You Charge? Examine Paid App Pricing Strategies by Category

**Challenge**: What is the median price price for a paid app? Then compare pricing by category by creating another box plot. But this time examine the prices (instead of the revenue estimates) of the paid apps. I recommend using `{categoryorder':'max descending'}` to sort the categories.


```python
df_paid_apps.Price.median()
```


```python
box = px.box(df_paid_apps,
             x='Category',
             y="Price",
             title='Price per Category')
 
box.update_layout(xaxis_title='Category',
                  yaxis_title='Paid App Price',
                  xaxis={'categoryorder':'max descending'},
                  xaxis_tickangle = 45,
                  yaxis=dict(type='log'))
box.add_hline(y=2.99 , line_color='red', line_width=3, opacity = 0.3)
 
box.show()
```


```python

```
