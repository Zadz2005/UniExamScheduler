import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamSearch.css';

const ExamSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // API base URL - adjust this to match your Spring Boot server
  const API_BASE_URL = 'http://localhost:8080/api/v1/exam';

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Fetch suggestions as user types
  const fetchSuggestions = async (term) => {
    if (!term.trim() || term.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}?name=${encodeURIComponent(term)}`);
      const examNames = [...new Set(response.data.map(exam => exam.name))]; // Get unique exam names
      setSuggestions(examNames.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.trim()) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    searchInputRef.current.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

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

  // Handle exam click
  const handleExamClick = (exam) => {
    const encodedName = encodeURIComponent(exam.name);
    const encodedTitle = encodeURIComponent(exam.title);
    navigate(`/exam/${encodedName}/${encodedTitle}`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      
      <div className="search-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type exam name (e.g., 'A' for suggestions)..."
              className="search-input"
              autoComplete="off"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div ref={suggestionsRef} className="suggestions-dropdown">
            {suggestionsLoading ? (
              <div className="suggestion-item loading-suggestion">
                <span>Loading suggestions...</span>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <span className="suggestion-text">{suggestion}</span>
                  <span className="suggestion-hint">Click to select</span>
                </div>
              ))
            ) : searchTerm.length > 0 ? (
              <div className="suggestion-item no-suggestions">
                <span>No suggestions found</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

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
          Start typing an exam name to see suggestions, or enter a complete name to search.
        </div>
      )}
    </div>
  );
};

export default ExamSearch;
