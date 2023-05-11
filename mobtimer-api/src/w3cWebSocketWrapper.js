"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3CWebSocketWrapper = void 0;
const websocket_1 = require("websocket");
class W3CWebSocketWrapper {
    constructor(url) {
        this._webSocket = new websocket_1.w3cwebsocket(url);
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
        this._webSocket.onmessage = handler;
    }
}
exports.W3CWebSocketWrapper = W3CWebSocketWrapper;
//# sourceMappingURL=w3cWebSocketWrapper.js.map