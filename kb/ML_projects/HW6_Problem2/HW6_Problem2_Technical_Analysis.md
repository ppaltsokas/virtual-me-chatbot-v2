# HW6 Problem 2: Generative Adversarial Networks (GANs) - Technical Analysis

## Overview
This project implements a Generative Adversarial Network (GAN) from scratch using TensorFlow/Keras to generate synthetic Fashion MNIST images. The analysis demonstrates adversarial training between generator and discriminator networks.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: Fashion MNIST dataset
- **Source**: `tensorflow.keras.datasets.fashion_mnist`
- **Filtered Classes**: T-shirt/top (0), Trouser (1), Pullover (2)
- **Training Set Only**: GANs use only training data (no test set needed)
- **Image Dimensions**: 28×28 grayscale images

### Data Preprocessing
- **Pixel Scaling**: Values scaled from [0, 255] to [-1, 1]
- **Method**: `X_train.astype("float32") / 127.5 - 1.0`
- **Rationale**: Tanh activation in generator outputs [-1, 1] range
- **Shape Expansion**: Added channel dimension `(n, 28, 28, 1)`
- **Class Distribution**: Verified balanced distribution of 3 classes

## Machine Learning Techniques

### Model Architectures

#### Generator Network
- **Input**: Random noise vector of size 30 (latent space)
- **Architecture**:
  - Dense(100, ReLU, HeNormal): First hidden layer
  - Dense(150, ReLU, HeNormal): Second hidden layer
  - Dense(784, Tanh): Output layer (28×28=784 pixels)
  - Reshape: (28, 28) image
- **Total Parameters**: ~150,000+ parameters
- **Activation**: Tanh for [-1, 1] output range
- **Initialization**: He Normal (appropriate for ReLU)

#### Discriminator Network
- **Input**: 28×28 grayscale images
- **Architecture**:
  - Flatten: 784-dimensional vector
  - Dense(150, ReLU, HeNormal): First hidden layer
  - Dense(100, ReLU, HeNormal): Second hidden layer
  - Dense(1, Sigmoid): Binary classification output
- **Total Parameters**: ~100,000+ parameters
- **Activation**: Sigmoid for binary classification (real vs fake)
- **Initialization**: He Normal

#### Combined GAN Model
- **Architecture**: Sequential([generator, discriminator])
- **Purpose**: Training generator through discriminator feedback
- **Discriminator Freezing**: `discriminator.trainable = False` during generator training
- **Loss Function**: Binary cross-entropy
- **Optimizer**: RMSprop for both discriminator and GAN

### Training Methodology

#### Adversarial Training Loop
1. **Phase 1 - Discriminator Training**:
   - Train on real images (label=1)
   - Train on fake images from generator (label=0)
   - Update discriminator weights
   - Goal: Distinguish real from fake

2. **Phase 2 - Generator Training**:
   - Freeze discriminator weights
   - Generate fake images from random noise
   - Train generator to fool discriminator (label=1 for fake images)
   - Update generator weights
   - Goal: Generate realistic images

#### Training Configuration
- **Optimizer**: RMSprop for both networks
- **Loss Function**: Binary cross-entropy
- **Batch Size**: 32 images per batch
- **Epochs**: 10 epochs
- **Dataset**: TensorFlow Dataset API with shuffling and prefetching

## Evaluation Metrics

### Training Metrics
- **Discriminator Loss**: Binary cross-entropy on real and fake images
- **Discriminator Accuracy**: Classification accuracy (real vs fake)
- **Generator Loss**: Binary cross-entropy when trying to fool discriminator
- **Visual Quality**: Generated images inspected after each epoch

### Visual Evaluation
- **Generated Images**: 32 images displayed in grid after each epoch
- **Quality Assessment**: Visual inspection of image realism
- **Progression**: Improvement in image quality over epochs
- **Mode Collapse Detection**: Checking for diversity in generated images

## Python Libraries and Tools

### Core Libraries
- **TensorFlow**: Deep learning framework
- **Keras**: High-level neural network API
- **NumPy**: Array operations, random number generation
- **TensorFlow Data API**: `Dataset.from_tensor_slices()` for efficient batching

### Visualization Libraries
- **Matplotlib**: Image grid visualization, generated image display

## Key Analytical Methods

### GAN Architecture Design
1. **Generator Design**: Maps random noise to image space
2. **Discriminator Design**: Binary classifier for real vs fake
3. **Adversarial Setup**: Two networks competing against each other
4. **Balance**: Generator and discriminator must be balanced in capacity

### Training Strategy
1. **Alternating Training**: Train discriminator and generator separately
2. **Label Strategy**: 
   - Real images: label=1
   - Fake images: label=0 (discriminator) or label=1 (generator training)
3. **Freezing Weights**: Discriminator frozen during generator training
4. **Batch Processing**: Efficient training with batches

### Image Generation
1. **Random Noise**: Sample from latent space (30-dimensional)
2. **Forward Pass**: Generator transforms noise to images
3. **Post-Processing**: Rescale from [-1, 1] to [0, 1] for display
4. **Grid Visualization**: Display multiple generated images

## Insights and Findings

### Model Performance

#### Training Dynamics
- **Discriminator**: Initially learns to distinguish real from random noise quickly
- **Generator**: Gradually improves image quality over epochs
- **Adversarial Balance**: Both networks improve together
- **Convergence**: Generator learns to produce more realistic images

#### Generated Image Quality
- **Early Epochs**: Blurry, noisy images
- **Later Epochs**: Clearer, more recognizable fashion items
- **Class Diversity**: Generated images show variety across 3 classes
- **Realism**: Images become more similar to training data

### Key Observations
1. **Adversarial Training**: Generator and discriminator improve together
2. **Mode Diversity**: Generated images show variety (no mode collapse observed)
3. **Class Representation**: All 3 classes (T-shirt, Trouser, Pullover) appear in generations
4. **Training Stability**: RMSprop optimizer provides stable training
5. **Visual Progression**: Clear improvement in image quality over epochs
6. **Latent Space**: 30-dimensional noise sufficient for image generation

### Theoretical Understanding
- **Adversarial Principle**: Two networks in competition
- **Nash Equilibrium**: Generator and discriminator reach balance
- **Generator Learning**: Learns data distribution through adversarial feedback
- **Discriminator Learning**: Learns to distinguish real from generated
- **GAN Training Challenges**: Requires careful balance and tuning

### GAN Characteristics
- **Unsupervised Learning**: No labels needed, learns from data distribution
- **Generative Model**: Creates new samples similar to training data
- **Latent Space**: Random noise as input enables controlled generation
- **Applications**: Image generation, data augmentation, style transfer

## Best Practices Demonstrated

1. **Architecture Design**: Appropriate generator and discriminator capacities
2. **Adversarial Training**: Proper alternating training strategy
3. **Weight Freezing**: Discriminator frozen during generator training
4. **Label Strategy**: Correct labels for adversarial training
5. **Optimizer Selection**: RMSprop for stable GAN training
6. **Batch Processing**: Efficient data loading with TensorFlow Dataset
7. **Visual Monitoring**: Generated images after each epoch
8. **Reproducibility**: Fixed random seeds for noise generation
9. **Pixel Scaling**: Proper [-1, 1] range for Tanh activation
10. **Progressive Visualization**: Monitoring training progress through images
