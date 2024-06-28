import React from "react";
import styles from "./Header.module.css";
import { FiHelpCircle } from "react-icons/fi";
import ExitLobby from "./ExitLobby";

const Header = () => {
  return (
    <header className={styles.header}>
      <div >
        <ExitLobby ws={null} userNumber={null} />
      </div>
      <div className={styles.title}>Knock Prompt</div>
      <div className={styles.icon}>
        <FiHelpCircle />
      </div>
    </header>
  );
};

export default Header;
