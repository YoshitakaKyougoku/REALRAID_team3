const { WebSocketServer, WebSocket } = require("ws");
const { createServer } = require("http");

const server = createServer();
const wss = new WebSocketServer({ server });

const rooms = {};
const MAX_USERS = 4;

wss.on("connection", (ws) => {
  let currentRoom = null;
  let userNumber = null;

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      currentRoom = parsedMessage.payload.room;
      if (!rooms[currentRoom]) {
        rooms[currentRoom] = {
          clients: [],
          currentTurn: 0,
          originalMessage: "",
          lastMessage: "",
        };
      }
      if (rooms[currentRoom].clients.length >= MAX_USERS) {
        ws.send(
          JSON.stringify({ type: "error", payload: "ルームは満員です。" })
        );
        return;
      }
      userNumber = rooms[currentRoom].clients.length + 1;
      rooms[currentRoom].clients.push({ ws, userNumber });
      ws.send(JSON.stringify({ type: "number", payload: userNumber }));

      const users = rooms[currentRoom].clients.map(
        (client) => client.userNumber
      );
      rooms[currentRoom].clients.forEach((client) => {
        client.ws.send(JSON.stringify({ type: "userList", payload: users }));
      });

      if (rooms[currentRoom].clients.length === MAX_USERS) {
        rooms[currentRoom].clients.forEach((client) => {
          client.ws.send(JSON.stringify({ type: "startGame" }));
        });
        // プレイヤー1のターンを最初に設定
        rooms[currentRoom].clients[0].ws.send(
          JSON.stringify({ type: "turn", payload: true })
        );
      }
    } else if (parsedMessage.type === "message" && currentRoom) {
      const room = rooms[currentRoom];
      const currentClient = room.clients[room.currentTurn];
      if (currentClient.ws === ws) {
        if (room.currentTurn === 0) {
          room.originalMessage = parsedMessage.payload;
        }
        room.lastMessage = parsedMessage.payload;

        room.currentTurn = (room.currentTurn + 1) % room.clients.length;

        if (room.currentTurn === 0) {
          const isCorrect = room.lastMessage === room.originalMessage;
          room.clients.forEach((client) => {
            client.ws.send(
              JSON.stringify({
                type: "result",
                payload: isCorrect,
              })
            );
          });
        } else {
          const nextClient = room.clients[room.currentTurn];
          nextClient.ws.send(JSON.stringify({ type: "turn", payload: true }));
          nextClient.ws.send(
            JSON.stringify({
              type: "previousMessage",
              payload: room.lastMessage,
            })
          );
        }
      }
    }
  });

  ws.on("close", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].clients = rooms[currentRoom].clients.filter(
        (client) => client.ws !== ws
      );
      if (rooms[currentRoom].clients.length === 0) {
        delete rooms[currentRoom];
      }
    }
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on ws://localhost:3001");
});
