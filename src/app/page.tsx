"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [lobbyId, setLobbyId] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const createLobby = () => {
    const newLobbyId = Math.random().toString(36).substring(2, 7);
    if (userName) {
      router.push(
        `/lobby/${newLobbyId}?userName=${encodeURIComponent(userName)}`
      );
    }
  };

  const joinLobby = () => {
    if (lobbyId && userName) {
      router.push(`/lobby/${lobbyId}?userName=${encodeURIComponent(userName)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-4">伝言ゲーム</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="ユーザー名を入力"
        className="border px-2 py-1 rounded"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        onClick={createLobby}
      >
        ロビーを作成
      </button>
      <div className="flex space-x-2">
        <input
          type="text"
          value={lobbyId}
          onChange={(e) => setLobbyId(e.target.value)}
          placeholder="ロビーIDを入力"
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded shadow"
          onClick={joinLobby}
        >
          ロビーに入る
        </button>
      </div>
    </div>
  );
}
