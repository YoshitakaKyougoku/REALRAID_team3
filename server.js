const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");
const { generateImage } = require("./imageGenerator");
const { generateText } = require("./chatgpt");

const server = createServer();
const wss = new WebSocketServer({ server });

const lobbies = {};
const MAX_USERS = 4;

server.on("error", (error) => {
  console.error("HTTP server error:", error);
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

wss.on("connection", (ws) => {
  let currentLobby = null;
  let userNumber = null;

  // クライアントからメッセージが送られてきた時に呼ばれる
  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "join") {
      currentLobby = parsedMessage.payload.lobby;
      if (!lobbies[currentLobby]) {
        lobbies[currentLobby] = {
          clients: [],
          currentTurn: 0,
          originalMessage: "",
          lastMessage: "",
        };
      }
      if (lobbies[currentLobby].clients.length >= MAX_USERS) {
        ws.send(
          JSON.stringify({ type: "error", payload: "ロビーは満員です。" })
        );
        return;
      }
      userNumber = lobbies[currentLobby].clients.length + 1;
      lobbies[currentLobby].clients.push({ ws, userNumber });
      ws.send(JSON.stringify({ type: "number", payload: userNumber }));

      const users = lobbies[currentLobby].clients.map(
        (client) => client.userNumber
      );
      lobbies[currentLobby].clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      if (lobbies[currentLobby].clients.length === MAX_USERS) {
        try {
          const imageData = await generateImage(
            "Woman drinking iced coffee while looking left at a cafe"
          );
          lobbies[currentLobby].clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({ type: "initialImage", payload: imageData })
            );
            client.ws.send(JSON.stringify({ type: "playing" }));
          });
          // プレイヤー1のターンを最初に設定
          lobbies[currentLobby].clients[0].ws.send(
            JSON.stringify({ type: "turn", payload: true })
          );
        } catch (error) {
          lobbies[currentLobby].clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                type: "error",
                payload: "画像の生成に失敗しました。",
              })
            );
          });
        }
      }
    } else if (parsedMessage.type === "message" && currentLobby) {
      const lobby = lobbies[currentLobby];
      const currentClient = lobby.clients[lobby.currentTurn];
      if (currentClient.ws === ws) {
        if (lobby.currentTurn === 0) {
          lobby.originalMessage =
            "Woman drinking iced coffee while looking left at a cafe";
        }
        lobby.lastMessage = parsedMessage.payload;

        lobby.currentTurn = (lobby.currentTurn + 1) % lobby.clients.length;

        try {
          const imageData = await generateImage(lobby.lastMessage);

          if (lobby.currentTurn === 0) {
            const isCorrect = lobby.lastMessage === lobby.originalMessage;
            console.log("call chatgpt");
            const chatgptRes = await generateText(
              lobby.originalMessage,
              lobby.lastMessage
            );

            lobby.clients.forEach(async (client) => {
              client.ws.send(
                JSON.stringify({
                  type: "result",
                  payload: isCorrect,
                })
              );
              client.ws.send(
                JSON.stringify({
                  type: "generatedImage",
                  payload: imageData,
                })
              );
              console.log("chatgptRes//" + chatgptRes);
              client.ws.send(
                JSON.stringify({ type: "chatgpt", payload: chatgptRes })
              );
            });
          } else {
            const nextClient = lobby.clients[lobby.currentTurn];
            nextClient.ws.send(
              JSON.stringify({ type: "generatedImage", payload: imageData })
            );
            nextClient.ws.send(JSON.stringify({ type: "turn", payload: true }));
            nextClient.ws.send(
              JSON.stringify({
                type: "previousMessage",
                payload: lobby.lastMessage,
              })
            );
          }
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: "error",
              payload: "画像の生成に失敗しました。",
            })
          );
          // すべてのクライアントに現在プレイしているユーザーを送信
          lobby.clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                type: "currentPlayer",
                payload: lobby.clients[lobby.currentTurn].userNumber,
              })
            );
          });
        }
      }
    } else if (parsedMessage.type === "getCurrentPlayer" && currentLobby) {
      const lobby = lobbies[currentLobby];
      if (lobby) {
        const currentPlayerNumber = lobby.clients[lobby.currentTurn].userNumber;
        ws.send(
          JSON.stringify({
            type: "currentPlayer",
            payload: currentPlayerNumber,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    if (currentLobby && lobbies[currentLobby]) {
      lobbies[currentLobby].clients = lobbies[currentLobby].clients.filter(
        (client) => client.ws !== ws
      );
      if (lobbies[currentLobby].clients.length === 0) {
        delete lobbies[currentLobby];
      }
    }
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on ws://localhost:3001");
});
