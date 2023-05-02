import WebSocket from "ws";
import { IWebSocketWrapper } from "./iWebSocketWrapper";

export class WSWebSocketWrapper extends WebSocket implements IWebSocketWrapper {
  constructor(url: string) {
    super(url);
  }

  public set onmessageReceived(handler: (message: any) => void) {
    super.on("message", (message) => {
      handler({ data: message });
    });
  }
}
