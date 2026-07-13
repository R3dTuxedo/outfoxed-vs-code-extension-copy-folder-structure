const fs = require("fs");
const path = require("path");

/**
 * @param {string} dirPath 
 * @param {string} prefix 
 * @param {number} depth 
 * @param {{maxDepth:number, ignore:string[], foldersOnly:boolean}} options 
 */
function buildTree(dirPath, prefix, depth, options) {

    if (depth >= options.maxDepth) {
        return prefix + "└── ... (max depth reached)\n";
    }

    let files = fs.readdirSync(dirPath)
        .filter(file => !options.ignore.includes(file));

    if (options.foldersOnly) {
        files = files.filter(file =>
            fs.statSync(path.join(dirPath, file)).isDirectory()
        );
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

            tree += buildTree(
                fullPath,
                newPrefix,
                depth + 1,
                options
            );

        }

    });

    return tree;

}

module.exports = buildTree;