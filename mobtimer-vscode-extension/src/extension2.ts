import { commands, ExtensionContext } from "vscode";
import { VscodeMobTimer } from "./vscode-mobtimer";

// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorldversion20" is now active!'
  );
  let vscodeMobTimer = new VscodeMobTimer();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "mobtimer.helloWorldversion20",
    () => {
      vscodeMobTimer.update();
      console.log("Hello World from mobtimer-vscode!!");
      //window.showInformationMessage("Hello World from mobtimer-vscode!!");
    }
  );

  context.subscriptions.push(vscodeMobTimer);
  context.subscriptions.push(disposable);
}

export function deactivate() {}