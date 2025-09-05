import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamDetail.css';

const ExamDetail = () => {
  const { name, title } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust this to match your Spring Boot server
  const API_BASE_URL = 'http://localhost:8080/api/v1/exam';

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Since we need to find the exam by name and title, we'll search by name first
        // and then filter by title on the frontend
        const response = await axios.get(`${API_BASE_URL}?name=${encodeURIComponent(name)}`);
        const exams = response.data;
        
        // Find the specific exam by matching both name and title
        const foundExam = exams.find(exam => 
          exam.name === decodeURIComponent(name) && 
          exam.title === decodeURIComponent(title)
        );
        
        if (foundExam) {
          setExam(foundExam);
        } else {
          setError('Exam not found');
        }
      } catch (err) {
        setError('Failed to fetch exam details. Please check if the backend server is running.');
        console.error('Error fetching exam details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (name && title) {
      fetchExamDetails();
    }
  }, [name, title]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
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

  const addToCalendar = () => {
    if (!exam) return;

    const startDate = new Date(`${exam.startDate}T${exam.startTime}`);
    const endDate = new Date(startDate);
    
    // Parse duration (assuming format like "2:30" for 2 hours 30 minutes)
    if (exam.duration) {
      const [hours, minutes] = exam.duration.split(':').map(Number);
      endDate.setHours(endDate.getHours() + hours, endDate.getMinutes() + minutes);
    } else {
      // Default to 2 hours if no duration specified
      endDate.setHours(endDate.getHours() + 2);
    }

    const formatDateForCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDateFormatted = formatDateForCalendar(startDate);
    const endDateFormatted = formatDateForCalendar(endDate);

    // Create calendar event data
    const eventData = {
      title: `${exam.name} - ${exam.title}`,
      start: startDateFormatted,
      end: endDateFormatted,
      location: exam.location || '',
      description: `Exam: ${exam.name}\nTitle: ${exam.title}\nDuration: ${exam.duration || 'N/A'}\nLocation: ${exam.location || 'N/A'}`
    };

    // Generate calendar URLs for different platforms
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventData.title)}&startdt=${startDateFormatted}&enddt=${endDateFormatted}&body=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    
    // Create .ics file for download (universal calendar format)
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Exam Scheduler//Exam Event//EN
BEGIN:VEVENT
UID:${Date.now()}@examscheduler.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${startDateFormatted}
DTEND:${endDateFormatted}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description.replace(/\n/g, '\\n')}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`;

    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, try to open the native calendar app
      const calendarUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
      const link = document.createElement('a');
      link.href = calendarUrl;
      link.download = `${exam.name.replace(/\s+/g, '_')}_${exam.title.replace(/\s+/g, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For desktop, show options
      const choice = window.confirm(
        'Choose calendar service:\n\nOK = Google Calendar\nCancel = Download .ics file'
      );
      
      if (choice) {
        window.open(googleCalendarUrl, '_blank');
      } else {
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${exam.name.replace(/\s+/g, '_')}_${exam.title.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading">Loading exam details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Search
        </button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="detail-container">
        <div className="error">Exam not found</div>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Search
      </button>

      <div className="detail-header">
        <h1 className="detail-title">{exam.name}</h1>
        <h2 className="detail-subtitle">{exam.title}</h2>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h3>📅 Date & Time</h3>
          <div className="detail-info">
            <div className="detail-info-item">
              <span className="detail-info-label">Date:</span>
              <span className="detail-info-value">{formatDate(exam.startDate)}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-info-label">Start Time:</span>
              <span className="detail-info-value">{formatTime(exam.startTime)}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-info-label">Duration:</span>
              <span className="detail-info-value">{exam.duration || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>📍 Location</h3>
          <div className="detail-info">
            <div className="detail-info-item">
              <span className="detail-info-label">Venue:</span>
              <span className="detail-info-value">{exam.location || 'TBA'}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>ℹ️ Additional Info</h3>
          <div className="detail-info">
            <div className="detail-info-item">
              <span className="detail-info-label">Exam Name:</span>
              <span className="detail-info-value">{exam.name}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-info-label">Exam Title:</span>
              <span className="detail-info-value">{exam.title}</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={addToCalendar} className="calendar-button">
        📅 Add to Calendar
      </button>
    </div>
  );
};

export default ExamDetail;
