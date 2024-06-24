import React from "react";
import UserTable from "./UserTable";

interface ShowCurrentPlayerProps {
  lobbyId: string;
  users: string[];
  userNumber: number | null;
  startGame: () => void;
}

const ShowCurrentPlayer: React.FC<ShowCurrentPlayerProps> = ({
  lobbyId,
  userNumber,
  startGame,
}) => {
  return (
    <div>
      <h2>ロビーID: {lobbyId}</h2>
      <h3>参加者:</h3>
      <UserTable />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={startGame}
        disabled={userNumber !== 1}
      >
        ゲーム開始
      </button>
    </div>
  );
};

export default ShowCurrentPlayer;
