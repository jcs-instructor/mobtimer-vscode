import { Action } from "./action";
import * as MobTimerRequests from "./mobTimerRequests";
import { IWebSocketWrapper } from "./iWebSocketWrapper";

class MobSocketClient {
  private _webSocket: IWebSocketWrapper;

  constructor(webSocket: IWebSocketWrapper) {
    this._webSocket = webSocket;
  }

  /**
   * Forces a process to wait until the socket's `readyState` becomes the specified value.
   * @param socket The socket whose `readyState` is being watched
   * @param state The desired `readyState` for the socket
   */
  static waitForSocketState(
    socket: { socketState: number },
    state: number
  ): Promise<void> {
    const client = this;
    return new Promise(function (resolve) {
      const timeout = setTimeout(function () {
        if (socket.socketState === state) {
          resolve();
        } else {
          MobSocketClient.waitForSocketState(socket, state).then(resolve);
        }
      });
      // todo: timeout.unref() fails when running from frontend; why?
      // timeout.unref();
    });
  }

  public waitForSocketState(state: number): Promise<void> {
    return MobSocketClient.waitForSocketState(this._webSocket, state);
  }

  sendEchoRequest() {
    this._sendJSON({ action: Action.Echo } as MobTimerRequests.EchoRequest);
  }

  joinMob(mobName: string) {
    console.log("sending join request", mobName);
    this._sendJSON({
      action: Action.Join,
      mobName,
    } as MobTimerRequests.JoinRequest);
  }

  update(durationMinutes: number) {
    this._sendJSON({
      action: Action.Update,
      value: { durationMinutes },
    } as MobTimerRequests.UpdateRequest);
  }

  addParticipant(name: string) {
    this._sendJSON({
      action: Action.AddParticipant,
      name: name,
    } as MobTimerRequests.AddParticipantRequest);
  }

  rotateParticipants() {
    this._sendJSON({
      action: Action.RotateParticipants,
    } as MobTimerRequests.RotateParticipantsRequest);
  }

  shuffleParticipants() {
    this._sendJSON({
      action: Action.ShuffleParticipants,
    } as MobTimerRequests.ShuffleParticipantsRequest);
  }

  editParticipants(participants: string[]) {
    this._sendJSON({
      action: Action.EditParticipants,
      participants: participants,
    } as MobTimerRequests.EditParticipantsRequest);
  }

  editRoles(roles: string[]) {
    this._sendJSON({
      action: Action.EditRoles,
      roles: roles,
    } as MobTimerRequests.EditRolesRequest);
  }

  start() {
    console.log("sending start request");
    this._sendJSON({ action: Action.Start } as MobTimerRequests.StartRequest);
  }

  pause() {
    console.log("sending pause request");
    this._sendJSON({ action: Action.Pause } as MobTimerRequests.PauseRequest);
  }

  reset() {
    console.log("sending reset request");
    this._sendJSON({ action: Action.Reset } as MobTimerRequests.ResetRequest);
  }

  private _sendJSON(request: MobTimerRequests.MobTimerRequest) {
    this._webSocket.sendMessage(JSON.stringify(request));
  }

  public get webSocket(): IWebSocketWrapper {
    return this._webSocket;
  }

  async closeSocket() {
    this.webSocket.closeSocket();
    await this.waitForSocketState(this.webSocket.CLOSED_CODE);
  }
}

export { MobSocketClient };
