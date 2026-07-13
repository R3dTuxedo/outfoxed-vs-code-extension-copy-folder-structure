const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const buildTree = require("./treeBuilder");
const { normalizePath, getProjectRoot } = require("./utils");

/**
 * @param {vscode.Uri} uri 
 */
async function copyContext(uri) {

    if (!uri) {
        vscode.window.showErrorMessage("No file or folder selected.");
        return;
    }


    const root = uri.fsPath;


    const searchConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.search");


    const contextConfig = vscode.workspace.getConfiguration("outfoxed.copyFolderStructure.context");


    const maxDepth = searchConfig.get("maxDepth") ?? 10;
    const ignore = searchConfig.get("ignore") ?? [];
    const extensions = contextConfig.get("enabledExtensions") ?? [];
    const maxCharacters = contextConfig.get("maxCharactersPerFile") ?? 10000;


    const stat = fs.statSync(root);


    let output = "";


    const projectRoot = getProjectRoot(root);




    // File selected
    if (stat.isFile()) {

        output += readFile(
            root,
            normalizePath(path.relative(projectRoot, root)),
            maxCharacters
        );

    }


    // Folder selected
    else {
        
        const relativeRoot = normalizePath(path.relative(projectRoot, root));


        output += `Source: ${relativeRoot || "."}\n\n`;

        output += path.basename(root) + "/\n";


        output += buildTree(root, "", 0, {
            maxDepth,
            ignore,
            foldersOnly: false
        })
        .trimEnd();


        output += "\n\n";


        const files = collectFiles(
            root,
            ignore,
            extensions
        );


        for (const file of files) {

            output += readFile(
                file,
                normalizePath(
                    path.relative(
                        projectRoot,
                        file
                    )
                ),
                maxCharacters
            );


            output += "\n\n";

        }

    }


    await vscode.env.clipboard.writeText(output.trimEnd());

    vscode.window.showInformationMessage("OutFoxed Copy Folder Structure (With Context): copied 🦊");

}


/**
 * 
 * @param {string} dir 
 * @param {string[]} ignore 
 * @param {string[]} extensions 
 * @returns {string[]}
 */
function collectFiles(dir, ignore, extensions) {

    let result = [];

    for (const item of fs.readdirSync(dir)) {


        if (ignore.includes(item))
            continue;


        const full = path.join(dir, item);

        const stat = fs.statSync(full);

        if (stat.isDirectory()) {

            result.push(
                ...collectFiles(
                    full,
                    ignore,
                    extensions
                )
            );

        }

        else {

            const ext = path.extname(full).replace(".", "");

            if (extensions.includes(ext)) {
                result.push(full);
            }

        }

    }


    return result;

}



/**
 * @param {string} file 
 * @param {string} relativePath 
 * @param {number} maxCharacters 
 */
function readFile(file, relativePath, maxCharacters) {

    let contents = fs.readFileSync(file, "utf8");

    let remaining = 0;


    if (contents.length > maxCharacters) {

        remaining = contents.length - maxCharacters;

        contents = contents.substring(0, maxCharacters);

    }


    const language = path.extname(file).replace(".", "");


    let output = `File: ${relativePath}\n`;


    output += "```" + language + "\n";


    output += contents;


    if (remaining > 0) {

        output += `\n\n... (${remaining} characters omitted)`;

    }


    output += "\n```";

    return output;

}



module.exports = copyContext;