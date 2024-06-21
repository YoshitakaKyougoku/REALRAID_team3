const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");
const { generateImage } = require("./imageGenerator");

const server = createServer();
const wss = new WebSocketServer({ server });

const lobbies = {};
// 最大4人まで参加可能
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
    // プレイヤーがロビーに入室する
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
      // ロビーの人数が最大人数を超えていたら忠告する
      if (lobbies[currentLobby].clients.length >= MAX_USERS) {
        ws.send(
          JSON.stringify({ type: "error", payload: "ロビーは満員です。" })
        );
        return;
      }
      // ロビーに入室したプレイヤーに番号を割り当てる
      userNumber = lobbies[currentLobby].clients.length + 1;
      lobbies[currentLobby].clients.push({ ws, userNumber });
      ws.send(JSON.stringify({ type: "number", payload: userNumber }));

      // ロビーに入室したプレイヤーに他のプレイヤーのリストを送信する
      const users = lobbies[currentLobby].clients.map(
        (client) => client.userNumber
      );
      lobbies[currentLobby].clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      if (lobbies[currentLobby].clients.length === MAX_USERS) {
        try {
          const imageData = await generateImage("girl");
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
          lobby.originalMessage = parsedMessage.payload;
        }
        lobby.lastMessage = parsedMessage.payload;

        lobby.currentTurn = (lobby.currentTurn + 1) % lobby.clients.length;

        try {
          const imageData = await generateImage(lobby.lastMessage);

          if (lobby.currentTurn === 0) {
            const isCorrect = lobby.lastMessage === lobby.originalMessage;
            lobby.clients.forEach((client) => {
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
        }
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
