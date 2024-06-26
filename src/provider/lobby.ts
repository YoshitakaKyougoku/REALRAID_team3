import { Dispatch, SetStateAction, createContext } from "react";

export const LobbyContext = createContext<{
    users: string[];
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    sendMessage: () => void;
    getCurrentPlayer: () => void;
    gameStarted: boolean;
  }>(
    {} as {
      users: string[];
      isMyTurn: boolean;
      setIsMyTurn: Dispatch<SetStateAction<boolean>>;
      sendMessage: () => void;
      getCurrentPlayer: () => void;
      gameStarted: boolean;
    }
  );