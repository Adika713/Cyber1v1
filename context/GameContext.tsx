
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { GameInfo, Lobby, GameState, GameId } from '../types';
import * as api from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';

export interface GameContextType {
  games: GameInfo[];
  lobbies: Lobby[];
  activeGameState: GameState | null;
  fetchLobbies: (gameId: GameId) => Promise<void>;
  createLobby: (name: string, isPrivate: boolean, password?: string, gameId?: GameId) => Promise<Lobby>;
  joinLobby: (lobbyId: string, password?: string) => Promise<void>;
  getGameState: (lobbyId: string) => Promise<void>;
  makeMove: (lobbyId: string, move: number) => Promise<void>;
  requestRematch: (lobbyId: string) => Promise<void>;
  leaveGame: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [games] = useState<GameInfo[]>(api.getGames());
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [activeGameState, setActiveGameState] = useState<GameState | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    // Poll if game is active, or if it's over and we are waiting for a rematch.
    const shouldPoll = activeGameState && (
      !activeGameState.isGameOver || 
      (activeGameState.isGameOver && !activeGameState.opponentDeclinedRematch)
    );

    if (shouldPoll) {
      interval = setInterval(() => {
        // This check prevents errors if user navigates away while a fetch is in flight
        if (activeGameState) {
            getGameState(activeGameState.lobby.id);
        }
      }, 2500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGameState]);

  const fetchLobbies = async (gameId: GameId) => {
    const fetchedLobbies = await api.getLobbies(gameId);
    setLobbies(fetchedLobbies);
  };
  
  const createLobby = async (name: string, isPrivate: boolean, password?: string, gameId?: GameId): Promise<Lobby> => {
    if (!user || !gameId) {
      throw new Error("A szoba létrehozásához be kell jelentkezned.");
    }
    const newLobby = await api.createLobby(name, isPrivate, password || '', gameId, user);
    fetchLobbies(gameId); // Refresh lobby list for others
    return newLobby;
  };
  
  const joinLobby = async (lobbyId: string, password?: string) => {
    if (!user) {
        throw new Error("A szobához való csatlakozáshoz be kell jelentkezned.");
    }
    await api.joinLobby(lobbyId, user, password);
    await getGameState(lobbyId);
  };

  const getGameState = async (lobbyId: string) => {
    try {
        const state = await api.getGameState(lobbyId);
        setActiveGameState(state);
    } catch (error) {
        console.error("Error fetching game state:", error);
        setActiveGameState(null); // Clear state if game is no longer available
    }
  };

  const makeMove = async (lobbyId: string, move: number) => {
    if (!user) throw new Error("A felhasználó nincs hitelesítve");
    const newState = await api.makeMove(lobbyId, user.id, move);
    setActiveGameState(newState);
  };

  const requestRematch = async (lobbyId: string) => {
    if (!user) throw new Error("A felhasználó nincs hitelesítve");
    const newState = await api.requestRematch(lobbyId, user.id);
    setActiveGameState(newState);
  };
  
  const leaveGame = () => {
    if (activeGameState && user) {
        api.playerLeft(activeGameState.lobby.id, user.id);
    }
    setActiveGameState(null);
  };

  const value = {
    games,
    lobbies,
    activeGameState,
    fetchLobbies,
    createLobby,
    joinLobby,
    getGameState,
    makeMove,
    requestRematch,
    leaveGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
