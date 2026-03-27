import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Processing = () => {
  const { audioId } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [stage, setStage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const stages = [
    { id: 1, name: 'Preprocessing', description: 'Cleaning and normalizing audio...' },
    { id: 2, name: 'Feature Extraction', description: 'Extracting acoustic features...' },
    { id: 3, name: 'NLP Analysis', description: 'Analyzing linguistic patterns...' },
    { id: 4, name: 'Model Prediction', description: 'Running hybrid CNN-LSTM model...' },
    { id: 5, name: 'Complete', description: 'Analysis complete!' }
  ];

  useEffect(() => {
    const processAudio = async () => {
      try {
        // Simulate processing stages
        for (let i = 1; i <= 4; i++) {
          setStage(i);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Process audio
        const response = await apiService.processAudio(audioId);

        if (response.success) {
          setStage(5);
          setResult(response);
          setProcessing(false);

          // Navigate to results after 1 second
          setTimeout(() => {
            navigate(`/result/${audioId}`, { state: { result: response } });
          }, 1000);
        } else {
          setError(response.error || 'Processing failed');
          setProcessing(false);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to process audio');
        setProcessing(false);
      }
    };

    processAudio();
  }, [audioId, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold mb-2">Processing Audio Sample</h2>
        <p className="text-gray-600 mb-8">
          Please wait while we analyze your audio through our processing pipeline...
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-700">Processing Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Stages */}
        <div className="space-y-4">
          {stages.map((s) => (
            <div
              key={s.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                stage === s.id
                  ? 'bg-primary text-white'
                  : stage > s.id
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {stage > s.id ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : stage === s.id ? (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-400 border-2 border-gray-300`}>
                    {s.id}
                  </div>
                )}
              </div>

              {/* Stage Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{s.name}</h3>
                <p className={`text-sm ${stage === s.id ? 'text-white' : stage > s.id ? 'text-green-700' : 'text-gray-500'}`}>
                  {s.description}
                </p>
              </div>

              {/* Status Badge */}
              {stage > s.id && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Complete
                </div>
              )}
              {stage === s.id && (
                <div className="bg-white text-primary px-3 py-1 rounded-full text-xs font-medium">
                  Processing...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {processing && (
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">{Math.round((stage / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${(stage / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full"
            disabled={!error && processing}
          >
            {error ? 'Return to Home' : 'Cancel'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50">
        <h3 className="font-bold mb-2">What's Happening?</h3>
        <p className="text-sm text-gray-700 mb-3">
          Our system is analyzing your audio through multiple stages:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Preprocessing:</strong> Removes noise and normalizes audio</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Feature Extraction:</strong> Extracts MFCC, speech rate, pause patterns</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>NLP Analysis:</strong> Analyzes vocabulary, repetition, complexity</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary font-bold">•</span>
            <span><strong>Model Prediction:</strong> Hybrid CNN-LSTM generates risk assessment</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Processing;
