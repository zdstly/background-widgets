import * as vscode from 'vscode';
import { PomodoroTimer } from './pomodoro';
import { commands } from './commands';
import { Pendant } from './Pendant';

export function activate(context: vscode.ExtensionContext) {
	var pomodoroTimer = new PomodoroTimer(context);
	let pendant = new Pendant();
	let startTimer = vscode.commands.registerCommand(commands.START_TIMER_CMD, () => {
		pomodoroTimer.start();
	});

	let pauseTimer = vscode.commands.registerCommand(commands.PAUSE_TIMER_CMD, () => {
	    pomodoroTimer.pause();
	});

	let resetTimer = vscode.commands.registerCommand(commands.RESET_TIMER_CMD, () => {
	    pomodoroTimer.reset();
	});

	let configInfo = vscode.commands.registerCommand(commands.SHOW_CONFIG, () => {
		pendant.alertConfigInfo();
	});

	let themeInstall = vscode.commands.registerCommand(commands.INSTALL_CW, () => {
		pendant.installPendant();
	});

	let themeUnInstall = vscode.commands.registerCommand(commands.UNINSTALL_CW, () => {
		pendant.uninstallPendant();
	});
	context.subscriptions.push(configInfo);
	context.subscriptions.push(themeInstall);
	context.subscriptions.push(themeUnInstall);

	context.subscriptions.push(startTimer);
	context.subscriptions.push(pauseTimer);
	context.subscriptions.push(resetTimer);

}

export function deactivate() {}
