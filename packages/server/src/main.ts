import { createServer } from "http"
import { Server, Socket } from "socket.io"
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  User,
} from "./types"
import { InMemorySessionStore } from "./session-store/in-memory-session-store"
import { randomId } from "./utils/random-id"

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

const sessionStore = new InMemorySessionStore()

io.use(async (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId

  if (sessionId) {
    const session = await sessionStore.finsSessionById(sessionId)
    if (session) {
      socket.data.sessionId = sessionId
      socket.data.userId = session.userId
      socket.data.username = session.username
      return next()
    }
  }
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error("invalid username"))
  }
  socket.data.sessionId = randomId()
  socket.data.userId = randomId()
  socket.data.username = username
  next()
})

io.on("connection", async (socket: Socket) => {
  // persist session
  await sessionStore.saveSession({
    id: socket.data.sessionId,
    userId: socket.data.userId,
    username: socket.data.username,
    connected: true,
  })

  // emit session details
  socket.emit("session", {
    sessionId: socket.data.sessionId,
    userId: socket.data.userId,
  })

  // join the userId room
  socket.join(socket.data.userId)

  // fetch existing users
  const users: User[] = []
  const sessions = await sessionStore.getAllSessions()
  sessions.forEach((session) => {
    users.push({
      userId: session.userId,
      username: session.username,
      connected: session.connected,
    })
  })
  socket.emit("users", users)

  // notify existing users
  socket.broadcast.emit("user connected", {
    userId: socket.data.userId,
    username: socket.data.username,
    connected: true,
  })

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).to(socket.data.userId).emit("private message", {
      content,
      from: socket.data.userId,
      to,
    })
  })

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.data.userID).fetchSockets()
    const isDisconnected = matchingSockets.length === 0
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.data.userId)
      // update the connection status of the session
      await sessionStore.saveSession({
        id: socket.data.sessionId,
        userId: socket.data.userId,
        username: socket.data.username,
        connected: false,
      })
    }
  })
})

const PORT = process.env.PORT ?? 5174

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
)
