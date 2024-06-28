import styles from "./WaitingGenerateImage.module.css";
export const WaitingGenerateImage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.message}>画像生成中</h2>
    </div>
  );
};
