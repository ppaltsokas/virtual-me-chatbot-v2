# Problem 1

### In this assignment, you will work with a filtered version of the Fashion MNIST dataset to explore the ability of autoencoders to compress and reconstruct image data. You will build and evaluate two autoencoder variants and compare their performance based on various experimental setups. Make sure to print any output you consider important to support your observations.

## <b>1.1</b>
### Load the Fashion MNIST dataset from the tensorflow.keras.datasets module. Keep only the instances that belong to the following three classes: ‘Sandal’, ‘Sneaker’, and ‘Ankle boot’. Split the filtered dataset into a training set (5/7), a validation set (1/7), and a test set (1/7). Make sure the split uses stratified sampling to preserve class balance. Scale all subsets so pixel values are in the range [0, 1]. Print the class distribution of each subset with clear, labeled messages.

Load Fashion MNIST


```python
from tensorflow.keras.datasets import fashion_mnist

(X_train_full, y_train_full), (X_test_full, y_test_full) = fashion_mnist.load_data()
```

Concatenate to extend the dataset and create custom splits.


```python
import numpy as np
X_full = np.concatenate([X_train_full, X_test_full], axis=0)
y_full = np.concatenate([y_train_full, y_test_full], axis=0)
```

Keep only classes: Sandal (5), Sneaker (7), Ankle boot (9) (The mapping of class indices to labels is standardized and documented)


```python
selected_classes = [5, 7, 9]
mask = np.isin(y_full, selected_classes)
X_full = X_full[mask]
y_full = y_full[mask]
```

Define the split sizes. Consider the full dataset split in 7 parts.


```python
train_size = 5/7
valid_size = 1/7
test_size = 1/7
```

Export the test set by splitting on the full sets. We keep $\frac{1}{7}\cdot{dataset}$.


```python
from sklearn.model_selection import train_test_split

X_temp, X_test, y_temp, y_test = train_test_split(X_full, y_full, test_size=test_size, random_state=42, stratify=y_full)
```

Having kept $\frac{1}{7}\cdot{dataset}$, we now want to export from the remaining $\frac{6}{7}\cdot{dataset}$, another $\frac{1}{7}\cdot{dataset}$. Therefore we will use a ratio of $\frac{\frac{1}{7}}{\frac{5}{7}+\frac{1}{7}}=\frac{\frac{1}{7}}{\frac{6}{7}}=\frac{1}{6}\cdot{temp\_dataset}$.



```python
valid_ratio_adjusted = valid_size / (train_size + valid_size)
X_train, X_valid, y_train, y_valid = train_test_split(X_temp, y_temp, test_size=valid_ratio_adjusted, random_state=42, stratify=y_temp)
```

Normalize pixel values 0-255 to 0-1. Setting the datatype explicitly is important for TensorFlow/Keras models since they expect float inputs to perform computations efficiently.


```python
X_train = X_train.astype("float32") / 255.
X_valid = X_valid.astype("float32") / 255.
X_test = X_test.astype("float32") / 255.
```

Print dataset shapes


```python
print(f'Train set shape: {X_train.shape}, Labels shape: {y_train.shape}')
print(f'Validation set shape: {X_valid.shape}, Labels shape: {y_valid.shape}')
print(f'Test set shape: {X_test.shape}, Labels shape: {y_test.shape}')
```

Verify that the stratified splitting preserved class balance


```python
import pandas as pd

def print_class_distribution(y, name):
    class_counts = pd.Series(y).value_counts().sort_index()
    class_names = {5: 'Sandal', 7: 'Sneaker', 9: 'Ankle boot'}
    print(f'\nClass distribution in {name} set:')
    for label, count in class_counts.items():
        print(f'{class_names[label]:<12}: {count}')

print_class_distribution(y_train, "Train")
print_class_distribution(y_valid, "Validation")
print_class_distribution(y_test, "Test")
```

## <b>1.2</b>
### Build a stacked autoencoder with the following architecture: an encoder and a decoder part of two fully-connected (Dense) layers each. Use ReLU activation for all hidden layers, and sigmoid activation for the output layer. Flatten the input before feeding it to the encoder, and reshape the output to match the original image shape (28×28). Set the latent space (codings) size to 50, and all other hidden layers to 256 units. Compile the model using: Nadam optimizer with learning rate $10^{−4}$, adding binary cross-entropy as the loss function. Print the model summary of this autoencoder.

Define the constants


```python
img_height, img_width = 28, 28
flattened_dim = img_height * img_width
hidden_units = 256
latent_dim = 50
```

Build the stacked autoencoder


```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Flatten, Dense, Reshape

autoencoder = Sequential([
    Input(shape=(28, 28)),
    
    # Encoder
    Flatten(),
    Dense(hidden_units, activation='relu'),
    Dense(latent_dim, activation='relu'),
    
    # Decoder
    Dense(hidden_units, activation='relu'),
    Dense(flattened_dim, activation='sigmoid'),
    Reshape((28, 28))

])
```

Compile


```python
from tensorflow.keras.optimizers import Nadam

autoencoder.compile(optimizer=Nadam(learning_rate=10**(-4)), loss='binary_crossentropy')

autoencoder.summary()
```

## <b>1.3</b>
### Now, build a second autoencoder that is identical in architecture to the one in Question 2, add l1 regularization to the latent space (the bottleneck layer), and use an activity regularizer with weight $10^{−6}$. Print the model summary for this sparse autoencoder.

