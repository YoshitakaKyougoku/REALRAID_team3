import React from "react";
import styles from "./Header.module.css";
import ExitLobby from "../lobby/components/ExitLobby";

const Header = () => {
  return (
    <header className={styles.header}>
      <div >
        <ExitLobby ws={null} userNumber={null} />
      </div>
      <div className={styles.title}>ゲームタイトル</div>
    </header>
  );
};

export default Header;
