import { Message } from "../types"
import { MessageStore } from "./message-store"
import assert from "assert"

export class InMemoryMessageStore extends MessageStore {
  private messagesByUserId = new Map<string, Message[]>()

  async saveMessage(message: Message): Promise<void> {
    const { to, from } = message

    assert(to && from, "Message should have 'to' and 'from' fields")

    const saveMessageForUserId = (userId: string) => {
      const messages = [...(this.messagesByUserId.get(userId) ?? []), message]
      this.messagesByUserId.set(userId, messages)
    }

    saveMessageForUserId(from)

    if (to !== from) {
      saveMessageForUserId(to)
    }
  }

  async getMessagesByUserId(userId: string): Promise<Message[]> {
    const messages = this.messagesByUserId.get(userId) ?? []
    return messages
  }
}
