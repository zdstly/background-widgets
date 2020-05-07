import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class Alert {

    images: vscode.Uri[];
    private panel: vscode.WebviewPanel | undefined;

    public constructor(private context: vscode.ExtensionContext) {
        var picPath = path.join(this.context.extensionPath, 'image');
        this.images = this.readPathImage(picPath);
    }

    public alertWebPage() {
        var imagePath = this.getImageUri();
        if (this.panel) {
            this.panel.webview.html = this.generateHtml(imagePath);
            this.panel.reveal();
        } else {
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

    public getImageUri(): vscode.Uri | string {
        var picPath = path.join(this.context.extensionPath, 'image');
        return this.getRandomOne(this.images);
    }

    private readPathImage(dirPath: string): vscode.Uri[] {
        let files: vscode.Uri[] = [];
        const result = fs.readdirSync(dirPath);
        result.forEach(function (item, index) {
            const stat = fs.lstatSync(path.join(dirPath, item));
            if (stat.isFile()) {
                files.push(vscode.Uri.file(path.join(dirPath, item)).with({ scheme: 'vscode-resource' }));
            }
        });
        return files;
    }

    private getRandomOne(images: string[] | vscode.Uri[]): string | vscode.Uri {
        const n = Math.floor(Math.random() * images.length + 1) - 1;
        return images[n];
    }

    protected generateHtml(imagePath: vscode.Uri | string): string {
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