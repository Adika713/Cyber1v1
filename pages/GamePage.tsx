
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import TicTacToeBoard from '../components/games/TicTacToeBoard';
import PostGameModal from '../components/modals/PostGameModal';
import { Loader2 } from 'lucide-react';
import CyberButton from '../components/ui/CyberButton';

const GamePage: React.FC = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeGameState, getGameState, leaveGame } = useGame();

  useEffect(() => {
    if (lobbyId) {
      getGameState(lobbyId);
    }
    return () => {
        // This is a placeholder for a real API call to leave the game on the backend
        console.log("Leaving game page for lobby:", lobbyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyId]);
  
  const handleReturnToLobbyList = () => {
    if (activeGameState) {
        navigate(`/lobby/${activeGameState.lobby.gameId}`);
        leaveGame();
    } else {
        navigate('/');
        leaveGame();
    }
  };

  if (!activeGameState || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader2 className="animate-spin h-12 w-12 text-cyber-primary" />
        <p className="mt-4 text-xl text-cyber-text-dim">Játék betöltése...</p>
      </div>
    );
  }

  const { lobby, currentPlayer, isGameOver } = activeGameState;
  const isWaitingForPlayer = lobby.players.length < 2;

  const player1 = lobby.players[0];
  const player2 = lobby.players[1];

  const getStatusText = () => {
    if (isWaitingForPlayer) return "Várakozás az ellenfélre...";
    if (isGameOver) return "Játék Vége";
    if (currentPlayer?.user.id === user.id) return "Te következel";
    return `Az ellenfél következik (${currentPlayer?.user.username})`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-cyber-surface border-2 border-cyber-border p-4 sm:p-8">
        <div className="flex justify-between items-center mb-4">
            <h1 className="font-orbitron text-2xl sm:text-3xl uppercase text-cyber-primary">{lobby.name}</h1>
            <CyberButton variant="ghost" onClick={handleReturnToLobbyList}>Vissza a szobákhoz</CyberButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <PlayerInfo player={player1} symbol="X" isCurrent={!isGameOver && currentPlayer?.user.id === player1.user.id} />

            <div className="flex flex-col items-center">
                {isWaitingForPlayer ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Loader2 className="animate-spin h-10 w-10 text-cyber-primary" />
                        <p className="mt-4 text-lg text-cyber-text-dim">Várakozás egy ellenfél csatlakozására...</p>
                    </div>
                ) : (
                    <TicTacToeBoard />
                )}
                <div className="mt-4 font-orbitron text-xl uppercase text-cyber-accent text-center">{getStatusText()}</div>
            </div>

            <PlayerInfo player={player2} symbol="O" isCurrent={!isGameOver && player2 && currentPlayer?.user.id === player2.user.id} rightAlign />
        </div>
      </div>
      {isGameOver && <PostGameModal />}
    </div>
  );
};

interface PlayerInfoProps {
    player?: { user: { username: string } };
    symbol: 'X' | 'O';
    isCurrent: boolean;
    rightAlign?: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, symbol, isCurrent, rightAlign = false }) => {
    const alignment = rightAlign ? 'text-right items-end' : 'text-left items-start';
    return (
        <div className={`flex flex-col ${alignment}`}>
            {player ? (
                <>
                    <p className={`font-orbitron text-2xl ${isCurrent ? 'text-cyber-primary animate-pulse' : 'text-cyber-text'}`}>{player.user.username}</p>
                    <p className="text-4xl font-bold text-cyber-secondary">{symbol}</p>
                </>
            ) : (
                <p className="text-cyber-text-dim">Várakozás a játékosra...</p>
            )}
        </div>
    )
}

export default GamePage;
