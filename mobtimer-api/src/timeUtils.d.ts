export declare class TimeUtils {
    static delaySeconds(seconds: number): Promise<void>;
    static getNowInSeconds(): number;
    static millisecondsToSeconds(milliseconds: number): number;
    static secondsToMilliseconds(seconds: number): number;
    static secondsToMinutes(seconds: number): number;
    static minutesToSeconds(minutes: number): number;
    static getTimeString(seconds: number): string;
    static getMinutesPart(seconds: number): string;
    static getSecondsPart(seconds: number): string;
}
