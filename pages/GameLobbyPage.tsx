
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import { Lobby, GameId } from '../types';
import { Lock, Users, PlusCircle, ArrowLeft } from 'lucide-react';
import CyberButton from '../components/ui/CyberButton';
import CreateLobbyModal from '../components/modals/CreateLobbyModal';
import AuthModal from '../components/modals/AuthModal';

const GameLobbyPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: GameId }>();
  const { games, lobbies, fetchLobbies, joinLobby } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [joiningLobbyId, setJoiningLobbyId] = useState<string | null>(null);

  const game = games.find(g => g.id === gameId);

  useEffect(() => {
    if (gameId) {
      fetchLobbies(gameId);
      const interval = setInterval(() => fetchLobbies(gameId), 5000); // Poll for lobbies
      return () => clearInterval(interval);
    }
  }, [gameId, fetchLobbies]);

  const handleJoinLobby = async (lobby: Lobby) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setJoiningLobbyId(lobby.id);
    try {
        let password = '';
        if (lobby.isPrivate) {
            password = prompt('Add meg a szoba jelszavát:') || '';
        }
        await joinLobby(lobby.id, password);
        navigate(`/game/${lobby.id}`);
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Nem sikerült csatlakozni a szobához');
    } finally {
        setJoiningLobbyId(null);
    }
  };
  
  const handleCreateLobbyClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setCreateModalOpen(true);
    }
  };

  if (!game) {
    return <div>A játék nem található.</div>;
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="flex items-center gap-2 text-cyber-text-dim hover:text-cyber-primary mb-6 transition-colors">
        <ArrowLeft size={20} />
        Vissza a játékokhoz
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
            <h1 className="font-orbitron text-4xl font-bold uppercase text-cyber-primary">{game.name} Szobák</h1>
            <p className="text-cyber-text-dim mt-2">Csatlakozz egy meglévő szobához, vagy hozz létre egy újat.</p>
        </div>
        <CyberButton onClick={handleCreateLobbyClick} className="mt-4 md:mt-0">
          <PlusCircle size={20} className="inline mr-2" />
          Szoba Létrehozása
        </CyberButton>
      </div>

      <div className="space-y-4">
        {lobbies.length > 0 ? lobbies.map(lobby => (
          <div key={lobby.id} className="bg-cyber-surface border-2 border-cyber-border p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-cyber-text flex items-center gap-2">
                {lobby.isPrivate && <Lock size={16} className="text-cyber-accent" />}
                {lobby.name}
              </h3>
              <p className="text-sm text-cyber-text-dim">Host: {lobby.host.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-cyber-text-dim">
                <Users size={18} />
                <span>{lobby.players.length}/{lobby.maxPlayers}</span>
              </div>
              <CyberButton 
                variant="secondary" 
                onClick={() => handleJoinLobby(lobby)}
                disabled={lobby.players.length >= lobby.maxPlayers || !!joiningLobbyId}
              >
                {joiningLobbyId === lobby.id ? 'Csatlakozás...' : 'Csatlakozás'}
              </CyberButton>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-cyber-surface border-2 border-dashed border-cyber-border">
            <h3 className="text-xl font-bold text-cyber-text-dim">Nincsenek aktív szobák</h3>
            <p className="text-cyber-text-dim mt-2">Hozz létre egyet elsőként!</p>
          </div>
        )}
      </div>

      {gameId && <CreateLobbyModal gameId={gameId} isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default GameLobbyPage;
