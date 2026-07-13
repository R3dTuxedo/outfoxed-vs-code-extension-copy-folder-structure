const path = require("path");
const vscode = require("vscode");

/**
 * @param {string} filePath
 */
function normalizePath(filePath) {
    return filePath.replace(/\\/g, "/");
}

/**
 * @param {string} fallback 
 */
function getProjectRoot(fallback) {
    const workspaceFolders = vscode.workspace.workspaceFolders || [];
    return workspaceFolders[0]?.uri.fsPath || fallback;
}

/**
 * @param {string} filePath 
 */
function getRelativePath(filePath) {
    return normalizePath(path.relative(getProjectRoot(filePath), filePath));
}

module.exports = {
    normalizePath,
    getProjectRoot,
    getRelativePath
};