"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobTimer = void 0;
const status_1 = require("./status");
const timeUtils_1 = require("./timeUtils");
const commands_1 = require("./commands");
class MobTimer {
    constructor(mobName = "") {
        this._mobName = "";
        this._durationMinutes = 5;
        this._whenLastStartedInSeconds = 0;
        this._whenPausedInSeconds = 0;
        this._nowInSecondsFunc = timeUtils_1.TimeUtils.getNowInSeconds;
        this._previouslyAccumulatedElapsedSeconds = 0;
        this._running = false;
        this._timerExpireFunc = () => { };
        this._ready = true;
        this._participants = [];
        this._mobName = mobName;
    }
    setExpireTimeout() {
        const timeoutMilliseconds = timeUtils_1.TimeUtils.secondsToMilliseconds(this.secondsRemaining);
        this._timer = setTimeout(() => this.onExpire(), timeoutMilliseconds);
        if (this._timer.unref)
            this._timer.unref();
    }
    get nextCommand() {
        let nextCommand;
        switch (this.status) {
            case status_1.Status.Running:
                nextCommand = commands_1.Command.Pause;
                break;
            case status_1.Status.Paused:
                nextCommand = commands_1.Command.Resume;
                break;
            default:
                nextCommand = commands_1.Command.Start;
        }
        return nextCommand;
    }
    onExpire() {
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
        if (this._timer)
            clearTimeout(this._timer);
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
    set nowInSecondsFunc(func) {
        this._nowInSecondsFunc = func;
    }
    set timerExpireFunc(func) {
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
    get state() {
        return {
            mobName: this._mobName,
            status: this.status,
            durationMinutes: this.durationMinutes,
            participants: this._participants,
            secondsRemaining: this.secondsRemaining,
        };
    }
    getLogInfo() {
        return {
            mobName: this._mobName,
            previouslyAccumulatedElapsedSeconds: this._previouslyAccumulatedElapsedSeconds,
            nowInSeconds: this._nowInSecondsFunc(),
            whenLastStartedInSeconds: this._whenLastStartedInSeconds,
            elapsedSeconds: this._previouslyAccumulatedElapsedSeconds +
                (this._nowInSecondsFunc() - this._whenLastStartedInSeconds),
        };
    }
    setSecondsRemaining(secondsRemaining) {
        const durationSeconds = timeUtils_1.TimeUtils.minutesToSeconds(this._durationMinutes);
        this._previouslyAccumulatedElapsedSeconds =
            durationSeconds - secondsRemaining;
        this._whenLastStartedInSeconds = this._nowInSecondsFunc();
    }
    get status() {
        if (this._ready) {
            return status_1.Status.Ready;
        }
        else if (this._running) {
            return status_1.Status.Running;
        }
        else {
            return status_1.Status.Paused;
        }
    }
    get secondsRemainingString() {
        return timeUtils_1.TimeUtils.getTimeString(this.secondsRemaining);
    }
    get secondsRemaining() {
        if (this._ready) {
            return 0;
        }
        const durationSeconds = timeUtils_1.TimeUtils.minutesToSeconds(this._durationMinutes);
        const elapsedSeconds = this.calculateElapsedSeconds();
        return Math.max(0, durationSeconds - elapsedSeconds);
    }
    calculateElapsedSeconds() {
        if (!this._running) {
            return this._previouslyAccumulatedElapsedSeconds;
        }
        else {
            return (this._previouslyAccumulatedElapsedSeconds +
                (this._nowInSecondsFunc() - this._whenLastStartedInSeconds));
        }
    }
    get durationMinutes() {
        return this._durationMinutes;
    }
    set durationMinutes(duration) {
        this._durationMinutes = duration;
    }
    get durationSeconds() {
        return this._durationMinutes * 60;
    }
    get participants() {
        return this._participants;
    }
    addParticipant(name) {
        const trimmedName = name.trim();
        if (trimmedName.length > 0) {
            this._participants.push(trimmedName);
        }
    }
    removeParticipant(index) {
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
    editParticipants(participants) {
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
exports.MobTimer = MobTimer;
//# sourceMappingURL=mobTimer.js.map