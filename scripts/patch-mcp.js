import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
  path.join(__dirname, "../node_modules/@lovable.dev/mcp-js/dist/stacks/tanstack/vite.js"),
  path.join(__dirname, "../node_modules/@lovable.dev/mcp-js/dist/stacks/tanstack/vite.cjs")
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, "utf8");

  // Fix ESM
  if (content.includes("child !== parent && !child.startsWith(parent + sep)")) {
    content = content.replace(
      "if (child !== parent && !child.startsWith(parent + sep)) {",
      'const normParent = normalizePath(parent);\n  const normChild = normalizePath(child);\n  if (normChild !== normParent && !normChild.startsWith(normParent + "/")) {'
    );
    fs.writeFileSync(file, content, "utf8");
    console.log(`Patched ${file}`);
  }

  // Fix CJS
  if (content.includes("child !== parent && !child.startsWith(parent + import_node_path.sep)")) {
    content = content.replace(
      "if (child !== parent && !child.startsWith(parent + import_node_path.sep)) {",
      'const normParent = normalizePath(parent);\n  const normChild = normalizePath(child);\n  if (normChild !== normParent && !normChild.startsWith(normParent + "/")) {'
    );
    fs.writeFileSync(file, content, "utf8");
    console.log(`Patched ${file}`);
  }
}
