import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './Pages/Lobby/Lobby';
import Meeting from './Pages/Meeting/Meeting'; // Import Meeting component
import { StreamProvider } from './Context/StreamContext';

function App() {
  return (
    <StreamProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/meeting" element={<Meeting />} />
        </Routes>
      </Router>
    </StreamProvider>
  );
}

export default App;
