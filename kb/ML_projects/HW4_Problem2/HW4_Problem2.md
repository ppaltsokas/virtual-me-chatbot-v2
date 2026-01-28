# Problem 2

#### In this task, you will explore strategies to help neural network architectures mitigate issues such as overfitting. To do this, you will leverage the dataset splits created in Problem 1. Your goal is to analyze the impact of each strategy when applied to a deep network architecture.

#### Apply the following models to the data that retain only the top half (upper portion) of each image of the Fashion MNIST database as generated up to the fourth step of Problem 1.

#### Train each model using an Adam optimizer, for 15 epochs with a batch size of 32, sparse categorical cross entropy as the loss function, and add accuracy as a metric. Ensure the output layer is appropriately configured for a multiclass problem.

#### For each of the four questions in this problem, print the model summary of each created model and generate a classification report using the scikit-learn library. Moreover, plot the training and the validation loss along with the training and the validation accuracy. In the same figure pinpoint the best epoch. Finally, comment on the obtained results. Did you notice any significant differences in performance?

## <b>2.1</b>
### Create and train a base model using Tensorflow/Keras library with three hidden layers of 128, 64, and 32 nodes, respectively, and add ReLU as their activation function


```python
from tensorflow import keras
```

Define the base neural network model. The model is designed to work with cropped images (top half) of shape 14x28. It flattens the 2D input into a 1D vector and passes it through three hidden dense layers with 128, 64, and 32 neurons respectively, all using ReLU activation. The output layer uses softmax activation to produce probabilities for the 10 classes.


```python
base_model = keras.Sequential([
    keras.layers.Input(shape=(14, 28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])
```

Compile the base neural network model using the Adam optimizer, sparse categorical crossentropy as the loss function, and accuracy as the evaluation metric. This configuration is appropriate for multiclass classification tasks where the labels are provided as integers.


```python
base_model.compile(
    optimizer=keras.optimizers.Adam(), 
    loss="sparse_categorical_crossentropy", 
    metrics=["accuracy"]
)
```


```python
base_model.summary()
```

Train the base neural network model using the top half images (X_train_top) and the corresponding training labels (y_train). The model is trained for 15 epochs with a batch size of 32. Validation is performed on the validation set (X_valid_top, y_valid) after each epoch, and the training history is stored in the variable `history_base`.


```python
history_base=base_model.fit(X_train_top, y_train, epochs=15, batch_size=32, validation_data=(X_valid_top, y_valid))
```

Evaluate the model on the test set


```python
y_pred_base = base_model.predict(X_test_top).argmax(axis=1)
print("Classification Report for Base Model:")
print(classification_report(y_test, y_pred_base, target_names=labels))
```


```python
plt.figure(figsize=(10, 5))
# Loop over each key in the training history dictionary and assign a style for plotting. The zip pairs each key with a corresponding line style.
for key, style in zip(history_base.history, ["r--", "r--.", "b-", "b-*"]):  
    # The validation error is computed at the end of each epoch, while the training error is computed using a running mean during each epoch, 
    # so the training curve should be shifted by half an epoch to the left.
    # Adjust epochs: if key is for validation (starts with 'val_'), no shift. For training keys, shift by -0.5 for better visibility
    epochs = np.array(history_base.epoch) + (0 if key.startswith("val_") else -0.5)
    # Plot the history values for this key with the specified style and label it with the key
    plt.plot(epochs, history_base.history[key], style, label=key)

# Determine the epoch index where the validation loss is minimum
best_epoch = np.argmin(history_base.history['val_loss'])
# Draw a vertical line at the best epoch (add 1 to counter for Python's zero-indexing) with an orange dashed line
plt.axvline(best_epoch, color='orange', linestyle='--', label=f'Best Epoch: {best_epoch + 1}')

# Set the x-ticks to represent each epoch (starting at 1) using the number of epochs in the training history
plt.xticks(ticks=np.arange(len(history_base.epoch)), labels=np.arange(1, len(history_base.epoch) + 1))
plt.xlabel("Epoch")
plt.ylabel("Loss / Accuracy")
plt.legend(loc="right")
plt.grid()
plt.title("Training & Validation History with Shifted Training Curve")
plt.show()
```

<b>Best Epoch: 9</b> \
The training accuracy is steadily increasing reaching around 88%. The model learns the training data well.\
The validation accuracy remains around 85% suggesting mild overfitting since the gap between training and validation performance is notable\
The training loss decreases steadily, indicating that the model is effectively minimizing the error on training data\
The validation loss remains steadily high, showing no major improvement. The fact that it doesn't continue decreasing in sync with training loss, means that the model learns training-specific patterns that do not help reduce calidaiton loss, which supports the observation of overfitting. \
#### <b>Summary</b>
The base model sets a good baseline, achieving decent performance but also demonstrating a classic overfitting pattern.




