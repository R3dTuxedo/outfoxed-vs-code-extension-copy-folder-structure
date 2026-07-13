const vscode = require("vscode");
const path = require("path");

const buildTree = require("./treeBuilder");
const { normalizePath } = require("./utils");

/**
 * @param {vscode.Uri} uri
 * @param {boolean} foldersOnly
 */
async function copyStructure(uri, foldersOnly) {

    if (!uri) {
        vscode.window.showErrorMessage("No folder selected.");
        return;
    }

    const searchConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.search");
    const resultConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.result");

	/** @type {number} */ const maxDepth = searchConfig.get("maxDepth") ?? 10;
    /** @type {string[]} */ const ignore = searchConfig.get("ignore") ?? [];
    /** @type {"none"|"absolute"|"relative"} */ const includeSourcePath = resultConfig.get("includeSourcePath") ?? "relative";

    const root = uri.fsPath;

    let output = "";

	switch(includeSourcePath) {
		case "absolute":
			output += `Source: ${normalizePath(root)}\n\n`;
			break;
		case "relative":
			const workspaceFolders = vscode.workspace.workspaceFolders || [];
			const projectRoot = workspaceFolders[0]?.uri.fsPath || root;
			let relativePath = normalizePath(path.relative(projectRoot, root));
			output += `Source: ${relativePath || "."}\n\n`;
			break;
		case "none":
		default:
			break;
	}


    output += path.basename(root) + "/\n";

    output += buildTree(root, "", 0, {
        maxDepth,
        ignore,
        foldersOnly
    }).trimEnd();

    await vscode.env.clipboard.writeText(output);

    vscode.window.showInformationMessage("OutFoxed Copy Folder Structure: copied 🦊");
}

module.exports = copyStructure;