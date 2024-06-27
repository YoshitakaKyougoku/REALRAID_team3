import { LobbyContext } from "@/app/context";
import React, { useContext } from "react";

interface AnswerInputProps {
  onSend: () => void;
}

const AnswerInput = ({ onSend }: AnswerInputProps) => {
  const { input, setInput } = useContext(LobbyContext);
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力"
      />
      <button onClick={onSend}>送信</button>
    </div>
  );
};

export default AnswerInput;
