"use client";

import { useState } from "react";
import styles from "./homePage.module.css";
import InputUsername from "@/features/home/components/InputUsername";
import Header from "@/features/home/components/Header";
import CreateLobby from "@/features/home/components/CreateLobby";
import JoinLobby from "@/features/home/components/JoinLobby";

export default function Home() {
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <h1 className={styles.title}>伝言ゲーム</h1>
      <div className={styles.inputContainer}>
        <InputUsername username={username} setUsername={setUsername} />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.button}>
          <CreateLobby username={username}  />
        </div>
        <div className={styles.button}>
          <JoinLobby username={username} />
        </div>
      </div>
    </div>
  );
}
