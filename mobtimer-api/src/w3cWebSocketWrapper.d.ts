import { IWebSocketWrapper } from "./iWebSocketWrapper";
export declare class W3CWebSocketWrapper implements IWebSocketWrapper {
    private _webSocket;
    constructor(url: string);
    get socketState(): number;
    sendMessage(message: string): void;
    closeSocket(): void;
    get OPEN_CODE(): number;
    get CLOSED_CODE(): number;
    set onmessageReceived(handler: (message: {
        data: any;
    }) => void);
}
