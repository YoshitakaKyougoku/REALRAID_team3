import React from "react";
import styles from "./Header.module.css";
import { FiHelpCircle } from "react-icons/fi";
import ExitLobby from "./ExitLobby";

const Header = () => {
  return (
    <header className={styles.header}>
      <div>
        <ExitLobby />
      </div>
      <div className={styles.title}>ゲームタイトル</div>
      <div className={styles.icon}>
        <FiHelpCircle />
      </div>
    </header>
  );
};

export default Header;
