
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('generate-clangd-configs.generate', () => {
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage(vscode.l10n.t('Please open a folder (Workspace) before running this command.'));
            return;
        }

        // 我們使用第一個工作區的根路徑作為目標路徑
        const workspaceRoot = workspaceFolders[0].uri.fsPath;

        const filesToCopy = ['.clangd', '.clang-format', '.clang-tidy'];

        const sourceFilesPath = path.join(context.extensionPath, 'res');

        try {
            filesToCopy.forEach(fileName => {
                const sourceFile = path.join(sourceFilesPath, fileName);
                const destinationFile = path.join(workspaceRoot, fileName);

                if (fs.existsSync(destinationFile)) {
                    vscode.window.showWarningMessage(vscode.l10n.t('File {0} already exists in the workspace root, skipping.', fileName));
                } else {
                    fs.copyFileSync(sourceFile, destinationFile);
                }
            });

			vscode.window.showInformationMessage(vscode.l10n.t('Clangd config files were successfully generated to the workspace root!'));

        } catch (error: any) {
            console.error(error);
            vscode.window.showErrorMessage(vscode.l10n.t('An error occurred while generating files. See the debug console for details.'));
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
