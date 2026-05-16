import fs from "fs/promises";
import path from "path";

import { EXPORTED_TYPES } from "./getBindings";

function ignore(file: string) {
  return file !== "mod.rs";
}

type ArgType = {
  name: string;
  type: string;
};

const TYPES_MAP = [
  ["string", /String/g],
  ["number", /i8|u8|i16|u16|i32|u32|f32|i64|u64|f64/g],
  ["boolean", /bool/g],
  ["Array", /Vec/g],
  ["Record", /HashMap/g],
  ["$1 | null", /Option<(.*)>/g],
  ["undefined", "()"],
  ["RecordId$1", /RecordId\s\/\*(.*)\*\//g],
  ["Record<string, InfoTerrainBonifie>", "InfoTerrainsBonifies"],
  // We remove lifetimes
  ["", /<'[a-zA-Z0-9_]+>/g],
] as const;

const PUB_FN_REGEX =
  /#\[command\]\s*pub\s+(async\s+)?fn\s+(?<command>[a-zA-Z0-9_]+)\s*\((?<params>[\S\s]*?)\)(?:\s*->\s*(?:Result<(?<returnType>.+?)>|(?<plainReturnType>.+?)))?(?=\s*\{|\s*;|\s*$)/gm;

export async function getCommandsInfo(commands: string[]) {
  const tauriCommands = await getTauriCommandsAndArgs();

  const res: {
    imports: Set<string>;
    commands: {
      [commandName: string]: {
        returnType?: string;
        [argName: string]: string | undefined;
      };
    };
  } = {
    imports: new Set(),
    commands: {},
  };

  for (const commandName in tauriCommands) {
    if (!commands.includes(commandName)) {
      continue;
    }

    const info = tauriCommands[commandName];

    if (!info) {
      continue;
    }

    res.commands[commandName] = {
      returnType: info.returnType,
    };

    info.typesToImport.forEach((type) => {
      res.imports.add(type);
    });

    info.argsTypes.forEach((arg) => {
      if (res.commands[commandName]) {
        res.commands[commandName][arg.name] = arg.type;
      }
    });
  }

  return res;
}

async function getTauriCommandsAndArgs() {
  const commandFilesPath = path.resolve(__dirname, "../../../src-tauri/src/commands");

  const files = await fs.readdir(commandFilesPath);

  const paths = files.filter(ignore).map((file) => path.join(commandFilesPath, file));
  const fileContents = await Promise.all(paths.map((file) => fs.readFile(file, "utf-8")));

  const res: Record<
    string,
    { argsTypes: ArgType[]; typesToImport: Set<string>; returnType?: string }
  > = {};

  for await (const fileContent of fileContents) {
    let match: RegExpExecArray | null;
    while ((match = PUB_FN_REGEX.exec(fileContent))) {
      if (!match?.groups) {
        continue;
      }

      const { command, params, returnType, plainReturnType } = match.groups;

      if (!command) {
        console.warn("No command name found in match:", match);
        continue;
      }

      let tsReturnType = returnType || plainReturnType || "void";
      TYPES_MAP.forEach(([rsReturnType, regex]) => {
        tsReturnType = tsReturnType.replaceAll(regex, rsReturnType);
      });

      const args = parseArguments(params);
      const argsTypes: ArgType[] = [];

      const typesToImport: Set<string> = new Set();

      for (const exportedType of EXPORTED_TYPES) {
        if (new RegExp(`\\b${exportedType}\\b`).test(tsReturnType)) {
          typesToImport.add(exportedType);
        }
      }

      for (const arg of args) {
        const [name, type] = arg.split(": ").map((item) => item.trim());

        if (!name || !type || type.includes("AppHandle")) {
          continue;
        }

        let tsType = type;
        TYPES_MAP.forEach(([rsType, regex]) => {
          tsType = tsType.replaceAll(regex, rsType);
        });

        for (const exportedType of EXPORTED_TYPES) {
          if (new RegExp(`\\b${exportedType}\\b`).test(tsType)) {
            typesToImport.add(exportedType);
          }
        }

        const argsNameToCamel = name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

        argsTypes.push({
          name: argsNameToCamel,
          type: tsType,
        });
      }

      res[command] = {
        argsTypes,
        typesToImport,
        returnType: tsReturnType,
      };
    }
  }

  return res;
}

function parseArguments(argsStr: string = ""): string[] {
  const args: string[] = [];

  let currentArg = "";
  let depth = 0;

  for (const char of argsStr) {
    if (char === "<") {
      depth++;
      currentArg += char;
    } else if (char === ">") {
      depth--;
      currentArg += char;
    } else if (char === "," && depth === 0) {
      args.push(currentArg.trim());
      currentArg = "";
    } else {
      currentArg += char;
    }
  }

  const trimmedArg = currentArg.trim();

  if (trimmedArg) {
    args.push(trimmedArg);
  }

  return args;
}
