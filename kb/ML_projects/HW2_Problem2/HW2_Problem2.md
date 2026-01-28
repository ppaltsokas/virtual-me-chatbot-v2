# Problem 2

## <b>2.1</b>
### <u> Load the Breast Cancer dataset from the sklearn.datasets package. </u>

Load the necessary libraries for the project. (Cell was updated as the solution was progressing)


```python
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.svm import LinearSVC, SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import f1_score
from sklearn.model_selection import GridSearchCV
```

Load the dataset


```python
from sklearn import datasets

cancer = datasets.load_breast_cancer() # Load the breast cancer dataset directly from sklearn
X = cancer.data # Extract the features
y = cancer.target # Extract the target variable
```

## <b>2.2</b>
### <u> Out of the 30 available features, select only "Worst area" and "Mean Concave Points". </u>

Convert the dataset into a dataframe to perform EDA for better data understanding


```python
import pandas as pd
cancer_df = pd.DataFrame(cancer.data, columns=cancer.feature_names)
cancer_df['target']=y # Create a new column for the target
cancer_df
```

Print all the features to spot the "worst area" and "mean concave points" features' index


```python
print(cancer_df.info())
```

Check the distribution of the target variable


```python
print(cancer_df['target'].value_counts())
```


```python
plt.figure(figsize=(6,4))
sns.countplot(x='target', data=cancer_df)
plt.title("Distribution of Target Classes")
plt.xlabel("Target Class (0 = Malignant, 1 = Benign)")
plt.ylabel("Count")
plt.show()
```

Create a correlation matrix


```python
mask = np.triu(np.ones_like(cancer_df.corr(), dtype=bool)) # Create a mask to hide the upper triangle and make the heatmap more readable

plt.figure(figsize=(15, 15))
mask = np.triu(np.ones_like(cancer_df.corr(), dtype=bool))
sns.heatmap(cancer_df.corr(), mask=mask, annot=True, cmap='coolwarm', linewidths=0.5, annot_kws={"size": 7})
plt.title("Correlation Matrix of Breast Cancer Features")
plt.show()
```

Select the features required for the problem.


```python
X_selected = X[:, [7, 23]]
```

Again, create a dataframe for the two variables for better readability


```python
X_selected_df = pd.DataFrame(X_selected, columns=['Worst Area', 'Mean Concave Points'])
X_selected_df['target'] = y
```


```python
X_selected_df
```

Part	                                                 Explanation\
X_selected_df ------------------------>	The DataFrame with columns: ['Worst Area', 'Mean Concave Points', 'target'].\
X_selected_df.iloc[:,2] --------------> Selects all rows, column index 2 → this is the 'target' column.\
X_selected_df.iloc[:,2] == 0 --------->	Creates a boolean mask → True where 'target' == 0, False elsewhere.\
X_selected_df.columns[[0]] ----------->	Selects the name of column 0 → which is 'Worst Area'.\
X_selected_df.loc[mask, column_name] ->	Filters rows where 'target' == 0 and keeps only 'Worst Area' column.



```python
X_selected_df.loc[X_selected_df.iloc[:,2] == 0, X_selected_df.columns[[0]]]
```

## <b>2.3</b>
### <u> Visualize the data from the Positive and Negative class with the "Mean Concave Points" on the x-axis and "Worst Area" on the y-axis. </u>


```python
X_scaled = StandardScaler().fit_transform(X_selected) # Standardize the selected features so that mean = 0 and std = 1

# X_scaled[y == 0, 0] Worst Area malignant items (scaled)
# X_scaled[y == 0, 1] Mean Concave malignant benign items (scaled) 
# X_scaled[y == 1, 0] Worst Area benign items (scaled)
# X_scaled[y == 1, 1] Mean Concave Points benign items (scaled) 
plt.figure(figsize=(8, 6))
plt.scatter(X_scaled[y == 0, 0], X_scaled[y == 0, 1], c="magenta", label="Negative (0)", alpha=0.6, edgecolors="k")
plt.scatter(X_scaled[y == 1, 0], X_scaled[y == 1, 1], c="cyan", label="Positive (1)", alpha=0.6, edgecolors="k")
plt.xlabel("Standardized Mean Concave Points")
plt.ylabel("Standardized Worst Area")
plt.title("Breast Cancer Dataset (Standardized)")
plt.legend()
plt.grid(True)
plt.show()
```

## <b>2.4</b>
### <u> Train two linear SVM classifiers with the regularization hyperparameter C equal to 0.1 and 1000, respectively. </u>

Create and fit two separate SVM pipelines with a linear kernel, to first scale our features and then apply the SVC.\
For the first classifier C=0.1, which means less penalty on margin violations. This means that the model may underfit.


```python
clf_1 = make_pipeline(StandardScaler(), SVC(kernel="linear", C=0.1, random_state=42))
clf_1.fit(X_selected, y)

```

For the second classifier C=1000, which means higher penalty on margin violations. That means that the model will try harder to correctly classify each training example, potentially leading to overfitting.


