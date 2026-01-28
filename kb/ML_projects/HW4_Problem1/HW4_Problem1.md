# Problem 1

#### In this task, you will experiment with a standard neural network architecture by utilizing different feature subsets from the Fashion MNIST dataset. You are required to use only Keras components through Tensorflow for building the neural network models, while any necessary analysis should utilize standard libraries (like pandas, numpy, or sklearn).

## <b>1.1</b>
### Load the Fashion MNIST dataset using Keras’ dataset module, adhering to the default training and test split specified in the official documentation, https://keras.io/api/datasets/fashion_mnist/. Then, use the last 10,000 instances of the training subset as the validation subset.


```python
import numpy as np
import tensorflow as tf
```

Load the fashion mnist dataset


```python
from tensorflow import keras
fashion_mnist = keras.datasets.fashion_mnist
(X_train_full, y_train_full), (X_test, y_test) = fashion_mnist.load_data()
```

As stated in chapter 10 notebooks : The dataset is already split for you between a training set (60,000 images) and a test set (10,000 images), but it can be useful to split the training set further to have a validation set. We'll use 50,000 images for training, and 10,000 for validation.


```python
X_train, y_train = X_train_full[:-10000], y_train_full[:-10000]
X_valid, y_valid = X_train_full[-10000:], y_train_full[-10000:]
```

Now, X_train_full and X_test contain 28×28 grayscale images, where each pixel has an intensity between 0 and 255, while y_train_full and y_test contain the class labels. So we have: \
X_train -> First 50,000 training images. \
X_valid -> Last 10,000 validation images. \
X_test -> 10,000 test images.

Print the shapes of the sets


```python
print("Shapes (X) (y)")
print("-------")
print("Training :",X_train.shape, y_train.shape)
print("Validation :", X_valid.shape, y_valid.shape)
print("Test :", X_test.shape, y_test.shape)
```

## <b>1.2</b>
### Record the class distribution of the 3 distinct subsets (training/validation/test) in a Pandas Dataframe, sorting them by the column name, which should coincide with the actual name of the existing labels.

The Fashion MNIST dataset originally labels classes as integers from 0 to 9, which correspond to the items in the labels list:


```python
labels = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"]
```


```python
def class_distribution(y):
    ''' 
    Computes the class distribution for a given dataset.
    Parameter : Array (y) of class labels.
    Return : Converts the array of labels(y) into a Pandas Series, counts how many times each unique class label appears in y, 
    and sorts the counts results by the class label index so that classes appear in ascending order.
    '''
    return pd.Series(y).value_counts().sort_index().values
```


```python
import pandas as pd
class_distribution_df = pd.DataFrame([class_distribution(y_train), class_distribution(y_valid), class_distribution(y_test)],
                                     columns=labels, index=["Training", "Validation", "Test"])

class_distribution_df=class_distribution_df.sort_index(axis=1) # Sort the DataFrame columns by label names for a consistent order
class_distribution_df
```


```python
import matplotlib.pyplot as plt

class_distribution_df.T.plot(kind='bar', figsize=(12, 6))
plt.title("Class Distribution Across Training, Validation, and Test Sets")
plt.xlabel("Class Labels")
plt.ylabel("Count")
plt.legend(title="Dataset Split")
plt.xticks(rotation=45)
plt.show()
```

## <b>1.3</b>
### Print the range (minimum and maximum) of pixels in each part of the dataset. Scale the data by normalizing the pixel values.

As mentioned earlier, pixel values in Fashion MNIST are grayscale intensity values ranging from 0 (black) to 255 (white).


```python
print("\nOriginal Pixels Range:")
print("Training: Min =", X_train.min(), "Max =", X_train.max())
print("Validation: Min =", X_valid.min(), "Max =", X_valid.max())
print("Test: Min =", X_test.min(), "Max =", X_test.max())
```

Scale the pixel intensities down to the 0-1 range and convert them to floats, by dividing by 255


```python
X_train, X_valid, X_test = X_train / 255., X_valid / 255., X_test / 255.
```


```python
print("\nPixels Range After Scaling:")
print("Training: Min =", X_train.min(), "Max =", X_train.max())
print("Validation: Min =", X_valid.min(), "Max =", X_valid.max())
print("Test: Min =", X_test.min(), "Max =", X_test.max())
```

Visualize the first image before and after normalization, side by side, for visual comparison. We verify that normalization does not distort the image.


