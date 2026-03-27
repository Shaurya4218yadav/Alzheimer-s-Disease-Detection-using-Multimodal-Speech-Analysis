import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const Admin = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.7);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modelResponse, statsResponse] = await Promise.all([
        apiService.getModelInfo(),
        apiService.getStats()
      ]);

      if (modelResponse.success) {
        setModelInfo(modelResponse);
        setThreshold(modelResponse.metadata.threshold);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrainModel = async () => {
    setProcessing(true);
    setMessage(null);

    try {
      const response = await apiService.retrainModel();

      if (response.success) {
        setMessage({ type: 'success', text: 'Model retrained successfully!' });
        await fetchData();
      } else {
        setMessage({ type: 'error', text: response.error || 'Retraining failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to retrain model' });
    } finally {
      setProcessing(false);
    }
  };

  const handleResetModel = async () => {
    if (!window.confirm('Are you sure you want to reset the model to default state?')) {
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      const response = await apiService.resetModel();

      if (response.success) {
        setMessage({ type: 'success', text: 'Model reset to default state' });
        await fetchData();
      } else {
        setMessage({ type: 'error', text: response.error || 'Reset failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset model' });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateThreshold = async () => {
    setProcessing(true);
    setMessage(null);

    try {
      const response = await apiService.updateThreshold(threshold);

      if (response.success) {
        setMessage({ type: 'success', text: `Threshold updated to ${threshold}` });
        await fetchData();
      } else {
        setMessage({ type: 'error', text: response.error || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update threshold' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
        <p className="text-gray-600">Model management and system configuration</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`card mb-6 ${
          message.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Model Information */}
      {modelInfo && (
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">Model Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Model Type</p>
              <p className="text-lg font-bold">{modelInfo.model.type}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Version</p>
              <p className="text-lg font-bold">{modelInfo.model.version}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Parameters</p>
              <p className="text-lg font-bold">{modelInfo.model.parameters}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-lg font-bold text-primary">
                {(modelInfo.metadata.accuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Trained</p>
                <p className="font-semibold">
                  {new Date(modelInfo.metadata.last_trained).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Weights Status</p>
                <p className="font-semibold">
                  {modelInfo.model.weights_loaded ? (
                    <span className="text-green-600">✓ Loaded</span>
                  ) : (
                    <span className="text-red-600">✗ Not Loaded</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Statistics */}
      {stats && (
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">System Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary text-white p-6 rounded-lg">
              <p className="text-sm mb-2 opacity-90">Total Predictions</p>
              <p className="text-4xl font-bold">{stats.total_predictions}</p>
            </div>
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <p className="text-sm mb-2 opacity-90">Average Confidence</p>
              <p className="text-4xl font-bold">{(stats.average_confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-blue-700 text-white p-6 rounded-lg">
              <p className="text-sm mb-2 opacity-90">Risk Distribution</p>
              <div className="text-sm space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>Normal:</span>
                  <span className="font-bold">{stats.risk_distribution['Normal'] || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>ECI:</span>
                  <span className="font-bold">{stats.risk_distribution['Early Cognitive Impairment'] || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk:</span>
                  <span className="font-bold">{stats.risk_distribution['High Alzheimer Risk'] || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Controls */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">Model Controls</h3>

        {/* Threshold Control */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-3">Confidence Threshold</h4>
          <p className="text-sm text-gray-600 mb-4">
            Set the minimum confidence level required for predictions. Higher values increase precision but may reduce sensitivity.
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="flex-1"
            />
            <div className="w-20 text-center">
              <span className="text-2xl font-bold text-primary">{threshold.toFixed(2)}</span>
            </div>
            <button
              onClick={handleUpdateThreshold}
              disabled={processing}
              className="btn-primary"
            >
              Update
            </button>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Low (0.00)</span>
            <span>Medium (0.50)</span>
            <span>High (1.00)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3 mb-3">
              <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="flex-1">
                <h4 className="font-bold mb-1">Retrain Model</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Simulate model retraining with updated data. This will generate new accuracy metrics.
                </p>
                <button
                  onClick={handleRetrainModel}
                  disabled={processing}
                  className="btn-primary w-full"
                >
                  {processing ? 'Retraining...' : 'Retrain Model'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-start space-x-3 mb-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h4 className="font-bold mb-1">Reset Model</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Reset model to default state. This will restore default accuracy and threshold values.
                </p>
                <button
                  onClick={handleResetModel}
                  disabled={processing}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors w-full"
                >
                  {processing ? 'Resetting...' : 'Reset Model'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Architecture Preview */}
      {modelInfo && (
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">Model Architecture</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre">
              {modelInfo.diagram}
            </pre>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="text-lg font-bold mb-2 text-yellow-800">Admin Notice</h3>
        <p className="text-sm text-yellow-700">
          This is a demonstration admin panel for a prototype system. Changes made here will affect
          model predictions but are for testing and demonstration purposes only. In a production system,
          model retraining would require proper data validation, testing, and approval processes.
        </p>
      </div>
    </div>
  );
};

export default Admin;
