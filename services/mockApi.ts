
import { User, GameId, GameInfo, Lobby, Player, GameState, TicTacToeBoard } from '../types';
import { calculateWinner } from '../utils/helpers';

// --- MOCK DATABASE using localStorage ---
let users: User[] = JSON.parse(localStorage.getItem('cybermatch_users') || '[]');
let lobbies: Lobby[] = JSON.parse(localStorage.getItem('cybermatch_lobbies') || '[]');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let gameStates: { [key: string]: any } = JSON.parse(localStorage.getItem('cybermatch_gamestates') || '{}');
let loggedInUser: User | null = JSON.parse(sessionStorage.getItem('cybermatch_user') || 'null');

const saveUsers = () => localStorage.setItem('cybermatch_users', JSON.stringify(users));
const saveLobbies = () => localStorage.setItem('cybermatch_lobbies', JSON.stringify(lobbies));
const saveGameStates = () => localStorage.setItem('cybermatch_gamestates', JSON.stringify(gameStates));
const saveSession = () => sessionStorage.setItem('cybermatch_user', JSON.stringify(loggedInUser));

// --- MOCK GAMES ---
const MOCK_GAMES: GameInfo[] = [
  {
    id: GameId.TIC_TAC_TOE,
    name: 'Amőba',
    description: 'A klasszikus X és O játék. Rakj ki hármat egy sorba a győzelemért.',
    imageUrl: 'https://i.imgur.com/g3Ue4dG.png',
  },
  {
    id: GameId.BATTLESHIP,
    name: 'Torpedó',
    description: 'Süllyeszd el az ellenfeled flottáját, mielőtt ő süllyeszti el a tiédet. (Hamarosan)',
    imageUrl: 'https://i.imgur.com/F2a3oM0.png',
  },
  {
    id: GameId.CONNECT_FOUR,
    name: 'Négy a nyerő',
    description: 'Rakj ki négy korongot egy sorba a győzelemért. (Hamarosan)',
    imageUrl: 'https://i.imgur.com/R0Vq3rT.png',
  },
];

// --- API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// AUTH
export const getCurrentUser = async (): Promise<User | null> => {
  await delay(100);
  return loggedInUser;
};

export const login = async (username: string, password: string): Promise<User> => {
  await delay(500);
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('Felhasználó nem található');
  // Mock password check - in a real app, this would be a hash comparison
  if (password.length === 0) throw new Error('A jelszó nem lehet üres');
  loggedInUser = user;
  saveSession();
  return user;
};

export const register = async (username: string, password: string): Promise<User> => {
  await delay(500);
  if (users.some(u => u.username === username)) {
    throw new Error('A felhasználónév már létezik');
  }
  if (password.length < 4) throw new Error('A jelszónak legalább 4 karakter hosszúnak kell lennie');
  const newUser: User = { id: `user_${Date.now()}`, username };
  users.push(newUser);
  saveUsers();
  loggedInUser = newUser;
  saveSession();
  return newUser;
};

export const logout = (): void => {
  loggedInUser = null;
  saveSession();
};

// GAMES
export const getGames = (): GameInfo[] => {
  return MOCK_GAMES;
};

// LOBBIES
export const getLobbies = async (gameId: GameId): Promise<Lobby[]> => {
  await delay(200);
  const now = Date.now();
  // Filter out old, empty lobbies
  lobbies = lobbies.filter(l => {
      const state = gameStates[l.id];
      const isOldAndEmpty = l.players.length === 0 && state && (now - state.createdAt > 5 * 60 * 1000);
      if (isOldAndEmpty) {
          delete gameStates[l.id];
      }
      return !isOldAndEmpty;
  });
  saveLobbies();
  saveGameStates();
  return lobbies.filter(l => l.gameId === gameId);
};

export const createLobby = async (name: string, isPrivate: boolean, password: string, gameId: GameId, host: User): Promise<Lobby> => {
  await delay(500);
  const hostPlayer: Player = { user: host, symbol: 'X' };
  const newLobby: Lobby = {
    id: `lobby_${Date.now()}`,
    name,
    gameId,
    isPrivate,
    host,
    players: [hostPlayer],
    maxPlayers: 2,
  };
  lobbies.push(newLobby);
  
  gameStates[newLobby.id] = {
    lobby: newLobby,
    board: Array(9).fill(null),
    currentPlayer: hostPlayer,
    winner: null,
    isGameOver: false,
    rematchRequestedBy: null,
    opponentDeclinedRematch: false,
    createdAt: Date.now()
  };

  saveLobbies();
  saveGameStates();
  return newLobby;
};

