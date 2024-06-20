"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import AnswerInput from "@/features/play/components/AnswerInput";
import Timer from "@/features/play/components/Timer";

export const PlayContext = createContext<{
  isMyTurn: boolean;
  setIsMyTurn: Dispatch<SetStateAction<boolean>>;
  sendMessage: () => void;
}>(
  {} as {
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    sendMessage: () => void;
  }
);

export default function Play({ params }: { params: any }) {
  const lobbyId = params.id;
  const [input, setInput] = useState("");
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!lobbyId) return;

    // websocketに接続
    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({ type: "join", payload: { lobby: lobbyId } })
      );
    };

    ws.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === "number") {
        setUserNumber(parsedMessage.payload);
        console.log("Set user number:", parsedMessage.payload);
      } else if (parsedMessage.type === "previousMessage") {
        setPreviousMessage(parsedMessage.payload);
        setInput(parsedMessage.payload);
      } else if (parsedMessage.type === "turn") {
        setIsMyTurn(true);
      } else if (parsedMessage.type === "result") {
        // 結果を表示
        setResult(parsedMessage.payload ? "正解！" : "不正解！");
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [lobbyId]);

  const sendMessage = () => {
    if (ws.current && input && isMyTurn) {
      ws.current.send(JSON.stringify({ type: "message", payload: input }));
      setInput("");
      setIsMyTurn(false);
    }
  };

  if (result !== null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-2xl font-bold">結果: {result}</div>
      </div>
    );
  }

  return (
    <PlayContext.Provider value={{ isMyTurn, setIsMyTurn, sendMessage }}>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {isMyTurn && <Timer totalTime={600} />}
        {userNumber !== null && (
          <div className="text-lg">あなたの番号: {userNumber}</div>
        )}
        {previousMessage && (
          <div className="text-lg">前のメッセージ: {previousMessage}</div>
        )}
        {isMyTurn ? (
          <AnswerInput input={input} setInput={setInput} onSend={sendMessage} />
        ) : (
          <div className="text-gray-500">他のプレイヤーが操作中</div>
        )}
      </div>
    </PlayContext.Provider>
  );
}
