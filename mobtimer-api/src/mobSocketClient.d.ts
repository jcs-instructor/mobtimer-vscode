import { IWebSocketWrapper } from "./iWebSocketWrapper";
declare class MobSocketClient {
    private _webSocket;
    constructor(webSocket: IWebSocketWrapper);
    static openSocketSync(webSocket: IWebSocketWrapper): MobSocketClient;
    static openSocket(webSocket: IWebSocketWrapper): Promise<MobSocketClient>;
    static waitForSocketState(socket: {
        socketState: number;
    }, state: number): Promise<void>;
    waitForSocketState(state: number): Promise<void>;
    sendEchoRequest(): void;
    joinMob(mobName: string): void;
    update(durationMinutes: number): void;
    addParticipant(name: string): void;
    rotateParticipants(): void;
    shuffleParticipants(): void;
    editParticipants(participants: string[]): void;
    start(): void;
    pause(): void;
    reset(): void;
    private _sendJSON;
    get webSocket(): IWebSocketWrapper;
    closeSocket(): Promise<void>;
}
export { MobSocketClient };