export const joinLobby = async (lobbyId: string, user: User, password?: string): Promise<void> => {
  await delay(500);
  const lobby = lobbies.find(l => l.id === lobbyId);
  const gameState = gameStates[lobbyId];
  if (!lobby || !gameState) throw new Error('A szoba nem található');
  if (lobby.isPrivate && password !== 'password') { // Super secure password check for mock
      throw new Error('Hibás jelszó');
  }
  if (lobby.players.length >= lobby.maxPlayers) throw new Error('A szoba tele van');
  if (lobby.players.some(p => p.user.id === user.id)) return; // Already in lobby

  const newPlayer: Player = { user, symbol: 'O' };
  lobby.players.push(newPlayer);
  gameState.lobby = lobby;
  
  saveLobbies();
  saveGameStates();
};

// GAME STATE
export const getGameState = async (lobbyId: string): Promise<GameState> => {
    await delay(200);
    const state = gameStates[lobbyId];
    if (!state) throw new Error('A játék nem található');
    return state;
};

export const makeMove = async (lobbyId: string, userId: string, moveIndex: number): Promise<GameState> => {
    await delay(300);
    const state: GameState = gameStates[lobbyId];
    if (!state) throw new Error('A játék nem található');
    if (state.isGameOver || state.currentPlayer?.user.id !== userId || state.board[moveIndex]) {
        return state;
    }

    const player = state.lobby.players.find(p => p.user.id === userId);
    if (!player) throw new Error('A játékos nincs a játékban');

    state.board[moveIndex] = player.symbol!;
    
    const winnerSymbol = calculateWinner(state.board as TicTacToeBoard);
    if (winnerSymbol) {
        state.winner = state.lobby.players.find(p => p.symbol === winnerSymbol) || null;
        state.isGameOver = true;
    } else if (!state.board.includes(null)) {
        state.winner = 'draw';
        state.isGameOver = true;
    } else {
        state.currentPlayer = state.lobby.players.find(p => p.user.id !== userId) || null;
    }

    saveGameStates();
    return state;
};

export const requestRematch = async (lobbyId: string, userId: string): Promise<GameState> => {
    await delay(300);
    const state: GameState = gameStates[lobbyId];
    if (!state) throw new Error('A játék nem található');

    const otherPlayer = state.lobby.players.find(p => p.user.id !== userId);

    if (state.rematchRequestedBy && state.rematchRequestedBy === otherPlayer?.user.id) {
        state.board = Array(9).fill(null);
        state.isGameOver = false;
        state.winner = null;
        state.rematchRequestedBy = null;
        state.opponentDeclinedRematch = false;
        state.currentPlayer = state.lobby.players.find(p => p.user.id === state.lobby.host.id) || null;
    } else {
        state.rematchRequestedBy = userId;
    }
    
    saveGameStates();
    return state;
};

export const playerLeft = async (lobbyId: string, userId: string): Promise<void> => {
    await delay(100);
    const lobby = lobbies.find(l => l.id === lobbyId);
    const state: GameState = gameStates[lobbyId];
    if (!lobby || !state) return;
    
    if (state.isGameOver) {
        state.opponentDeclinedRematch = true;
        state.rematchRequestedBy = null;
    } else if (lobby.players.length > 1) {
        const winner = lobby.players.find(p => p.user.id !== userId) || null;
        state.winner = winner;
        state.isGameOver = true;
    }

    lobby.players = lobby.players.filter(p => p.user.id !== userId);
    if (lobby.host.id === userId && lobby.players.length > 0) {
        lobby.host = lobby.players[0].user; // Reassign host
    }
    
    // If lobby is empty, it will be cleaned up by getLobbies later
    if(lobby.players.length === 0){
        delete gameStates[lobbyId];
        lobbies = lobbies.filter(l => l.id !== lobbyId);
    }

    saveLobbies();
    saveGameStates();
};
