import fs from "fs/promises";
import path from "path";

const FILES_TO_IGNORE = ["index.ts", "commandsList.ts"];

function ignore(file: string) {
  return !FILES_TO_IGNORE.includes(file);
}

const bindingsPath = path.resolve(__dirname, "../../bindings");

const bindingFiles = (await fs.readdir(bindingsPath)).filter(ignore);
const bindingFilePaths = bindingFiles.map((file) => path.join(bindingsPath, file));

for (const i in bindingFilePaths) {
  const filePath = bindingFilePaths[i]!;
  const stats = await fs.stat(filePath);

  if (!stats.isFile()) {
    const files = (await fs.readdir(filePath)).filter(ignore);
    const nestedFilePaths = files.map((file) => path.join(filePath, file));
    bindingFilePaths.splice(Number(i), 1, ...nestedFilePaths);
  }
}

const bindingFileContents = await Promise.all(
  bindingFilePaths.map((file) => fs.readFile(file, "utf-8"))
);

const EXPORT_TYPE_REGEX = /(?:export(?: default)? (?:type|interface) )(\w*)/gm;

function getExportTypes(content: string) {
  const exportTypes = [];
  let match;
  while ((match = EXPORT_TYPE_REGEX.exec(content)) !== null) {
    if (!match[1]) {
      console.warn("No export type found in match:", match);
      continue;
    }

    exportTypes.push(match[1]);
  }
  return exportTypes;
}

export const EXPORTED_TYPES = bindingFileContents.map((content) => getExportTypes(content)).flat();
