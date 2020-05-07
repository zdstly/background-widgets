"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
class Alert {
    constructor(context) {
        this.context = context;
        var picPath = path.join(this.context.extensionPath, 'image');
        this.images = this.readPathImage(picPath);
    }
    alertWebPage() {
        var imagePath = this.getImageUri();
        if (this.panel) {
            this.panel.webview.html = this.generateHtml(imagePath);
            this.panel.reveal();
        }
        else {
            this.panel = vscode.window.createWebviewPanel("rest", "rest", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.generateHtml(imagePath);
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }
    getImageUri() {
        var picPath = path.join(this.context.extensionPath, 'image');
        return this.getRandomOne(this.images);
    }
    readPathImage(dirPath) {
        let files = [];
        const result = fs.readdirSync(dirPath);
        result.forEach(function (item, index) {
            const stat = fs.lstatSync(path.join(dirPath, item));
            if (stat.isFile()) {
                files.push(vscode.Uri.file(path.join(dirPath, item)).with({ scheme: 'vscode-resource' }));
            }
        });
        return files;
    }
    getRandomOne(images) {
        const n = Math.floor(Math.random() * images.length + 1) - 1;
        return images[n];
    }
    generateHtml(imagePath) {
        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>rest</title>
        </head>
        <body>
            <div><h1>have a rest</h1></div>
            <div><img style="width: auto; height: auto; max-width: 100%; max-height: 100%;" src="${imagePath}"></div>
        </body>
        </html>`;
        return html;
    }
}
exports.Alert = Alert;
//# sourceMappingURL=alert.js.map