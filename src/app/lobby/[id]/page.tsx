"use client";

import { useState, useEffect, useRef, useContext } from "react";
import AnswerInput from "@/features/play/components/AnswerInput";
import Timer from "@/features/play/components/Timer";
import Waiting from "@/features/play/components/Waiting";
import ShowCurrentPlayer from "@/features/lobby/components/ShowCurrentPlayer";
import Error from "@/features/play/components/Error";
import Link from "next/link";
import Header from "@/features/lobby/components/Header";
import ChangeNextUser from "@/features/play/components/ChangeNextUser";
import { useSearchParams } from "next/navigation";
import { LobbyContext } from "@/app/context";

export default function LobbyPlay({ params }: { params: any }) {
  const {
    userNumber,
    setUserNumber,
    users,
    setUsers,
    isMyTurn,
    setIsMyTurn,
    input,
    setInput,
    currentPlayer,
    setCurrentPlayer,
  } = useContext(LobbyContext);

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeChangeNextPlayer, setTimeChangeNextPlayer] = useState<number>(0);
  const [showChangeNextUser, setShowChangeNextUser] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const lobbyId = params.id;
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
        setInput(parsedMessage.payload);
      } else if (parsedMessage.type === "result") {
        setResult(parsedMessage.payload ? "正解！" : "不正解！");
      } else if (parsedMessage.type === "currentPlayer") {
        setCurrentPlayer(parsedMessage.payload);
        console.log("Set current player:", parsedMessage.payload);
      } else if (parsedMessage.type === "error") {
        setError(parsedMessage.payload);
      } else if (parsedMessage.type === "gameStarted") {
        setGameStarted(parsedMessage.payload);
        console.log("Game started:", parsedMessage.payload);
      }
    };

    return () => {
      console.log("Closing connection");
      ws.current?.close();
    };
  }, [
    lobbyId,
    userName,
    setUserNumber,
    setUsers,
    setIsMyTurn,
    setInput,
    setCurrentPlayer,
  ]);

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
      <div>
        <div>結果: {result}</div>
        <Link href="/">トップに戻る</Link>
      </div>
    );
  }

  if (error) {
    return <Error error={error} />;
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
        <Timer userName={userName} totalTime={30} sendMessage={sendMessage} />
        <AnswerInput onSend={sendMessage} />
      </div>
    );
  }

  if (gameStarted && !isMyTurn) {
    return <Waiting currentPlayer={currentPlayer} />;
  }

  return (
    <div>
      <Header />
      <ShowCurrentPlayer
        lobbyId={lobbyId}
        users={users}
        userNumber={userNumber}
        startGame={startGame}
      />
    </div>
  );
}
