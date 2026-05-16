import fs from "fs/promises";
import path from "path";

const commandsPath = path.resolve("./src-tauri/src/commands");
const fileNames = ["firebase", "imgbb"];

console.log(process.argv);

for (const index in fileNames) {
  const fileName = fileNames[index]!;
  const file = path.join(commandsPath, `${fileName}.rs`);

  const content = await fs.readFile(file, "utf-8");

  const firstArgIndex = 2;

  const newContent = content.replace(
    `{{ ${fileName.toUpperCase()}_API_KEY }}`,
    process.argv[firstArgIndex + Number(index)] || "",
  );

  await fs.writeFile(file, newContent, "utf-8");
}
