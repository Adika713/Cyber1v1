
export type User = {
  id: string;
  username: string;
};

export enum GameId {
  TIC_TAC_TOE = 'tic-tac-toe',
  BATTLESHIP = 'battleship',
  CONNECT_FOUR = 'connect-four',
}

export type GameInfo = {
  id: GameId;
  name: string;
  description: string;
  imageUrl: string;
};

export type Player = {
  user: User;
  symbol?: 'X' | 'O';
};

export type Lobby = {
  id: string;
  name: string;
  gameId: GameId;
  isPrivate: boolean;
  host: User;
  players: Player[];
  maxPlayers: number;
};

export type TicTacToeBoard = (string | null)[];
export type GameState = {
  lobby: Lobby;
  board: TicTacToeBoard;
  currentPlayer: Player | null;
  winner: Player | null | 'draw';
  isGameOver: boolean;
  rematchRequestedBy: string | null;
  opponentDeclinedRematch: boolean;
};
