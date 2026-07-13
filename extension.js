const vscode = require('vscode');

const runCopyContext = require("./lib/copyContext");
const runCopyStructure = require("./lib/copyStructure");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const copyStructure = vscode.commands.registerCommand(
        "outfoxed-copy-folder-structure.copyStructure",
        (uri) => runCopyStructure(uri, false)
    );

    const copyFoldersOnly = vscode.commands.registerCommand(
        "outfoxed-copy-folder-structure.copyFoldersOnly",
        (uri) => runCopyStructure(uri, true)
    );

    const copyWithContext = vscode.commands.registerCommand(
        "outfoxed-copy-folder-structure.copyWithContext",
        (uri) => runCopyContext(uri)
    );

    context.subscriptions.push(copyStructure);
    context.subscriptions.push(copyFoldersOnly);
    context.subscriptions.push(copyWithContext);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
