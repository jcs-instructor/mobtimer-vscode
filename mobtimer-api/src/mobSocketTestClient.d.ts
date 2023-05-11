import { SuccessfulResponse } from "./mobTimerResponse";
import { Action } from "./action";
import { MobSocketClient } from "./mobSocketClient";
import { MobState } from "./mobState";
import { IWebSocketWrapper } from "./iWebSocketWrapper";
declare class MobSocketTestClient extends MobSocketClient {
    private _successfulResponses;
    private _echoReceived;
    private _errorReceived;
    private _socket;
    constructor(webSocket: IWebSocketWrapper);
    private trackMessage;
    private convertToMobTimerResponse;
    static openSocketSync(webSocket: IWebSocketWrapper): MobSocketTestClient;
    static openSocket(webSocket: IWebSocketWrapper): Promise<MobSocketTestClient>;
    waitForLastResponse(): Promise<void>;
    waitForEcho(): Promise<void>;
    get lastSuccessfulResponse(): SuccessfulResponse;
    get lastSuccessfulAction(): Action;
    get lastSuccessfulMobState(): MobState;
    get successfulResponses(): string[];
    get echoReceived(): boolean;
    get errorReceived(): boolean;
}
export { MobSocketTestClient };
