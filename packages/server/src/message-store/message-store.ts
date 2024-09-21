import { Message } from "../types"

export abstract class MessageStore {
  abstract saveMessage(userId: string, message: Message): Promise<void>
  abstract getMessagesByUserId(userId: string): Promise<Message[]>
}
