"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Room({ params }: { params: any }) {
  const router = useRouter();
  const roomId = params.id;
  const [users, setUsers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      if (parsedMessage.type === "userList") {
        setUsers(parsedMessage.payload);
      } else if (parsedMessage.type === "startGame") {
        router.push(`/game/${roomId}`);
      } else if (parsedMessage.type === "error") {
        setError(parsedMessage.payload);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">ルームID: {roomId}</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="text-lg">参加者: {users.join(", ")}</div>
      {users.length < 4 && (
        <div className="text-gray-500">他のプレイヤーを待っています...</div>
      )}
    </div>
  );
}
