import styles from "./Waiting.module.css";

interface WaitingProps {
  currentPlayer: string | null;
}

export default function Waiting({ currentPlayer }: WaitingProps) {
  return (
    <div id="loading" className={styles.loading}>
      <div className={styles.loadingCircle}></div>
      <span className={styles.loadingTitle}></span>
      <div className={styles.currentPlayer}>
        {currentPlayer !== null
          ? `プレイヤー${currentPlayer}が回答中`
          : "プレイヤー情報を取得中"}
      </div>
    </div>
  );
}
