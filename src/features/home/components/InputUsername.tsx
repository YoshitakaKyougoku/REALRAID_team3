import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './InputUsername.module.css';

type InputUsernameProps = {
  username: string;
  setUsername: (username: string) => void;
};

const InputUsername = ({username,setUsername}:InputUsernameProps) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
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