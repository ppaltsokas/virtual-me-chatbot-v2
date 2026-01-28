# HW5 Problem 2: Time Series Forecasting with Neural Networks - Technical Analysis

## Overview
This project implements a Multilayer Perceptron (MLP) for multi-step ahead time series forecasting on Monthly Mean Sunspots data spanning 1749-2019. The analysis demonstrates sequence-to-vector forecasting using a sliding window approach.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Monthly Mean Total Sunspot Number
- **Time Period**: 1749 to 2019 (270 years)
- **Sample Size**: 3,252 monthly observations
- **Data Format**: CSV file with time series data
- **Source Column**: "Monthly Mean Total Sunspot Number"

### Data Exploration
- **Missing Values**: Checked for missing data
- **Descriptive Statistics**: Mean, std, min, max, quartiles
- **Data Type**: Converted to NumPy float32 array
- **Visualization**: Time series plot showing cyclical patterns

### Data Preprocessing
- **Scaling**: MinMaxScaler to range [0, 1]
- **Rationale**: Neural networks perform better with normalized inputs
- **Window Creation**: Sliding window of 40 timesteps (40 months)
- **Forecast Horizon**: 326 months (length of test set)
- **Sequence-to-Vector**: One input sequence predicts entire forecast horizon

### Data Splitting
- **Training Set**: 90% of data (2,926 samples)
- **Test Set**: 10% of data (326 samples)
- **Window Overlap**: Sliding windows create multiple training samples
- **Training Samples**: 2,561 sequences (train_size - window_size - forecast_horizon + 1)

## Machine Learning Techniques

### Model Architecture

#### Multilayer Perceptron (MLP)
- **Input Layer**: 40 neurons (window size)
- **Batch Normalization**: Normalizes inputs
- **Hidden Layer 1**: 50 neurons with SELU activation
- **Hidden Layer 2**: 25 neurons with SELU activation
- **Output Layer**: 326 neurons (forecast horizon length)
- **Total Parameters**: ~20,000+ parameters

### Activation Functions
- **SELU (Scaled Exponential Linear Unit)**: Self-normalizing activation
- **Benefits**: Automatic normalization, prevents vanishing/exploding gradients
- **Initialization**: LeCun Normal initialization (compatible with SELU)

### Training Configuration
- **Optimizer**: AdamW (Adam with weight decay)
- **Loss Function**: Mean Squared Error (MSE)
- **Metrics**: Mean Absolute Error (MAE)
- **Epochs**: 30 maximum
- **Batch Size**: 32
- **Validation Split**: 10% of training data
- **Early Stopping**: Patience=2, monitors validation loss

## Evaluation Metrics

### Forecasting Metrics
1. **Mean Squared Error (MSE)**: Penalizes large forecast errors
2. **Mean Absolute Error (MAE)**: Average absolute forecast error
3. **Root Mean Squared Error (RMSE)**: Square root of MSE, in original units
4. **Visual Comparison**: Predicted vs actual time series plots

### Model Evaluation
- **Training History**: Loss and MAE over epochs
- **Best Epoch**: Epoch with minimum validation loss
- **Parameter Count**: Analysis of model complexity
- **Training Time**: Computational efficiency measurement

## Python Libraries and Tools

### Core Libraries
- **Pandas**: Data loading, DataFrame operations
- **NumPy**: Array operations, time series manipulation
- **TensorFlow/Keras**: 
  - `Sequential`: Model construction
  - `BatchNormalization`: Input normalization layer
  - `Dense`: Fully connected layers
  - `Input`: Input layer specification
  - `AdamW`: Optimizer with weight decay
  - `EarlyStopping`: Training callback
- **Scikit-learn**: `MinMaxScaler` for data normalization

### Visualization Libraries
- **Matplotlib**: Time series plots, forecast visualization

## Key Analytical Methods

### Time Series Preprocessing
1. **Sliding Window**: Creating input-output pairs from time series
2. **Sequence-to-Vector**: One sequence predicts multiple future steps
3. **Scaling**: MinMax normalization for neural network stability
4. **Train-Test Split**: Temporal split (no shuffling to preserve time order)

### Neural Network Design
1. **MLP Architecture**: Feedforward network for time series
2. **Batch Normalization**: Stabilizes training, allows higher learning rates
3. **SELU Activation**: Self-normalizing properties
4. **Output Dimension**: Matches forecast horizon (326 months)

### Forecasting Methodology
1. **Multi-Step Ahead**: Predicting entire test set at once
2. **Single Input**: One 40-month window predicts 326-month horizon
3. **Direct Strategy**: Directly predicts all future values
4. **Evaluation**: Compare predicted vs actual test set

## Insights and Findings

### Model Performance
- **Training Convergence**: Model learns to predict sunspot patterns
- **Forecast Quality**: Captures general trends and cyclical patterns
- **Limitations**: May struggle with long-term dependencies
- **Error Patterns**: Analysis of where predictions deviate from actuals

### Key Observations
1. **Cyclical Patterns**: Sunspots show ~11-year cycles (visible in data)
2. **Window Size Impact**: 40-month window captures short-term patterns
3. **Forecast Horizon**: 326-month prediction is challenging (multi-step ahead)
4. **Scaling Importance**: MinMax scaling essential for neural network training
5. **SELU Benefits**: Self-normalizing activation helps with deep networks

### Theoretical Understanding
- **Time Series Forecasting**: Predicting future values from past observations
- **Sliding Window**: Converting time series to supervised learning problem
- **Multi-Step Ahead**: Predicting multiple future time steps simultaneously
- **Sequence-to-Vector**: Alternative to sequence-to-sequence approaches
- **Neural Network Capacity**: MLP can learn non-linear time series patterns

### Data Characteristics
- **Seasonality**: 11-year solar cycle evident in data
- **Trend**: Long-term trends over 270 years
- **Noise**: Natural variability in sunspot counts
- **Scale**: Values range from near-zero to hundreds

## Best Practices Demonstrated

1. **Time Series Preprocessing**: Proper scaling and window creation
2. **Temporal Splitting**: No shuffling to preserve time order
3. **Batch Normalization**: Stabilizes training for time series
4. **SELU Activation**: Appropriate for deep networks
5. **Early Stopping**: Prevents overfitting on time series
6. **Multi-Step Forecasting**: Direct prediction of entire horizon
7. **Visualization**: Clear time series and forecast plots
8. **Parameter Analysis**: Understanding model complexity
9. **Reproducibility**: Fixed random states and seeds
