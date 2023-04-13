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

export function deactivate() {}

class Timer {
  private _statusBarItem: StatusBarItem;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
  }

  public update() {	
	// Every second, update the status bar with the current time with seconds
	setInterval(() => {
		const date = new Date();
		const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		this._statusBarItem.text = `$(clock) ${time}`;
	}, 1000);
    //this._statusBarItem.text = "Timer: $(clock) 00:00";
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}
