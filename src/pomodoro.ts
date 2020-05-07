import * as vscode from 'vscode';
import { commands } from './commands';
import { Alert } from './Alert';

var TimerState = {
    UNKNOWN: 0,
    READY: 1,
    RUNNING: 2,
    PAUSED: 3,
    FINISHED: 4,
    DISPOSED: 5,
    RESTRUNNING: 6,
    RESTSTOP: 7
};

export class PomodoroTimer {
    static startIcon: string = "$(triangle-right)";
    static stopIcon: string = "$(primitive-square)";
    static reSetIcon: string = "$(refresh)";
    static configIcon: string = "$(gear)";

    defaultTime = 25 * 60 * 1000;
    defaultRestTime = 10 * 1000;
    statusBarItem: vscode.StatusBarItem;
    reSetBarItem: vscode.StatusBarItem;
    ACTIVE_IN_SECOND = 1000;
    millisecondsRemaining = this.defaultTime;
    state = TimerState.READY;

    timeoutStopFunc: () => void = () => { };
    secondIntervalStopFunc: () => void = () => { };

    alert: Alert;

    constructor(private context: vscode.ExtensionContext) {
        this.alert = new Alert(context);
        this.reSetBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER);
        this.reSetBarItem.command = commands.RESET_TIMER_CMD;
        this.reSetBarItem.text = " " + PomodoroTimer.reSetIcon + " ";

        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER);
        this.statusBarItem.command = commands.START_TIMER_CMD;
        this.loadconfig();
        this.updateStatusBar();

        this.statusBarItem.show();
        this.reSetBarItem.show();
    }

    start() {
        let onEverytime = () => {
            this.millisecondsRemaining -= this.ACTIVE_IN_SECOND;
            this.updateStatusBar();
        };

        let onStop = () => {
            vscode.window.showInformationMessage("enjoy the rest");
            this.alert.alertWebPage();
            this.reset();
        };

        this.timeoutStopFunc = this.getTimeout(onStop);
        this.secondIntervalStopFunc = this.getSecondInterval(onEverytime);
        this.setState(TimerState.RUNNING);
    }

    pause() {
        if (this.state !== TimerState.RUNNING) {
            return false;
        }
        this.stop();
        this.setState(TimerState.PAUSED);
        this.updateStatusBar();
        return true;
    }

    reset() {
        this.stop();
        this.loadconfig();
        this.setState(TimerState.READY);
        this.updateStatusBar();
        return true;
    }

    stop() {
        console.log("stop");
        this.timeoutStopFunc();
        this.secondIntervalStopFunc();
    }

    private getTimeout(stop: () => void) {
        let timeout = setTimeout(stop, this.millisecondsRemaining);
        return function () {
            clearTimeout(timeout);
        };
    }

    private getSecondInterval(onEverytine: () => void) {
        let secondInterval = setInterval(onEverytine, this.ACTIVE_IN_SECOND);
        return function () {
            clearInterval(secondInterval);
        };
    }

    private millisecondsToMMSS(milliseconds: number) {
        let MILLISECONDS_IN_SECOND = 1000;
        let SECONDS_IN_MINUTE = 60;
        let totalSeconds = Math.round(milliseconds / MILLISECONDS_IN_SECOND);
        let minutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE);
        let seconds = Math.floor(totalSeconds - (minutes * SECONDS_IN_MINUTE));

        let resultMinutes = minutes + "";
        let resultSeconds = seconds + "";
        if (minutes < 10) { resultMinutes = "0" + minutes; }
        if (seconds < 10) { resultSeconds = "0" + seconds; }

        return resultMinutes + ':' + resultSeconds;
    }

    private updateStatusBar() {
        const icon = TimerState.RUNNING === this.state ? "$(primitive-square)" : "$(triangle-right)";
        this.statusBarItem.text = icon + " " + this.millisecondsToMMSS(this.millisecondsRemaining) + " (" + this.stateToString(this.state) + ")";
    }

    private stateToString(state: any) {
        switch (state) {
            case TimerState.UNKNOWN:
                return "unknown";
            case TimerState.READY:
                return "ready";
            case TimerState.RUNNING:
                return "running";
            case TimerState.PAUSED:
                return "paused";
            case TimerState.FINISHED:
                return "finished";
            case TimerState.DISPOSED:
                return "disposed";
            case TimerState.RESTRUNNING:
                return "resting";
            case TimerState.RESTSTOP:
                return "stop";
            default:
                return "unknown";
        }
    }

    private setState(state: any) {
        this.state = state;
        switch (state) {
            case TimerState.UNKNOWN:
                return "unknown";
            case TimerState.READY:
                this.statusBarItem.command = commands.START_TIMER_CMD;
                return "ready";
            case TimerState.RUNNING:
                this.statusBarItem.command = commands.PAUSE_TIMER_CMD;
                return "running";
            case TimerState.PAUSED:
                this.statusBarItem.command = commands.START_TIMER_CMD;
                return "paused";
            case TimerState.FINISHED:
                this.statusBarItem.command = commands.START_TIMER_CMD;
                return "finished";
            case TimerState.DISPOSED:
                return "disposed";
            case TimerState.RESTRUNNING:
                this.statusBarItem.command = commands.PAUSE_TIMER_CMD;
                return "resting";
            case TimerState.RESTSTOP:
                this.statusBarItem.command = commands.START_TIMER_CMD;
                return "stop";
            default:
                return "unknown";
        }
    }

    private loadconfig() {
        this.defaultTime = vscode.workspace.getConfiguration("frankenstein").get("reminderViewIntervalInMinutes", 25) * 60 * 1000;
        this.millisecondsRemaining = this.defaultTime;
        // this.millisecondsRemaining = 2 * 1000;
    }
}
