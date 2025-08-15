
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame';
import { useAuth } from '../../hooks/useAuth';
import CyberButton from '../ui/CyberButton';

const PostGameModal: React.FC = () => {
  const { activeGameState, requestRematch, leaveGame } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!activeGameState || !activeGameState.isGameOver || !user) return null;

  const { winner, lobby, rematchRequestedBy, opponentDeclinedRematch } = activeGameState;

  let resultMessage = '';
  if (winner === 'draw') {
    resultMessage = "Döntetlen!";
  } else if (winner?.user.id === user.id) {
    resultMessage = 'Győztél!';
  } else {
    resultMessage = 'Vesztettél!';
  }
  
  const handleReturnToLobby = () => {
    navigate(`/lobby/${lobby.gameId}`);
    leaveGame();
  };
  
  const handleRematch = () => {
    requestRematch(lobby.id);
  };

  const isRematchButtonDisabled = !!rematchRequestedBy || opponentDeclinedRematch;
  const rematchButtonText = () => {
    if(opponentDeclinedRematch) return "Ellenfél kilépett";
    if(rematchRequestedBy === user.id) return "Várakozás az ellenfélre...";
    if(rematchRequestedBy) return "Ellenfeled visszavágót szeretne!";
    return "Visszavágó";
  };


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-surface border-2 border-cyber-border w-full max-w-md p-8 text-center">
        <h2 className="font-orbitron text-4xl font-bold text-cyber-primary mb-4">{resultMessage}</h2>
        {opponentDeclinedRematch && <p className="text-cyber-text-dim mb-4">Ellenfeled visszautasította a visszavágót és visszatért a szobákhoz.</p>}
        <div className="flex justify-center gap-4 mt-8">
          <CyberButton 
            variant="secondary" 
            onClick={handleRematch}
            disabled={isRematchButtonDisabled}
          >
            {rematchButtonText()}
          </CyberButton>
          <CyberButton variant="ghost" onClick={handleReturnToLobby}>
            Vissza a szobákhoz
          </CyberButton>
        </div>
      </div>
    </div>
  );
};

export default PostGameModal;
