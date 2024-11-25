import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GameBoard from './pages/GameBoard';
import TeamSelection from './pages/TeamSelection';
import TeamPage from './pages/TeamPage';
import { TeamsProvider } from './context/TeamsContext';

function App() {
  // Check if the URL includes /join or /team to determine if it's a contestant view
  const isContestantView = window.location.hash.includes('/join') || 
                          window.location.hash.includes('/team');

  return (
    <Router>
      <TeamsProvider>
        <Routes>
          {/* Main Game Board */}
          <Route path="/" element={<GameBoard />} />
          
          {/* Contestant Routes */}
          <Route path="/join" element={<TeamSelection />} />
          <Route path="/team/:teamName/:playerName" element={<TeamPage />} />
          
          {/* Redirect contestant 404s to join page */}
          <Route 
            path="*" 
            element={
              isContestantView ? <Navigate to="/join" replace /> : <Navigate to="/" replace />
            } 
          />
        </Routes>
      </TeamsProvider>
    </Router>
  );
}

export default App;
