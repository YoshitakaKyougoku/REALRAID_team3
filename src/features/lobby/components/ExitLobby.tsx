import React, { FC, useState } from "react";
import styles from "./ExitLobby.module.css";
import { useRouter } from "next/navigation";

interface ExitProps {
  ws: WebSocket | null;
}

const ExitLobby: FC<ExitProps> = ({ ws }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    console.log("キャンセルしました");
    setModalVisible(false);
  };

  const handleExit = () => {
    console.log("ホームに戻ります");
    ws?.send(JSON.stringify({ type: "exit" }));
    router.push("/");
    hideModal();
  };

  return (
    <div className={styles.lobby}>
      <button onClick={showModal} className={styles.exitButton}>
        ロビー退出
      </button>
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p className={styles.titleText}>本当にホームに戻りますか？</p>
            <div className={styles.buttonContainer}>
              <button onClick={hideModal} className={styles.cancelButton}>
                キャンセル
              </button>
              <button onClick={handleExit} className={styles.confirmButton}>
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitLobby;
