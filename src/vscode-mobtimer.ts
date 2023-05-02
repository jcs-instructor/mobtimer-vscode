import { StatusBarAlignment, StatusBarItem, window } from "vscode";
import { Controller } from "./controller/controller";
import { MobTimer, MobTimerResponses, TimeUtils } from "mobtimer-api";
import { WSWebSocketWrapper } from "./mobtimer-api-copy";
import { WebSocket } from "ws";

export class VscodeMobTimer {
  private _statusBarItem: StatusBarItem;
  private _seconds = 0;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    initializeMobTimer();
  }

  public update() {
    // Every second, update the status bar with the current time with seconds
    setInterval(() => {
      console.log("Clicking");
      this._seconds++;
      const text = `[ $(clock) ${this._seconds} CURRENT TIME: ${Controller.frontendMobTimer.secondsRemainingString} ]`;
      this._statusBarItem.text = text;
    }, 1000); // 1000 ms = 1 second
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}

async function initializeMobTimer() {
  console.log("initializeMobTimer");

  // todo: unhardcode port
  const url =
    process.env.REACT_APP_WEBSOCKET_URL ||
    `ws://localhost:${process.env.REACT_APP_WEBSOCKET_PORT || "4000"}`;

  // const socket = new WebSocket(url);

  const wrapperSocket = new WSWebSocketWrapper(url) as any;

  Controller.initializeClientAndFrontendMobTimer(wrapperSocket, onExpire);

  const client = Controller.client;
  Controller.frontendMobTimer.timerExpireFunc = onExpire;

  client.webSocket.onmessageReceived = async (message: { data: string }) => {
    // Get response from server
    console.log("message:::::::::::::::", message);
    const response = JSON.parse(
      message.data
    ) as MobTimerResponses.SuccessfulResponse;

    // todo: handle if response is not successful

    // Read response data
    const { mobStatus, durationMinutes, participants, secondsRemaining } =
      Controller.translateResponseData(response);

    // Derive mob label from response status
    const label = Controller.getActionButtonLabel(mobStatus); // todo: make enum

    // modify frontend mob timer
    Controller.changeStatus(Controller.frontendMobTimer, mobStatus);
    Controller.frontendMobTimer.setSecondsRemaining(secondsRemaining);
    console.log("frontend mob timer");

    if (response.mobState.status !== Controller.frontendMobTimer.status) {
      console.log(
        "PROBLEM - FRONT AND BACK END STATUS MISMATCH!!!!!!!!!! --- " +
          "Frontend Status: " +
          Controller.frontendMobTimer.status +
          ", " +
          "Backend Status:" +
          response.mobState.status
      );
    }
  };

  await client.waitForSocketState(WebSocket.OPEN);

  client.joinMob("front-end-timer");
  console.log("joined mob", Controller.frontendMobTimer);
}

// todo: in progress
// await client.waitForSocketState(WebSocket.OPEN);
// const mobName = "test-mob-temp-xxxxxxxxxxxxx"; // todo unhardcode
// client.joinMob(mobName);
// console.log('joined mob', mobName, client);

function onExpire() {
  console.log("timer expired on front end");
  // const audio = new Audio(soundSource);
  // audio.play();
}
