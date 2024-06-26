"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AnswerInput from "@/features/play/components/AnswerInput";
import Timer from "@/features/play/components/Timer";
import Waiting from "@/features/play/components/Waiting";
import ShowCurrentPlayer from "@/features/lobby/components/ShowCurrentPlayer";
import Error from "@/features/play/components/Error";
import Link from "next/link";
import Header from "@/features/lobby/components/Header";
import { useSearchParams } from "next/navigation";

export default function LobbyPlay({ params }: { params: any }) {
  const lobbyId = params.id;
  const [users, setUsers] = useState<string[]>([]);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [chatgpt, setChatgpt] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const searchParams = useSearchParams();
  const userName = searchParams.get("userName");

  useEffect(() => {
    if (!lobbyId) return;

    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: "join",
          payload: { lobby: lobbyId, userName: userName },
        })
      );
    };

    ws.current.onmessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === "number") {
        setUserNumber(parsedMessage.payload);
      } else if (parsedMessage.type === "userList") {
        setUsers(parsedMessage.payload);
        console.log("Set users:", parsedMessage.payload);
        getCurrentPlayer(); 
      } else if (parsedMessage.type === "turn") {
        setIsMyTurn(parsedMessage.payload);
      } else if (parsedMessage.type === "previousMessage") {
        setPreviousMessage(parsedMessage.payload);
        setInput("");
      } else if (parsedMessage.type === "result") {
        setResult(parsedMessage.payload ? "正解！" : "不正解！");
      } else if (parsedMessage.type === "currentPlayer") {
        setCurrentPlayer(parsedMessage.payload);
        console.log("Set current player:", parsedMessage.payload);
      } else if (parsedMessage.type === "error") {
        setError(parsedMessage.payload);
      } else if (parsedMessage.type === "initialImage") {
        setInitialImage(parsedMessage.payload);
      } else if (parsedMessage.type === "initialPrompt") {
        console.log(initialPrompt);
        setInitialPrompt(parsedMessage.payload);
      } else if (parsedMessage.type === "generatedImage") {
        setGeneratedImage(parsedMessage.payload);
        console.log("set //" + chatgpt);
      } else if (parsedMessage.type === "chatgpt") {
        setChatgpt(parsedMessage.payload);
        console.log("set chatgpt//" + chatgpt);
      } else if (parsedMessage.type === "gameStarted") {
        setGameStarted(parsedMessage.payload);
        console.log("Game started:", parsedMessage.payload);
      }
    };

    return () => {
      console.log("Closing connection");
      ws.current?.close();
    };
  }, [lobbyId, userName]);

  const sendMessage = () => {
    if (ws.current && input && isMyTurn) {
      ws.current.send(JSON.stringify({ type: "message", payload: input }));
      setInput("");
      setIsMyTurn(false);
    }
  };

  const getCurrentPlayer = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: "getCurrentPlayer" }));
    }
  };

  const startGame = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: "startGame" }));
    }
  };

  if (result !== null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Link href="/">トップに戻る</Link>
        <p>ChatGPTによる評価：{chatgpt}</p>
        <p>お題</p>
        <p>{initialPrompt}</p>
        <figure>
          <Image
            src={`data:image/png;base64,${initialImage}`}
            alt="Received Data"
            width={300}
            height={300}
          />
        </figure>
        <p>生成された画像</p>
        <p>{previousMessage}</p>
        <figure>
          <Image
            src={`data:image/png;base64,${generatedImage}`}
            alt="Received Data"
            width={300}
            height={300}
          />
        </figure>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Error error={error} />
      </div>
    );
  }

  if (isMyTurn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Timer userName={userName} totalTime={600} />
        <p>画像からプロンプトを予想して入力しましょう</p>
        <p>入力例：公園で本を読んでいるメガネをかけた青年</p>
        <AnswerInput input={input} setInput={setInput} onSend={sendMessage} />
        {initialImage && !previousMessage && (
          <>
            <p>お題</p>
            <figure>
              <Image
                src={`data:image/png;base64,${initialImage}`}
                alt="Received Data"
                width={300}
                height={300}
              />
            </figure>
          </>
        )}
        {initialImage && previousMessage && (
          <>
            <p>生成された画像</p>
            <figure>
              <Image
                src={`data:image/png;base64,${generatedImage}`}
                alt="Received Data"
                width={300}
                height={300}
              />
            </figure>
          </>
        )}
      </div>
    );
  }

  if (gameStarted && !isMyTurn) {
    return (
      <LobbyContext.Provider
        value={{
          users,
          setUsers,
          isMyTurn,
          setIsMyTurn,
          sendMessage,
          getCurrentPlayer,
        }}
      >
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <Waiting currentPlayer={currentPlayer} />
        </div>
      </LobbyContext.Provider>
    );
  }

  return (
    <LobbyContext.Provider
      value={{
        users,
        setUsers,
        isMyTurn,
        setIsMyTurn,
        sendMessage,
        getCurrentPlayer,
      }}
    >
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Header />
        <ShowCurrentPlayer
          lobbyId={lobbyId}
          users={users}
          userNumber={userNumber}
          startGame={startGame}
          start={start}
        />
      </div>
    </LobbyContext.Provider>
  );
}
