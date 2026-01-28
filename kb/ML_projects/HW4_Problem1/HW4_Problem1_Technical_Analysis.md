# HW4 Problem 1: Neural Networks on Fashion MNIST - Technical Analysis

## Overview
This project implements feedforward neural networks using TensorFlow/Keras on the Fashion MNIST dataset. The analysis explores different feature subsets (full images, top half, bottom half) and their impact on classification performance.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Fashion MNIST dataset
- **Source**: `tensorflow.keras.datasets.fashion_mnist`
- **Default Split**: 60,000 training, 10,000 test images
- **Custom Split**: 50,000 training, 10,000 validation, 10,000 test
- **Image Dimensions**: 28×28 grayscale images
- **Classes**: 10 fashion item categories (T-shirt/top, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot)

### Data Preprocessing
- **Pixel Normalization**: Values scaled from [0, 255] to [0, 1] by dividing by 255
- **Data Type**: Converted to float32 for TensorFlow compatibility
- **Class Distribution**: Verified balanced distribution across train/validation/test sets

### Feature Subset Creation
- **Full Images**: Complete 28×28 images
- **Top Half**: Upper 14 rows (14×28) - `X[:, :14, :]`
- **Bottom Half**: Lower 14 rows (14×28) - `X[:, 14:, :]`
- **Purpose**: Analyze impact of partial image information on classification

### Data Visualization
- **Before/After Normalization**: Side-by-side comparison showing normalization doesn't distort images
- **Cropped Images**: Visualization of top and bottom halves
- **Class Distribution**: Bar chart showing class counts across splits

## Machine Learning Techniques

### Model Architecture
- **Framework**: TensorFlow/Keras Sequential API
- **Input Layer**: Shape matches feature subset (28×28, 14×28, or 14×28)
- **Flatten Layer**: Converts 2D images to 1D vectors
- **Hidden Layers**: 
  - Dense layers with ReLU activation
  - Layer sizes vary by experiment
- **Output Layer**: 
  - Dense layer with 10 units (one per class)
  - Softmax activation for probability distribution

### Training Configuration
- **Optimizer**: Adam optimizer (adaptive learning rate)
- **Loss Function**: Sparse categorical crossentropy (for integer labels)
- **Metrics**: Accuracy
- **Epochs**: Varies by experiment
- **Batch Size**: Typically 32
- **Validation**: Separate validation set for monitoring

### Experimental Variations
1. **Full Image Models**: Complete 28×28 images
2. **Top Half Models**: Upper portion only (14×28)
3. **Bottom Half Models**: Lower portion only (14×28)
4. **Layer Architecture**: Different numbers and sizes of hidden layers

## Evaluation Metrics

### Training Metrics
- **Loss**: Sparse categorical crossentropy
- **Accuracy**: Classification accuracy on training set
- **Validation Loss**: Loss on validation set
- **Validation Accuracy**: Accuracy on validation set

### Model Comparison
- **Performance by Feature Subset**: Full vs top vs bottom half
- **Architecture Impact**: Effect of different layer configurations
- **Overfitting Analysis**: Training vs validation performance gaps

## Python Libraries and Tools

### Core Libraries
- **TensorFlow**: Deep learning framework
- **Keras**: High-level neural network API (via TensorFlow)
- **NumPy**: Array operations, data manipulation
- **Pandas**: DataFrame operations for class distribution analysis

### Visualization Libraries
- **Matplotlib**: Image display, bar charts, training history plots

## Key Analytical Methods

### Neural Network Design
1. **Layer Architecture**: Sequential dense layers with ReLU activation
2. **Flattening**: Converting 2D images to 1D feature vectors
3. **Output Configuration**: Softmax for multi-class classification
4. **Input Shape Handling**: Adapting to different image dimensions

### Feature Subset Analysis
1. **Information Content**: Comparing full vs partial image performance
2. **Spatial Analysis**: Understanding which image regions are most informative
3. **Dimensionality Impact**: Effect of reduced input dimensions

### Training Methodology
1. **Validation Monitoring**: Separate validation set for overfitting detection
2. **Normalization**: Pixel value scaling for stable training
3. **Batch Processing**: Efficient training with batch size 32
4. **Epoch Management**: Training for sufficient epochs to convergence

## Insights and Findings

### Model Performance
- **Full Images**: Best performance (complete information)
- **Top Half**: Moderate performance (upper body features)
- **Bottom Half**: Varies by class (lower body features)
- **Architecture Impact**: Deeper networks may improve performance

### Key Observations
1. **Normalization Critical**: Pixel scaling essential for neural network training
2. **Feature Subset Impact**: Partial images reduce but don't eliminate classification ability
3. **Class-Specific Patterns**: Some classes more identifiable from specific image regions
4. **Overfitting Risk**: Need for validation monitoring and regularization

### Theoretical Understanding
- **Feedforward Networks**: Multi-layer perceptrons for image classification
- **ReLU Activation**: Non-linearity enabling complex pattern learning
- **Softmax Output**: Probability distribution over classes
- **Adam Optimizer**: Adaptive learning rate for efficient training

## Best Practices Demonstrated

1. **Data Normalization**: Proper pixel value scaling
2. **Train/Validation/Test Split**: Proper data partitioning
3. **Class Distribution Verification**: Ensuring balanced splits
4. **Feature Engineering**: Exploring different input representations
5. **Model Architecture**: Appropriate layer design for task
6. **Training Configuration**: Proper optimizer, loss, and metrics
7. **Visualization**: Clear plots for data and model understanding
8. **Reproducibility**: Fixed random states where applicable
