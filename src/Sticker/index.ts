import { downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import { Base } from "../Base";
import { WASocketType } from "../app";
import { StickerTypes, createSticker } from "wa-sticker-formatter";

export class StickerFactory extends Base {
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo) {
    super(sock, msg)
  }

  async createSticker() {
    const buff = await downloadMediaMessage(this.msg, "buffer", {}) as Buffer
    const { type } = this.getMessageMedia(this.msg.message)
    const sticker = await createSticker(buff, { author: this.msg?.pushName ?? "", type: StickerTypes.CROPPED })

    if (type === 'image' || type === 'video') {
      return await this.sendMessageWTyping({ sticker: sticker }, this.msg.key.remoteJid)
    }
  }

  private getMessageMedia(message: proto.IWebMessageInfo['message']): {
    media: proto.Message.IImageMessage | proto.Message.IVideoMessage
    type: 'image' | 'video'
    viewOnce: boolean
  } {
    if (message?.imageMessage) {
      return { media: message.imageMessage, type: 'image', viewOnce: false }
    }
    if (message?.videoMessage) {
      return { media: message.videoMessage, type: 'video', viewOnce: false }
    }

    if (message?.viewOnceMessageV2?.message?.imageMessage) {
      return { media: message?.viewOnceMessageV2?.message?.imageMessage, type: 'image', viewOnce: true }
    }
    if (message?.viewOnceMessageV2?.message?.videoMessage) {
      return { media: message?.viewOnceMessageV2?.message?.videoMessage, type: 'video', viewOnce: true }
    }

    if (message?.viewOnceMessage?.message?.imageMessage) {
      return { media: message?.viewOnceMessage?.message?.imageMessage, type: 'image', viewOnce: true }
    }
    if (message?.viewOnceMessage?.message?.videoMessage) {
      return { media: message?.viewOnceMessage?.message?.videoMessage, type: 'video', viewOnce: true }
    }

    return null
  }

}
