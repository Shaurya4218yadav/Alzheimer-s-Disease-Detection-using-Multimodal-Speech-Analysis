Problem Statement

Alzheimer’s disease is often diagnosed late, when cognitive decline is already significant. Early detection is difficult because traditional methods are expensive, time-consuming, and not easily accessible.

This project aims to detect early signs of Alzheimer’s using speech patterns, which are non-invasive and scalable.

Solution Overview

This system analyzes both:

How you speak (acoustic features)
What you say (linguistic features)

These are processed using a hybrid deep learning model (CNN + LSTM) to classify users into:

Normal
Early Cognitive Impairment
High Alzheimer Risk
⚙️ System Pipeline
1. Audio Preprocessing
Noise reduction (STFT + spectral gating)
Silence trimming
Normalization (Z-score)
2. Acoustic Feature Extraction
MFCC (40 coefficients)
Pause duration
Speech rate
Zero-crossing rate
Chroma features
3. Linguistic Feature Extraction
Speech-to-text transcription
Tokenization + POS tagging
Word embeddings (Word2Vec / BERT)
Repetition & hesitation detection
Lexical diversity
Sentence complexity
4. Model Architecture
CNN branch → processes acoustic features
LSTM branch → processes linguistic sequences
Feature fusion → Dense layers → Softmax classification
5. Output
Risk category
Probability scores
Confidence level
   Model Architecture (Simplified)
Audio → CNN ┐
             ├ → Fusion → Dense → Output (3 classes)
Text → LSTM ┘
   Evaluation Metrics
Accuracy
Precision
Recall
F1 Score
ROC-AUC
   Training Details
Optimizer: Adam
Learning Rate: 0.001
Batch Size: 32
Epochs: 100
Loss: Categorical Cross-Entropy
Early stopping + LR decay used
   Tech Stack
Python
TensorFlow / PyTorch (mention what you actually used—don’t lie)
Librosa (audio processing)
NLP tools (NLTK / SpaCy / Transformers)
Speech-to-text engine
   Project Structure
├── data/
├── models/
├── preprocessing/
├── feature_extraction/
├── training/
├── inference/
├── app/ (if you built UI)
├── README.md
 How to Run
git clone <repo-link>
cd <repo-name>
pip install -r requirements.txt
python main.py



 Limitations 
Depends heavily on audio quality
Speech-to-text errors affect accuracy
Requires diverse dataset for generalization
Not a medical diagnostic tool
 Future Improvements
Real-time mobile app
Larger multilingual dataset
Integration with wearable/clinical data
Explainable AI for predictions
