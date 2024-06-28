import React, { useState } from "react";
import styles from "./CreateLobby.module.css";
import { useRouter } from "next/navigation";

type CreateLobbyProps = {
  username: string;
};

const CreateLobby = ({ username }: CreateLobbyProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const createLobby = () => {
    const newLobbyId = Math.random().toString(36).substring(2, 7);
    if (username) {
      router.push(
        `/lobby/${newLobbyId}?userName=${encodeURIComponent(username)}`
      );
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
          ロビーを作成
        </button>
      )}
      {modalOpen && (
        <div className={styles.modal} onClick={hideModal}>
          <div className={styles.modalContent}>
            <h3 className={styles.title}>ロビーを作成しますか？</h3>
            <button className={styles.button} onClick={createLobby}>
              作成する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLobby;
