import { AnyMessageContent, proto } from "@whiskeysockets/baileys";

export class ErrorHandler {
  msg: proto.IWebMessageInfo
  sendMessageWTyping: (msg: AnyMessageContent, jid: string) => Promise<void>
  error: string
  constructor(w: (msg: AnyMessageContent, jid: string) => Promise<void>, msg: proto.IWebMessageInfo, error: string) {
    this.sendMessageWTyping = w
    this.msg = msg
    this.sendError(error)
  }

  private async sendError(error: string) {
    return await this.sendMessageWTyping({ text: error }, this.msg.key.remoteJid!)
  }
}
