"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const pomodoro_1 = require("./pomodoro");
const commands_1 = require("./commands");
const Pendant_1 = require("./Pendant");
function activate(context) {
    var pomodoroTimer = new pomodoro_1.PomodoroTimer(context);
    let pendant = new Pendant_1.Pendant();
    let startTimer = vscode.commands.registerCommand(commands_1.commands.START_TIMER_CMD, () => {
        pomodoroTimer.start();
    });
    let pauseTimer = vscode.commands.registerCommand(commands_1.commands.PAUSE_TIMER_CMD, () => {
        pomodoroTimer.pause();
    });
    let resetTimer = vscode.commands.registerCommand(commands_1.commands.RESET_TIMER_CMD, () => {
        pomodoroTimer.reset();
    });
    let configInfo = vscode.commands.registerCommand(commands_1.commands.SHOW_CONFIG, () => {
        pendant.alertConfigInfo();
    });
    let themeInstall = vscode.commands.registerCommand(commands_1.commands.INSTALL_CW, () => {
        pendant.installPendant();
    });
    let themeUnInstall = vscode.commands.registerCommand(commands_1.commands.UNINSTALL_CW, () => {
        pendant.uninstallPendant();
    });
    context.subscriptions.push(configInfo);
    context.subscriptions.push(themeInstall);
    context.subscriptions.push(themeUnInstall);
    context.subscriptions.push(startTimer);
    context.subscriptions.push(pauseTimer);
    context.subscriptions.push(resetTimer);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map