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
import Link from "next/link";

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
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (!lobbyId) return;

    // websocketに接続
    ws.current = new WebSocket("ws://localhost:3001");

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
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
      } else if (parsedMessage.type === "initialImage") {
        setInitialImage(parsedMessage.payload);
      } else if (parsedMessage.type === "generatedImage") {
        setGeneratedImage(parsedMessage.payload);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed, retrying...");
      retryWebSocketConnection();
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.current?.close();
    };
  };

  const retryWebSocketConnection = () => {
    if (retryTimeout.current) clearTimeout(retryTimeout.current);
    retryTimeout.current = setTimeout(() => {
      connectWebSocket();
    }, 3000); // 3秒後に再接続を試みる
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
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

  return (
    <PlayContext.Provider value={{ isMyTurn, setIsMyTurn, sendMessage }}>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        {isMyTurn && <Timer totalTime={600} />}
        {userNumber !== null && (
          <div className="text-lg">あなたの番号: {userNumber}</div>
        )}
        {initialImage ? (
          <div className="generated-image-area">
            <p>お題</p>
            <figure>
              <Image
                src={`data:image/png;base64,${initialImage}`}
                alt="Received Data"
                width={512}
                height={512}
              />
            </figure>
          </div>
        ) : (
          <div>画像を読み込み中...</div>
        )}
        {previousMessage && (
          <>
          <div className="text-lg">前のメッセージ: {previousMessage}</div>
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
        {isMyTurn ? (
          <AnswerInput input={input} setInput={setInput} onSend={sendMessage} />
        ) : (
          // Todo : 他のプレイヤーが操作中の画面の作成
          <Waiting />
        )}
      </div>
    </PlayContext.Provider>
  );
}
