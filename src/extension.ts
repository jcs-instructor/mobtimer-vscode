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

// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorld" is now active!'
  );

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
