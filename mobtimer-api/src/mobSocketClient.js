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
exports.MobSocketClient = void 0;
const action_1 = require("./action");
class MobSocketClient {
    constructor(webSocket) {
        this._webSocket = webSocket;
    }
    static openSocketSync(webSocket) {
        const mobSocketClient = new MobSocketClient(webSocket);
        return mobSocketClient;
    }
    static openSocket(webSocket) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobSocketClient = new MobSocketClient(webSocket);
            yield MobSocketClient.waitForSocketState(mobSocketClient.webSocket, mobSocketClient.webSocket.OPEN_CODE);
            return mobSocketClient;
        });
    }
    static waitForSocketState(socket, state) {
        const client = this;
        return new Promise(function (resolve) {
            const timeout = setTimeout(function () {
                if (socket.socketState === state) {
                    resolve();
                }
                else {
                    MobSocketClient.waitForSocketState(socket, state).then(resolve);
                }
            });
        });
    }
    waitForSocketState(state) {
        return MobSocketClient.waitForSocketState(this._webSocket, state);
    }
    sendEchoRequest() {
        this._sendJSON({ action: action_1.Action.Echo });
    }
    joinMob(mobName) {
        console.log("sending join request", mobName);
        this._sendJSON({
            action: action_1.Action.Join,
            mobName,
        });
    }
    update(durationMinutes) {
        this._sendJSON({
            action: action_1.Action.Update,
            value: { durationMinutes },
        });
    }
    addParticipant(name) {
        this._sendJSON({
            action: action_1.Action.AddParticipant,
            name: name,
        });
    }
    rotateParticipants() {
        this._sendJSON({
            action: action_1.Action.RotateParticipants,
        });
    }
    shuffleParticipants() {
        this._sendJSON({
            action: action_1.Action.ShuffleParticipants,
        });
    }
    editParticipants(participants) {
        this._sendJSON({
            action: action_1.Action.EditParticipants,
            participants: participants,
        });
    }
    start() {
        console.log("sending start request");
        this._sendJSON({ action: action_1.Action.Start });
    }
    pause() {
        console.log("sending pause request");
        this._sendJSON({ action: action_1.Action.Pause });
    }
    reset() {
        console.log("sending reset request");
        this._sendJSON({ action: action_1.Action.Reset });
    }
    _sendJSON(request) {
        this._webSocket.sendMessage(JSON.stringify(request));
    }
    get webSocket() {
        return this._webSocket;
    }
    closeSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            this.webSocket.closeSocket();
            yield this.waitForSocketState(this.webSocket.CLOSED_CODE);
        });
    }
}
exports.MobSocketClient = MobSocketClient;
//# sourceMappingURL=mobSocketClient.js.map