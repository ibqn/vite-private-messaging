import { io } from "socket.io-client"

const URL = import.meta.env.SOCKET_IO_URL as string
export const socket = io(URL, { autoConnect: false })

socket.onAny((event, ...args) => {
  console.log(event, args)
})
