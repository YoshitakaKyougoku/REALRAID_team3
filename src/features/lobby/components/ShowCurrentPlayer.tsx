import React from "react";
import UserTable from "./UserTable";
import styles from './ShowCurrentPlayer.module.css'

interface ShowCurrentPlayerProps {
  lobbyId: string;
  users: string[];
  userNumber: number | null;
  startGame: () => void;
  start: boolean;
}

const ShowCurrentPlayer: React.FC<ShowCurrentPlayerProps> = ({
  lobbyId,
  userNumber,
  startGame,
  start,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.id}>ロビーID: {lobbyId}</h2>
      <UserTable />
      <button
        className={userNumber === 1?styles.button:styles.disabledButton}
        onClick={startGame}
        disabled={userNumber !== 1}
      >
        ゲーム開始！
      </button>
      {start && <p>お題画像生成中...</p>}
    </div>
  );
};

export default ShowCurrentPlayer;
