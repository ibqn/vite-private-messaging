import { Message } from "../types"
import { MessageStore } from "./message-store"

export class InMemoryMessageStore extends MessageStore {
  private messages: Message[] = []

  async saveMessage(message: Message): Promise<void> {
    this.messages.push(message)
  }

  async getMessagesByUserId(userId: string): Promise<Message[]> {
    return this.messages.filter(
      (message) => message.from === userId || message.to === userId
    )
  }
}
