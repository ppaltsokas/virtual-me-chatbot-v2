# Problem 2

### This problem concentrates on training a Neural Network model for time series forecasting. The dataset at hand corresponds to the Monthly Mean Sunspots spanning from 1749 to 2019. Thus it includes 3252 samples. The goal of this analysis is to build a Multilayer Neural Network that can forecast accurately the number of sunspots several months into the future (multi-step ahead forecast). You are required to do the following:

# <b>2.1</b>
### Open a Jupyter-notebook load the the sunspots.csv file. Print and observe the structure of the data. Extract the appropriate column that is of interest to the analysis.


```python
import pandas as pd

sunspots_df = pd.read_csv("sunspots.csv")
sunspots_df.head()
```


```python
sunspots_df.info()
```


```python
series = sunspots_df["Monthly Mean Total Sunspot Number"]
series
```

# <b>2.2</b>
###  Check the sanity and appropriateness of the data. Search for missing values and print descriptive statistics. Cast the data into a numpy array. Plot the data. 


```python
print("Missing values per column:")
print(sunspots_df.isnull().sum())
```


```python
sunspots_df.describe()
```

Cast the time series into a NumPy array


```python
import numpy as np
sunspots_series = sunspots_df["Monthly Mean Total Sunspot Number"].values.astype(np.float32)
print("Shape of series:", sunspots_series.shape, type(sunspots_series))
```


```python
import matplotlib.pyplot as plt

plt.figure(figsize=(15, 4))
plt.plot(series, linewidth=0.8)
plt.title("Monthly Mean Sunspots (1749–2019)")
plt.xlabel("Months since Jan 1749")
plt.ylabel("Sunspot Count")
plt.grid(True)
plt.show()
```

# <b>2.3</b>
### Scale all data in the interval [0,1]. Choose a window parameter of 40 timesteps. Split the resulting reformed data into train and test parts such that 90% of the samples in retained in the training set. The output of the Neural Network should be a vector of size equal to length of the test set (forecasting horizon). This horizon should be constructed with one input sample (sequence-to-vector).

It's important to scale the time series data. Neural networks often perform much better when all input features have similar ranges. A common choice is to use MinMax scaling to map the values to the [0, 1] range. To train a neural network for time series forecasting, we need to convert the 1D series into a supervised learning problem. Each input will be a window of 40 consecutive past values (40 months), and the corresponding output will be a vector of future values. In our case, the entire 326-month test set.


```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
scaled_series = scaler.fit_transform(sunspots_series.reshape(-1, 1)).flatten()
```

Define window and forecast parameters


```python
window_size = 40
total_samples = len(scaled_series)
train_size = int(0.9 * total_samples)
forecast_horizon = total_samples - train_size
print("Train size =",train_size, ", Forecast Horizon =",forecast_horizon)
```

Build the training dataset


```python
X_train = []
y_train = []

for i in range(train_size - window_size - forecast_horizon + 1): # 2926-40-326+1 = 2561 training samples. This ensures we don't run out of data 
                                                                 # when slicing the input window and the 326 month forecast
    window = scaled_series[i:i + window_size] 
    target = scaled_series[i + window_size:i + window_size + forecast_horizon]
    X_train.append(window)
    y_train.append(target)
```


```python
X_train = np.array(X_train)
y_train = np.array(y_train)
```

Prepare the test input (X_test) and true labels (y_test)


```python
X_test = scaled_series[train_size - window_size:train_size].reshape(1, window_size)
y_test = scaled_series[train_size:].reshape(forecast_horizon,)
```


```python
print(f"X_train shape: {X_train.shape}  <- Input windows for training (n_samples, window_size)")
print(f"y_train shape: {y_train.shape}  <- Corresponding forecast vectors (n_samples, forecast_horizon)")
print(f"X_test shape:  {X_test.shape}   <- Single test input (1, window_size)")
print(f"y_test shape:  {y_test.shape}   <- True future values for comparison (forecast_horizon,)")
```

# <b>2.4</b>
### Build a Multilayer Percepton Model with the following sequence of layers: 
### a) Batch Normalization Layer
### b) Dense layer with 50 neurons utilizing Lecun Normal initiliazation and SELU activation
### c) Dense layer with 25 neurons utilizing Lecun Normal initiliazation and SELU activation
### d) An output layer
### The model should be compiled with MSE loss and ADAMW optimizer. Add MAE to the model’s metrics. Train the model for 30 epochs with a batch size set to 32 and with a validation split set to 10% of the training set. You have to utilize early stopping with patience of 2 iterations and the ability to restore the best weights. Print the model summary and explain the number of parameters and where they come from. Measure the training time and print. 

Build the MLP Model\
We construct a simple Multilayer Perceptron (MLP) for sequence-to-vector time series forecasting. The architecture includes:
- Batch Normalization
- Dense layers with SELU activation and Lecun Normal initialization
- A final output layer matching the test set length (326 months)


