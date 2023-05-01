import { commands, ExtensionContext } from "vscode";
import { Beta } from "./beta";

// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorld" is now active!'
  );
  let beta = new Beta();

  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand("mobtimer.helloWorld", () => {
    beta.update();
    console.log("Hello World from mobtimer-vscode!!");
    //window.showInformationMessage("Hello World from mobtimer-vscode!!");
  });

  context.subscriptions.push(beta);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
