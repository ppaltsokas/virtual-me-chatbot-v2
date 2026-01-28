# Problem 1


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()
from sklearn.linear_model import LinearRegression
from pathlib import Path
import zipfile
import urllib.request
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_absolute_percentage_error, mean_squared_error, accuracy_score
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split, cross_val_score, KFold


```

## <b>1.1</b>
### <u>Open a Jupyter-notebook. Download the wines dataset and load the data of the “red” wines.</u>

## 📕 Fetch & Load Wine_Quality_Data


```python
from pathlib import Path
import pandas as pd

def load_wine_quality_data():
    '''This function downloads and unzips the wine_quality.zip file, 
    containing the winequality-white.csv and winequality-red.csv. After the extraction, 
    the function returns the winequality-red.csv as a Pandas dataframe'''
    
    zip_path = Path('datasets/wine_quality.zip')  # Path to the ZIP file
    dataset_folder = Path('datasets/wine_quality_dataset')  # Path to the extracted dataset folder
    
    if not dataset_folder.exists():  # Check if dataset is already downloaded
        Path('datasets').mkdir(parents=True, exist_ok=True)  # In case it doesn't exist, create the datasets folder
        
        url = 'https://archive.ics.uci.edu/static/public/186/wine+quality.zip'  # URL of the dataset
        urllib.request.urlretrieve(url, zip_path)  # Download the ZIP file to the path given earlier
        
        with zipfile.ZipFile(zip_path) as zip_ref:  # Open the ZIP file
            zip_ref.extractall(dataset_folder)  # Extract all files to the dataset folder
        print('Dataset downloaded and extracted successfully.')
    
    return pd.read_csv(dataset_folder / 'winequality-red.csv')  # Return the DataFramea
wine_quality_data = load_wine_quality_data()

red_wine_df = pd.read_csv('datasets/wine_quality_dataset/winequality-red.csv', sep=';')
```

Print the dataset's first rows


```python
red_wine_df.head()
```

## <b>1.2</b>
### <u>What are the features describing the quality of the wines?</u>


Overview of the red wine dataframe


```python
red_wine_df.info()
```

We notice there are 12 different features, 1599 non-null values out of 1599 entries, which means there are no missing values. 11 columns are of type float64 and describe continuous numerical features, while 1 column is of type int64, and describes a discrete numerical feature. \
Let's store the feature names in a list and print them out.


```python
red_wine_df_col = list(red_wine_df.columns) # Get the columns
print(f'The features of the dataset are: {", ".join(red_wine_df_col)}.') # Join them
```

## <b>1.3</b>
### <u>Compute the descriptive statistics of the dataset features and discuss about their types, ranges and completeness.</u>


Check the dataset features' descriptive statistics


```python
red_wine_df.describe()
```

Inspect the features data types and completness


```python
red_wine_df.info()
```


```python
red_wine_df.isnull().sum()
```


```python
def feature_type(column_name):
    '''
    Determines the type of a given feature.
    '''
    if column_name == 'quality':
        return 'Ordinal Categorical' # Checks if the column name is 'qualtiy', which is of ordinal categorical type. 
    else:
        return 'Continuous Numerical' # Every other column is of continuous numerical type.
```

Present the type, range and completeness of the dataset features


```python
descriptive_stats = red_wine_df.describe() 

for column in descriptive_stats.columns: # Loop through the columns to retrieve its descriptive statistics and store their type, min and max values, and count.
    f_type = feature_type(column)
    min_val = descriptive_stats.loc['min', column]
    max_val = descriptive_stats.loc['max', column]
    count_val = descriptive_stats.loc['count', column]
    
    # Print the features' details
    print(f'Feature: {column}')
    print(f' - Type: {f_type}')
    print(f' - Range: [{min_val}, {max_val}]')
    print(f' - Completeness: {int(count_val)} / {len(red_wine_df)} values present')
    print('-' * 40) # Separator

```

Domain knowledge observations: The wines in this dataset represent a diverse range. Most of the wines fall within expected ranges for acidity, alcohol content, and pH. A wide range of values for Residual Sugar, shows that the wines include both dry and sweet wines. The quality ratings indicate that most wines are average, with no wines rated extremely poorly (min rating is 3) or excellently (max rating is 8).

## <b>1.4</b>
### <u>Form the histograms of the features and discuss their distribution. Can the distribution of some features be improved (tending more towards the Gaussian) and how?</u>



```python
red_wine_df.hist(bins=50, figsize=(15,8)) # Create the histograms, with 50 bins
plt.tight_layout() # Use tight_layout so that the histogram title does not collide with the x-axis ticks/values.
plt.show()
```

Setting aside the Quality feature, which is a categorical variable with distinct values, we observe that most distributions are right-skewed. Others have a strong right skew (Total Sulfur Dioxide, Chlorides, Residual Sugar) while others have a slight right skew (Alcohol, Fixed Acidity, Volatile Acidity). We also notice that Density and pH are nearly symmetrical, colse to normal distribution. For the right-skewed features, we should apply a logarithmic transformation to reduce the skewness and make their distributions closer to Gaussian followed by scaling techniques such as standardization, to achieve a mean of 0 and a standard deviation of 1, or min-max scaling to bring the values into a fixed range, like [0,1] or [-1,1].

## <b>1.5</b>
### <u>Which are the features that mostly affect quality and which are those that affect it less? Provide evidence through correlation and discuss accordingly.</u>



```python
red_wine_df.corr()
```


```python
corr_matrix = red_wine_df.corr()
corr_matrix['quality'].sort_values(ascending=False)
```

Create the heatmap with mask applied


```python
mask = np.triu(np.ones_like(red_wine_df.corr(), dtype=bool)) # Create a mask for the upper triangle

