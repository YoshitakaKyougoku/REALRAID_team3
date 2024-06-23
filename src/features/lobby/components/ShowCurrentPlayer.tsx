import React from "react";

interface ShowCurrentPlayerProps {
  lobbyId: string;
  users: string[];
  userNumber: number | null;
  isHost: boolean;
  startGame: () => void;
}

const ShowCurrentPlayer: React.FC<ShowCurrentPlayerProps> = ({
  lobbyId,
  users,
  userNumber,
  isHost,
  startGame,
}) => {
  return (
    <div>
      <h2>ロビーID: {lobbyId}</h2>
      <h3>参加者:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <p>あなたの番号: {userNumber}</p>
      {isHost && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={startGame}
        >
          ゲーム開始
        </button>
      )}
    </div>
  );
};

export default ShowCurrentPlayer;
