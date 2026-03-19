// folder-structure.js
import fs from "fs";
import path from "path";

// Folders to ignore (auto-generated)
const ignore = ["node_modules", ".next", ".git", "dist", ".vscode"];

// Recursive function to list files
function listFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    if (ignore.includes(entry.name)) continue; // skip auto-generated
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      console.log(`${prefix}${entry.name}/`);
      listFiles(fullPath, prefix + "  "); // indent for subfolders
    } else {
      console.log(`${prefix}${entry.name}`);
    }
  }
}

// Run from current folder
listFiles("./");