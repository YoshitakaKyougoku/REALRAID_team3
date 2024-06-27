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
import ChangeNextUser from "@/features/play/components/ChangeNextUser";
import { useSearchParams } from "next/navigation";
import { LobbyContext } from "@/provider/lobby";
import { ShowImage } from "@/features/play/components/ShowImage";
import { GameResult } from "@/features/play/components/GameResult";

export default function LobbyPlay({ params }: { params: any }) {
  const lobbyId = params.id;
  const [users, setUsers] = useState<string[]>([]);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [initialImage, setInitialImage] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [chatgpt, setChatgpt] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const searchParams = useSearchParams();
  const userName = searchParams.get("userName");
  const [timeChangeNextPlayer, setTimeChangeNextPlayer] = useState<number>(0);
  const [showChangeNextUser, setShowChangeNextUser] = useState(false);

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

  // 次のプレーヤーに遷移する前にカウントダウンを表示
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isMyTurn) {
      setTimeChangeNextPlayer(5); // 秒数を設定
      setShowChangeNextUser(true);
      timerId = setInterval(() => {
        setTimeChangeNextPlayer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            setShowChangeNextUser(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isMyTurn]);

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
      <GameResult
        chatgpt={chatgpt}
        initialPrompt={initialPrompt}
        initialImage={initialImage}
        previousMessage={previousMessage}
        generatedImage={generatedImage}
      />
    );
  }

  if (error) {
    return (
      <div>
        <Error error={error} />
      </div>
    );
  }

  if (showChangeNextUser && timeChangeNextPlayer > 0) {
    return (
      <ChangeNextUser
        timeChangeNextPlayer={timeChangeNextPlayer}
        currentPlayer={currentPlayer}
      />
    );
  }

  if (isMyTurn) {
    return (
      <div>
        <Timer userName={userName} totalTime={15} sendMessage={sendMessage} />
        <p>画像からプロンプトを予想して入力しましょう</p>
        <AnswerInput input={input} setInput={setInput} onSend={sendMessage} />
        {initialImage && !previousMessage && (
          <>
            <p>お題</p>
            <ShowImage imageData={initialImage} />
          </>
        )}
        {initialImage && previousMessage && (
          <>
            <p>生成された画像</p>
            <ShowImage imageData={generatedImage} />
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
          isMyTurn,
          setIsMyTurn,
          sendMessage,
          getCurrentPlayer,
          gameStarted,
        }}
      >
        <Waiting currentPlayer={currentPlayer} />
      </LobbyContext.Provider>
    );
  }

  return (
    <LobbyContext.Provider
      value={{
        users,
        isMyTurn,
        setIsMyTurn,
        sendMessage,
        getCurrentPlayer,
        gameStarted,
      }}
    >
      <Header />
      <ShowCurrentPlayer
        lobbyId={lobbyId} 
        users={users}
        userNumber={userNumber}
        startGame={startGame}
        start={gameStarted}
      />
    </LobbyContext.Provider>
  );
}
