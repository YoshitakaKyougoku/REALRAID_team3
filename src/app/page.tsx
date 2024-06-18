"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 7);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-4">伝言ゲーム</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        onClick={createRoom}
      >
        ルームを作成
      </button>
      <div className="flex space-x-2">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="ルームIDを入力"
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded shadow"
          onClick={joinRoom}
        >
          ルームに入る
        </button>
      </div>
    </div>
  );
}