plt.figure(figsize=(8, 6))
sns.heatmap(red_wine_df.corr(), annot=True, cmap='icefire', vmin=-1, vmax=1, mask=mask, annot_kws={"size": 8})
plt.title('Red Wine Features Correlation Heatmap')
plt.show()
```

## <b>1.6</b>
### <u>Split the dataset into a training and a testing set retaining 80% and 20% of the total number of samples, respectively, using random shuffling and splitting that retains the statistical properties of the input data (stratified) with respect to quality.</u>

Split the dataset into training and test sets, with a ratio of 80%-20%. I use stratified sampling to ensure that the distribution of the 'quality' target variable, is retained in the new sets.


```python
strat_train_set, strat_test_set = train_test_split(red_wine_df, test_size=0.2, stratify=red_wine_df['quality'], random_state=42)
```

Confirm with manual calculations, that the stratification maintained a similar distribution. Pass the results into a dataframe and print them.


```python
test_strat_ratio = (strat_test_set['quality'].value_counts() / len(strat_test_set)).sort_index() 
train_strat_ratio = (strat_train_set['quality'].value_counts() / len(strat_train_set)).sort_index()
original_strat_ratio = (red_wine_df['quality'].value_counts() / len(red_wine_df)).sort_index()

ratios_df = pd.DataFrame({
    'Original %': (original_strat_ratio * 100).round(2),
    'Train %': (train_strat_ratio * 100).round(2),
    'Test %': (test_strat_ratio * 100).round(2)
})
```


```python
ratios_df
```

The quality distribution is retained in both training and test set. This was expected, since we used stratified splitting which ensures exactly that.

## <b>1.7</b>
### <u>Scale the data with a Standard scaler and train a linear regression model. Evaluate the performance of the model, using the test set, with respect to metrics such as R2 -score, Mean Absolute Error, Mean Absolute Percentage Error, Mean Squared Error and Accuracy. Comment on the accuracy of predictions by plotting Actuals vs Predicted diagram.</u>

#### Reset the indices for the train and the test set.
When splitting datasets, the indices often retain their original values, which might be scattered.\
Resetting indices ensures clean, sequential indices (0, 1, 2, ...) for both datasets.\
It avoids errors later, especially when combining predictions or debugging.


```python
strat_train_set.reset_index(drop=True, inplace=True)
strat_test_set.reset_index(drop=True, inplace=True)
```

To train the model, we need to separate:\
X: Independent variables (features that describe the wine).\
y: Dependent variable (wine quality in this case).\
This is a standard practice in supervised machine learning problems


```python
X_train = strat_train_set.drop('quality',axis=1)
y_train = strat_train_set['quality']

X_test = strat_test_set.drop('quality', axis=1)
y_test = strat_test_set['quality']
```

Many machine learning models, including Linear Regression, perform better when features are standardized.\
StandardScaler transforms features to have mean = 0 and standard deviation = 1.\
Important: The scaler is fitted only on the training set, to prevent data leakage. The same scaler is then applied to the test set.


```python
target_scaler = StandardScaler()

X_train_scaled = target_scaler.fit_transform(X_train)
X_test_scaled = target_scaler.transform(X_test)
```

#### Initialize the Linear Regression model, using the scaled training features and the training target variable. Then, use the trained model to predict the 'quality' of the wines in the test set.
It's a simple baseline regression model.\
It tries to find the best-fitting line by minimizing the Mean Squared Error (MSE) between actual and predicted values.\
It's a good starting point, but not always the best for complex relationships.\
The model, after training, is now used to make predictions on unseen data (X_test_scaled).\
Outputs are continuous values, as Linear Regression predicts floats.


```python
model = LinearRegression()
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
```

#### Calculate the requested metrics, to evaluate the performance of our model.

R² Score (Coefficient of Determination): Measures how much variance in the target variable is explained by the model.\
Value of 1 means perfect prediction.\
Value of 0 means the model is as good as the mean of y.\
MAE (Mean Absolute Error): Average absolute error. Easy to interpret as it's in the same units as quality.\
MAPE (Mean Absolute Percentage Error): Measures the error as a percentage. Useful to understand errors relative to the actual values.\
MSE (Mean Squared Error): Penalizes larger errors more heavily (squared).


```python
# R² Score
r2 = r2_score(y_test, y_pred)

# Mean Absolute Error
mae = mean_absolute_error(y_test, y_pred)

