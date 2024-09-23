import { Session } from "../types"
import { SessionStore } from "./session-store"

export class InMemorySessionStore extends SessionStore {
  private sessions = new Map<string, Session>()

  async findSessionById(id: string): Promise<Session | null> {
    return this.sessions.get(id) ?? null
  }

  async saveSession(session: Session): Promise<void> {
    this.sessions.set(session.id, session)
  }

  async getAllSessions(): Promise<Session[]> {
    return [...this.sessions.values()]
  }
}
