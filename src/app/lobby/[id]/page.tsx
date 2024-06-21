"use client";

import { useState, useEffect, useRef, createContext } from "react";
import { useRouter } from "next/navigation";
import ShowCurrentPlayer from "@/features/lobby/components/ShowCurrentPlayer";
import Error from "@/features/play/components/Error";

export const LobbyContext = createContext<{
  userNumber: number | null;
  users: number[];
}>(
  {} as {
    userNumber: number | null;
    users: number[];
  }
);

export default function Lobby({ params }: { params: any }) {
  const router = useRouter();
  const lobbyId = params.id;
  console.log(lobbyId);
  const [users, setUsers] = useState<number[]>([]);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!lobbyId) return;

    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({ type: "join", payload: { lobby: lobbyId } })
      );
    };

    ws.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      console.log(parsedMessage);
      if (parsedMessage.type === "number") {
        setUserNumber(parsedMessage.payload);
      } else if (parsedMessage.type === "userList") {
        setUsers(parsedMessage.payload);
      } else if (parsedMessage.type === "playing") {
        router.push(`/play/${lobbyId}`);
      } else if (parsedMessage.type === "error") {
        setError(parsedMessage.payload);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [lobbyId, router]);

  return (
    <LobbyContext.Provider value={{ userNumber, users }}>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {error ? (
          <Error error={error} />
        ) : (
          <ShowCurrentPlayer lobbyId={lobbyId} />
        )}
      </div>
    </LobbyContext.Provider>
  );
}
