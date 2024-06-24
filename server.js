const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");
const { generateImage } = require("./imageGenerator");
const { generateAnswer } = require("./chatgpt");
const { translate } = require("./chatgpt");
const { generatePrompt } = require("./chatgpt");

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
  let userName = null;

  // クライアントからメッセージが送られてきた時に呼ばれる
  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "join") {
      currentLobby = parsedMessage.payload.lobby;
      userName = parsedMessage.payload.userName;
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
      lobbies[currentLobby].clients.push({ ws, userNumber, userName });
      ws.send(JSON.stringify({ type: "number", payload: userNumber }));

      const users = lobbies[currentLobby].clients.map(
        (client) => client.userName
      );
      lobbies[currentLobby].clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      // ユーザー番号1に権限を付与
      if (lobbies[currentLobby].clients.length === 1) {
        lobbies[currentLobby].clients[0].ws.send(
          JSON.stringify({ type: "authority", payload: true })
        );
      }

      // ユーザーが4人以上になったら、エラーを返す
      // if (lobbies[currentLobby].clients.length === MAX_USERS) {
      //   lobbies[currentLobby].clients[0].ws.send(
      //     JSON.stringify({ type: "turn", payload: true })
      //   );
      // }
    } else if (parsedMessage.type === "startGame" && currentLobby) {
      const lobby = lobbies[currentLobby];
      const initialPrompt = await generatePrompt();
      lobby.originalMessage = initialPrompt;
      console.log(initialPrompt);
      const translatedPrompt = await translate(initialPrompt);
      console.log(translatedPrompt);
      const imageData = await generateImage(translatedPrompt);
      if (lobby.clients[0].ws === ws) {
        lobby.clients[0].ws.send(
          JSON.stringify({ type: "turn", payload: true })
        );
        lobby.clients.forEach((client) => {
          client.ws.send(
            JSON.stringify({ type: "gameStarted", payload: true })
          );
          client.ws.send(
            JSON.stringify({ type: "initialImage", payload: imageData })
          );
        });
      }
    } else if (parsedMessage.type === "message" && currentLobby) {
      const lobby = lobbies[currentLobby];
      const currentClient = lobby.clients[lobby.currentTurn];
      if (currentClient.ws === ws) {
        if (lobby.currentTurn === 0) {
          
        }
        lobby.lastMessage = parsedMessage.payload;

        lobby.currentTurn = (lobby.currentTurn + 1) % lobby.clients.length;

        try {
          const translatedPrompt = await translate(lobby.lastMessage);
          const imageData = await generateImage(translatedPrompt);

          if (lobby.currentTurn === 0) {
            const isCorrect = lobby.lastMessage === lobby.originalMessage;
            console.log("call chatgpt");
            const chatgptRes = await generateAnswer(
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
              client.ws.send(
                JSON.stringify({
                  type: "initialPrompt",
                  payload: lobby.originalMessage,
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
          lobby.clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                type: "currentPlayer",
                payload: nextClient.userName,
              })
            );
          });
        }
      }
    } else if (parsedMessage.type === "getCurrentPlayer" && currentLobby) {
      const lobby = lobbies[currentLobby];
      if (lobby) {
        const currentPlayer = lobby.clients[lobby.currentTurn].userName;
        ws.send(
          JSON.stringify({
            type: "currentPlayer",
            payload: currentPlayer,
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
