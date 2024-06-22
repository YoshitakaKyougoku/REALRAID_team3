const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");

const server = createServer();
const wss = new WebSocketServer({ server });

const lobbies = {};
const MAX_USERS = 4;

wss.on("connection", (ws) => {
  let currentLobby = null;
  let userNumber = null;

  ws.on("message", (message) => {
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
        lobbies[currentLobby].clients[0].ws.send(
          JSON.stringify({ type: "turn", payload: true })
        );
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

        if (lobby.currentTurn === 0) {
          const isCorrect = lobby.lastMessage === lobby.originalMessage;
          lobby.clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                type: "result",
                payload: isCorrect,
              })
            );
          });
        } else {
          const nextClient = lobby.clients[lobby.currentTurn];
          nextClient.ws.send(JSON.stringify({ type: "turn", payload: true }));
          nextClient.ws.send(
            JSON.stringify({
              type: "previousMessage",
              payload: lobby.lastMessage,
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
