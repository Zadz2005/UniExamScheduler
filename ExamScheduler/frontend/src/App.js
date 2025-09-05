import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ExamSearch from './components/ExamSearch';
import ExamDetail from './components/ExamDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Exam Scheduler</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<ExamSearch />} />
            <Route path="/exam/:name/:title" element={<ExamDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;