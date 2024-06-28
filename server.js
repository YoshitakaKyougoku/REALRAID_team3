const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");
const { generateImage } = require("./imageGenerator");
const { generateAnswer, translate, generatePrompt } = require("./chatgpt");

const server = createServer((req, res) => {
  // CORSヘッダーを追加
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONSリクエストに対するレスポンス
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 他のリクエストに対するレスポンス
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running.');
});
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
    } else if (parsedMessage.type === "exit" && currentLobby) {
      const exitUser = parsedMessage.payload;
      const lobby = lobbies[currentLobby];

      lobby.clients = lobby.clients.filter(
        (client) => client.userNumber !== exitUser
      );

      // 更新後のuserNumberを再設定
      lobby.clients.forEach((client, index) => {
        client.userNumber = index + 1;
      });

      const users = lobby.clients.map((client) => client.userName);

      lobby.clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      if (lobby.clients.length === 0) {
        delete lobbies[currentLobby];
      }
    } else if (parsedMessage.type === "startGame" && currentLobby) {
      const lobby = lobbies[currentLobby];
      if (lobby.clients[0].ws === ws) {
        lobby.clients[0].ws.send(
          JSON.stringify({ type: "turn", payload: true })
        );
        lobby.clients.forEach((client) => {
          client.ws.send(
            JSON.stringify({ type: "gameStarted", payload: true })
          );
        });
        const initialPrompt = await generatePrompt();
        lobby.originalMessage = initialPrompt;
        console.log(initialPrompt);
        const translatedPrompt = await translate(initialPrompt);
        console.log(translatedPrompt);
        const imageData = await generateImage(translatedPrompt);
        lobby.clients.forEach((client) => {
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
              client.ws.send(
                JSON.stringify({
                  type: "previousMessage",
                  payload: lobby.lastMessage,
                })
              );
              console.log("chatgptRes//" + chatgptRes);
              client.ws.send(
                JSON.stringify({ type: "chatgpt", payload: chatgptRes })
              );
            });
          } else {
            const nextClient = lobby.clients[lobby.currentTurn];
            lobby.clients.forEach((client) => {
              client.ws.send(
                JSON.stringify({ type: "generatedImage", payload: imageData })
              );
            });
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

      // Update user numbers and user list for remaining clients
      lobbies[currentLobby].clients.forEach((client, index) => {
        client.userNumber = index + 1;
      });

      const users = lobbies[currentLobby].clients.map(
        (client) => client.userName
      );
      lobbies[currentLobby].clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      if (lobbies[currentLobby].clients.length === 0) {
        delete lobbies[currentLobby];
      }
    }
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on ws://localhost:3001");
});