```python
import matplotlib.pyplot as plt


fig, ax = plt.subplots(1, 2, figsize=(8, 4)) # Create a figure with 1 row and 2 columns of subplots, setting the figure size to 8x4

# Plot the first image from the full training set before normalization
ax[0].imshow(X_train_full[0], cmap="gray")
ax[0].set_title("Before Normalization")
ax[0].axis("off")
    
# Plot the first image from the normalized training set after normalization
ax[1].imshow(X_train[0], cmap="gray")
ax[1].set_title("After Normalization")
ax[1].axis("off")
    
plt.show()


```

## <b>1.4</b>
### Create two data variants:
- ### The first will retain only the top half (upper portion) of each image.
- ### The second will retain the bottom half (lower portion) of each image.
### Crop each image along the height axis to create these two distinct representations.

Each image is stored in a NumPy array with shape <b>(number of samples, height of each image (28), width of each image (28))</b>. Therefore, to extract the top half of each image we use <b>[:, :14, :]</b> which selects <b>[ all samples, top 14 rows, all columns]</b>. Similarly <b>[:, 14:, :]</b> for the bottom half.


```python
X_train_top = X_train[:, :14, :]
X_train_bottom = X_train[:, 14:, :]

X_valid_top = X_valid[:, :14, :]
X_valid_bottom = X_valid[:, 14:, :]

X_test_top = X_test[:, :14, :]
X_test_bottom = X_test[:, 14:, :]
```

Print their shapes for verification


```python
print("\nShapes of Cropped Datasets:")
print("Training Top Half:", X_train_top.shape)
print("Training Bottom Half:", X_train_bottom.shape)
print("Validation Top Half:", X_valid_top.shape)
print("Validation Bottom Half:", X_valid_bottom.shape)
print("Test Top Half:", X_test_top.shape)
print("Test Bottom Half:", X_test_bottom.shape)
```


```python
fig, ax = plt.subplots(2, 2, figsize=(8, 8)) # Create a figure with 2 rows and 2 columns of subplots, setting the figure size to 8x8

# Plot the first image of the top half of the training set
ax[0, 0].imshow(X_train_top[0], cmap="gray")
ax[0, 0].set_title("Top Half")
ax[0, 0].axis("off")

# Plot the first image of the bottom half of the training set
ax[0, 1].imshow(X_train_bottom[0], cmap="gray")
ax[0, 1].set_title("Bottom Half")
ax[0, 1].axis("off")

# Plot the first image of the top half of the test set
ax[1, 0].imshow(X_test_top[0], cmap="gray")
ax[1, 0].set_title("Test Top Half")
ax[1, 0].axis("off")

# Plot the first image of the bottom half of the test set
ax[1, 1].imshow(X_test_bottom[0], cmap="gray")
ax[1, 1].set_title("Test Bottom Half")
ax[1, 1].axis("off")

plt.show()

```

## <b>1.5</b>
### Visualize the first 20 instances from the training set for both variants. Use subplots with 4 rows and 5 columns to display them, verifying the correctness of your slicing process against a plot of the original images. [


```python
fig, axes = plt.subplots(4, 5, figsize=(10, 8)) # Create a figure with 4 rows and 5 columns of subplots, and set the figure size to 10x8
fig.suptitle("Original Images")

for i, ax in enumerate(axes.flat): # Loop over each subplot, flattening the 2D array of axes, and display the corresponding image from X_train
    ax.imshow(X_train[i], cmap="gray")
    ax.axis("off")
plt.show()
```


```python
fig, axes = plt.subplots(4, 5, figsize=(10, 8))
fig.suptitle("Top Half Images")
for i, ax in enumerate(axes.flat):
    ax.imshow(X_train_top[i], cmap="gray")
    ax.axis("off")
plt.show()
```


```python
fig, axes = plt.subplots(4, 5, figsize=(10, 8))
fig.suptitle("Bottom Half Images")
for i, ax in enumerate(axes.flat):
    ax.imshow(X_train_bottom[i], cmap="gray")
    ax.axis("off")
plt.show()
```

## <b>1.6</b>
### Build a neural network using Tensorflow/Keras for a multiclass classification task. The network should have two hidden dense layers with 128 and 64 nodes, and use ReLU as the activation function of each layer. The output layer should be compatible with multiclass classification. Compile the model using the SGD optimizer with a learning rate of $10^{-4}$ , sparse categorical cross-entropy as the loss function, and add classification accuracy to the metrics. Print a summary of the model.

