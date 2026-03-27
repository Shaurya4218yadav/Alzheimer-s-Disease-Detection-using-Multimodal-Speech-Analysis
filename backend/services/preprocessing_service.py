import numpy as np
import librosa
import soundfile as sf
from scipy import signal
import time

class PreprocessingService:
    """
    Audio preprocessing service
    Simulates noise reduction, silence trimming, and normalization
    """

    def __init__(self):
        self.sample_rate = 22050
        self.status_updates = []

    def preprocess_audio(self, audio_path, callback=None):
        """
        Preprocess audio file with status updates

        Args:
            audio_path: Path to audio file
            callback: Optional callback function for status updates

        Returns:
            dict with processed audio info and status
        """
        self.status_updates = []

        try:
            # Load audio
            self._update_status("Loading audio file...", callback)
            time.sleep(0.5)
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)

            # Noise reduction (mock)
            self._update_status("Removing background noise...", callback)
            time.sleep(0.7)
            audio = self._noise_reduction(audio, sr)

            # Silence trimming
            self._update_status("Trimming silence...", callback)
            time.sleep(0.5)
            audio = self._trim_silence(audio)

            # Normalization
            self._update_status("Normalizing audio...", callback)
            time.sleep(0.5)
            audio = self._normalize(audio)

            self._update_status("Preprocessing complete!", callback)

            return {
                'success': True,
                'audio': audio,
                'sample_rate': sr,
                'duration': len(audio) / sr,
                'status_updates': self.status_updates
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'status_updates': self.status_updates
            }

    def _noise_reduction(self, audio, sr):
        """
        Mock noise reduction using spectral gating
        In a real system, this would use more sophisticated algorithms
        """
        # Simple high-pass filter to remove low-frequency noise
        sos = signal.butter(10, 100, 'hp', fs=sr, output='sos')
        filtered = signal.sosfilt(sos, audio)
        return filtered

    def _trim_silence(self, audio, threshold=0.01):
        """
        Trim silence from beginning and end
        """
        # Find non-silent regions
        trimmed, _ = librosa.effects.trim(audio, top_db=20)
        return trimmed

    def _normalize(self, audio):
        """
        Z-score normalization
        """
        # Normalize to [-1, 1]
        if np.max(np.abs(audio)) > 0:
            audio = audio / np.max(np.abs(audio))

        # Z-score normalization
        mean = np.mean(audio)
        std = np.std(audio)
        if std > 0:
            audio = (audio - mean) / std

        return audio

    def _update_status(self, message, callback=None):
        """Update status and call callback if provided"""
        self.status_updates.append({
            'timestamp': time.time(),
            'message': message
        })

        if callback:
            callback(message)

    def get_audio_info(self, audio_path):
        """Get basic audio file information"""
        try:
            audio, sr = librosa.load(audio_path, sr=None)
            duration = len(audio) / sr

            return {
                'success': True,
                'duration': duration,
                'sample_rate': sr,
                'channels': 1,  # librosa always loads as mono
                'samples': len(audio)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
