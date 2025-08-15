
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame';
import CyberButton from '../ui/CyberButton';
import CyberInput from '../ui/CyberInput';
import { X } from 'lucide-react';
import { GameId } from '../../types';

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: GameId;
}

const CreateLobbyModal: React.FC<CreateLobbyModalProps> = ({ isOpen, onClose, gameId }) => {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { createLobby } = useGame();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const newLobby = await createLobby(name, isPrivate, password, gameId);
      onClose();
      navigate(`/game/${newLobby.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nem sikerült létrehozni a szobát');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-cyber-surface border-2 border-cyber-border w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-cyber-text-dim hover:text-cyber-primary">
          <X size={24} />
        </button>
        <h2 className="font-orbitron text-2xl font-bold text-cyber-primary mb-4">Szoba Létrehozása</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CyberInput
            label="Szoba Neve"
            id="lobbyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 bg-cyber-surface border-cyber-border text-cyber-primary focus:ring-cyber-primary"
            />
            <label htmlFor="isPrivate" className="text-cyber-text-dim">Privát Szoba</label>
          </div>
          {isPrivate && (
            <CyberInput
              label="Jelszó"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <CyberButton type="submit" variant="primary" className="w-full">
            Létrehozás
          </CyberButton>
        </form>
      </div>
    </div>
  );
};

export default CreateLobbyModal;
