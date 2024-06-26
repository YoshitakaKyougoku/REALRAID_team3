import { Dispatch, SetStateAction, createContext } from "react";

export const LobbyContext = createContext<{
    users: string[];
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    sendMessage: () => void;
    getCurrentPlayer: () => void;
  }>(
    {} as {
      users: string[];
      isMyTurn: boolean;
      setIsMyTurn: Dispatch<SetStateAction<boolean>>;
      sendMessage: () => void;
      getCurrentPlayer: () => void;
    }
  );