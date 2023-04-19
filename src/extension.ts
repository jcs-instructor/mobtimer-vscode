import { SERVFAIL } from "dns";
import {
  window,
  commands,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
} from "vscode";

// todo: in progress
//import { Controller } from './controller/controller';
//import { MobTimerResponses, TimeUtils } from "mobtimer-api";

// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorld" is now active!'
  );

  // todo: in progress
  // Controller.initializeFrontendMobTimer(onExpire);
  // const client = Controller.client;

  // client.webSocket.onmessage = (message: { data: string; }) => {

  //   // Get response from server
  //   const response = JSON.parse(message.data) as MobTimerResponses.SuccessfulResponse;

  //   // todo: handle if response is not successful

  //   console.log("MOB: " + response.mobState.mobName +
  //     " (" + response.mobState.participants.length + " Participant(s):" + response.mobState.participants.join(",") + "), " +
  //     "Action:" + response.actionInfo.action + ", " +
  //     "Status:" + response.mobState.status + ", DurationMin:" + response.mobState.durationMinutes + ", " +
  //     "RemainingSec:" + response.mobState.secondsRemaining + " (" + TimeUtils.getTimeString(response.mobState.secondsRemaining) + ") "
  //   );

  //   // Read response data 
  //   const { mobStatus, durationMinutes, participants, secondsRemaining } = Controller.translateResponseData(response);

  //   // Derive mob label from response status
  //   const label = Controller.getActionButtonLabel(mobStatus); // todo: make enum 

  //   // modify frontend mob timer
  //   Controller.changeStatus(Controller.frontendMobTimer, mobStatus);
  //   Controller.frontendMobTimer.setSecondsRemaining(secondsRemaining);

  //   if (response.mobState.status !== Controller.frontendMobTimer.status) {
  //     console.log("PROBLEM - FRONT AND BACK END STATUS MISMATCH!!!!!!!!!! --- " +
  //       "Frontend Status: " + Controller.frontendMobTimer.status + ", " +
  //       "Backend Status:" + response.mobState.status);
  //   };
  // };

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

  let timer = new Timer();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand("mobtimer.helloWorld", () => {
    timer.update();
    console.log("Hello World from mobtimer-vscode!!");
    //window.showInformationMessage("Hello World from mobtimer-vscode!!");
  });

  context.subscriptions.push(timer);
  context.subscriptions.push(disposable);
}

export function deactivate() { }

class Timer {
  private _statusBarItem: StatusBarItem;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
  }

  public update() {
    // Every second, update the status bar with the current time with seconds
    setInterval(
      () => {
        const text = `[ $(clock) CURRENT TIME: ${this.getCurrentTime()} ]`;
        this._statusBarItem.text = text;
      },
      1000); // 1000 ms = 1 second 
    this._statusBarItem.show();
  }

  private getCurrentTime() {
    let date = new Date();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    let currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}
