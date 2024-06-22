import styles from "./Waiting.module.css";

interface WaitingProps {
  currentPlayer: number | null;
}

export default function Waiting({ currentPlayer }: WaitingProps) {
  return (
    <div>
      <div className="text-gray-500">{`${currentPlayer}`} プレイヤーが操作中</div>
      <div id="loading" className={styles.loading}>
        <div className={styles.loadingCircle}></div>
        <span className={styles.loadingTitle}></span>
      </div>
    </div>
  );
}
