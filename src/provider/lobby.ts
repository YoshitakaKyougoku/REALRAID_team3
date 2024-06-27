import { Dispatch, SetStateAction, createContext } from "react";

export const LobbyContext = createContext<{
  users: string[];
  setUsers: Dispatch<SetStateAction<string[]>>;
  isMyTurn: boolean;
  setIsMyTurn: Dispatch<SetStateAction<boolean>>;
  sendMessage: () => void;
  getCurrentPlayer: () => void;
}>(
  {} as {
    users: string[];
    setUsers: Dispatch<SetStateAction<string[]>>;
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    sendMessage: () => void;
    getCurrentPlayer: () => void;
  }
);