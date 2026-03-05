const vscode = require('vscode');
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const copyStructure = vscode.commands.registerCommand(
        "outfoxed-copy-folder-structure.copyStructure",
        (uri) => runCopy(uri, false)
    );

    const copyFoldersOnly = vscode.commands.registerCommand(
        "outfoxed-copy-folder-structure.copyFoldersOnly",
        (uri) => runCopy(uri, true)
    );

    context.subscriptions.push(copyStructure);
    context.subscriptions.push(copyFoldersOnly);
}

/** @param {string} p */
const normalizePath = p => p.replace(/\\/g, "/");

/**
 * @param {vscode.Uri} uri
 * @param {boolean} foldersOnly
 */
async function runCopy(uri, foldersOnly) {

    if (!uri) {
        vscode.window.showErrorMessage("No folder selected.");
        return;
    }

    const searchConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.search");
    const resultConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.result");

	/** @type {number} */ const maxDepth = searchConfig.get("maxDepth");
    /** @type {string[]} */ const ignore = searchConfig.get("ignore");
    /** @type {"none"|"absolute"|"relative"} */ const includeSourcePath = resultConfig.get("includeSourcePath");

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

/**
 * @param {string} dirPath 
 * @param {string} prefix 
 * @param {number} depth 
 * @param {{maxDepth:number, ignore:string[], foldersOnly:boolean}} options 
 * @returns 
 */
function buildTree(dirPath, prefix, depth, options) {

	if (depth >= options.maxDepth) {
        return prefix + "└── ... (max depth reached)\n";
    }

    let files = fs.readdirSync(dirPath)
        .filter(file => !options.ignore.includes(file));

	if (options.foldersOnly) {
        files = files.filter(file => fs.statSync(path.join(dirPath, file)).isDirectory());
    }

    let tree = "";

    files.forEach((file, index) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        const isLast = index === files.length - 1;
        const connector = isLast ? "└── " : "├── ";
		
        tree += prefix + connector + file + "\n";

        if (stat.isDirectory()) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            tree += buildTree( fullPath, newPrefix, depth + 1, options);
        }
    });

    return tree;
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
