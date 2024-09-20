export interface ServerToClientEvents {
  users: (users: User[]) => void
  "user connected": (user: User) => void
  "user disconnected": (userID: string) => void
}

export interface ClientToServerEvents {
  hello: () => void
}

export interface InterServerEvents {}

export interface SocketData {
  username: string
}

export type User = {
  userID: string
  username: string
  self?: boolean
  connected?: boolean
  messages?: Message[]
  hasNewMessages?: boolean
}

export type Message = {
  content: string
  fromSelf?: boolean
}

export type Session = {
  id: string
  userId: string
}
