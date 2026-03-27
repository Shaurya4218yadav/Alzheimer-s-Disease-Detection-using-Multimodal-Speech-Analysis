import numpy as np

class PredictionService:
    """
    Prediction service that combines all components
    Orchestrates the complete prediction pipeline
    """

    def __init__(self, model_service):
        self.model_service = model_service
        self.threshold = 0.7  # Default confidence threshold

    def make_prediction(self, acoustic_features, linguistic_features):
        """
        Make prediction using combined features

        Args:
            acoustic_features: Dict of acoustic features
            linguistic_features: Dict of linguistic features

        Returns:
            dict with prediction results
        """
        # Get probabilities from model
        probabilities = self.model_service.predict(
            acoustic_features,
            linguistic_features
        )

        # Determine risk level based on highest probability
        risk_level = max(probabilities, key=probabilities.get)
        confidence = probabilities[risk_level]

        # Classify confidence level
        if confidence >= 0.85:
            confidence_level = "Very High"
        elif confidence >= 0.70:
            confidence_level = "High"
        elif confidence >= 0.55:
            confidence_level = "Moderate"
        else:
            confidence_level = "Low"

        # Generate recommendations based on risk level
        recommendations = self._generate_recommendations(risk_level, confidence)

        # Risk factors analysis
        risk_factors = self._analyze_risk_factors(
            acoustic_features,
            linguistic_features
        )

        return {
            'risk_level': risk_level,
            'confidence': round(confidence, 4),
            'confidence_level': confidence_level,
            'probabilities': probabilities,
            'recommendations': recommendations,
            'risk_factors': risk_factors
        }

    def _generate_recommendations(self, risk_level, confidence):
        """Generate recommendations based on prediction"""
        recommendations = []

        if risk_level == "Normal":
            recommendations = [
                "Continue regular health checkups",
                "Maintain healthy lifestyle and mental activities",
                "Monitor any changes in cognitive function"
            ]
        elif risk_level == "Early Cognitive Impairment":
            recommendations = [
                "Consult with a neurologist for comprehensive evaluation",
                "Consider cognitive assessment tests",
                "Engage in brain-stimulating activities",
                "Maintain social interactions and physical exercise",
                "Monitor progression with regular checkups"
            ]
        else:  # High Alzheimer Risk
            recommendations = [
                "⚠️ Immediate consultation with a specialist recommended",
                "Comprehensive neurological evaluation needed",
                "Consider brain imaging (MRI/CT scan)",
                "Discuss treatment options with healthcare provider",
                "Create support system and care plan",
                "Regular monitoring and follow-up essential"
            ]

        if confidence < 0.7:
            recommendations.append(
                "Note: Confidence is moderate. Additional testing recommended for confirmation."
            )

        return recommendations

    def _analyze_risk_factors(self, acoustic_features, linguistic_features):
        """
        Analyze specific risk factors from features
        """
        risk_factors = []

        # Acoustic risk factors
        speech_rate = acoustic_features.get('speech_rate', 3.0)
        if speech_rate < 2.5:
            risk_factors.append({
                'factor': 'Slow Speech Rate',
                'value': f"{speech_rate:.2f} segments/sec",
                'severity': 'Moderate',
                'description': 'Speech rate is below normal range'
            })

        pause_duration = acoustic_features.get('pause_duration', 0.3)
        if pause_duration > 0.5:
            risk_factors.append({
                'factor': 'Long Pauses',
                'value': f"{pause_duration:.3f} sec",
                'severity': 'Moderate',
                'description': 'Extended pauses may indicate word-finding difficulties'
            })

        # Linguistic risk factors
        lexical_diversity = linguistic_features.get('lexical_diversity', 0.7)
        if lexical_diversity < 0.5:
            risk_factors.append({
                'factor': 'Low Lexical Diversity',
                'value': f"{lexical_diversity:.3f}",
                'severity': 'High',
                'description': 'Limited vocabulary usage detected'
            })

        repetition_score = linguistic_features.get('repetition_score', 0.1)
        if repetition_score > 0.15:
            risk_factors.append({
                'factor': 'High Repetition',
                'value': f"{repetition_score:.3f}",
                'severity': 'High',
                'description': 'Frequent word repetition may indicate memory issues'
            })

        hesitation_count = linguistic_features.get('hesitation_count', 1)
        if hesitation_count > 3:
            risk_factors.append({
                'factor': 'Frequent Hesitations',
                'value': f"{hesitation_count} occurrences",
                'severity': 'Moderate',
                'description': 'Multiple hesitation markers detected'
            })

        memory_phrases = linguistic_features.get('memory_related_phrases', [])
        if len(memory_phrases) > 0:
            risk_factors.append({
                'factor': 'Memory-Related Language',
                'value': f"{len(memory_phrases)} phrases",
                'severity': 'High',
                'description': f"Detected memory concerns: {', '.join(memory_phrases[:3])}"
            })

        # If no risk factors found
        if not risk_factors:
            risk_factors.append({
                'factor': 'No Significant Issues',
                'value': 'Normal',
                'severity': 'None',
                'description': 'All speech and language parameters within normal range'
            })

        return risk_factors

    def set_threshold(self, threshold):
        """Set confidence threshold for predictions"""
        self.threshold = max(0.0, min(1.0, threshold))

    def get_threshold(self):
        """Get current confidence threshold"""
        return self.threshold

    def validate_prediction(self, prediction):
        """
        Validate prediction meets confidence threshold
        """
        if prediction['confidence'] < self.threshold:
            return {
                'valid': False,
                'message': f"Confidence {prediction['confidence']:.2f} below threshold {self.threshold:.2f}",
                'recommendation': "Additional testing recommended for conclusive diagnosis"
            }

        return {
            'valid': True,
            'message': "Prediction meets confidence threshold"
        }
