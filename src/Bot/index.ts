import { proto } from "@whiskeysockets/baileys";
import { ErrorHandler } from "../ErrorHandler";
import { StickerFactory } from "../Sticker";
import { Waifu } from "../Waifu";
import { WASocketType } from "../app";
import { Profile } from "../Profile";
import { Base } from "../Base";

export class Bot extends Base {
  prefix: string

  constructor(sock: WASocketType, msg: proto.IWebMessageInfo, prefix: string) {
    super(sock, msg)
    this.prefix = prefix
  }

  async listen() {
    const msg = this.msg?.message ?? undefined
    let command: string = ""
    switch (true) {
      // group
      case Object.keys(msg)[0].includes("conversation"):
        command = this.msg.message.conversation
        break;
      // image
      case Object.keys(msg)[0].includes("imageMessage"):
        command = this.msg.message.imageMessage.caption
        break;
      // video
      case Object.keys(msg)[0].includes("videoMessage"):
        command = this.msg.message.videoMessage.caption
        break;
      // dm
      case Object.keys(msg)[0].includes("extendedTextMessage"):
        command = this.msg.message.extendedTextMessage.text
        break;

      default:
        break;
    }

    switch (true) {
      case (command.startsWith(`${this.prefix}menu`)):
        return await this.sendMessageWTyping({
          text: `Menu:
    1. [${this.prefix}menu] Tampilkan menu ini
    2. [${this.prefix}sticker] Ubah media menjadi stiker
    3. [${this.prefix}waifu] Temukan cinta sejati anda!
    4. [${this.prefix}profile] 
        -photo- Ubah photo profile bot ini!
`}, this.msg.key.remoteJid!)

      case (command.startsWith(`${this.prefix}sticker`)):
        const sticker = new StickerFactory(this.sock, this.msg)
        return await sticker.createSticker()

      case (command.startsWith(`${this.prefix}waifu`)):
        const waifu = new Waifu(this.sock, this.msg)
        return await waifu.generateWaifu()

      case (command.startsWith(`${this.prefix}profile`)):
        const p = new Profile(this.sock, this.msg);
        return await p.listen(command)

      default:
        if (command.startsWith(this.prefix)) {
          return new ErrorHandler(this.sock, this.msg, 'Perintah tidak ditemukan!')
        }
    }
  }
}
