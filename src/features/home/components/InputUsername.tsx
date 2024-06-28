import { FC } from "react";
import styles from "./InputUsername.module.css";

type InputUsernameProps = {
  username: string;
  setUsername: (username: string) => void;
};

const InputUsername: FC<InputUsernameProps> = ({
  username,
  setUsername,
}: InputUsernameProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {!username && <p>はじめにユーザー名を入力してください</p>}
        {username && <p>下のボタンを選択してください</p>}
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ユーザー名を入力"
        className={styles.input}
      />
    </div>
  );
};

export default InputUsername;
