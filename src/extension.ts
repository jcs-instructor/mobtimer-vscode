import * as vscode from "vscode";

// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "mobtimer.helloWorld" is now active!'
  );

  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "mobtimer.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from mobtimer-vscode!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
