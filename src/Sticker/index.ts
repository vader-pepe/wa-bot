import { AnyMessageContent, downloadMediaMessage, proto } from "@whiskeysockets/baileys";
import Sticker from "wa-sticker-formatter";
import { ErrorHandler } from "../ErrorHandler";

export class StickerFactory {
  msg: proto.IWebMessageInfo
  sendMessageWTyping: (msg: AnyMessageContent, jid: string) => Promise<void>
  constructor(msg: proto.IWebMessageInfo, w: (msg: AnyMessageContent, jid: string) => Promise<void>) {
    this.msg = msg
    this.sendMessageWTyping = w
  }

  async createSticker() {
    const buff = await downloadMediaMessage(this.msg, "buffer", {}) as Buffer
    const { type } = this.getMessageMedia(this.msg.message)
    if (type === 'video') {
      return new ErrorHandler(this.sendMessageWTyping, this.msg, "Saat ini bot belum support video")
    }

    const sticker = new Sticker(buff, {
      quality: 50,
      author: this.msg?.pushName ?? "",
    });

    const media = await sticker.toBuffer()
    if (type === 'image' || media.length < 1024 * 1000) {
      return await this.sendMessageWTyping({ sticker: media, isAnimated: true }, this.msg.key.remoteJid)
    }
    return new ErrorHandler(this.sendMessageWTyping, this.msg, "Gambar terlalu besar!")
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
