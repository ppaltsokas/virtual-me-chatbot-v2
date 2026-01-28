# HW6 Problem 1: Autoencoders for Image Compression - Technical Analysis

## Overview
This project implements and compares two autoencoder architectures (standard and sparse) for compressing and reconstructing Fashion MNIST images. The analysis explores different batch sizes and regularization techniques for unsupervised representation learning.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Fashion MNIST dataset
- **Source**: `tensorflow.keras.datasets.fashion_mnist`
- **Filtered Classes**: Sandal (5), Sneaker (7), Ankle boot (9)
- **Sample Size**: Subset of full dataset (3 classes only)
- **Image Dimensions**: 28×28 grayscale images

### Data Preprocessing
- **Custom Split**: 5/7 training, 1/7 validation, 1/7 test
- **Stratified Splitting**: Maintains class balance across splits
- **Normalization**: Pixel values scaled to [0, 1] range
- **Data Type**: float32 for TensorFlow compatibility
- **Class Distribution**: Verified balanced distribution across splits

## Machine Learning Techniques

### Model Architectures

#### 1. Standard Autoencoder
- **Encoder**:
  - Input: (28, 28) images
  - Flatten: 784-dimensional vector
  - Dense(256, ReLU): First hidden layer
  - Dense(50, ReLU): Latent space (bottleneck)
- **Decoder**:
  - Dense(256, ReLU): First reconstruction layer
  - Dense(784, Sigmoid): Output layer (matches input size)
  - Reshape: (28, 28) reconstructed images
- **Latent Dimension**: 50 (compression from 784 to 50)
- **Compression Ratio**: ~15.7:1

#### 2. Sparse Autoencoder
- **Architecture**: Identical to standard autoencoder
- **Regularization**: L1 activity regularizer on latent layer
- **Regularization Weight**: 10^-6
- **Purpose**: Encourages sparse latent representations
- **Sparsity**: Many latent neurons should be inactive (near zero)

### Training Configuration
- **Optimizer**: Nadam (Nesterov-accelerated Adam)
- **Learning Rate**: 10^-4 (0.0001)
- **Loss Function**: Binary cross-entropy (appropriate for [0,1] pixel values)
- **Epochs**: Up to 50
- **Batch Sizes**: 32 and 256 (two experiments per model)
- **Early Stopping**:
  - `patience=5`: Wait 5 epochs without improvement
  - `min_delta=1e-2`: Minimum change to qualify as improvement
  - `restore_best_weights=True`: Keep best model weights

## Evaluation Metrics

### Reconstruction Quality
1. **Training Loss**: Binary cross-entropy on training set
2. **Validation Loss**: Binary cross-entropy on validation set
3. **Visual Comparison**: Original vs reconstructed images
4. **Loss Curves**: Training and validation loss over epochs

### Model Comparison
- **Standard vs Sparse**: Comparison of reconstruction quality
- **Batch Size Impact**: Effect of batch size 32 vs 256
- **Convergence Speed**: How quickly models reach optimal performance
- **Overfitting Analysis**: Training vs validation loss gaps

## Python Libraries and Tools

### Core Libraries
- **TensorFlow**: Deep learning framework
- **Keras**: High-level neural network API
- **NumPy**: Array operations
- **Pandas**: Class distribution analysis

### Visualization Libraries
- **Matplotlib**: Loss curves, image reconstruction comparisons

## Key Analytical Methods

### Autoencoder Design
1. **Encoder-Decoder Architecture**: Symmetric encoder and decoder
2. **Bottleneck Layer**: Latent space forces compression
3. **Reconstruction Loss**: Binary cross-entropy measures reconstruction quality
4. **Sparsity Regularization**: L1 penalty encourages sparse activations

### Training Methodology
1. **Self-Supervised Learning**: Input and target are the same (reconstruction task)
2. **Batch Size Impact**: Larger batches (256) may provide more stable gradients
3. **Early Stopping**: Prevents overfitting on reconstruction task
4. **Learning Rate**: Small learning rate (10^-4) for stable training

### Evaluation Strategy
1. **Loss Monitoring**: Training and validation loss curves
2. **Visual Inspection**: Side-by-side original and reconstructed images
3. **Convergence Analysis**: When models reach optimal performance
4. **Regularization Effect**: Impact of L1 sparsity on reconstruction

## Insights and Findings

### Model Performance

#### Standard Autoencoder
- **Reconstruction Quality**: Good reconstruction with 50-dimensional latent space
- **Loss Convergence**: Steady decrease in both training and validation loss
- **Batch Size Impact**: Larger batches may converge faster but similar final performance

#### Sparse Autoencoder
- **Sparsity Effect**: L1 regularization encourages sparse latent representations
- **Reconstruction Quality**: Similar to standard autoencoder
- **Latent Activations**: Many neurons in latent layer remain near zero
- **Regularization Trade-off**: Slight impact on reconstruction for sparsity benefit

### Key Observations
1. **Compression Capability**: 50 dimensions sufficient for good reconstruction
2. **Information Retention**: Autoencoders learn essential features for reconstruction
3. **Batch Size**: Larger batches (256) provide more stable training
4. **Sparsity Regularization**: L1 penalty successfully creates sparse representations
5. **Early Stopping**: Effective at preventing overfitting
6. **Reconstruction Quality**: Visual inspection shows good preservation of image structure

### Theoretical Understanding
- **Autoencoder Principle**: Learn compressed representation that enables reconstruction
- **Bottleneck Effect**: Latent dimension forces information compression
- **Sparsity**: Sparse representations may learn more meaningful features
- **Unsupervised Learning**: No labels needed, learns from data structure
- **Representation Learning**: Latent space captures essential image features

### Applications
- **Dimensionality Reduction**: Compress high-dimensional images
- **Feature Learning**: Latent space as learned features
- **Denoising**: Can be extended for noise removal
- **Anomaly Detection**: High reconstruction error indicates anomalies

## Best Practices Demonstrated

1. **Architecture Design**: Symmetric encoder-decoder with bottleneck
2. **Regularization**: L1 sparsity for meaningful representations
3. **Loss Function**: Binary cross-entropy for [0,1] pixel values
4. **Early Stopping**: Prevents overfitting on reconstruction task
5. **Batch Size Exploration**: Testing different batch sizes
6. **Visual Evaluation**: Image reconstruction comparison
7. **Loss Monitoring**: Training and validation curves
8. **Reproducibility**: Fixed random states and seeds
9. **Hyperparameter Tuning**: Learning rate, regularization weight selection
