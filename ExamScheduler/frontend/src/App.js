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
          <div className="city-logo">
            <span>C</span><span>i</span><span>t</span><span>y</span>
            <span> </span>
            <span>E</span><span>x</span><span>a</span><span>m</span>
            <span> </span>
            <span>S</span><span>c</span><span>h</span><span>e</span><span>d</span><span>u</span><span>l</span><span>e</span><span>r</span>
          </div>
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