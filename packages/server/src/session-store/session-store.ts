import { Session } from "../types"

export abstract class SessionStore {
  abstract findSessionById(id: string): Promise<Session | null>
  abstract saveSession(session: Session): Promise<void>
  abstract getAllSessions(): Promise<Session[]>
}
