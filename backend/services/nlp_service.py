import re
import random

class NLPService:
    """
    NLP processing service for linguistic feature extraction
    Simulates speech-to-text and extracts linguistic patterns
    """

    def __init__(self):
        # Mock transcripts for demonstration
        self.mock_transcripts = [
            "I went to the store and then I forgot what I needed. The store was, uh, you know, the place where they sell things.",
            "Yesterday I was trying to remember where I put my keys. I looked everywhere but I couldn't find them. Then I found them in the refrigerator.",
            "My daughter came to visit. She brought some food. We had a nice time together. I can't remember what we talked about though.",
            "The weather is nice today. I like when it's sunny. What was I saying? Oh yes, the weather.",
            "I need to take my medicine. What time is it? I think I already took it. Or did I? I'm not sure."
        ]

    def process_audio(self, audio_path):
        """
        Process audio and extract linguistic features
        In a real system, this would use speech-to-text API

        Args:
            audio_path: Path to audio file

        Returns:
            dict with transcript and linguistic features
        """
        # Mock speech-to-text
        transcript = self._mock_speech_to_text(audio_path)

        # Extract linguistic features
        features = self._extract_linguistic_features(transcript)

        return {
            'transcript': transcript,
            'features': features
        }

    def _mock_speech_to_text(self, audio_path):
        """
        Mock speech-to-text conversion
        Returns a random transcript for demonstration
        """
        return random.choice(self.mock_transcripts)

    def _extract_linguistic_features(self, transcript):
        """
        Extract linguistic features from transcript
        """
        # Tokenization
        tokens = self._tokenize(transcript)

        # Word count
        word_count = len(tokens)

        # Lexical diversity (unique words / total words)
        unique_words = len(set(tokens))
        lexical_diversity = unique_words / word_count if word_count > 0 else 0

        # Repetition detection
        repetition_score = self._detect_repetition(tokens)

        # Hesitation markers (um, uh, you know, etc.)
        hesitation_count = self._count_hesitations(transcript)

        # Sentence complexity (average words per sentence)
        complexity_score = self._calculate_complexity(transcript, word_count)

        # Detect memory-related phrases
        memory_phrases = self._detect_memory_phrases(transcript)

        return {
            'token_count': word_count,
            'unique_words': unique_words,
            'lexical_diversity': round(lexical_diversity, 3),
            'repetition_score': round(repetition_score, 3),
            'hesitation_count': hesitation_count,
            'complexity_score': round(complexity_score, 2),
            'memory_related_phrases': memory_phrases
        }

    def _tokenize(self, text):
        """Simple tokenization"""
        # Remove punctuation and convert to lowercase
        text = re.sub(r'[^\w\s]', '', text.lower())
        tokens = text.split()
        return tokens

    def _detect_repetition(self, tokens):
        """
        Calculate repetition score
        Higher score indicates more repetition
        """
        if len(tokens) < 2:
            return 0

        # Count repeated consecutive words
        repetitions = 0
        for i in range(len(tokens) - 1):
            if tokens[i] == tokens[i + 1]:
                repetitions += 1

        # Count word frequency
        word_freq = {}
        for token in tokens:
            word_freq[token] = word_freq.get(token, 0) + 1

        # Calculate repetition score
        max_freq = max(word_freq.values()) if word_freq else 1
        repetition_score = (repetitions + (max_freq - 1)) / len(tokens)

        return repetition_score

    def _count_hesitations(self, text):
        """Count hesitation markers"""
        hesitation_markers = ['um', 'uh', 'er', 'ah', 'you know', 'like', 'I mean']
        text_lower = text.lower()

        count = 0
        for marker in hesitation_markers:
            count += text_lower.count(marker)

        return count

    def _calculate_complexity(self, text, word_count):
        """
        Calculate sentence complexity
        Based on average words per sentence
        """
        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if len(sentences) == 0:
            return 0

        # Average words per sentence
        avg_words_per_sentence = word_count / len(sentences)

        return avg_words_per_sentence

    def _detect_memory_phrases(self, text):
        """Detect phrases related to memory problems"""
        memory_keywords = [
            'forgot', 'forget', "can't remember", 'cannot remember',
            "don't remember", 'memory', 'confused', "I'm not sure"
        ]

        text_lower = text.lower()
        detected = []

        for keyword in memory_keywords:
            if keyword in text_lower:
                detected.append(keyword)

        return detected

    def get_feature_summary(self, features):
        """Get human-readable summary for UI"""
        summary = {
            'Total Words': features['token_count'],
            'Unique Words': features['unique_words'],
            'Lexical Diversity': f"{features['lexical_diversity']:.3f}",
            'Repetition Score': f"{features['repetition_score']:.3f}",
            'Hesitation Count': features['hesitation_count'],
            'Sentence Complexity': f"{features['complexity_score']:.2f} words/sentence",
            'Memory-Related Phrases': len(features['memory_related_phrases'])
        }
        return summary
