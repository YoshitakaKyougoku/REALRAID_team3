import React from "react";
import styles from "./ChangeNextUser.module.css";

type ChangeNextUserProps = {
  timeChangeNextPlayer: number;
  currentPlayer: string | null;
};

const ChangeNextUser = ({ timeChangeNextPlayer }: ChangeNextUserProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>あなたのターンです！</h2>
      <h2 className={styles.message}>画像生成中</h2>
      <p className={styles.countdown}>スタートまで: {timeChangeNextPlayer}秒</p>
    </div>
  );
};

export default ChangeNextUser;
