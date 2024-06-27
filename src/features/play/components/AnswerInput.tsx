import React from "react";

type AnswerInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
};

const AnswerInput = ({ input, setInput, onSend }: AnswerInputProps) => {
  return (
    <div>
      <h3>プロンプトを入力してください！</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={onSend}>送信</button>
    </div>
  );
};

export default AnswerInput;