```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import BatchNormalization, Dense
from tensorflow.keras import Input

model = Sequential([
    Input(shape=(40,)),
    BatchNormalization(),
    Dense(50, activation="selu", kernel_initializer="lecun_normal"),
    Dense(25, activation="selu", kernel_initializer="lecun_normal"),
    Dense(y_train.shape[1])
])
```

Compile the modelric


```python
from tensorflow.keras.optimizers import AdamW

model.compile(
    loss="mse",
    optimizer=AdamW(),
    metrics=["mae"]
)
```

Configure Early Stopping


```python
from tensorflow.keras.callbacks import EarlyStopping

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=2,
    restore_best_weights=True
)
```

Train the model for up to 30 epochs, while also measuring the training time.


```python
import time

start = time.time()
history = model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=32,
    validation_split=0.1,
    callbacks=[early_stopping],
    verbose=1
)
end = time.time()
training_time = end - start
print(f"Total training time: {training_time:.2f} seconds")
```


```python
model.summary()
```

# <b>2.5</b>
### Plot the training loss with respect to the epochs in a semi logarithic diagram for both training and validation. Print the RMSE and MAE for training and test. Discuss the results.


```python
best_epoch = np.argmin(history.history['val_loss'])


plt.figure(figsize=(10, 5))
plt.semilogy(history.history["loss"], color='red', label="Training Loss")
plt.semilogy(history.history["val_loss"], color='blue', label="Validation Loss")
plt.axvline(best_epoch, color='orange', linestyle='--', label=f"Best Epoch: {best_epoch}")

plt.xlabel("Epochs")
plt.ylabel("Loss (log scale)")
plt.title("Training and Validation Loss")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
```


```python
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Predictions
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# Compute metrics
train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
train_mae = mean_absolute_error(y_train, y_train_pred)

test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred.flatten()))
test_mae = mean_absolute_error(y_test, y_test_pred.flatten())

mlp_training_time = training_time
mlp_test_RMSE = test_rmse
mlp_test_MAE = test_mae
print(f"Train RMSE: {train_rmse:.4f}, Train MAE: {train_mae:.4f}")
print(f"Test RMSE: {test_rmse:.4f}, Test MAE: {test_mae:.4f}")

```

The Multilayer Perceptron model performed very well, achieving low RMSE (0.0871) and MAE (0.0704) on the test set, indicating strong forecasting ability. Both training and validation losses decreased smoothly, with early stopping activating at epoch 10 to prevent overfitting. The final model generalizes effectively, aided by proper scaling, SELU activation with Lecun Normal initialization, and a well-chosen sequence-to-vector architecture. The training was efficient (2.23s), and the best epoch was clearly marked in the learning curves for visual reference.

# <b>2.6</b>
### Compute predictions based on test inputs. Plot the actuals corresponding to the test set along with the predictions and discuss the results.


```python
# Predict future values using the trained model
y_test_pred = model.predict(X_test).flatten()

# Plot the actual vs predicted values
plt.figure(figsize=(12, 6))
plt.plot(y_test, label="Actual", linewidth=1.5)
plt.plot(y_test_pred, label="Prediction", linestyle='-', linewidth=1.5)
plt.title("Actual vs Predicted Sunspot Counts (Scaled)")
plt.xlabel("Months Ahead")
plt.ylabel("Scaled Sunspot Count")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
```

The model captures the cyclical nature of sunspot activity well, delivering stable and realistic long-term forecasts across the 326-month horizon. Although it slightly smooths sharp peaks and valleys and falls a little ahead or behind in time, it preserves the overall shape and timing of the cycles. This suggests strong generalization, especially given the difficulty of the sequence-to-vector task (compressing a lot of future prediction into a single forward pass, without feedback or correction from previous outputs), and makes the model a good starting point for more advanced forecasting methods.

# <b>2.7</b>
### Create an additional model using two Gated Recurrent Unit (GRU) layers and the output layer of Q4. The parameters should be the same as those on Q4. Compare the new model with the existing one with respect to training times RMSE and MAE of the predictions on the test set. Additionaly, the early stopping criterion should check if the minimum change in the monitored quantity is above 0.0005. Discuss your results.


```python
# Reshape for RNN input: (samples, timesteps, features)
X_train_gru = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
X_test_gru = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
```

Define the GRU Mode


```python
from tensorflow.keras.layers import GRU

gru_model = Sequential([
    Input(shape=(window_size,1)),
    GRU(50, return_sequences=True,),
    GRU(25),
    Dense(y_train.shape[1])  # Output size = forecast horizon
])
```

Compile and Configure Early Stopping


```python
gru_model.compile(
    loss="mse",
    optimizer=AdamW(),
    metrics=["mae"]
)

early_stopping_gru = EarlyStopping(
    monitor="val_loss",
    patience=2,
    restore_best_weights=True,
    min_delta=0.0005
)

```

Train the GRU Model


```python
start = time.time()
gru_history = gru_model.fit(
    X_train_gru, y_train,
    epochs=30,
    batch_size=32,
    validation_split=0.1,
    callbacks=[early_stopping_gru],
    verbose=1
)
end = time.time()
gru_training_time = end - start
print(f"GRU training time: {gru_training_time:.2f} seconds")
```

