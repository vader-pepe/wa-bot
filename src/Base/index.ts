import { proto } from "@whiskeysockets/baileys";
import { WASocketType } from "../app";
import { BaseUtil } from "../Utils";

export class Base extends BaseUtil {
  constructor(sock: WASocketType, msg: proto.IWebMessageInfo) {
    super(sock, msg)
  }
}
