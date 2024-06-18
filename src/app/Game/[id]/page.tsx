"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Game({ params }: { params: any }) {
  const router = useRouter();
  const roomId = params.id;
  const [input, setInput] = useState("");
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({ type: "join", payload: { room: roomId } })
      );
    };

    ws.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === "number") {
        setUserNumber(parsedMessage.payload);
      } else if (parsedMessage.type === "previousMessage") {
        setPreviousMessage(parsedMessage.payload);
      } else if (parsedMessage.type === "turn") {
        setIsMyTurn(true);
      } else if (parsedMessage.type === "result") {
        setResult(parsedMessage.payload ? "正解！" : "不正解！");
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

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
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">ゲーム画面</h1>
      {userNumber !== null && (
        <div className="text-lg">あなたの番号: {userNumber}</div>
      )}
      {previousMessage && (
        <div className="text-lg">前のメッセージ: {previousMessage}</div>
      )}
      {isMyTurn ? (
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力"
            className="border px-2 py-1 rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            onClick={sendMessage}
          >
            送信
          </button>
        </div>
      ) : (
        <div className="text-gray-500">他のプレイヤーが操作中</div>
      )}
    </div>
  );
}
