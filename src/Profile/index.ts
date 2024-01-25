import { AnyMessageContent, downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { WASocketType } from "../app";
import { ErrorHandler } from "../ErrorHandler";

export class Profile {
  sock: WASocketType
  msg: proto.IWebMessageInfo
  sendMessageWTyping: (msg: AnyMessageContent, jid: string) => Promise<void>
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo, w: (msg: AnyMessageContent, jid: string) => Promise<void>) {
    this.sock = sock
    this.sendMessageWTyping = w
    this.msg = msg
  }

  async listen(command: string) {
    const splitted = command.split(" ")
    const secondCommand = splitted[1]
    switch (secondCommand) {
      case "photo":
        return await this.changePhotoProfile()

      default:
        break;
    }

  }

  async changePhotoProfile() {
    const msg = this.msg?.message ?? undefined
    const isImage = Object.keys(msg)[0].includes("imageMessage")
    const isText = Object.keys(msg)[0].includes("extendedTextMessage")
    if (isText) {
      return new ErrorHandler(this.sendMessageWTyping, this.msg, "Pastikan memberikan photo!")
    }

    if (isImage) {
      const buff = await downloadMediaMessage(this.msg, "buffer", {}) as Buffer
      // TODO: check NSFW here
      return await this.sock.updateProfilePicture(this.msg.key.remoteJid!, buff)
    }

    return new ErrorHandler(this.sendMessageWTyping, this.msg, "File tidak diterima")
  }


  // async changeStatus(status: Array<string>) {
  //   if (status[2]) {
  //     return await this.client.setStatus(status[2])
  //   }
  //   return new ErrorHandler(this.msg, "Please provide a Status!")
  // }

}
