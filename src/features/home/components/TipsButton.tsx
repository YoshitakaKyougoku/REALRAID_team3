// TipsButton.tsx
import React from "react";
import { FiHelpCircle } from "react-icons/fi";
import styles from "./TipsButton.module.css";

const TipsButton = () => {
  return (
    <div className={styles.buttonContainer}>
      <div className={styles.content}>
        <a href="https://www.canva.com/design/DAGJb-LE-3k/IexK73oqPyfdfp4rP7UPUg/view?utm_content=DAGJb-LE-3k&utm_campaign=designshare&utm_medium=link&utm_source=editor" className={styles.icon}>
          <FiHelpCircle size={24} />
        </a>
        <p className={styles.text}>遊び方</p>
      </div>
    </div>
  );
};

export default TipsButton;
