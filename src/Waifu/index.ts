import { proto } from "@whiskeysockets/baileys";
import { ErrorHandler } from "../ErrorHandler";
import { Base } from "../Base";
import { WASocketType } from "../app";

type WaifuResponse = {
  images: Array<
    {
      signature: string
      extension: string
      image_id: number
      favorites: number
      dominant_color: string
      source: string | URL
      artist: {
        artist_id: number
        name: string
        patreon?: null
        pixiv?: string | URL
        twitter?: string | URL
        deviant_art?: string | URL
      }
      uploaded_at: string
      liked_at?: string
      is_nsfw: boolean
      width: number
      height: number
      byte_size: number
      url: string | URL
      preview_url: string | URL
      tags: [
        {
          tag_id: number
          name: string
          description: string
          is_nsfw: boolean
        },
        {
          tag_id: number
          name: string
          description: string
          is_nsfw: boolean
        }
      ]
    }>
} | null

export class Waifu extends Base {
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo) {
    super(sock, msg)
  }

  async generateWaifu() {
    const apiUrl = 'https://api.waifu.im/search' // Replace with the actual API endpoint URL
    const params = {}

    const queryParams = new URLSearchParams(params)
    const requestUrl = `${apiUrl}?${queryParams}`

    const response = await fetch(requestUrl)
    let data: WaifuResponse = null
    if (response.ok) {
      data = await response.json() as WaifuResponse
    } else {
      return new ErrorHandler(this.sock, this.msg, 'Gambar tidak berhasil didapatkan!')
    }

    const fimg = await fetch(data?.images[0].url ?? '')
    const fimgb = Buffer.from(await fimg.arrayBuffer())

    return await this.sendMessageWTyping({ image: fimgb }, this.msg.key.remoteJid!)
  }
}
