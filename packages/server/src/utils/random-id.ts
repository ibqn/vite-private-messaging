import crypto from "crypto"

export const randomId = (): string => crypto.randomUUID()
