import { SERVFAIL } from "dns";
import {
  commands,
  Disposable,
  ExtensionContext,
  TextDocument,
} from "vscode";
import { Timer } from "./timer";

import { MobTimerResponses, TimeUtils } from "./mobtimer-api-copy";
import { MobTimer } from "./mobtimer-api-copy/mobTimer";
import { Controller } from "./controller/controller";
import { WSWebSocketWrapper } from "./mobtimer-api-copy";
import WebSocket from "ws";


// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "mobtimer.helloWorld" is now active!');
  let timer = new Timer();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand("mobtimer.helloWorld", () => {
    timer.update();
    console.log("Hello World from mobtimer-vscode!!");
    // initializeMobTimer();
    //window.showInformationMessage("Hello World from mobtimer-vscode!!");
  });

  context.subscriptions.push(timer);
  context.subscriptions.push(disposable);
}

export function deactivate() { }

function initializeMobTimer() {
  console.log("initializeMobTimer");
  
  // todo: unhardcode port
  const url =
    process.env.REACT_APP_WEBSOCKET_URL ||
    `ws://localhost:${process.env.REACT_APP_WEBSOCKET_PORT || "4000"}`;

  const socket = new WebSocket(url);

  // const wrapperSocket = new WSWebSocketWrapper(url);

  // Controller.initializeClientAndFrontendMobTimer(new WSWebSocketWrapper(url), onExpire);

  // const mobTimer = new MobTimer();
  // mobTimer.timerExpireFunc = onExpire;

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
}

