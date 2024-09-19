export interface ServerToClientEvents {
  users: (users: User[]) => void
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
}