Evaluate the GRU Model


```python
# Make predictions
y_test_gru_pred = gru_model.predict(X_test_gru).flatten()

# Compute metrics
gru_test_rmse = np.sqrt(mean_squared_error(y_test, y_test_gru_pred))
gru_test_mae = mean_absolute_error(y_test, y_test_gru_pred)

print(f"GRU Test RMSE: {gru_test_rmse:.4f}, Test MAE: {gru_test_mae:.4f}")

```


```python
# Construct comparison DataFrame
comparison_df = pd.DataFrame({
    "Model": ["MLP", "GRU"],
    "Training Time (s)": [mlp_training_time, gru_training_time],
    "Test RMSE": [mlp_test_RMSE, gru_test_rmse],
    "Test MAE": [mlp_test_MAE, gru_test_mae]
})

comparison_df
```

The GRU-based model achieved comparable RMSE and MAE to the MLP, confirming its ability to capture long-term dependencies in the sunspot time series. However, as expected, the GRU required a longer training time due to its recurrent architecture. Early stopping functioned correctly, halting training once improvements became negligible. Overall, both models performed well, but the GRU provides a more flexible approach for sequence modeling. It's especially useful for capturing complex temporal patterns, though it comes with higher training time.


```python
# Predict the next 326 months using the GRU model
y_test_gru_pred = gru_model.predict(X_test_gru).flatten()

# Plot the actual vs predicted values
plt.figure(figsize=(12, 6))
plt.plot(y_test, label="Actual", linewidth=1.5)
plt.plot(y_test_gru_pred, label="GRU Prediction", linestyle='-', linewidth=1.5, color='purple')
plt.title("GRU: Actual vs Predicted Sunspot Counts (Scaled)")
plt.xlabel("Months Ahead")
plt.ylabel("Scaled Sunspot Count")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

```

Below is a visual comparison between the predictions made by the MLP and the GRU models against the actual sunspot values over a 326-month forecast horizon.


```python
# Run both predictions if not already done
y_test_mlp_pred = model.predict(X_test).flatten()
y_test_gru_pred = gru_model.predict(X_test_gru).flatten()

# Plot side-by-side
plt.figure(figsize=(15, 6))

# MLP Prediction
plt.plot(y_test, label="Actual", color='blue', linewidth=1.5, alpha = 0.3)
plt.plot(y_test_mlp_pred, label="MLP Prediction", linestyle='-', color='red', linewidth=1.5)

# GRU Prediction
plt.plot(y_test_gru_pred, label="GRU Prediction", linestyle='-', color='green', linewidth=1.5)

plt.title("MLP vs GRU: Actual vs Predicted Sunspot Counts (Scaled)")
plt.xlabel("Months Ahead")
plt.ylabel("Scaled Sunspot Count")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

```

This graph confirms that both models capture the general structure of the sunspot time series. The MLP prediction is more responsive but appears noisier overall. In contrast, the GRU provides a smoother and more stable forecast, which would probably generalize better over time. These observations are consistent with the RMSE and MAE values and highlight GRU’s advantage in sequence modeling tasks with repeating cycles, like this one.

Visualizing the dataset's split in training and test sets.


```python
plt.figure(figsize=(14, 5))

# Full series in light gray
plt.plot(scaled_series, label="Full Series", color='lightgray')

# Training portion
plt.plot(range(train_size), scaled_series[:train_size], label="Training Set", linewidth = 1)

# Test portion
plt.plot(range(train_size, len(scaled_series)), scaled_series[train_size:], label="Test Set", linewidth = 1)

plt.title("Sunspot Series: Training vs Test Split")
plt.xlabel("Months since Jan 1749")
plt.ylabel("Scaled Sunspot Count")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

```

A visual representation of the rolling window mechanism, showing the training input windows (X) and their corresponding forecast targets (y) for samples starting at indices 1, 400, and 600.


```python
fig, axs = plt.subplots(3, 1, figsize=(14, 15), sharex=True)

# Define the indices of the windows to visualize
window_indices = [0, 399, 599]

for idx, i in enumerate(window_indices):
    ax = axs[idx]
    x_start = i
    x_end = x_start + window_size
    y_start = x_end
    y_end = y_start + forecast_horizon

    ax.plot(range(1000), scaled_series[:1000], label="Zoomed Series", linewidth=1)
    ax.plot(range(x_start, x_end), scaled_series[x_start:x_end], '--', label=f"X({i+1})", linewidth=1)
    ax.plot(range(y_start, y_end), scaled_series[y_start:y_end], label=f"y({i+1})", linewidth=1)

    ax.set_title(f"Input-Output Window {i+1}: X({i+1}) and y({i+1})")
    ax.set_ylabel("Scaled Sunspot Count")
    ax.legend()
    ax.grid(True)

axs[-1].set_xlabel("Months since Jan 1749")
plt.tight_layout()
plt.show()

```


```python

```
