"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeUtils = void 0;
class TimeUtils {
    static delaySeconds(seconds) {
        return new Promise((resolve) => {
            const timeout = setTimeout(resolve, TimeUtils.secondsToMilliseconds(seconds));
        });
    }
    static getNowInSeconds() {
        const currentMilliseconds = new Date().getTime();
        return TimeUtils.millisecondsToSeconds(currentMilliseconds);
    }
    static millisecondsToSeconds(milliseconds) {
        return milliseconds / 1000;
    }
    static secondsToMilliseconds(seconds) {
        return seconds * 1000;
    }
    static secondsToMinutes(seconds) {
        return seconds / 60;
    }
    static minutesToSeconds(minutes) {
        return minutes * 60;
    }
    static getTimeString(seconds) {
        const integerSeconds = Math.ceil(seconds);
        return (TimeUtils.getMinutesPart(integerSeconds) +
            ":" +
            TimeUtils.getSecondsPart(integerSeconds));
    }
    static getMinutesPart(seconds) {
        const minutesPart = Math.trunc(seconds / 60);
        return minutesPart.toString().padStart(2, "0");
    }
    static getSecondsPart(seconds) {
        const secondsPart = seconds % 60;
        return secondsPart.toString().padStart(2, "0");
    }
}
exports.TimeUtils = TimeUtils;
//# sourceMappingURL=timeUtils.js.map