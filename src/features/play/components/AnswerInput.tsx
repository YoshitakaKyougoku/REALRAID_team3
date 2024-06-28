import React from "react";
import styles from './AnswerInput.module.css'

type AnswerInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
};

const AnswerInput = ({ input, setInput, onSend }: AnswerInputProps) => {
  return (
    <div className={styles.container}>
      <h3>プロンプトを入力してください！</h3>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={styles.button} onClick={onSend}>送信</button>
    </div>
  );
};

export default AnswerInput;
