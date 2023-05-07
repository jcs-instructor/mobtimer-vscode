import { MobState } from "./mobState";
import { Status } from "./status";
import { TimeUtils } from "./timeUtils";
import { Command } from "./commands";

export class MobTimer {
  private _mobName = "";
  private _durationMinutes = 5;
  private _whenLastStartedInSeconds = 0;
  private _whenPausedInSeconds = 0;
  private _nowInSecondsFunc = TimeUtils.getNowInSeconds;
  private _previouslyAccumulatedElapsedSeconds = 0;
  private _running = false;
  private _timer: NodeJS.Timeout | undefined;
  private _timerExpireFunc = () => {};
  private _ready = true;
  private _participants: string[] = [];

  constructor(mobName: string = "") {
    this._mobName = mobName;
  }

  private setExpireTimeout() {
    // We will wait until very near when the timer should expire, and then very
    // frequently check to see if the timer has expired. This is to avoid
    // the case where the timer expires before we have had time to check.
    const timeoutMilliseconds = TimeUtils.secondsToMilliseconds(
      this.secondsRemaining
    );
    this._timer = setTimeout(() => this.onExpire(), timeoutMilliseconds);
    if (this._timer.unref) this._timer.unref();
  }

  get nextCommand() {
    let nextCommand;
    switch (this.status) {
      case Status.Running:
        nextCommand = Command.Pause;
        break;
      case Status.Paused:
        nextCommand = Command.Resume;
        break;
      default:
        nextCommand = Command.Start;
    }
    return nextCommand;
  }

  protected onExpire() {
    this.rotateParticipants();
    this.reset();
  }

  reset() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._ready = true;
    if (this._timerExpireFunc) {
      this._timerExpireFunc();
    }
    if (this._timer) clearTimeout(this._timer);
  }

  start() {
    this._running = true;
    if (this._ready) {
      this._previouslyAccumulatedElapsedSeconds = 0;
      this._ready = false;
    }
    this._whenLastStartedInSeconds = this._nowInSecondsFunc();
    this.setExpireTimeout();
  }

  public set nowInSecondsFunc(func: () => number) {
    this._nowInSecondsFunc = func;
  }

  public set timerExpireFunc(func: () => void) {
    this._timerExpireFunc = func;
  }

  pause() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._whenPausedInSeconds = this._nowInSecondsFunc();
    this._previouslyAccumulatedElapsedSeconds +=
      this._whenPausedInSeconds - this._whenLastStartedInSeconds;
  }

  public get state() {
    return {
      mobName: this._mobName,
      status: this.status,
      durationMinutes: this.durationMinutes,
      participants: this._participants,
      secondsRemaining: this.secondsRemaining,
    } as MobState;
  }

  getLogInfo() {
    return {
      mobName: this._mobName,
      previouslyAccumulatedElapsedSeconds:
        this._previouslyAccumulatedElapsedSeconds,
      nowInSeconds: this._nowInSecondsFunc(),
      whenLastStartedInSeconds: this._whenLastStartedInSeconds,
      elapsedSeconds:
        this._previouslyAccumulatedElapsedSeconds +
        (this._nowInSecondsFunc() - this._whenLastStartedInSeconds),
    };
  }

  setSecondsRemaining(secondsRemaining: number) {
    // You can't set seconds remaining directly since it's a calculated number, so change the correlated variables to have that effect:
    // Example: if duration = 1 minute and secondsRemaining = 20 seconds, then previously accumulated elapsed seconds = 40 seconds
    const durationSeconds = TimeUtils.minutesToSeconds(this._durationMinutes);
    this._previouslyAccumulatedElapsedSeconds =
      durationSeconds - secondsRemaining;
    this._whenLastStartedInSeconds = this._nowInSecondsFunc();
  }

  public get status(): Status {
    // if (this._whenStartedInSeconds === 0) {
    //   return Status.Ready;
    // }

    // If timer hasn't been started or has elapsed fully, then: READY
    if (this._ready) {
      return Status.Ready;
    } else if (this._running) {
      return Status.Running;
    } else {
      return Status.Paused;
    }
  }

  public get secondsRemainingString(): string {
    return TimeUtils.getTimeString(this.secondsRemaining);
  }

  public get secondsRemaining(): number {
    // When the timer is ready, show "0:00" for the time.
    if (this._ready) {
      return 0;
    }
    const durationSeconds = TimeUtils.minutesToSeconds(this._durationMinutes);
    const elapsedSeconds = this.calculateElapsedSeconds();
    return Math.max(0, durationSeconds - elapsedSeconds);
  }

  private calculateElapsedSeconds() {
    if (!this._running) {
      return this._previouslyAccumulatedElapsedSeconds;
    } else {
      return (
        this._previouslyAccumulatedElapsedSeconds +
        (this._nowInSecondsFunc() - this._whenLastStartedInSeconds)
      );
    }
  }

  public get durationMinutes(): number {
    return this._durationMinutes;
  }
  public set durationMinutes(duration: number) {
    this._durationMinutes = duration;
  }

  public get durationSeconds(): number {
    return this._durationMinutes * 60;
  }

  public get participants(): string[] {
    return this._participants;
  }

  public addParticipant(name: string) {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      // todo also check for duplicates, i.e.,  && !participants.includes(trimmedName))
      this._participants.push(trimmedName);
    }
  }

  removeParticipant(index: number) {
    if (index >= 0 && index < this._participants.length) {
      this._participants.splice(index, 1);
    }
  }

  rotateParticipants() {
    const first = this._participants.shift();
    if (first) {
      this._participants.push(first);
    }
  }

  editParticipants(participants: string[]) {
    this._participants = participants;
  }

  shuffleParticipants() {
    for (let i = this._participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._participants[i], this._participants[j]] = [
        this._participants[j],
        this._participants[i],
      ];
    }
  }
}
