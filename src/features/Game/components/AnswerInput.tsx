import React from "react";

type AnswerInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
};

const AnswerInput = ({ input,setInput, onSend}: AnswerInputProps) => {
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力"
      />
      <button
        onClick={onSend}
      >
        送信
      </button>
    </div>
  );
};

export default AnswerInput;
