import React from "react";
import styles from "./Waiting.module.css";

export default function Waiting() {
  return (
    <div>
      <div className="text-gray-500">他のプレイヤーが操作中</div>
      <div id="loading" className={styles.loading}>
        <div className={styles.loadingCircle}></div>
        <span className={styles.loadingTitle}></span>
      </div>
    </div>
  );
}
