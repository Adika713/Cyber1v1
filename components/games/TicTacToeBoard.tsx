
import React from 'react';
import { useGame } from '../../hooks/useGame';
import { useAuth } from '../../hooks/useAuth';

const TicTacToeBoard: React.FC = () => {
  const { activeGameState, makeMove } = useGame();
  const { user } = useAuth();
  
  if (!activeGameState || !user) return null;

  const { board, lobby, currentPlayer, isGameOver } = activeGameState;

  const handleSquareClick = (index: number) => {
    if (board[index] || isGameOver || currentPlayer?.user.id !== user.id) {
      return;
    }
    makeMove(lobby.id, index);
  };
  
  const getSymbolClasses = (symbol: string | null) => {
    if (symbol === 'X') return 'text-cyber-primary';
    if (symbol === 'O') return 'text-cyber-secondary';
    return '';
  };
  
  return (
    <div className="grid grid-cols-3 gap-2 w-64 h-64 sm:w-80 sm:h-80">
      {board.map((value, index) => (
        <div
          key={index}
          onClick={() => handleSquareClick(index)}
          className={`flex items-center justify-center text-5xl sm:text-7xl font-bold bg-cyber-bg border-2 border-cyber-border transition-colors 
            ${!value && !isGameOver && currentPlayer?.user.id === user.id ? 'cursor-pointer hover:bg-cyber-surface' : 'cursor-not-allowed'}
            ${getSymbolClasses(value)}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default TicTacToeBoard;
