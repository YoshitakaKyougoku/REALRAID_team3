import React from "react";
import styles from "./JoinLobby.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinLobbyProps = {
  username: string;
};

const JoinLobby = ({ username }: JoinLobbyProps) => {
  const [lobbyId, setLobbyId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const joinLobby = () => {
    if (lobbyId && username) {
      router.push(`/lobby/${lobbyId}?userName=${encodeURIComponent(username)}`);
    }
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const hideModal = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setModalOpen(false);
    }
  };

  return (
    <div>
      {username && (
        <button className={styles.button} onClick={showModal}>
          ロビーに入る
        </button>
      )}
      {modalOpen && (
        <div className={styles.modal} onClick={hideModal}>
          <div className={styles.modalContent}>
            <input
              type="text"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              placeholder="ロビーIDを入力"
              className={styles.input}
            />
            <button className={styles.joinButton} onClick={joinLobby}>
              参加する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinLobby;
