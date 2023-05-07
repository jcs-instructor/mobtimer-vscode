import { StatusBarAlignment, StatusBarItem, window } from "vscode";
import { Controller } from "./controller/controller";
import { Command } from "./mobtimer-api-copy";

export class PlayButton {
  private _statusBarItem: StatusBarItem;

  public constructor() {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    this._statusBarItem.text = this.getPlayButtonLabel();
  }

  getPlayButtonLabel() {
    switch (Controller.frontendMobTimer.nextCommand) {
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

  public update() {
    this._statusBarItem.text = this.getPlayButtonLabel();
  }

  dispose() {
    this._statusBarItem.dispose();
  }
}