## <b>2.2</b>
### Rebuild and train the base model after adding an early stopping mechanism, with a patience argument of 3, and track the validation loss.

Set up an early stopping mechanism for training the model. The EarlyStopping callback monitors the validation loss and stops training if it does not improve for 3 consecutive epochs (`patience=3`). Additionally, it restores the model weights from the epoch with the best validation loss by setting `restore_best_weights=True`.


```python
early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
```

Define a Sequential model using early stopping.


```python
model_early_stopping = keras.Sequential([
    keras.layers.Input(shape=(14,28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])    
```

Compile the model


```python
model_early_stopping.compile(
    optimizer=keras.optimizers.Adam(),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)
```


```python
model_early_stopping.summary()
```

Train the model with early stoping on top-half images


```python
history_early_stopping=model_early_stopping.fit(X_train_top, y_train, epochs=15, batch_size=32,
                                                validation_data=(X_valid_top, y_valid), callbacks=[early_stopping])
```

Evaluate the model on the test set


```python
y_pred_early_stopping = model_early_stopping.predict(X_test_top).argmax(axis=1)
print("Classification Report for Early Stopping Model")
print(classification_report(y_test, y_pred_early_stopping,target_names=labels))
```

Plot training history


```python
plt.figure(figsize=(10,5))
for key, style in zip(history_early_stopping.history, ["r--", "r--.", "b-", "b-*"]):
    epochs = np.array(history_early_stopping.epoch) + (0 if key.startswith("val_") else -0.5)
    plt.plot(epochs, history_early_stopping.history[key], style, label=key)

best_epoch_early = np.argmin(history_early_stopping.history['val_loss'])
plt.axvline(best_epoch_early, color='orange', linestyle='--', label=f'Best Epoch: {best_epoch_early + 1}')

plt.xticks(ticks=np.arange(len(history_base.epoch)), labels=np.arange(1, len(history_base.epoch) + 1))
plt.xlabel("Epoch")
plt.ylabel("Loss / Accuracy")
plt.legend(loc="lower right")
plt.grid()
plt.title("Training & Validation History with Early Stopping and Shifted Training Curve")
plt.show()
```

<b>Best Epoch: 5</b> \
The early stopping was triggered at epoch 5, preventing unecessary training, even though it may stop before the highest training accuracy is reached. \
The training accuracy steadily increases, approaching 85%. This means it does not achieve the same higher training accuracy as the base model, but avoids overfitting. \
The validation accuracy maintained around 83%, which is still good, even though it is lower than the base model. The smaller gap between training and validation accuracy suggests a better generalization. \
The training loss decreases quickly. Once it starts flattening out, the early stopping kicks in. The quick drop suggests that the model learns the main patterns quickly. \
The validation loss drops fast unil around 43%, then followed by three epochs with no improvement, setting off the early stopping. 

#### <b>Summary</b>
Early stopping is beneficial for preventing unnecessary training and overfitting. While the final validation accuracy is close to the base model, this approach saves training time and typically produces a model that generalizes well without over-tailoring to the training set.

## <b>2.3</b>
### Rebuild and train the base model after incorporating a batch normalization layer after each dense layer (do not use early stopping, and ensure the use bias argument of dense layers is set to False).  

Define a Sequential model that incorporates batch normalization after each dense layer.


```python
model_batch_normalization = keras.Sequential([
    keras.layers.Input(shape=(14, 28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu", use_bias=False),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(64, activation="relu", use_bias=False),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(32, activation="relu", use_bias=False),
    keras.layers.BatchNormalization(),
    keras.layers.Dense(10, activation="softmax")
])
```

Compile the model


```python
model_batch_normalization.compile(
    optimizer=keras.optimizers.Adam(),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)
```


```python
model_batch_normalization.summary()
```

Train the model with batch normalization on top-half images


```python
history_batch_normalization = model_batch_normalization.fit(
    X_train_top, y_train, epochs=15, batch_size=32,
    validation_data=(X_valid_top, y_valid)
)
```

Evaluate the model on the test set


```python
y_pred_batch_normalization = model_batch_normalization.predict(X_test_top).argmax(axis=1)
print("Classification Report for Batch Normalization Model")
print(classification_report(y_test, y_pred_batch_normalization, target_names=labels))
```

Plot training history


