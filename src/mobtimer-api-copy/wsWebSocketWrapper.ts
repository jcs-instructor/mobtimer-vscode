import WebSocket from "ws";
import { IWebSocketWrapper } from "./iWebSocketWrapper";

export class WSWebSocketWrapper extends WebSocket implements IWebSocketWrapper {
  constructor(url: string) {
    super(url);
  }

  public get socketState(): number {
    return super.readyState;
  }

  public sendMessage(message: string): void {
    super.send(message);
  }

  public closeSocket(): void {
    super.close();
  }

  public get OPEN_CODE(): number {
    return super.OPEN;
  }

  public get CLOSED_CODE(): number {
    return super.CLOSED;
  }

  public set onmessageReceived(handler: (message: any) => void) {
    super.on("message", (message) => {
      handler({ data: message });
    });
  }
}
