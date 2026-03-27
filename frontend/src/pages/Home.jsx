import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="card">
        <h2 className="text-3xl font-bold mb-4">Welcome to the Early Alzheimer Detection System</h2>
        <p className="text-gray-700 mb-4">
          This AI-powered system uses multimodal speech analysis to detect early signs of Alzheimer's disease.
          Our hybrid CNN-LSTM model analyzes both acoustic and linguistic features from speech samples.
        </p>
        <div className="flex space-x-4 mt-6">
          <Link to="/upload" className="btn-primary">
            Start Analysis
          </Link>
          <Link to="/history" className="btn-secondary">
            View History
          </Link>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Acoustic Analysis</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Analyzes speech patterns including MFCC, speech rate, pause duration, and spectral features.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Linguistic Analysis</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Examines vocabulary, repetition, hesitation patterns, and sentence complexity.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Prediction</h3>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Hybrid CNN-LSTM model provides risk classification with confidence scores.
          </p>
        </div>
      </div>

      {/* Statistics */}
      {!loading && stats && (
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">System Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Total Predictions</p>
              <p className="text-3xl font-bold text-primary">{stats.total_predictions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Average Confidence</p>
              <p className="text-3xl font-bold text-primary">
                {(stats.average_confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Risk Distribution</p>
              <div className="text-sm space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>Normal:</span>
                  <span className="font-semibold">{stats.risk_distribution['Normal'] || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>ECI:</span>
                  <span className="font-semibold">{stats.risk_distribution['Early Cognitive Impairment'] || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk:</span>
                  <span className="font-semibold">{stats.risk_distribution['High Alzheimer Risk'] || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">How It Works</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold mb-1">Upload or Record Audio</h4>
              <p className="text-gray-600 text-sm">
                Provide a speech sample (30-60 seconds recommended)
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold mb-1">Audio Preprocessing</h4>
              <p className="text-gray-600 text-sm">
                System cleans audio, removes noise, and normalizes the signal
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold mb-1">Feature Extraction</h4>
              <p className="text-gray-600 text-sm">
                Extracts acoustic features (MFCC, speech rate, pauses) and linguistic features (vocabulary, complexity)
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold mb-1">AI Analysis</h4>
              <p className="text-gray-600 text-sm">
                Hybrid CNN-LSTM model processes features and generates prediction
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              5
            </div>
            <div>
              <h4 className="font-bold mb-1">Results & Recommendations</h4>
              <p className="text-gray-600 text-sm">
                Receive risk classification, confidence score, and personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="text-lg font-bold mb-2 text-yellow-800">Important Disclaimer</h3>
        <p className="text-sm text-yellow-700">
          This system is a prototype for demonstration and research purposes only. It is NOT a medical diagnostic tool
          and should not be used for clinical decision-making. Always consult with qualified healthcare professionals
          for proper medical evaluation and diagnosis.
        </p>
      </div>
    </div>
  );
};

export default Home;
