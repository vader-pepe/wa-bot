import { proto } from "@whiskeysockets/baileys";
import { WASocketType } from "../app";
import { Base } from "../Base";

export class ErrorHandler extends Base {
  error: string
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo, error: string) {
    super(sock, msg)
    this.sendError(error)
  }

  private async sendError(error: string) {
    return await this.sendMessageWTyping({ text: error }, this.msg.key.remoteJid!)
  }
}
