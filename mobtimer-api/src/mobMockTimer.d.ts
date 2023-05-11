import { MobTimer } from "./mobTimer";
export declare class MobMockTimer extends MobTimer {
    private _mockCurrentTimeSeconds;
    constructor(mobName?: string);
    private mockNowInSeconds;
    mockDelaySeconds(seconds: number): void;
}
