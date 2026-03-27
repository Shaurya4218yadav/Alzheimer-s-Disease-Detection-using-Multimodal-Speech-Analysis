import numpy as np
import json

class ModelService:
    """
    Mock Hybrid CNN-LSTM Model Service
    Simulates a deep learning model for Alzheimer detection
    """

    def __init__(self):
        self.model_version = "v1.0.0"
        self.architecture = self._define_architecture()
        self.weights_loaded = True

    def _define_architecture(self):
        """
        Define mock model architecture
        Returns architecture description for visualization
        """
        architecture = {
            "model_type": "Hybrid CNN-LSTM",
            "branches": [
                {
                    "name": "CNN Branch (Acoustic Features)",
                    "layers": [
                        {"type": "Input", "shape": "(40, 100, 1)", "description": "MFCC features"},
                        {"type": "Conv1D", "filters": 64, "kernel_size": 3, "activation": "relu"},
                        {"type": "MaxPooling1D", "pool_size": 2},
                        {"type": "Conv1D", "filters": 128, "kernel_size": 3, "activation": "relu"},
                        {"type": "MaxPooling1D", "pool_size": 2},
                        {"type": "Conv1D", "filters": 256, "kernel_size": 3, "activation": "relu"},
                        {"type": "GlobalAveragePooling1D"},
                        {"type": "Dense", "units": 128, "activation": "relu"}
                    ]
                },
                {
                    "name": "LSTM Branch (Linguistic Features)",
                    "layers": [
                        {"type": "Input", "shape": "(50,)", "description": "Word embeddings"},
                        {"type": "Embedding", "input_dim": 10000, "output_dim": 128},
                        {"type": "LSTM", "units": 128, "return_sequences": True},
                        {"type": "Dropout", "rate": 0.3},
                        {"type": "LSTM", "units": 64},
                        {"type": "Dense", "units": 64, "activation": "relu"}
                    ]
                }
            ],
            "fusion": [
                {"type": "Concatenate", "description": "Merge CNN and LSTM outputs"},
                {"type": "Dense", "units": 128, "activation": "relu"},
                {"type": "Dropout", "rate": 0.5},
                {"type": "Dense", "units": 64, "activation": "relu"},
                {"type": "Dense", "units": 3, "activation": "softmax", "description": "Output: 3 classes"}
            ],
            "output_classes": [
                "Normal",
                "Early Cognitive Impairment",
                "High Alzheimer Risk"
            ],
            "total_parameters": "~2.5M parameters"
        }
        return architecture

    def predict(self, acoustic_features, linguistic_features):
        """
        Mock prediction using rule-based logic and random components

        Args:
            acoustic_features: Dict of acoustic features
            linguistic_features: Dict of linguistic features

        Returns:
            dict with class probabilities
        """
        # Extract key indicators
        speech_rate = acoustic_features.get('speech_rate', 3.0)
        pause_duration = acoustic_features.get('pause_duration', 0.3)
        lexical_diversity = linguistic_features.get('lexical_diversity', 0.7)
        repetition_score = linguistic_features.get('repetition_score', 0.1)
        hesitation_count = linguistic_features.get('hesitation_count', 1)
        memory_phrases = len(linguistic_features.get('memory_related_phrases', []))

        # Calculate risk score (0-1)
        risk_score = 0.0

        # Lower speech rate indicates potential issues
        if speech_rate < 2.5:
            risk_score += 0.15

        # Higher pause duration indicates hesitation
        if pause_duration > 0.5:
            risk_score += 0.15

        # Lower lexical diversity indicates vocabulary problems
        if lexical_diversity < 0.5:
            risk_score += 0.2

        # Higher repetition indicates memory issues
        if repetition_score > 0.15:
            risk_score += 0.2

        # Hesitation markers
        if hesitation_count > 3:
            risk_score += 0.15

        # Memory-related phrases strongly indicate issues
        if memory_phrases > 0:
            risk_score += 0.15 * memory_phrases

        # Add small random component for variation
        risk_score += np.random.uniform(-0.1, 0.1)

        # Clip to [0, 1]
        risk_score = np.clip(risk_score, 0, 1)

        # Convert to class probabilities
        if risk_score < 0.35:
            # Normal
            prob_normal = 0.6 + np.random.uniform(0, 0.25)
            prob_eci = np.random.uniform(0.1, 0.25)
            prob_high = 1.0 - prob_normal - prob_eci
        elif risk_score < 0.65:
            # Early Cognitive Impairment
            prob_eci = 0.5 + np.random.uniform(0, 0.3)
            prob_normal = np.random.uniform(0.15, 0.35)
            prob_high = 1.0 - prob_normal - prob_eci
        else:
            # High Alzheimer Risk
            prob_high = 0.5 + np.random.uniform(0, 0.35)
            prob_eci = np.random.uniform(0.15, 0.35)
            prob_normal = 1.0 - prob_high - prob_eci

        # Normalize to ensure sum = 1
        total = prob_normal + prob_eci + prob_high
        prob_normal /= total
        prob_eci /= total
        prob_high /= total

        probabilities = {
            "Normal": round(float(prob_normal), 4),
            "Early Cognitive Impairment": round(float(prob_eci), 4),
            "High Alzheimer Risk": round(float(prob_high), 4)
        }

        return probabilities

    def get_architecture(self):
        """Return model architecture for visualization"""
        return self.architecture

    def get_architecture_diagram(self):
        """
        Return ASCII diagram of model architecture for UI display
        """
        diagram = """
┌─────────────────────────────────────────────────┐
│         HYBRID CNN-LSTM ARCHITECTURE            │
└─────────────────────────────────────────────────┘

    Acoustic Features              Linguistic Features
         (MFCC)                      (Word Embeddings)
            │                               │
            ▼                               ▼
    ┌──────────────┐              ┌──────────────┐
    │   Conv1D(64) │              │ Embedding(128)│
    │   + ReLU     │              └──────┬────────┘
    └──────┬───────┘                     │
           │                             ▼
           ▼                      ┌──────────────┐
    ┌──────────────┐              │  LSTM(128)   │
    │ MaxPooling1D │              │  + Dropout   │
    └──────┬───────┘              └──────┬────────┘
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │  Conv1D(128) │              │  LSTM(64)    │
    └──────┬───────┘              └──────┬────────┘
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │  Conv1D(256) │              │  Dense(64)   │
    └──────┬───────┘              └──────┬────────┘
           │                             │
           └─────────┬───────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Concatenate   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Dense(128)    │
            │   + ReLU        │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Dropout(0.5)  │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Dense(64)     │
            │   + ReLU        │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Dense(3)      │
            │   + Softmax     │
            └────────┬────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Classification       │
        │   ─────────────────    │
        │   • Normal             │
        │   • Early Cognitive    │
        │     Impairment         │
        │   • High Alzheimer     │
        │     Risk               │
        └────────────────────────┘
        """
        return diagram

    def retrain(self):
        """
        Mock model retraining
        Returns training metrics
        """
        # Simulate training
        epochs = 100
        history = {
            'accuracy': [],
            'val_accuracy': [],
            'loss': [],
            'val_loss': []
        }

        # Generate mock training history
        for epoch in range(epochs):
            acc = 0.3 + (0.57 * (epoch / epochs)) + np.random.uniform(-0.02, 0.02)
            val_acc = 0.25 + (0.62 * (epoch / epochs)) + np.random.uniform(-0.03, 0.03)
            loss = 1.2 - (0.9 * (epoch / epochs)) + np.random.uniform(-0.05, 0.05)
            val_loss = 1.3 - (0.85 * (epoch / epochs)) + np.random.uniform(-0.06, 0.06)

            history['accuracy'].append(round(float(acc), 4))
            history['val_accuracy'].append(round(float(val_acc), 4))
            history['loss'].append(round(float(loss), 4))
            history['val_loss'].append(round(float(val_loss), 4))

        final_metrics = {
            'accuracy': history['accuracy'][-1],
            'val_accuracy': history['val_accuracy'][-1],
            'loss': history['loss'][-1],
            'val_loss': history['val_loss'][-1]
        }

        return {
            'success': True,
            'history': history,
            'metrics': final_metrics
        }

    def get_model_info(self):
        """Return model information"""
        return {
            'version': self.model_version,
            'type': 'Hybrid CNN-LSTM',
            'parameters': '~2.5M',
            'input_shapes': {
                'acoustic': '(40, 100, 1)',
                'linguistic': '(50,)'
            },
            'output_classes': 3,
            'weights_loaded': self.weights_loaded
        }
