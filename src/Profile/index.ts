import { downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { WASocketType } from "../app";
import { ErrorHandler } from "../ErrorHandler";
import { Base } from "../Base";

export class Profile extends Base {
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo) {
    super(sock, msg)
  }

  async listen(command: string) {
    const splitted = command.split(" ")
    const secondCommand = splitted[1]
    switch (secondCommand) {
      case "photo":
        return await this.changePhotoProfile()
      case "status":
        return await this.changeStatus(splitted)

      default:
        break;
    }
  }

  async changePhotoProfile() {
    const msg = this.msg?.message ?? undefined
    const isImage = Object.keys(msg)[0].includes("imageMessage")
    const isText = Object.keys(msg)[0].includes("extendedTextMessage")
    if (isText) {
      return new ErrorHandler(this.sock, this.msg, "Pastikan memberikan photo!")
    }

    if (isImage) {
      const buff = await downloadMediaMessage(this.msg, "buffer", {}) as Buffer
      // TODO: check NSFW here
      await this.sock.updateProfilePicture(this.formatToJid(process.env.BOT_NUMBER), buff)
      return await this.sendMessageWTyping({ text: "Photo profile berhasil diubah!" }, this.msg.key.remoteJid!)
    }

    return new ErrorHandler(this.sock, this.msg, "File tidak diterima")
  }

  private extractFromThirdElement(inputString: string): string {
    // Split the string by spaces
    const words: string[] = inputString.split(' ');

    // Check if there are at least three elements
    if (words.length >= 3) {
      // Extract elements from the third element to the last element
      const result: string[] = words.slice(2);

      // Join the elements into a new string
      const resultString: string = result.join(' ');

      return resultString;
    } else {
      // Return an empty string if there are less than three elements
      return '';
    }
  }

  async changeStatus(status: Array<string>) {
    if (status[2]) {
      await this.sock.updateProfileStatus(this.extractFromThirdElement(status.join(" ")))
      return await this.sendMessageWTyping({ text: "Status profil berhasil diubah!" }, this.msg.key.remoteJid!)
    }
    return new ErrorHandler(this.sock, this.msg, "Please provide a Status!")
  }

}
