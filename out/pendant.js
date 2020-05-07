"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defBase64_1 = require("./defBase64");
const path = require("path");
const vscode = require("vscode");
const fs = require("fs-extra");
const commands_1 = require("./commands");
class Pendant {
    constructor() {
        this.configItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER);
        this.configItem.command = commands_1.commands.SHOW_CONFIG;
        this.configItem.text = " " + Pendant.configIcon + " ";
        this.configItem.show();
    }
    alertConfigInfo() {
        const [cssName, cssBKName] = this.getBasePath();
        let text = fs.existsSync(cssBKName) ? Pendant.Uninstall : Pendant.Install;
        vscode.window.showInformationMessage(`need ${text} theme ?`, 'YES', 'NO')
            .then(function (item) {
            console.log(item);
            if (item === "YES") {
                if (text === Pendant.Uninstall) {
                    vscode.commands.executeCommand(commands_1.commands.UNINSTALL_CW);
                    return true;
                }
                if (text === Pendant.Install) {
                    vscode.commands.executeCommand(commands_1.commands.INSTALL_CW);
                    return true;
                }
            }
        });
    }
    installPendant() {
        console.log("installing");
        const [cssName, cssBKName] = this.getBasePath();
        if (fs.existsSync(cssBKName)) {
            return true;
        }
        let willMoveEnd = () => {
            console.log("sync end1");
            let content = fs.readFileSync(cssBKName, 'utf-8');
            content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
            content = content.replace(/\s*$/, '');
            let theCss = this.hookCss();
            fs.writeFileSync(cssName, content + theCss, 'utf-8');
            vscode.window.showInformationMessage("Install finish. Need Restart vscode", { title: 'Restart vscode' })
                .then(function (item) {
                if (!item) {
                    return;
                }
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            });
            console.log("sync end2");
        };
        fs.move(cssName, cssBKName, willMoveEnd);
    }
    uninstallPendant() {
        console.log("uninstalling");
        const [cssName, cssBKName] = this.getBasePath();
        if (!fs.existsSync(cssBKName)) {
            return true;
        }
        let content = fs.readFileSync(cssBKName, 'utf-8');
        let willMoveEnd = () => {
            console.log("sync end");
            fs.removeSync(cssBKName);
            vscode.window.showInformationMessage("Uninstall finish. Need Restart vscode", { title: 'Restart vscode' })
                .then(function (item) {
                if (!item) {
                    return;
                }
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            });
            console.log("sync end");
        };
        fs.writeFile(cssName, content, willMoveEnd);
    }
    hookCss() {
        const [img0, img1, img2] = defBase64_1.default;
        var content = `
[id="workbench.parts.editor"] .split-view-view:nth-child(1) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${img0}');${Pendant.style}}

[id="workbench.parts.editor"] .split-view-view:nth-child(2) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${img1}');${Pendant.style}}

[id="workbench.parts.editor"] .split-view-view:nth-child(3) .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element::after{background-image: url('${img2}');${Pendant.style}}

[id="workbench.parts.editor"] .split-view-view .editor-container .editor-instance>.monaco-editor .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}
`;
        return content.replace(/\s*$/, '');
    }
    getBasePath() {
        let base = path.dirname(require.main.filename);
        let cssName = path.join(base, 'vs', 'workbench', parseFloat(vscode.version) >= 1.38 ? 'workbench.desktop.main.css' : 'workbench.main.css');
        let cssBKName = path.join(base, 'vs', 'workbench', parseFloat(vscode.version) >= 1.38 ? 'workbench.desktop.main.css.bk' : 'workbench.main.css.bk');
        return [cssName, cssBKName];
    }
}
exports.Pendant = Pendant;
Pendant.style = "content:'';pointer-events:none;position:absolute;z-index:99999;width:100%;height:100%;background-position:100% 100%;background-repeat:no-repeat;opacity:1;;";
Pendant.Uninstall = "Uninstall";
Pendant.Install = "Install";
Pendant.configIcon = "$(gear)";
//# sourceMappingURL=Pendant.js.map