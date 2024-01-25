import { BufferJSON } from "@whiskeysockets/baileys";

export function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, BufferJSON.replacer), BufferJSON.reviver)
}

