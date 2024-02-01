import { AnyMessageContent, delay, jidNormalizedUser, proto } from "@whiskeysockets/baileys"
import { WASocketType } from "../app"

export class BaseUtil {
  sock: WASocketType;
  msg: proto.IWebMessageInfo;

  constructor(sock: WASocketType, msg: proto.IWebMessageInfo) {
    this.sock = sock;
    this.msg = msg;
  }

  async sendMessageWTyping(msgContent: AnyMessageContent, jid: string) {
    await this.sock.presenceSubscribe(jid)
    await delay(500)

    await this.sock.sendPresenceUpdate('composing', jid)
    await delay(2000)

    await this.sock.sendPresenceUpdate('paused', jid)

    await this.sock.sendMessage(jid, msgContent, { quoted: this.msg })
  }

  sanitizePhoneNumber(number: string) {
    if (typeof number == 'undefined' || number == '') {
      return ''
    }

    number = number.split(':')[0]
    number = number.replace(/\D/g, '')

    if (number.startsWith('08')) {
      number = '62' + number.substring(1)
    }

    return number
  }

  formatToJid(number: string) {
    const jid = jidNormalizedUser(number)
    if (jid) {
      return jid
    }

    const sanitized = this.sanitizePhoneNumber(number)
    if (!sanitized) {
      return ''
    }

    return sanitized + '@s.whatsapp.net'
  }

}