Define a Sequential neural network model using Keras for multiclass classification. The model expects 28x28 grayscale images as input. It first flattens each image into a 1D vector, then passes it through two dense layers with 128 and 64 nodes respectively, both using ReLU activation. Finally, the output layer uses softmax activation to produce class probabilities for the 10 distinct classes.


```python
model_full = keras.Sequential([
    keras.layers.Input(shape=(28, 28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu"), 
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])
```

Compile the neural network model designed for cropped images. It uses the SGD optimizer with a learning rate of $10^{-4}$, applies sparse categorical crossentropy as the loss function (which is suitable when labels are provided as integers), and includes accuracy as a metric to evaluate the model's performance during training.


```python
model_full.compile(
    optimizer=keras.optimizers.SGD(learning_rate=1e-4),  # SGD optimizer with learning rate 10^(-4)
    loss="sparse_categorical_crossentropy",  # Loss function for multiclass classification
    metrics=["accuracy"]  # Classification accuracy
)
```


```python
model_full.summary()
```

The Param # column, indicates the number of trainable parameters in that layer:\
Flatten: 0 parameters because it only rearranges the data.\
Dense : Has 128 nodes, and each node is connected to all 784 inputs, plus one bias term per node. That results in $784 \cdot 128 + 128 = 100,480$ parameters.\
Dense_1 : Connects 128 nodes to 64 nodes. The parameters here are $128 \cdot 64 + 64 = 8,256$.\
Dense_2 : Maps 64 nodes to 10 classes, giving $64 \cdot 10 + 10 = 650$ parameters.


```python
# pip install pydot
```


```python
keras.utils.plot_model(model_full, "my_fashion_mnist_model_FULL.png", show_shapes=True, dpi=100)
```

Define a Sequential model designed to work with cropped images of shape 14x28, which is half the height of the original 28x28 images. The model flattens the 2D input into a 1D vector, then passes it through two dense layers with 128 and 64 neurons respectively, both using ReLU activation. The final output layer uses softmax activation to produce probabilities for each of the 10 classes.


```python
model_cropped = keras.Sequential([
    keras.layers.Input(shape=(14, 28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])
```


```python
model_cropped.compile(
    optimizer=keras.optimizers.SGD(learning_rate=1e-4),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)
```


```python
model_cropped.summary()
```


```python
keras.utils.plot_model(model_cropped, "my_fashion_mnist_model_CROPPED.png", show_shapes=True, dpi=100)
```

## <b>1.7</b>
### Train one model for each data variant, ensuring consistent weight initialization across both experiments. Hint: Store the initial random weights of the model in a variable. Train the model on the first data variant, and then reset the weights of the model to the stored weights. Train each model for 10 epochs with batches of 32 samples. Apply each trained model to the corresponding test set and export the classification report for each model using the scikit-learn library. Comment on the most important differences in the models’ performance per class.

Store initial random weights


```python
initial_weights = model_cropped.get_weights()
```

Train on the first variant - Top Half


```python
history_top = model_cropped.fit(X_train_top, y_train, epochs=10, batch_size=32, validation_data=(X_valid_top, y_valid))
```

Evaluate on test set


```python
from sklearn.metrics import classification_report

y_pred_top = model_cropped.predict(X_test_top).argmax(axis=1)
print("Classification Report for Top Half Model:")
print(classification_report(y_test, y_pred_top, target_names=labels))
```

Reset to the initial weights


```python
model_cropped.set_weights(initial_weights)
```

Train on the second variant - Bottom Half


```python
history_bottom = model_cropped.fit(X_train_bottom, y_train, epochs=10, batch_size=32, validation_data=(X_valid_bottom, y_valid))
```

Evaluate on test set


```python
y_pred_bottom = model_cropped.predict(X_test_bottom).argmax(axis=1)
print("Classification Report for Bottom Half Model:")
print(classification_report(y_test, y_pred_bottom, target_names=labels))
```


