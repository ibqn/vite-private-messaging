export interface ServerToClientEvents {
  users: (users: User[]) => void
  "user connected": (user: User) => void
  "user disconnected": (userId: string) => void
  session: (data: { sessionId: string; userId: string }) => void
  "private message": (data: {
    content: string
    from: string
    to: string
  }) => void
}

export interface ClientToServerEvents {
  "private message": (data: { content: string; to: string }) => void
}

export interface InterServerEvents {}

export interface SocketData {
  username: string
  userId: string
  sessionId: string
}

export type User = {
  userId: string
  username: string
  self?: boolean
  connected?: boolean
  messages?: Message[]
  hasNewMessages?: boolean
}

export type Message = {
  content: string
  fromSelf?: boolean
  to?: string
  from?: string
}

export type Session = {
  id: string
  userId: string
  username: string
  connected: boolean
}
