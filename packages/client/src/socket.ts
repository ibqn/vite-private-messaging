import { ClientToServerEvents, ServerToClientEvents } from "server/src/types"
import { io, Socket } from "socket.io-client"

// Extend the Socket type to include userId
type ExtendedSocket = Socket<ServerToClientEvents, ClientToServerEvents> & {
  userId?: string
}

const URL = import.meta.env.SOCKET_IO_URL as string
export const socket: ExtendedSocket = io(URL, { autoConnect: false })

socket.onAny((event, ...args) => {
  console.log(event, args)
})
