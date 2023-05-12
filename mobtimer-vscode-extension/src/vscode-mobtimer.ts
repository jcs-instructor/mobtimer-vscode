import { StatusBarAlignment, StatusBarItem, window } from "vscode";
import { Controller } from "./controller/controller";
import {
  Command,
  IWebSocketWrapper,
  MobSocketClient,
  MobTimer,
  MobTimerResponses,
} from "mobtimer-api";
import { WSWebSocketWrapper } from "mobtimer-api";

export class VscodeMobTimer {
  private _statusBarItem: StatusBarItem;
  private _playButton: StatusBarItem;
  private _seconds = 0;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    this._playButton = window.createStatusBarItem(StatusBarAlignment.Left);
    this._playButton.text = getPlayButtonLabel();
    this._playButton.show();
    const url =
      process.env.REACT_APP_WEBSOCKET_URL ||
      `ws://localhost:${process.env.REACT_APP_WEBSOCKET_PORT || "4000"}`;
    const wrapperSocket = new WSWebSocketWrapper(url) as IWebSocketWrapper;
    Controller.client = new MobSocketClient(wrapperSocket);
    const mobName = "front-end-timer";
    Controller.frontendMobTimer = new MobTimer(mobName);
    Controller.frontendMobTimer.timerExpireFunc = onExpire;
    const client = Controller.client;
    client.joinMob(mobName);
    client.webSocket.onmessageReceived = async (message: { data: string }) => {
      // Get response from server
      controllerOnMessage(message);
      this._playButton.text = "Large tiger";
      this._playButton.show();
    };
  }

  public update() {
    // Every second, update the status bar with the current time with seconds
    console.log("update");
    setInterval(() => {
      console.log("Clicking version20");
      this._seconds++;
      const text = `[ $(clock) ${this._seconds} version20: ${Controller.frontendMobTimer.secondsRemainingString} ]`;
      this._statusBarItem.text = text;
    }, 1000); // 1000 ms = 1 second
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}

function controllerOnMessage(message: { data: string }) {
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
}

// todo: in progress
// await client.waitForSocketState(WebSocket.OPEN_CODE);
// const mobName = "test-mob-temp-xxxxxxxxxxxxx"; // todo unhardcode
// client.joinMob(mobName);
// console.log('joined mob', mobName, client);

function onExpire() {
  console.log("timer expired on front end");
  // const audio = new Audio(soundSource);
  // audio.play();
}

function getPlayButtonLabel() {
  switch (Controller.frontendMobTimer?.nextCommand) {
    case Command.Pause: {
      return "⏸️ Pause";
    }
    case Command.Resume: {
      return "▶️ Resume";
    }
    case Command.Start: {
      return "▶️ Start";
    }
    default: {
      return "???";
    }
  }
}
