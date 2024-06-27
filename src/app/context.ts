import { Dispatch, SetStateAction, createContext } from "react";

export const LobbyContext = createContext<{
  userNumber: number | null;
  setUserNumber: Dispatch<SetStateAction<number | null>>;
  users: string[];
  setUsers: Dispatch<SetStateAction<string[]>>;
  isMyTurn: boolean;
  setIsMyTurn: Dispatch<SetStateAction<boolean>>;

  currentPlayer: string | null;
  setCurrentPlayer: Dispatch<SetStateAction<string | null>>;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}>(
  {} as {
    userNumber: number | null;
    setUserNumber: Dispatch<SetStateAction<number | null>>;
    users: string[];
    setUsers: Dispatch<SetStateAction<string[]>>;
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    currentPlayer: string | null;
    setCurrentPlayer: Dispatch<SetStateAction<string | null>>;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
  }
);
