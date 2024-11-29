import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextType {
  gameId: string;
  updateGameId: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameId, setGameId] = useState<string>('');

  const updateGameId = (id: string) => {
    setGameId(id);
  };

  return (
    <GameContext.Provider value={{ gameId, updateGameId }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;