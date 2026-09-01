import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import JobMatch from './pages/JobMatch';
import Interview from './pages/Interview';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Templates from './pages/Templates';
import Builder from './pages/Builder';

export default function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/analysis/:id" element={<Analysis />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/job-match" element={<JobMatch />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Chatbot />
          <Footer />
        </div>
      </Router>
    </ResumeProvider>
  );
}
