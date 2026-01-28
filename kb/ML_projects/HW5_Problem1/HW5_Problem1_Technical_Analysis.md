# HW5 Problem 1: Clustering on MNIST - Technical Analysis

## Overview
This project implements unsupervised learning techniques for clustering MNIST digit images. The analysis explores K-means and DBSCAN clustering algorithms combined with dimensionality reduction using PCA and t-SNE for visualization.

## Data Sources and Preprocessing

### Data Loading
- **Dataset**: MNIST handwritten digits dataset
- **Source**: `tensorflow.keras.datasets.mnist`
- **Sample Size**: Full dataset (70,000 images) concatenated and split
- **Split Ratio**: 5/7 training, 1/7 validation, 1/7 test
- **Image Dimensions**: 28×28 grayscale images (784 features)
- **Classes**: 10 digit classes (0-9)

### Data Preprocessing
- **Normalization**: Pixel values scaled from [0, 255] to [0, 1]
- **Data Type**: Converted to float32
- **Stratified Splitting**: Maintains class distribution across splits
- **One-Hot Encoding**: Target labels converted to one-hot vectors (for some experiments)

### Dimensionality Reduction
- **PCA**: Applied to reduce dimensionality before clustering
- **t-SNE**: Used for 2D visualization of high-dimensional data
- **Purpose**: Make clustering computationally feasible and visually interpretable

## Machine Learning Techniques

### Clustering Algorithms

#### 1. K-Means Clustering
- **Algorithm**: `sklearn.cluster.KMeans`
- **Parameters**:
  - `n_clusters`: Number of clusters (typically 10, matching digit classes)
  - `random_state`: 42 for reproducibility
- **Method**: Partition-based clustering
- **Initialization**: K-means++ (default)
- **Distance Metric**: Euclidean distance

#### 2. DBSCAN Clustering
- **Algorithm**: `sklearn.cluster.DBSCAN`
- **Parameters**:
  - `eps`: Maximum distance between samples in same cluster
  - `min_samples`: Minimum samples to form core point
- **Method**: Density-based clustering
- **Characteristics**: Can identify noise points, variable number of clusters

### Dimensionality Reduction Techniques

#### Principal Component Analysis (PCA)
- **Method**: `sklearn.decomposition.PCA`
- **Purpose**: Reduce 784 dimensions to lower-dimensional space
- **Variance Retention**: Typically 90% or specific number of components
- **Application**: Applied before clustering to reduce computational cost

#### t-Distributed Stochastic Neighbor Embedding (t-SNE)
- **Method**: `sklearn.manifold.TSNE`
- **Purpose**: Non-linear dimensionality reduction for visualization
- **Dimensions**: Typically reduced to 2D for plotting
- **Characteristics**: Preserves local neighborhood structure

## Evaluation Metrics

### Clustering Quality Metrics
1. **Silhouette Score**: Measures how similar objects are to their own cluster vs other clusters
2. **Adjusted Rand Index (ARI)**: Measures similarity between clustering and true labels
3. **Homogeneity Score**: Measures if clusters contain only members of single class
4. **Completeness Score**: Measures if all members of a class are in same cluster

### Visual Evaluation
- **Cluster Visualization**: t-SNE plots colored by cluster assignments
- **Centroid Visualization**: Representative images from each cluster
- **Confusion Matrix**: Cluster assignments vs true labels

## Python Libraries and Tools

### Core Libraries
- **NumPy**: Array operations, distance calculations
- **TensorFlow/Keras**: Dataset loading (`mnist.load_data()`)
- **Scikit-learn**:
  - `KMeans`: K-means clustering
  - `DBSCAN`: DBSCAN clustering
  - `PCA`: Principal Component Analysis
  - `TSNE`: t-SNE dimensionality reduction
  - `train_test_split`: Stratified data splitting
  - `silhouette_score`: Clustering quality metric
  - `adjusted_rand_score`: Clustering evaluation
  - `homogeneity_score`, `completeness_score`: Clustering metrics

### Visualization Libraries
- **Matplotlib**: Scatter plots, image displays, cluster visualizations
- **Seaborn**: Enhanced plotting capabilities

## Key Analytical Methods

### Clustering Methodology
1. **Preprocessing**: Normalization and dimensionality reduction
2. **Algorithm Selection**: K-means for partition-based, DBSCAN for density-based
3. **Parameter Tuning**: Number of clusters (K-means) or eps/min_samples (DBSCAN)
4. **Evaluation**: Multiple metrics to assess clustering quality

### Dimensionality Reduction Strategy
1. **PCA First**: Reduce dimensions for computational efficiency
2. **t-SNE for Visualization**: 2D embedding for visual inspection
3. **Variance Trade-off**: Balancing information retention vs dimensionality

### Cluster Analysis
1. **Centroid Analysis**: Understanding cluster centers
2. **Representative Samples**: Images closest to cluster centroids
3. **Label Comparison**: Comparing cluster assignments to true labels
4. **Noise Detection**: DBSCAN's ability to identify outliers

## Insights and Findings

### Clustering Performance
- **K-Means**: Forms distinct clusters, but may not align perfectly with digit classes
- **DBSCAN**: Can identify noise points, variable cluster count
- **PCA Impact**: Dimensionality reduction essential for computational feasibility
- **Visualization**: t-SNE reveals cluster structure in 2D space

### Key Observations
1. **Digit Similarity**: Some digits naturally cluster together (e.g., 6 and 9)
2. **Cluster Quality**: K-means with k=10 doesn't perfectly match 10 digit classes
3. **Dimensionality Challenge**: 784 dimensions make clustering computationally expensive
4. **Visualization Value**: t-SNE helps understand cluster relationships
5. **Evaluation Complexity**: Unsupervised learning lacks ground truth for direct comparison

### Theoretical Understanding
- **Unsupervised Learning**: No labels, must discover structure in data
- **Clustering Assumptions**: K-means assumes spherical clusters, DBSCAN handles arbitrary shapes
- **Curse of Dimensionality**: High dimensions make distance metrics less meaningful
- **Dimensionality Reduction**: Essential for both computation and visualization

## Best Practices Demonstrated

1. **Data Normalization**: Proper pixel value scaling
2. **Dimensionality Reduction**: PCA before clustering for efficiency
3. **Multiple Algorithms**: Comparison of different clustering approaches
4. **Visualization**: t-SNE for understanding cluster structure
5. **Evaluation Metrics**: Multiple metrics for comprehensive assessment
6. **Centroid Analysis**: Understanding cluster representatives
7. **Parameter Exploration**: Testing different cluster numbers and DBSCAN parameters
8. **Reproducibility**: Fixed random states throughout
