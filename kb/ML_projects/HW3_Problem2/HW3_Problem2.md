# Problem 2

#### This problem focuses on supervised learning concepts using Ensemble Models, utilizing popular learning frameworks. Additionally, the final question benchmarks the performance of a semi-supervised learning approach using the scikit-learn library. Please fix the random state to 42 where required. 


```python
## Collection of imports for Problem 2
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split, StratifiedShuffleSplit
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
# from sklearn.svm import SVC
# from sklearn.ensemble import BaggingClassifier
# from sklearn.metrics import classification_report, confusion_matrix
# from sklearn.semi_supervised import SelfTrainingClassifier
```

## <b>2.1</b>
### Load the provided dataset, pima.csv, print its shape and display the distribution of the target variable.


```python
import pandas as pd
# Downloaded the dataset from Kaggle and renamed from diabetes.csv to pima.csv, in order to allign with the request.
data = pd.read_csv('pima.csv')
data_og=pd.read_csv('pima.csv') # Keep a copy of the original dataset
```

 Print the first ten lines to take a peek in the data


```python
data.head(10)
```

Print the shape of the datase


```python
print("Dataset shape:", data.shape)
```

 Extract the target variable


```python
target=data['Outcome']
```

Print the target variable distribution


```python
print("Target Variable Distribution:")
print(target.value_counts())
```

Print the percentage distribution of the target variable


```python
print((target.value_counts()/data.shape[0] * 100).round(2).astype(str) + '%')
```

Plot the distribution of the target variable


```python
from matplotlib import pyplot as plt
import seaborn as sns

plt.figure(figsize=(6,4))
sns.countplot(x=target, data=data)
plt.title("Target Variable Distribution")
plt.xlabel("Outcome (0 = Negative, 1 = Positive)")
plt.ylabel("Count of Samples")
plt.show()
```

## <b>2.2</b>
### Display the main statistical characteristics of each column in the data in a tabular format. Identify columns where the minimum value takes an unreasonable value equal to zero. Replace these zero values with the median of the corresponding column, as they represent missing values based on the dataset’s creation protocol. Print the updated dataset’s characteristics in a tabular format and list the columns affected by this step.

Display the summary statistics of the dataset.


```python
data.describe()
```

Plot histograms of all features to visually identify any abnormalities.


```python
data.hist(bins=50, figsize=(15,8)) # Create the histograms, with 50 bins
plt.tight_layout() # Use tight_layout so that the histogram title does not collide with the x-axis ticks/values.
plt.show()
```

We wouldn't expect the attributes 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin' and 'BMI', to have zero values. These zeroes represent missing values.

Define the columns that should not contain zero values, and count the number of zeroes in each column.


```python
unreasonable_columns = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
print("Number of zero values in unreasonable columns:")
print((data[unreasonable_columns] == 0).sum())
```

