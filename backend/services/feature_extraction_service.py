import numpy as np
import librosa

class FeatureExtractionService:
    """
    Acoustic feature extraction service
    Extracts MFCC, speech rate, pause duration, ZCR, and chroma features
    """

    def __init__(self):
        self.sample_rate = 22050

    def extract_features(self, audio, sample_rate):
        """
        Extract all acoustic features from audio

        Args:
            audio: Audio signal array
            sample_rate: Sample rate of audio

        Returns:
            dict containing all extracted features
        """
        features = {}

        # MFCC features
        features['mfcc'] = self._extract_mfcc(audio, sample_rate)
        features['mfcc_mean'] = np.mean(features['mfcc'], axis=1).tolist()
        features['mfcc_std'] = np.std(features['mfcc'], axis=1).tolist()

        # Speech rate and pause duration
        speech_stats = self._extract_speech_rate_and_pauses(audio, sample_rate)
        features['speech_rate'] = speech_stats['speech_rate']
        features['pause_duration'] = speech_stats['pause_duration']
        features['pause_count'] = speech_stats['pause_count']

        # Zero Crossing Rate
        features['zcr'] = self._extract_zcr(audio)
        features['zcr_mean'] = float(np.mean(features['zcr']))

        # Chroma features
        features['chroma'] = self._extract_chroma(audio, sample_rate)
        features['chroma_mean'] = np.mean(features['chroma'], axis=1).tolist()

        # Additional features
        features['spectral_centroid'] = self._extract_spectral_centroid(audio, sample_rate)
        features['spectral_rolloff'] = self._extract_spectral_rolloff(audio, sample_rate)

        return features

    def _extract_mfcc(self, audio, sample_rate, n_mfcc=40):
        """Extract MFCC features"""
        mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_mfcc)
        return mfcc

    def _extract_speech_rate_and_pauses(self, audio, sample_rate):
        """
        Calculate speech rate and pause statistics
        Uses onset detection to find speech segments
        """
        # Detect onsets (speech starts)
        onset_frames = librosa.onset.onset_detect(y=audio, sr=sample_rate)
        onset_times = librosa.frames_to_time(onset_frames, sr=sample_rate)

        # Calculate speech rate (onsets per second)
        duration = len(audio) / sample_rate
        speech_rate = len(onset_frames) / duration if duration > 0 else 0

        # Detect pauses using RMS energy
        rms = librosa.feature.rms(y=audio)[0]
        threshold = np.mean(rms) * 0.2

        # Find silent frames
        silent_frames = rms < threshold

        # Calculate pause statistics
        frame_length = len(audio) / len(silent_frames)
        pause_frames = []
        pause_start = None

        for i, is_silent in enumerate(silent_frames):
            if is_silent and pause_start is None:
                pause_start = i
            elif not is_silent and pause_start is not None:
                pause_frames.append(i - pause_start)
                pause_start = None

        # Calculate average pause duration
        if pause_frames:
            avg_pause_frames = np.mean(pause_frames)
            pause_duration = (avg_pause_frames * frame_length) / sample_rate
        else:
            pause_duration = 0

        return {
            'speech_rate': round(speech_rate, 2),
            'pause_duration': round(pause_duration, 3),
            'pause_count': len(pause_frames)
        }

    def _extract_zcr(self, audio):
        """Extract Zero Crossing Rate"""
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        return zcr

    def _extract_chroma(self, audio, sample_rate):
        """Extract Chroma features"""
        chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
        return chroma

    def _extract_spectral_centroid(self, audio, sample_rate):
        """Extract spectral centroid"""
        centroid = librosa.feature.spectral_centroid(y=audio, sr=sample_rate)[0]
        return float(np.mean(centroid))

    def _extract_spectral_rolloff(self, audio, sample_rate):
        """Extract spectral rolloff"""
        rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sample_rate)[0]
        return float(np.mean(rolloff))

    def get_feature_summary(self, features):
        """
        Get human-readable summary of features for UI display
        """
        summary = {
            'MFCC': f"Extracted {len(features['mfcc_mean'])} coefficients",
            'Speech Rate': f"{features['speech_rate']} segments/sec",
            'Pause Duration': f"{features['pause_duration']:.3f} sec",
            'Pause Count': features['pause_count'],
            'Zero Crossing Rate': f"{features['zcr_mean']:.4f}",
            'Chroma Features': f"{len(features['chroma_mean'])} bins",
            'Spectral Centroid': f"{features['spectral_centroid']:.2f} Hz",
            'Spectral Rolloff': f"{features['spectral_rolloff']:.2f} Hz"
        }
        return summary