Define constants


```python
img_height, img_width = 28, 28
flattened_dim = img_height * img_width
hidden_units = 256
latent_dim = 50
activity_reg_weight = 10**(-6)
```

Build the sparse autoencoder


```python
from tensorflow.keras.regularizers import l1

sparse_autoencoder = Sequential([
    Input(shape=(28, 28)),

    # Encoder
    Flatten(),
    Dense(hidden_units, activation='relu'),
    Dense(latent_dim, activation='relu', activity_regularizer=l1(activity_reg_weight)),
    
    # Decoder
    Dense(hidden_units, activation='relu'),
    Dense(flattened_dim, activation='sigmoid'),
    Reshape((28, 28))
])
```

Compile


```python
sparse_autoencoder.compile(optimizer=Nadam(learning_rate=10**(-4)), loss='binary_crossentropy')

sparse_autoencoder.summary()
```

## <b>1.4</b>
### Train both autoencoders (from Q2 and Q3) for up to 50 epochs. Use early stopping with patience=5, and min_delta equal to $10^{−2}$, monitoring the validation loss. Train each model with two different batch sizes: 32 and 256. This gives you four experiments in total (2 models × 2 batch sizes). After running your experiments, plot the training and validation loss curves for all of them. Add your comments on the differences observed between the models and batch sizes.

Set up early stopping


```python
from tensorflow.keras.callbacks import EarlyStopping

early_stopping_cb = EarlyStopping(monitor='val_loss', patience=5, min_delta=1e-2, restore_best_weights=True, verbose=1)
```

Flatten inputs for dense autoencoders


```python
X_train_flat = X_train.reshape(-1, 28, 28)
X_valid_flat = X_valid.reshape(-1, 28, 28)
```

Dictionaries to store models and histories


```python
from tensorflow.keras.models import clone_model

models = {
    "regular_bs32": clone_model(autoencoder),
    "regular_bs256": clone_model(autoencoder),
    "sparse_bs32": clone_model(sparse_autoencoder),
    "sparse_bs256": clone_model(sparse_autoencoder),
}

histories = {}
```

Compile and train each model


```python
for key, model in models.items():
    model.compile(optimizer=Nadam(learning_rate=1e-4), loss='binary_crossentropy')
    batch_size = 32 if "32" in key else 256
    print(f"\nTraining {key} with batch size {batch_size}...\n")

    history = model.fit(
        X_train_flat, X_train_flat,
        epochs=50,
        batch_size=batch_size,
        validation_data=(X_valid_flat, X_valid_flat),
        callbacks=[early_stopping_cb],
        verbose=2
    )

    histories[key] = history
```

Plot the training and validation losses for all the autoencoders


```python
import matplotlib.pyplot as plt

for key, history in histories.items():
    epochs = np.arange(len(history.epoch))
    best_epoch = np.argmin(history.history['val_loss'])

    plt.figure(figsize=(6, 4))

    # Plot training and validation loss only
    plt.plot(epochs - 0.5, history.history['loss'], label='Training Loss')
    plt.plot(epochs, history.history['val_loss'], label='Validation Loss')
    plt.axvline(best_epoch, color='green', linestyle='--', label=f'Best Epoch: {best_epoch + 1}')
    plt.title(f'{key} - Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.xticks(ticks=epochs, labels=epochs + 1)
    plt.ylabel('Binary Crossentropy')
    plt.grid()
    plt.legend(loc='upper right', fontsize=8)

    plt.tight_layout()
    plt.show()
```

## <b>1.5</b>
### Write a function that compares original images with their reconstructions from an autoencoder. The function should: 
### • Accept a model, a set of images, and the number of images to display as input. 
### • Display a grid where the top row shows the original images, and the bottom row shows the reconstructed images.
### • Ensure the pixel values are clipped to the range [0, 1] for proper visualization.
### Then use this function to display the first 15 test images and their reconstructions from the regular autoencoder trained with a batch size of 256, and the sparse autoencoder trained with a batch size 256.


```python
def show_reconstructions(model, images, n_images=15):
    """
    Plots original and reconstructed images in a 2-row grid.

    Top row: original images
    Bottom row: reconstructed images
    """
    reconstructions = model.predict(images[:n_images], verbose=0)
    reconstructions = np.clip(reconstructions, 0, 1)  # Ensure proper range

    plt.figure(figsize=(n_images, 3))
    for i in range(n_images):
        # Original
        plt.subplot(2, n_images, i + 1)
        plt.imshow(images[i], cmap='gray')
        plt.axis('off')

        # Reconstructed
        plt.subplot(2, n_images, i + 1 + n_images)
        plt.imshow(reconstructions[i], cmap='gray')
        plt.axis('off')

    plt.suptitle("Top: Original Images — Bottom: Reconstructions", fontsize=12)
    plt.tight_layout()
    plt.show()

```

Flatten test images for model input


```python
X_test_flat = X_test.reshape(-1, 28, 28)
```

Display reconstructions for regular autoencoder (batch size 256)


```python
print("Regular Autoencoder (batch size 256):")
show_reconstructions(models["regular_bs256"], X_test_flat, n_images=15)
```

Display reconstructions for sparse autoencoder (batch size 256)


```python
print("Sparse Autoencoder (batch size 256):")
show_reconstructions(models["sparse_bs256"], X_test_flat, n_images=15)
```
