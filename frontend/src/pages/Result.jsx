import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';

const Result = () => {
  const { audioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch result if not passed from processing page
        if (!result) {
          const response = await apiService.processAudio(audioId);
          if (response.success) {
            setResult(response);
          }
        }

        // Fetch model info for architecture display
        const modelResponse = await apiService.getModelInfo();
        if (modelResponse.success) {
          setModelInfo(modelResponse);
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [audioId, result]);

  if (loading || !result) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { prediction, acoustic_features, nlp, preprocessing } = result;

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'Normal') return 'text-green-600 bg-green-100';
    if (riskLevel === 'Early Cognitive Impairment') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.85) return 'text-green-600';
    if (confidence >= 0.70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Analysis Results</h2>
        <p className="text-gray-600">Comprehensive multimodal speech analysis report</p>
      </div>

      {/* Main Prediction */}
      <div className="card bg-gradient-to-r from-blue-50 to-white border-l-4 border-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Risk Assessment</h3>
          <span className={`px-4 py-2 rounded-full font-bold ${getRiskColor(prediction.risk_level)}`}>
            {prediction.risk_level}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-2">Confidence Score</p>
            <div className="flex items-baseline space-x-2">
              <span className={`text-4xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
              <span className="text-gray-500">({prediction.confidence_level})</span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-sm mb-2">Class Probabilities</p>
            <div className="space-y-2">
              {Object.entries(prediction.probabilities).map(([className, prob]) => (
                <div key={className} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{className}:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">Risk Factors Analysis</h3>
        <div className="space-y-3">
          {prediction.risk_factors.map((factor, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {factor.severity === 'High' && (
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {factor.severity === 'Moderate' && (
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {factor.severity === 'None' && (
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold">{factor.factor}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    factor.severity === 'High' ? 'bg-red-100 text-red-700' :
                    factor.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {factor.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{factor.description}</p>
                <p className="text-xs text-gray-500"><strong>Value:</strong> {factor.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-blue-50 border-l-4 border-blue-400">
        <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {prediction.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-800">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feature Analysis - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acoustic Features */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>Acoustic Features</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(acoustic_features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">{key}:</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linguistic Features */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>Linguistic Features</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(nlp.features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">{key}:</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Speech Transcript</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800 italic">"{nlp.transcript}"</p>
        </div>
      </div>

      {/* Model Architecture */}
      {modelInfo && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Model Architecture</h3>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre">
              {modelInfo.diagram}
            </pre>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Model Type</p>
              <p className="font-semibold">{modelInfo.model.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Version</p>
              <p className="font-semibold">{modelInfo.model.version}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Parameters</p>
              <p className="font-semibold">{modelInfo.model.parameters}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Accuracy</p>
              <p className="font-semibold">{(modelInfo.metadata.accuracy * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <Link to="/upload" className="btn-primary flex-1 text-center">
          Analyze Another Sample
        </Link>
        <Link to="/history" className="btn-secondary flex-1 text-center">
          View History
        </Link>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
        >
          Home
        </button>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="text-lg font-bold mb-2 text-yellow-800">Medical Disclaimer</h3>
        <p className="text-sm text-yellow-700">
          This is a research prototype and should NOT be used for medical diagnosis. Results are for
          demonstration purposes only. Please consult qualified healthcare professionals for proper
          medical evaluation and diagnosis of Alzheimer's disease or cognitive impairment.
        </p>
      </div>
    </div>
  );
};

export default Result;
