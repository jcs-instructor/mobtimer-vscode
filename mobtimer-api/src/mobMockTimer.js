"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobMockTimer = void 0;
const mobTimer_1 = require("./mobTimer");
class MobMockTimer extends mobTimer_1.MobTimer {
    constructor(mobName = "") {
        super(mobName);
        this._mockCurrentTimeSeconds = 0;
        this.nowInSecondsFunc = () => this.mockNowInSeconds();
    }
    mockNowInSeconds() {
        return this._mockCurrentTimeSeconds;
    }
    mockDelaySeconds(seconds) {
        this._mockCurrentTimeSeconds += seconds;
        const toleranceSeconds = 0.01;
        if (this.secondsRemaining <= toleranceSeconds) {
            super.onExpire();
        }
    }
}
exports.MobMockTimer = MobMockTimer;
//# sourceMappingURL=mobMockTimer.js.map