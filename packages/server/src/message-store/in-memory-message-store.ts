import { Message } from "../types"
import { MessageStore } from "./message-store"

export class InMemoryMessageStore extends MessageStore {
  private messagesByUserId = new Map<string, Message[]>()

  async saveMessage(userId: string, message: Message): Promise<void> {
    const messages = [...(this.messagesByUserId.get(userId) ?? []), message]
    this.messagesByUserId.set(userId, messages)
  }

  async getMessagesByUserId(userId: string): Promise<Message[]> {
    const messages = this.messagesByUserId.get(userId) ?? []
    return messages
  }
}