Replace all zero values in the unreasonable columns with the median of the non-zero values (In order to calculate the median of the actual values we remove the zeroes from the calculation, because not doing so, would alter the values' distribution). Then we replace those zeroes with the median.


```python
for col in unreasonable_columns:
    median_value = data[col][data[col] != 0].median()
    data[col] = data[col].replace(0, median_value)
```

Confirm there are no zero values remaining in the unreasonable columns.


```python
(data[unreasonable_columns]==0).any()
```

Print the updated dataset's statistics


```python
data.describe()
```

Identify and print the affected columns.


```python
affected_columns = []
for col in unreasonable_columns:
    if not data_og[col].equals(data[col]):
        affected_columns.append(col)

# Print affected columns
print("Affected columns:")
print(affected_columns)
```

## <b>2.3</b>
### Perform a stratified split of the dataset, allocating 700 instances to the training set and the remaining samples as the test set. Ensure that the target variable is the Outcome column, while the rest of the columns constitute the feature space for the classification task.


```python
X = data.drop(columns=['Outcome'])
y = data['Outcome']
```


```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, 
                                                    train_size =700, 
                                                    stratify = y, 
                                                    random_state=42)
```


```python
print("Train set size:",len(X_train))
print("Test set size:", len(X_test))
```

## <b>2.4</b>
### Train the following models:
### - A simple Decision Tree classifier using the default values of its parameters. 
### - A Random Forest classifier using the default values of its parameters.
### - A Bagging classifier with an SVM classifier (linear kernel) and 10 estimators.
### - An AdaBoost classifier with a decision tree classifier, using 100 estimators and a learning rate of 0.25
### For each model, display a classification report presenting the standard classification metrics, recision, recall, and f1-score and the confusion matrix as they were calculated on the test set. 

### Training

Decision Tree classifier


```python
from sklearn.tree import DecisionTreeClassifier

dt_clf = DecisionTreeClassifier(random_state=42)
dt_clf.fit(X_train, y_train)
y_pred_dt = dt_clf.predict(X_test)
```

Random Forest classifier


```python
from sklearn.ensemble import RandomForestClassifier

rf_clf = RandomForestClassifier(random_state=42)
rf_clf.fit(X_train, y_train)
y_pred_rf = rf_clf.predict(X_test)
```

Bagging classifier (SVM)


```python
from sklearn.ensemble import BaggingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

bag_svm_pipeline = make_pipeline(StandardScaler(), 
                                 BaggingClassifier(SVC(kernel='linear', random_state=42),
                                                   n_estimators=10,
                                                   random_state=42))

bag_svm_pipeline.fit(X_train, y_train)
y_pred_bag_svm = bag_svm_pipeline.predict(X_test)
```

AdaBoost classifier (Decision Tree)


```python
from sklearn.ensemble import AdaBoostClassifier

ada_clf = AdaBoostClassifier(
    DecisionTreeClassifier(random_state=42),
    n_estimators=100,
    learning_rate=0.25,
    algorithm="SAMME",
    random_state=42)
ada_clf.fit(X_train, y_train)
y_pred_ada = ada_clf.predict(X_test)
```

### Evaluation


```python
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix

def model_evaluation_and_conf_mat(model, X_test, y_test, model_name):
    """Evaluates the model on test data, and prints classification metrics along with a Seaborn heatmap confusion matrix."""
    print(f"\n {model_name} Classification metrics")
    y_pred = model.predict(X_test)
    
    print(classification_report(y_test, y_pred))
    
    # Compute confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # Plot confusion matrix using Seaborn
    plt.figure(figsize=(6,5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=np.unique(y_test), yticklabels=np.unique(y_test))
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.title(f"Confusion Matrix - {model_name}")
    plt.show()

```


```python
print("\nDecision Tree Classification Report:")
model_evaluation_and_conf_mat(dt_clf, X_test, y_test, "Decision Tree")
```


```python
print("\nRandom Forest Classification Report:")
model_evaluation_and_conf_mat(rf_clf, X_test, y_test, "Random Forest")
```


```python
print("\nBagging with SVM Classification Report:")
model_evaluation_and_conf_mat(bag_svm_pipeline, X_test, y_test, "Bagging (SVM)")
```


```python
print("\nAdaBoost Classification Report:")
model_evaluation_and_conf_mat(ada_clf, X_test, y_test, "AdaBoost")
```

## <b>2.5</b>
### Compare the performance of the previous four models. Comment on the observed performance differences.


```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def model_metrics(model, X_test, y_test):
    y_pred = model.predict(X_test)
    return {"Accuracy": accuracy_score(y_test, y_pred),
    "Precision": precision_score(y_test, y_pred),
    "Recall": recall_score(y_test, y_pred),
    "F1-score": f1_score(y_test, y_pred)}
```


```python
metrics_df = pd.DataFrame([
    model_metrics(dt_clf, X_test, y_test),
    model_metrics(rf_clf, X_test, y_test),
    model_metrics(bag_svm_pipeline, X_test, y_test),
    model_metrics(ada_clf, X_test, y_test)
], index=["Decision Tree", "Random Forest", "Bagging (SVM)", "AdaBoost"]).round(2).astype(str)

metrics_df
```

Looking at the results, <b>Random Forest</b> clearly stands out as the best model, achieving the highest accuracy (0.81) and the best balance between precision, recall, and F1-score. This shows how powerful ensemble methods can be in improving predictions and handling complex patterns in the data.\
<b>Bagging with SVM</b> does a decent job too, with an accuracy of 0.74 and an F1-score of 0.62. It offers some improvements over a standalone model but doesn't quite reach the level of Random Forest.\
On the other hand, the <b>Decision Tree</b> struggles a bit more. While its accuracy (0.72) isn’t too far behind, its recall is quite low (0.50), meaning it misses a lot of positive cases. This suggests it’s not as reliable when it comes to generalizing well.\
<b>AdaBoost</b>, despite being another ensemble method, surprisingly performs the worst. Its recall (0.46) is the lowest, and its F1-score (0.52) reflects that it’s having a hard time maintaining a good balance between precision and recall.\
Overall, Random Forest is the clear winner, showing why it’s such a popular choice. 

## <b>2.6</b>
### Select the best-performing classifier from Question 4 as the base model. Wrap it in an instance of the SelfTrainingClassifier class with the arguments criterion=‘threshold’ and threshold=0.99. Randomly select 200 instances from the initial training set as labeled data, marking the rest as unlabeled. Train the semi-supervised model on the combined labeled and unlabeled data and train the supervised model on only the labeled data. Evaluate both models on the same test set, display the classification reports, and add your comments.


```python
from sklearn.ensemble import RandomForestClassifier


base_model = RandomForestClassifier(random_state=42)
```


```python
from sklearn.semi_supervised import SelfTrainingClassifier
self_training_clf = SelfTrainingClassifier(base_model, criterion="threshold", threshold=0.99)
```


```python
train_idx = X_train.index.to_numpy()

# Randomly select 200 indices from X_train's index
np.random.seed(42)
labeled_idx = np.random.choice(train_idx, 200, replace=False)
labeled_idx[:10] # Check the first 10 indeces
```


```python
X_labeled = X_train.loc[labeled_idx]
y_labeled = y_train.loc[labeled_idx]
```


```python
X_unlabeled = X_train.drop(index=labeled_idx) # Create a set keeping only the unlabeled data from X_train, 
                                             # by droping the indeces of the labeled data
y_unlabeled = np.full(len(X_unlabeled),-1) # Set the unlabeled dataset's target to -1 (no class)
```


```python
# Check correct distribution of labeled/unlabeled data
(len(X_unlabeled) == 500) and (len(y_unlabeled) == 500)
```


```python
X_combined = pd.concat([X_labeled, X_unlabeled]) # pd.DataFrame
y_combined = np.concatenate([y_labeled, y_unlabeled]) # np.array
```

Train the SelfTrainingClassifier on the combined labeled and unlabeled data


```python
self_training_clf.fit(X_combined, y_combined)
```

Train a fully supervised model only on the labeled data


```python
supervised_clf = RandomForestClassifier(random_state=42)
supervised_clf.fit(X_labeled, y_labeled)
```

Evaluate both models on the same test set


```python
y_pred_self_training = self_training_clf.predict(X_test)
y_pred_supervised = supervised_clf.predict(X_test)
```


```python
print("\nSelf-Training Classifier Performance:")
print(classification_report(y_test, y_pred_self_training))

print("\nFully Supervised Classifier Performance:")
print(classification_report(y_test, y_pred_supervised))
```


```python
# Convert classification reports into DataFrames
report_self_training = classification_report(y_test, y_pred_self_training, output_dict=True)
report_supervised = classification_report(y_test, y_pred_supervised, output_dict=True)

# Convert to Pandas DataFrame for better visualization
df_self_training = pd.DataFrame(report_self_training).transpose()
df_supervised = pd.DataFrame(report_supervised).transpose()
```


```python
df_self_training
```


```python
df_supervised
```

The fully supervised model has slightly better performance across all metrics. It is better at identifying non-diabetic patients (Class 0), making fewer false negatives, and also makes slightly fewer false positives for diabetic patients (Class 1). However, self-training achieves nearly the same performance as full supervision, despite using only 200 labeled samples. This highlights its ability to perform competitively with minimal labeled data, making it a promising approach when labeled data is limited.
