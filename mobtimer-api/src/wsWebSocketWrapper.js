"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSWebSocketWrapper = void 0;
const ws_1 = __importDefault(require("ws"));
class WSWebSocketWrapper {
    constructor(url) {
        this._webSocket = new ws_1.default(url);
    }
    get socketState() {
        return this._webSocket.readyState;
    }
    sendMessage(message) {
        this._webSocket.send(message);
    }
    closeSocket() {
        this._webSocket.close();
    }
    get OPEN_CODE() {
        return this._webSocket.OPEN;
    }
    get CLOSED_CODE() {
        return this._webSocket.CLOSED;
    }
    set onmessageReceived(handler) {
        this._webSocket.on("message", (message) => {
            handler({ data: message });
        });
    }
}
exports.WSWebSocketWrapper = WSWebSocketWrapper;
//# sourceMappingURL=wsWebSocketWrapper.js.map