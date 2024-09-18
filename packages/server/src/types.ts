export interface ServerToClientEvents {
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
}

export interface SocketData {
  username: string;
}


export type User = {
  userID: string;
  username: string;
}