# Mean Absolute Percentage Error
mape = mean_absolute_percentage_error(y_test, y_pred)

# Mean Squared Error
mse = mean_squared_error(y_test, y_pred)
```

The target variable 'quality' in the dataset, takes integer values in range $[3,8]$. The linear regression model, outputs continuous values, that is float numbers. Since the actual wine quality is always an integer, we round those predictions, and then we keep only the ones that fall in the valid range of our dataset's wine quality. Accuracy measures how well the model performed in predicting the actual quality values. Had we not rounded the predictions, it would be virtually impossible to achieve an exact match and we would get a misleadingly low evaluation score.


```python
y_pred_rounded = np.rint(y_pred) # Round predictions to the nearest integer

y_pred_rounded = np.clip(y_pred_rounded, y_test.min(), y_test.max()) # Ensure predictions are within the valid 'quality' range

accuracy = accuracy_score(y_test, y_pred_rounded)
```

Create a dictionary for the metrics and pass it into a dataframe.


```python
metrics = {'Metric': ['R² Score', 'Mean Absolute Error (MAE)', 'Mean Absolute Pct Error (MPAE)', 'Mean Squared Error (MSE)', 'Accuracy'],
           'Value': [round(r2,3), round(mae,3), round(mape,3), round(mse,3), round(accuracy,3)]}
           

```


```python
metrics_df = pd.DataFrame(metrics)
metrics_df
```

The model's R² score of 0.37, suggests that only 37% of the variance in the 'quality' scores is being explained by the model and the model's Accuracy score of 0.597, suggests that the model correctly predicts the wine quality around 59.7% of the time. Our model is not performing particularly well, which might mean that a linear regression model might not be the best fit for this problem.

This can also be seen in the visualization below.

Plot Actual vs Predicted values


```python
plt.figure(figsize=(8,6))
plt.scatter(y_test, y_pred, alpha=0.7, color='b')
plt.xlabel('Actual Quality')
plt.ylabel('Predicted Quality')
plt.title('Actual vs Predicted Quality')
diagonal = np.linspace(y_test.min(), y_test.max(), 100)  # Generate 100 values between the minimum value of the y_test and 
                                                         # the maximum value of y_test
plt.plot(diagonal, diagonal, 'r--') # Draw a diagonal line, where x and y are equal, hence the y=x line. That represents a 
                                    # diagonal reference line that indicates the perfect predictions.
plt.show()
```

We observe that the points fall far off from the reference prediction reference line.

## <b>1.8</b>
### <u>Perform 10-fold cross validation and compute the mean and standard deviation of the scores over the folds. Is the model’s R2-score within the limits defined by the 10-fold cross validation?</u>

Initialize the linear regression model, and define the 10-fold CV using KFold. Perform cross validation, computing the R² for each fold, and store the results in cv_scores.

The training set is split into 10 parts.\
The model is trained on 9 parts and validated on the 10th.\
This repeats 10 times, so every fold gets to be the validation set once\
The R² score is computed in each fold and saved in cv_scores.


```python
linear_model = LinearRegression()

kf = KFold(n_splits=10, shuffle=True, random_state=42)

cv_scores = cross_val_score(linear_model, X_train_scaled, y_train, cv=kf, scoring='r2')
print("Cross-Validation R² Scores:")
print(cv_scores)
```

Calculate the mean and standard deviation of R² scores

Mean R² → Average performance of the model across the folds.\
Standard Deviation of R² → Measures stability and variance of the model's performance across folds.\
This gives you an idea of how much the model's performance fluctuates across different training-validation splits.


```python
mean_r2 = cv_scores.mean()
std_r2 = cv_scores.std()

print(f"\nMean R² Score: {mean_r2:.4f}")
print(f"Standard Deviation of R² Scores: {std_r2:.4f}")
```

Now that CV is done, we train the model on the entire training set to prepare for final evaluation on the test set.


```python
linear_model.fit(X_train_scaled, y_train)
```

Predict the target variable for the test data


```python
y_pred = linear_model.predict(X_test_scaled)
```

Calculate R² score on the test set. We evaluate the trained model on unseen data.


```python
test_r2 = r2_score(y_test, y_pred)

print(f"\nTest Set R² Score: {test_r2:.4f}")
```

Calculate the limits

We calculate a range of "expected" R² scores based on CV:\
Lower Limit = Mean R² - Std R²\
Upper Limit = Mean R² + Std R²\
This defines a confidence interval-like band to judge if the model generalizes as expected.


```python
lower_limit = mean_r2 - std_r2
upper_limit = mean_r2 + std_r2

print(f"\nCross-Validation R² Score Range: [{lower_limit:.4f}, {upper_limit:.4f}]")
```

Check if test R² score is within the limits


```python
if lower_limit <= test_r2 <= upper_limit:
    print(f"The model's test R² score: {test_r2:.4f} is within the limits defined by the 10-fold cross-validation.")
else:
    print(f"The model's test R² score: {test_r2:.4f} is NOT within the limits defined by the 10-fold cross-validation.")


```