```python
plt.figure(figsize=(10,5))
for key, style in zip(history_batch_normalization.history, ["r--", "r--.", "b-", "b-*"]):
    epochs = np.array(history_batch_normalization.epoch) + (0 if key.startswith("val_") else -0.5)
    plt.plot(epochs, history_batch_normalization.history[key], style, label=key)

best_epoch_batch_normalization = np.argmin(history_batch_normalization.history['val_loss'])
plt.axvline(best_epoch_batch_normalization, color='orange', linestyle='--', label=f'Best Epoch: {best_epoch_batch_normalization + 1}')

plt.xticks(ticks=np.arange(len(history_base.epoch)), labels=np.arange(1, len(history_base.epoch) + 1))
plt.xlabel("Epoch")
plt.ylabel("Loss / Accuracy")
plt.legend(loc="right")
plt.grid()
plt.title("Training and Validation History with Batch Normalization")
plt.show()
```

<b>Best Epoch: 11</b> \
The training accuracy steadily increases, approaching 88%. This is similar to the base model. \
The validation accuracy maintained around 85% which is similar with the best validation accuracy seen in the base model. It often remains more stable and smooth due to batch normalization.\
The training loss decreases smoothly, and consistently, reflecting the stabilizing effect of batch normalization. When activations are normalized, gradients flow more predictably, and the network often avoids erratic jumps in loss. \
The validation loss Gradually declines to about 45%, mirroring the consistent improvement in validation accuracy. This indicates a more stable learning curve compared to the base model, which sometimes shows a plateau or fluctuations earlier.
#### <b>Summary</b>
Batch normalization often leads to a smoother and sometimes quicker convergence because it normalizes activations layer by layer. Here, it yields performance roughly comparable to the base model in terms of final accuracy, but it’s typically more robust, and less sensitive to initial conditions.

## <b>2.4</b>
### Rebuild and train the base model after adding a dropout layer with a rate of 0.50 after each dense layer (do not use early stopping or batch normalization)

Define a Sequential model that incorporates dropout layers to help reduce overfitting.


```python
model_dropout = keras.Sequential([
    keras.layers.Input(shape=(14, 28)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(10, activation="softmax")
])
```

Compile the model


```python
model_dropout.compile(
    optimizer=keras.optimizers.Adam(),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)
```

Train the model on top-half images


```python
history_dropout = model_dropout.fit(
    X_train_top, y_train, epochs=15, batch_size=32,
    validation_data=(X_valid_top, y_valid)
)
```

Evaluate the model on the test set


```python
y_pred_dropout = model_dropout.predict(X_test_top).argmax(axis=1)
print("Classification Report for Dropout Regularization Model")
print(classification_report(y_test, y_pred_dropout, target_names=labels))
```

Plot training history


```python
plt.figure(figsize=(10,5))
for key, style in zip(history_dropout.history, ["r--", "r--.", "b-", "b-*"]):
    epochs = np.array(history_dropout.epoch) + (0 if key.startswith("val_") else -0.5)
    plt.plot(epochs, history_dropout.history[key], style, label=key)

best_epoch_dropout = np.argmin(history_dropout.history['val_loss'])
plt.axvline(best_epoch_dropout, color='orange', linestyle='--', label=f'Best Epoch: {best_epoch_dropout + 1}')

plt.xticks(ticks=np.arange(len(history_base.epoch)), labels=np.arange(1, len(history_base.epoch) + 1))
plt.xlabel("Epoch")
plt.ylabel("Loss / Accuracy")
plt.legend(loc="upper center")
plt.grid()
plt.title("Training and Validation History with Dropout Regularization")
plt.show()
```

<b>Best Epoch: 14</b> \
The training accuracy stays behind the other models, ending up around 78%. This lower value is due to the aggressive 50% dropout rate, which prevents the model from fully learning the data by randomly deactivating half of the neurons with each forward pass. \
The validation accuracy shows a gradual improvement, eventually reaching around 80%. This suggests that although the model is constrained by dropout during training, it manages to generalize reasonably well to unseen data.\
The training loss drops quickly in the early epochs and continues to decline, stabilizing at approximately 65$ by the final epoch. This indicates that despite the regularization, the model is effectively minimizing the error on the training data. \
The validation loss decreases in a smooth, steady manner over the epochs, which is indicative of a consistent learning process and stable generalization performance throughout training.
#### <b>Summary</b>
The dropout model, with a 50% dropout rate after each dense layer, significantly restricts the network’s capacity, as evidenced by the training accuracy staying below 78%. Nevertheless, the model is able to achieve a validation accuracy of about 80%, demonstrating that the dropout is effective at tackling overfitting. The rapid initial drop in training loss, which then levels off at around 0.65, along with the smoothly declining validation loss, highlights the trade-off: while dropout helps maintain a stable learning curve and good generalization, it also limits the ultimate learning capacity of the model.
