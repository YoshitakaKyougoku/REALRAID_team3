import React from "react";
import UserTable from "./UserTable";
import styles from './ShowCurrentPlayer.module.css'

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
    <div className={styles.container}>
      <h2 className={styles.id}>ロビーID: {lobbyId}</h2>
      <UserTable />
      <button
        className={styles.button}
        onClick={startGame}
        disabled={userNumber !== 1}
      >
        ゲーム開始！
      </button>
    </div>
  );
};

export default ShowCurrentPlayer;
