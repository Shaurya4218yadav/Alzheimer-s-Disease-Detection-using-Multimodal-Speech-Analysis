import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiService.getHistory(50);
        if (response.success) {
          setPredictions(response.predictions);
        } else {
          setError('Failed to load history');
        }
      } catch (err) {
        setError('Failed to fetch prediction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getRiskBadgeColor = (riskLevel) => {
    if (riskLevel === 'Normal') return 'bg-green-100 text-green-800';
    if (riskLevel === 'Early Cognitive Impairment') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading prediction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Prediction History</h2>
          <p className="text-gray-600">View all past analysis results</p>
        </div>
        <Link to="/upload" className="btn-primary">
          New Analysis
        </Link>
      </div>

      {error && (
        <div className="card bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {predictions.length === 0 ? (
        <div className="card text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No Predictions Yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your first audio sample to see predictions here
          </p>
          <Link to="/upload" className="btn-primary inline-block">
            Upload Audio
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="table-header">ID</th>
                  <th className="table-header">Filename</th>
                  <th className="table-header">Duration</th>
                  <th className="table-header">Risk Level</th>
                  <th className="table-header">Confidence</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-gray-50">
                    <td className="table-cell font-semibold">#{prediction.id}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="text-sm">{prediction.filename}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm">
                      {prediction.duration ? `${prediction.duration.toFixed(1)}s` : 'N/A'}
                    </td>
                    <td className="table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(prediction.risk_level)}`}>
                        {prediction.risk_level}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${prediction.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-gray-600">
                      {formatDate(prediction.predicted_at)}
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/result/${prediction.id}`}
                        className="text-primary hover:text-blue-700 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Predictions</p>
              <p className="text-2xl font-bold text-primary">{predictions.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Confidence</p>
              <p className="text-2xl font-bold text-primary">
                {predictions.length > 0
                  ? (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Latest Prediction</p>
              <p className="text-sm font-semibold text-gray-800">
                {predictions.length > 0 ? formatDate(predictions[0].predicted_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
