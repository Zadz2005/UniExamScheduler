import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamSearch.css';

const ExamSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API base URL - adjust this to match your Spring Boot server
  const API_BASE_URL = 'http://localhost:8080/api/v1/exam';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}?name=${encodeURIComponent(searchTerm)}`);
      setExams(response.data);
    } catch (err) {
      setError('Failed to fetch exams. Please check if the backend server is running.');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamClick = (exam) => {
    // Navigate to exam detail page using name and title as parameters
    const encodedName = encodeURIComponent(exam.name);
    const encodedTitle = encodeURIComponent(exam.title);
    navigate(`/exam/${encodedName}/${encodedTitle}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search for Exams</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter exam name to search..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          Searching for exams...
        </div>
      )}

      {!loading && !error && exams.length > 0 && (
        <div className="exam-list">
          <h3>Search Results ({exams.length} found)</h3>
          {exams.map((exam, index) => (
            <div
              key={`${exam.name}-${exam.title}-${index}`}
              className="exam-card"
              onClick={() => handleExamClick(exam)}
            >
              <div className="exam-name">{exam.name}</div>
              <div className="exam-title">{exam.title}</div>
              <div className="exam-info">
                <div className="exam-info-item">
                  <span className="exam-info-icon">📅</span>
                  <span>{formatDate(exam.startDate)}</span>
                </div>
                <div className="exam-info-item">
                  <span className="exam-info-icon">🕐</span>
                  <span>{formatTime(exam.startTime)}</span>
                </div>
                <div className="exam-info-item">
                  <span className="exam-info-icon">⏱️</span>
                  <span>{exam.duration || 'N/A'}</span>
                </div>
                <div className="exam-info-item">
                  <span className="exam-info-icon">📍</span>
                  <span>{exam.location || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && exams.length === 0 && searchTerm && (
        <div className="no-results">
          No exams found for "{searchTerm}". Try a different search term.
        </div>
      )}

      {!loading && !error && !searchTerm && (
        <div className="no-results">
          Enter an exam name above to search for exams.
        </div>
      )}
    </div>
  );
};

export default ExamSearch;
