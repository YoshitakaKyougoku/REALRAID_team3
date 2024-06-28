"use client";

import { useState } from "react";
import styles from "./homePage.module.css";
import InputUsername from "@/features/home/components/InputUsername";
import Header from "@/features/home/components/Header";
import CreateLobby from "@/features/home/components/CreateLobby";
import JoinLobby from "@/features/home/components/JoinLobby";
import Image from "next/image";
import gameIcon from "@/public/gameIcon.webp";

export default function Home() {
  const [username, setUsername] = useState("");

  return (
    <>
      <Header />
      <div className={styles.mainContainer}>
        <Image src={gameIcon} alt={""} className={styles.image} />
        <InputUsername username={username} setUsername={setUsername} />
        <div className={styles.buttonContainer}>
          <CreateLobby username={username} />
          <JoinLobby username={username} />
        </div>
      </div>
    </>
  );
}
