# HW4 Problem 2: Overfitting Mitigation in Neural Networks - Technical Analysis

## Overview
This project explores strategies to mitigate overfitting in deep neural networks applied to Fashion MNIST. The analysis compares base models with early stopping, batch normalization, and dropout regularization techniques.

## Data Sources and Preprocessing

### Data Source
- **Dataset**: Fashion MNIST top half images (from Problem 1)
- **Image Dimensions**: 14×28 (upper portion of 28×28 images)
- **Classes**: 10 fashion item categories
- **Preprocessing**: Already normalized to [0, 1] range

## Machine Learning Techniques

### Model Architectures

#### 1. Base Model
- **Architecture**: 
  - Input: (14, 28)
  - Flatten: 392-dimensional vector
  - Dense(128, ReLU)
  - Dense(64, ReLU)
  - Dense(32, ReLU)
  - Dense(10, Softmax)
- **Total Parameters**: ~60,000+ parameters
- **Characteristics**: No regularization, prone to overfitting

#### 2. Early Stopping Model
- **Architecture**: Identical to base model
- **Regularization**: EarlyStopping callback
- **Configuration**:
  - `monitor='val_loss'`: Monitors validation loss
  - `patience=3`: Stops after 3 epochs without improvement
  - `restore_best_weights=True`: Restores weights from best epoch
- **Purpose**: Prevents unnecessary training and overfitting

#### 3. Batch Normalization Model
- **Architecture**: Base model with BatchNormalization after each Dense layer
- **Configuration**:
  - `use_bias=False`: Bias disabled (batch norm provides shift)
  - BatchNormalization after each hidden layer
- **Purpose**: Normalizes layer inputs, stabilizes training, reduces internal covariate shift

#### 4. Dropout Model
- **Architecture**: Base model with Dropout layers
- **Configuration**:
  - Dropout(0.2) after first hidden layer
  - Dropout(0.3) after second hidden layer
  - Dropout(0.4) after third hidden layer
- **Purpose**: Randomly deactivates neurons during training, prevents co-adaptation

### Training Configuration
- **Optimizer**: Adam optimizer
- **Loss Function**: Sparse categorical crossentropy
- **Metrics**: Accuracy
- **Epochs**: 15 epochs maximum
- **Batch Size**: 32
- **Validation**: Separate validation set for monitoring

## Evaluation Metrics

### Training History Metrics
- **Training Loss**: Loss on training set per epoch
- **Training Accuracy**: Accuracy on training set per epoch
- **Validation Loss**: Loss on validation set per epoch
- **Validation Accuracy**: Accuracy on validation set per epoch
- **Best Epoch**: Epoch with minimum validation loss

### Classification Reports
- **Metrics**: Precision, recall, F1-score per class
- **Macro Averages**: Overall performance metrics
- **Per-Class Performance**: Detailed breakdown by fashion category

### Visualization
- **Learning Curves**: Training and validation loss/accuracy over epochs
- **Best Epoch Marker**: Vertical line indicating optimal stopping point
- **Curve Shifting**: Training curves shifted by -0.5 epochs for better visualization

## Python Libraries and Tools

### Core Libraries
- **TensorFlow**: Deep learning framework
- **Keras**: High-level neural network API
- **NumPy**: Array operations, epoch calculations
- **Scikit-learn**: `classification_report` for detailed metrics

### Visualization Libraries
- **Matplotlib**: Learning curve plots, epoch visualization

## Key Analytical Methods

### Overfitting Detection
1. **Gap Analysis**: Difference between training and validation performance
2. **Loss Divergence**: Training loss decreases while validation loss plateaus/increases
3. **Accuracy Gap**: Training accuracy exceeds validation accuracy significantly
4. **Best Epoch Identification**: Point of optimal generalization

### Regularization Techniques

#### Early Stopping
1. **Mechanism**: Monitors validation loss, stops when no improvement
2. **Patience Parameter**: Number of epochs to wait before stopping
3. **Weight Restoration**: Keeps best model weights (not final weights)
4. **Benefits**: Prevents overfitting, saves training time

#### Batch Normalization
1. **Mechanism**: Normalizes layer inputs to zero mean, unit variance
2. **Training vs Inference**: Different behavior during training and prediction
3. **Benefits**: Faster convergence, allows higher learning rates, reduces internal covariate shift
4. **Bias Removal**: Batch norm provides shift, making bias redundant

#### Dropout
1. **Mechanism**: Randomly sets fraction of inputs to zero during training
2. **Dropout Rates**: Increasing rates (0.2, 0.3, 0.4) in deeper layers
3. **Inference**: All neurons active, outputs scaled by dropout rate
4. **Benefits**: Prevents co-adaptation, forces robust feature learning

## Insights and Findings

### Model Performance Comparison

#### Base Model
- **Training Accuracy**: ~88% (high)
- **Validation Accuracy**: ~85% (lower, indicating overfitting)
- **Gap**: ~3% difference shows mild overfitting
- **Best Epoch**: Epoch 9

#### Early Stopping Model
- **Stopped Early**: Epoch 5 (saved training time)
- **Training Accuracy**: ~85% (lower than base, but better generalization)
- **Validation Accuracy**: ~83% (slightly lower but more stable)
- **Gap**: Reduced gap indicates better generalization

#### Batch Normalization Model
- **Training Stability**: More stable training curves
- **Convergence**: Faster convergence to good performance
- **Generalization**: Improved validation performance
- **Benefits**: Better gradient flow, reduced internal covariate shift

#### Dropout Model
- **Training Accuracy**: Lower than base (expected, regularization effect)
- **Validation Accuracy**: Better generalization
- **Gap Reduction**: Smaller gap between training and validation
- **Robustness**: More robust to overfitting

### Key Observations
1. **Overfitting Pattern**: Base model shows classic overfitting (high training, lower validation)
2. **Early Stopping Effectiveness**: Prevents unnecessary training, saves time
3. **Batch Normalization Benefits**: Stabilizes training, improves convergence
4. **Dropout Effectiveness**: Reduces overfitting gap significantly
5. **Combination Potential**: Techniques can be combined for maximum effect

### Theoretical Understanding
- **Bias-Variance Trade-off**: Regularization reduces variance (overfitting)
- **Generalization**: Goal is good performance on unseen data
- **Regularization Methods**: Different approaches to same goal
- **Training Dynamics**: Understanding how each technique affects learning

## Best Practices Demonstrated

1. **Validation Monitoring**: Separate validation set for overfitting detection
2. **Early Stopping**: Prevents overfitting and saves computational resources
3. **Batch Normalization**: Proper implementation with bias removal
4. **Dropout**: Appropriate dropout rates for different layers
5. **Learning Curve Analysis**: Visualizing training dynamics
6. **Best Epoch Tracking**: Identifying optimal stopping point
7. **Comprehensive Evaluation**: Classification reports and multiple metrics
8. **Technique Comparison**: Systematic comparison of regularization methods
9. **Reproducibility**: Fixed random states and configurations
