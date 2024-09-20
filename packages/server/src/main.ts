import { createServer } from "http"
import { Server, Socket } from "socket.io"
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  User,
} from "./types"

const httpServer = createServer()
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
})

io.use((socket, next) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error("invalid username"))
  }
  socket.data.username = username
  next()
})

io.on("connection", (socket: Socket) => {
  // fetch existing users
  const users: User[] = []
  for (const [id, socket] of io.of("/").sockets) {
    users.push({
      userId: id,
      username: socket.data.username,
    })
  }
  socket.emit("users", users)

  // notify existing users
  socket.broadcast.emit("user connected", {
    userId: socket.id,
    username: socket.data.username,
  })

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    })
  })

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id)
  })
})

const PORT = process.env.PORT ?? 5174

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
)
