import React from "react";
import styles from "./Header.module.css";
import TipsButton from "./TipsButton";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Knock Prompt</div>
      <div className={styles.icon}>
        <TipsButton />
      </div>
    </header>
  );
};

export default Header;