```python
clf_2 = make_pipeline(StandardScaler(), SVC(kernel="linear", C=1000, random_state=42))
clf_2.fit(X_selected, y)
```

## <b>2.5</b>
### <u> Plot data points, decision boundaries, and margins for the two classifiers. </u>

Define a function that will plot the decision boundary, margins, support vectors, and data points for a linear SVM classifier, and prints out the equations of the decision boundary and margin lines for reference.


```python
def plot_svc_decision_boundary(svm_clf, X, y, title):
    """
    Plots the decision boundary, margins, support vectors, and data points for a linear SVM classifier.
    Parameters:
    svm_clf : A trained SVM pipeline
    X : Array of shape (n_samples, 2) that holds the unscaled input data
    y : Array of shape (n_samples,1) that holds the class labels corresponding to each sample in X.
    title : str type, which will be the title of the plot
    Returns:
    None
    """
    # Extract the scaler and SVM model from the pipeline
    scaler = svm_clf.named_steps['standardscaler']
    svc = svm_clf.named_steps['svc']
    
    # Scale the input data X
    X_scaled = scaler.transform(X)
    
    # Compute the decision boundary
    w = svc.coef_[0]
    b = svc.intercept_[0]

    # Generate an array of 200 evenly spaced with a range from the min value to the max value of the "Mean Concave Points" data. 
    # We start slightly below the minimum value, and we end slightly above the maximum value to ensure all data points 
    # are within the grid 
    x0 = np.linspace(X_scaled[:, 0].min() - 1, X_scaled[:, 0].max() + 1, 200)
    
    decision_boundary = -w[0] / w[1] * x0 - b / w[1]
    margin = 1 / np.linalg.norm(w)
    gutter_up = -w[0] / w[1] * x0 - (b - 1) / w[1]
    gutter_down = -w[0] / w[1] * x0 - (b + 1) / w[1]

    # Plot the decision boundary, and the margin lines
    plt.figure(figsize=(8, 6))
    plt.plot(x0, decision_boundary, 'k-', linewidth=2, label='Decision Boundary')
    plt.plot(x0, gutter_up, 'k--', linewidth=2, label='Margins')
    plt.plot(x0, gutter_down, 'k--', linewidth=2)
    
    # Plot the data points
    plt.scatter(X_scaled[y == 0, 0], X_scaled[y == 0, 1], color='magenta', label='Negative class', edgecolors='k')
    plt.scatter(X_scaled[y == 1, 0], X_scaled[y == 1, 1], color='cyan', label='Positive class', edgecolors='k')
    
    # Plot support vectors
    plt.scatter(svc.support_vectors_[:, 0], svc.support_vectors_[:, 1], s=100,
                facecolors='none', edgecolors='k', alpha=0.8, linewidths=1, label='Support Vectors', zorder=-2)
    
    plt.xlabel("Standardized Mean Concave Points")
    plt.ylabel("Standardized Worst Area")
    plt.xlim(-2,2)
    plt.ylim(-2,2)
    plt.title(title)
    plt.legend(loc='lower right')
    plt.grid(True)
    plt.show()

    # Print out the equations of the decision boundary, and the margin lines
    slope = -w[0] / w[1]
    intercept = -b / w[1]
    intercept_up = intercept + margin
    intercept_down = intercept - margin
    print(f"{title}")
    print(f"Decision Boundary: x1 = {slope:.4f} * x0 + {intercept:.4f}")
    print(f"Upper Margin: x1 = {slope:.4f} * x0 + {intercept_up:.4f}")
    print(f"Lower Margin: x1 = {slope:.4f} * x0 + {intercept_down:.4f}")
```


```python
plot_svc_decision_boundary(clf_1, X_selected, y, title="Linear SVM with C=0.1")
plot_svc_decision_boundary(clf_2, X_selected, y, title="Linear SVM with C=1000")
```

## <b>2.6</b>
### <u> Display the number of Support Vectors and the F1-score for each of the two classifiers. </u>

Extract the SVC objects from the pipelines, to be able to access the support_vectors_ attribute.


```python
svc_1 = clf_1.named_steps['svc']
svc_2 = clf_2.named_steps['svc']
svc_1.support_vectors_.shape, svc_2.support_vectors_.shape # Check the shape of the support vectors arrays.
```

Count the number of support vectors for each classifier.


```python
num_support_vectors_1 = svc_1.support_vectors_.shape[0]
num_support_vectors_2 = svc_2.support_vectors_.shape[0]

print(f"There are {num_support_vectors_1} support vectors for classifier with C=0.1")
print(f"There are {num_support_vectors_2} support vectors for classifier with C=1000")
```

Compute the F1-scores for each classifier.


```python
# Predict on the training data
y_pred_1 = clf_1.predict(X_selected)
y_pred_2 = clf_2.predict(X_selected)

# Calculate the F1-score for each classifier
f1_score_1 = f1_score(y, y_pred_1)
f1_score_2 = f1_score(y, y_pred_2)
print(f"F1-score for classifier with C=0.1: {f1_score_1}")
print(f"F1-score for classifier with C=1000: {f1_score_2}")
```

