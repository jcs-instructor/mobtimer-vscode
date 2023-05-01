import WebSocket from "ws";
import { IWebSocketWrapper } from "./iWebSocketWrapper";

export class WSWebSocketWrapper extends WebSocket implements IWebSocketWrapper {
  public set onmessage2(handler: (message: any) => void) {
    super.on("message", (message) => {
      handler({ data: message });
    });
  }
}
