# OutFoxed Copy Folder Structure

Quickly copy the folder structure of any folder in your VS Code project to the clipboard. Supports copying **files + folders** or **folders only**, max depth, ignored files, and showing source paths.

---

## Features

- Right-click any folder to copy its structure
- Two commands:
  - **Copy Folder Structure** – includes files and folders
  - **Copy Folder Structure (Folders Only)** – includes only folder hierarchy
- Optional settings:
  - Max depth
  - Include source path (none / absolute / relative)
  - Ignore files/folders (like `node_modules`, `.git`)
- Clipboard-ready tree output for documentation, sharing, or AI prompts

## Install
Install from the Visual Studio Code Marketplace:

https://marketplace.visualstudio.com/items?itemName=OutFoxed.outfoxed-copy-folder-structure

Or

search for `OutFoxed Copy Folder Structure` inside VS Code Extensions.

## Usage
Right-click any folder and choose:

• Copy Folder Structure  
• Copy Folder Structure (Folders Only)

![Context menu with Copy Folder Structure buttons](/images/context-menu-copy-folder-structure.png)

**Example: Copy Structure**

```
public/
├── css
│   └── main.css
├── images
│   └── icon.png
└── js
    └── app.js
```

**Example: Copy Folders Only**

```
public/
├── css
├── images
└── js
```

**Example with Relative Source Path**

```
Source: src/public

public/
├── css
├── images
└── js
```

---

## Requirements

None! Works out-of-the-box with VS Code.

---

## Extension Settings

This extension contributes the following VS Code settings:

* `outfoxed.copyFolderStructure.search.maxDepth` – Maximum folder depth to scan (default: 10)
* `outfoxed.copyFolderStructure.search.ignore` – Array of files/folders to ignore (default: `["node_modules",".git","dist","build",".vscode",".vscode-test","coverage",".cache",".next",".idea","Thumbs.db",".DS_Store","desktop.ini"]`)
* `outfoxed.copyFolderStructure.result.includeSourcePath` – Show folder path in output: `none`, `absolute`, or `relative` (default: `none`)

### How to Access Settings

1. Press `Ctrl+,` (or go to **Gear Icon > Settings**)  
2. Search for **OutFoxed Copy Folder Structure**  
3. Modify settings as needed

---

## Known Issues

- Deeply nested folders may generate large output; adjust `maxDepth` if needed
- Files/folders listed in `ignore` will not appear in output
- Only supports **workspace folders** for relative paths

---

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for full version history.

### 1.0.0
Initial release with:
- Copy Folder Structure
- Copy Folder Structure (Folders Only)
- Max depth, ignore list, source path options