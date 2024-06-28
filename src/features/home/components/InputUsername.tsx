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
        {!username && (
          <p>
            はじめに名前を
            <br />
            入力してね!
          </p>
        )}
        {username && <p>ロビーを作る？入る？</p>}
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
