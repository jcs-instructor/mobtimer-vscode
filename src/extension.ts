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

  let wordCounter = new WordCounter();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand("mobtimer.helloWorld", () => {
    wordCounter.updateWordCount();
    console.log("Hello World from mobtimer-vscode!!");
    //window.showInformationMessage("Hello World from mobtimer-vscode!!");
  });

  context.subscriptions.push(wordCounter);
  context.subscriptions.push(disposable);
}

export function deactivate() {}

class WordCounter {
  private _statusBarItem: StatusBarItem;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
  }

  public updateWordCount() {
    this._statusBarItem.text = "(not a markdown file)";
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}