```python
# Extra code. Not requested.
import pandas as pd

data = {
    "Class": ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", 
              "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"],
    "Precision Top": [0.58, 0.60, 0.44, 0.52, 0.44, 0.92, 0.50, 0.75, 0.64, 0.58],
    "Recall Top":    [0.65, 0.91, 0.55, 0.31, 0.68, 0.01, 0.05, 0.69, 0.76, 0.99],
    "F1 Top":        [0.61, 0.72, 0.49, 0.39, 0.53, 0.02, 0.09, 0.72, 0.69, 0.73],
    "Precision Bottom": [0.53, 0.94, 0.47, 0.60, 0.29, 0.94, 0.15, 0.57, 0.46, 0.64],
    "Recall Bottom":    [0.69, 0.82, 0.52, 0.78, 0.31, 0.01, 0.02, 0.88, 0.57, 0.89],
    "F1 Bottom":        [0.60, 0.88, 0.49, 0.68, 0.30, 0.03, 0.03, 0.69, 0.51, 0.75],
}

df_results = pd.DataFrame(data).set_index("Class")

df_results = df_results[["Precision Top", "Precision Bottom", 
                         "Recall Top", "Recall Bottom", 
                         "F1 Top", "F1 Bottom"]]

def highlight_improved(row):
    styles = []
    for metric in ["Precision", "Recall", "F1"]:
        top_val = row[f"{metric} Top"]
        bottom_val = row[f"{metric} Bottom"]
        if top_val > bottom_val:
            styles.extend(["background-color: lightgreen", ""])  # highlight Top cell
        elif bottom_val > top_val:
            styles.extend(["", "background-color: lightgreen"])  # highlight Bottom cell
        else:
            styles.extend(["", ""])
    return styles

styled_df = df_results.style.apply(highlight_improved, axis=1).format("{:.2f}")

styled_df

```

Analyzing the two classification reports, we can draw some conclusions regarding which half of the image contributes more discriminative information for certain calsses. \
<i>We will mark TH for Top-Half and BH for Bottom-Half.</i>

The most notable differences appear in :
### <b> 1) Trouser and Dress: </b>
The bottom-half (BH) model shows a major improvement on these classes. Trouser precision jumnps from 0.60 (TH) to 0.94 (BH) and the f1-score improves from 0.72 to 0.88. Similarly, the Dress f1-score jumps from 0.39 (TH) to 0.68 (BH). This indicates that <b>the lower part of the images carry critical features for identifying trousers and dresses.</b> 

### <b> 2) Coat and Bag: </b>
In contrast, the top-half (TH) model performs notably better for Coat and Bag with their f1-scores jumping from 0.30 and 0.51, to 0.53 and 0.69 respectively. This suggests that <b>the upper part of the images contain more discriminative information for coats and bags.</b>

Other notable conclusions

### <b> Ankle Boots:</b> 
BH has higher precision (0.64 vs 0.58) and a slightly better f1-score (0.75 vs 0.73). However, we note that TH model, with 0.99 recall vs 0.89, is able to capture 99% of the images belonging to that class.

### <b> Sneaker:</b> 
Whilte TH model has better precision (0.75 vs 0.57) meaning it is more accurate in its captures, it has lower Recall (0.69 vs 0.88) meaning it captures less images belonging in that class than the BH model. F1-score gives a slight edge to the TH model 0.72 vs 0.69.

### <b> Shirt:</b> 
While both models struggle, when TH model identifies an item from this class, it is significantly more frequently correct than the BH model (0.50 vs 0.15).

### <b><u>Overall: </b></u>
Classes that rely heavily on lower-body features like Trouser, Dress, Ankle Boots, see a clear advantage when trained on the BH model. \
Upper-body related classes like Coat, Bag, T-shirt, seem to benefit from the TH model. \
Some classes like Shirts and Sandals are hard to classify in both halves. \
Pullover is a tie, seeing no difference among the two halves.

## <b>1.8</b>
### Identify test instances where one model correctly predicts the correct class, but the other model makes an incorrect prediction. For each case, display the first 5 instances along with the actual labels and the incorrect predictions from the competitor model.


```python
y_pred_top[:10], y_test[:10]
```


```python
y_pred_bottom[:10], y_test[:10]
```


```python
incorrect_labels_top = (y_pred_top != y_test)
incorrect_labels_bottom = (y_pred_bottom != y_test)
correct_labels_top = ~incorrect_labels_top
correct_labels_bottom = ~incorrect_labels_bottom
incorrect_labels_top, incorrect_labels_bottom
```

Cases labeled correctly by a single model


```python
disagreement_cases = np.where(correct_labels_top & incorrect_labels_bottom)[0]  # find the indices of instances where two conditions are met simultaneously
disagreement_cases
```


```python
fig, axes = plt.subplots(1, 5, figsize=(15, 5))
for i, idx in enumerate(disagreement_cases[:5]):
    axes[i].imshow(X_test[idx], cmap="gray")
    axes[i].set_title(f"True: {labels[y_test[idx]]}\nBottom Pred: {labels[y_pred_bottom[idx]]}")
    axes[i].axis("off")
plt.show()
```