## <b>2.7</b>
### <u> Run a Grid Search for an RBF SVM, with the following hyperparameter options:</u> 
### C$:[0.1, 1, 10, 100]$, gamma: $[0.1, 1, 10, 100]$

Define the hyperparameter options.


```python
param_grid = {'svc__C': [0.1, 1, 10, 100], 'svc__gamma': [0.1, 1, 10, 100]}
```

Create a pipeline that scales the data and then applies a SVM with an RBF kernel.


```python
rbf_pipeline = make_pipeline(StandardScaler(), SVC(kernel = 'rbf', random_state=42))
rbf_pipeline
```

Perform grid search with a 5-fold cross-validation setup, using the F1-score as the socring metric.


```python
grid_search = GridSearchCV(rbf_pipeline, param_grid, cv=5, scoring='f1')
grid_search.fit(X_selected, y)
```

## <b>2.8</b>
### <u> Display the best hyperparameter values, the number of support vectors, and the F1-score for the best model. </u>

Extract the best model found by the grid search.


```python
best_model = grid_search.best_estimator_ # best_estimator_ returns the pipeline with the best combination of parameters.
best_params = grid_search.best_params_ # best_params_ returns the parameters of the best pipeline.
best_svc = best_model.named_steps['svc'] # Extract the SVC model from the best pipeline.
num_support_vectors = best_svc.support_vectors_.shape[0] # Get the number of support vectors
best_f1_score = f1_score(y, best_model.predict(X_selected)) # Get the F1-score by evaluating the best model on the full dataset.

print(f"Best Model Parameters: {best_params}")
print(f"Number of Support Vectors for Best Model: {num_support_vectors}")
print(f"F1-Score for Best Model: {best_f1_score:.4f}")
```

## <b>2.9</b>
### <u>  Plot the data points and the decision boundary for the best RBF model. </u>

We retrieve the best gamma and C values found during Grid Search and re-fit the SVM model using these parameters.


```python
gamma = best_params['svc__gamma']
C = best_params['svc__C']

rbf_kernel_svm_clf = make_pipeline(StandardScaler(), SVC(kernel='rbf', gamma=gamma, C=C))
rbf_kernel_svm_clf.fit(X_selected, y)
```


```python
X_selected.shape
```

Since our model was trained on scaled data, we need to scale the data points for plotting to maintain consistency.


```python
scaler = rbf_kernel_svm_clf.named_steps['standardscaler']
X_scaled_best = scaler.transform(X_selected)
```

We create the mesh grid for plotting. We start slightly below the minimum value, and we end slightly above the maximum value to ensure all data points are within the grid 


```python
xx, yy = np.meshgrid(np.linspace(X_scaled_best[:, 0].min() - 1, X_scaled_best[:, 0].max() + 1, 200),
                     np.linspace(X_scaled_best[:, 1].min() - 1, X_scaled_best[:, 1].max() + 1, 200))
# xx and yy are (200,200) arrays. We flatten the 2D arrays into 1D and concatenate them to create a 2D array of grid points. 
# Positive values indicate one class, negative values indicate the other.
grid = np.c_[xx.ravel(), yy.ravel()]
# The decision_function computes the distance of each point in grid to the decision boundary and creates an (40000,) array.
Z = rbf_kernel_svm_clf.named_steps['svc'].decision_function(grid) 
# We, then reshape this array, to match the shape of xx and yy, so we can plot it over the grid.
Z = Z.reshape(xx.shape)
```


```python
for name,var in {"xx":xx, "yy":yy, "Z":rbf_kernel_svm_clf.named_steps['svc'].decision_function(grid), "Z_Reshaped":Z}.items():
    print(f"Variable:{name}")
    print(type(var))
    print(var.shape)
```


```python
# Plot decision boundary
plt.figure(figsize=(8, 6))
# Create filled contour plots
plt.contourf(xx, yy, Z, levels=np.linspace(Z.min(), Z.max(), 50), alpha=0.6, cmap='viridis')
# Draw the decision boundary where the decision function equals zero
plt.contour(xx, yy, Z, levels=[0], linewidths=2, colors='black', alpha=0.8)

# Plot the scaled data points
plt.scatter(X_scaled_best[y == 0, 0], X_scaled_best[y == 0, 1], c="magenta", label="Negative (0)", alpha=0.6, edgecolors="black")
plt.scatter(X_scaled_best[y == 1, 0], X_scaled_best[y == 1, 1], c="cyan", label="Positive (1)", alpha=0.6, edgecolors="black")

plt.xlabel("Standardized Mean Concave Points")
plt.ylabel("Standardized Worst Area")
plt.title("Best RBF Kernel SVM Decision Boundary")
plt.legend(loc='upper left')
plt.grid(True)
plt.show()
```

Unlike a linear SVM boundary, which was a single straight line, the RBF kernel produces a highly non-linear decision boundary. This allows the classifier to adapt to the data’s underlying structure more flexibly, potentially capturing subtle class distinctions that a linear model misses.The best RBF model’s decision boundary is a visually clear demonstration of how kernel methods can capture complex patterns in low-dimensional projections of high-dimensional data.
