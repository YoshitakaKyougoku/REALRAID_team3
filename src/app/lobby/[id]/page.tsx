"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
import AnswerInput from "@/features/play/components/AnswerInput";
import Timer from "@/features/play/components/Timer";
import Waiting from "@/features/play/components/Waiting";
import ShowCurrentPlayer from "@/features/lobby/components/ShowCurrentPlayer";
import Error from "@/features/play/components/Error";
import Link from "next/link";

const MAX_USERS = 4;

export const LobbyContext = createContext<{
  currentPlayer: number | null;
  users: number[];
  isMyTurn: boolean;
  setIsMyTurn: Dispatch<SetStateAction<boolean>>;
  sendMessage: () => void;
  getCurrentPlayer: () => void;
}>(
  {} as {
    currentPlayer: number | null;
    users: number[];
    isMyTurn: boolean;
    setIsMyTurn: Dispatch<SetStateAction<boolean>>;
    sendMessage: () => void;
    getCurrentPlayer: () => void;
  }
);

/**
 * lobbyId : ロビーID
 * users : ロビーにいるプレイヤーの一覧
 * userNumber : プレイヤー番号(保持)
 */
export default function LobbyPlay({ params }: { params: any }) {
  const lobbyId = params.id;
  const [users, setUsers] = useState<number[]>([]);
  const [userNumber, setUserNumber] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [chatgpt, setChatgpt] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const getCurrentPlayer = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: "getCurrentPlayer" }));
    }
  };

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
      if (parsedMessage.type === "number") {
        setUserNumber(parsedMessage.payload);
        console.log("Set user number:", parsedMessage.payload);
      } else if (parsedMessage.type === "userList") {
        setUsers(parsedMessage.payload);
        getCurrentPlayer(); // プレイヤー一覧を受け取った後に現在のプレイヤーを取得
      } else if (parsedMessage.type === "turn") {
        setIsMyTurn(true);
      } else if (parsedMessage.type === "previousMessage") {
        setPreviousMessage(parsedMessage.payload);
        setInput(parsedMessage.payload);
      } else if (parsedMessage.type === "result") {
        setResult(parsedMessage.payload ? "正解！" : "不正解！");
      } else if (parsedMessage.type === "currentPlayer") {
        setCurrentPlayer(parsedMessage.payload);
        console.log("Set current player:", parsedMessage.payload);
      } else if (parsedMessage.type === "error") {
        setError(parsedMessage.payload);
      } else if (parsedMessage.type === "initialImage") {
        setInitialImage(parsedMessage.payload);
      } else if (parsedMessage.type === "generatedImage") {
        setGeneratedImage(parsedMessage.payload);
        console.log("set //" + chatgpt);
      } else if (parsedMessage.type === "chatgpt") {
        setChatgpt(parsedMessage.payload);
        console.log("set chatgpt//" + chatgpt);
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
        <Link href="/">トップに戻る</Link>
        <p>お題</p>
        <figure>
          <Image
            src={`data:image/png;base64,${initialImage}`}
            alt="Received Data"
            width={512}
            height={512}
          />
        </figure>
        <p>生成された画像</p>
        <figure>
          <Image
            src={`data:image/png;base64,${generatedImage}`}
            alt="Received Data"
            width={512}
            height={512}
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
        <Timer userNumber={userNumber} totalTime={600} />
        <AnswerInput input={input} setInput={setInput} onSend={sendMessage} />
        {initialImage && !previousMessage && (
          <>
            <p>お題</p>
            <figure>
              <Image
                src={`data:image/png;base64,${initialImage}`}
                alt="Received Data"
                width={512}
                height={512}
              />
            </figure>
          </>
        )}
        {initialImage && previousMessage && (
          <>
            <div className="text-lg">前のメッセージ: {previousMessage}</div>
            <p>生成された画像</p>
            <figure>
              <Image
                src={`data:image/png;base64,${generatedImage}`}
                alt="Received Data"
                width={512}
                height={512}
              />
            </figure>
          </>
        )}
      </div>
    );
  }

  if (userNumber !== null && users.length === MAX_USERS) {
    return (
      <LobbyContext.Provider
        value={{
          currentPlayer,
          users,
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
        currentPlayer,
        users,
        isMyTurn,
        setIsMyTurn,
        sendMessage,
        getCurrentPlayer,
      }}
    >
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <ShowCurrentPlayer
          lobbyId={lobbyId}
          users={users}
          userNumber={userNumber}
        />
      </div>
    </LobbyContext.Provider>
  );
}
