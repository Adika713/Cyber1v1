
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameLobbyPage from './pages/GameLobbyPage';
import GamePage from './pages/GamePage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lobby/:gameId" element={<GameLobbyPage />} />
              <Route path="/game/:lobbyId" element={<GamePage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
