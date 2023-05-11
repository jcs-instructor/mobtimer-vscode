"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobSocketTestClient = void 0;
const action_1 = require("./action");
const mobSocketClient_1 = require("./mobSocketClient");
class MobSocketTestClient extends mobSocketClient_1.MobSocketClient {
    constructor(webSocket) {
        super(webSocket);
        this._successfulResponses = [];
        this._echoReceived = false;
        this._errorReceived = false;
        this._socket = webSocket;
        this._socket.onmessageReceived = (message) => {
            console.log("message:::::::::::::::", message);
            this.trackMessage(message);
        };
    }
    trackMessage(message) {
        const responseObject = this.convertToMobTimerResponse(message.data);
        switch (responseObject.actionInfo.action) {
            case action_1.Action.Echo: {
                this._echoReceived = true;
                break;
            }
            case action_1.Action.InvalidRequestError: {
                this._errorReceived = true;
                break;
            }
            default: {
                console.log("pushing message.data", message.data);
                this._successfulResponses.push(message.data);
                break;
            }
        }
    }
    convertToMobTimerResponse(response) {
        return JSON.parse(response);
    }
    static openSocketSync(webSocket) {
        const mobSocketTestClient = new MobSocketTestClient(webSocket);
        return mobSocketTestClient;
    }
    static openSocket(webSocket) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobSocketTestClient = new MobSocketTestClient(webSocket);
            yield mobSocketTestClient.waitForSocketState(mobSocketTestClient.webSocket.OPEN_CODE);
            return mobSocketTestClient;
        });
    }
    waitForLastResponse() {
        const _super = Object.create(null, {
            sendEchoRequest: { get: () => super.sendEchoRequest }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.sendEchoRequest.call(this);
            yield this.waitForEcho();
        });
    }
    waitForEcho() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this;
            return new Promise(function (resolve) {
                const timeout = setTimeout(function () {
                    if (client.echoReceived) {
                        resolve();
                    }
                    client.waitForEcho().then(resolve);
                }, 10);
                timeout.unref();
            });
        });
    }
    get lastSuccessfulResponse() {
        return JSON.parse(this._successfulResponses.at(-1) || "");
    }
    get lastSuccessfulAction() {
        const lastSuccessfulResponse = this.lastSuccessfulResponse;
        return lastSuccessfulResponse.actionInfo.action;
    }
    get lastSuccessfulMobState() {
        const lastSuccessfulResponse = this.lastSuccessfulResponse;
        return lastSuccessfulResponse.mobState;
    }
    get successfulResponses() {
        return [...this._successfulResponses];
    }
    get echoReceived() {
        return this._echoReceived;
    }
    get errorReceived() {
        return this._errorReceived;
    }
}
exports.MobSocketTestClient = MobSocketTestClient;
//# sourceMappingURL=mobSocketTestClient.js.map