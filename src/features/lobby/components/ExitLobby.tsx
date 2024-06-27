import { FC, useState } from "react";
import styles from "./ExitLobby.module.css";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";

const ExitLobby: FC = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  const hideModal = () => {
    console.log("キャンセルしました");
    setModalOpen(false);
  };

  const handleExit = () => {
    console.log("ホームに戻ります");
    router.push("/");
    hideModal();
  };

  return (
    <div className={styles.lobby}>
      <button onClick={showModal} className={styles.buttonIcon}>
        <BiLogOut />
      </button>
      {modalOpen && (
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
