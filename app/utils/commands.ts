import { invoke } from "@tauri-apps/api/core";

import type {
  Commands,
  CommandsWithArgs,
  CommandsWithoutArgs,
} from "~/bindings";

export async function run<T extends keyof CommandsWithoutArgs>(
  command: T,
): Promise<CommandsWithoutArgs[T]["return"]>;
export async function run<T extends keyof CommandsWithArgs>(
  command: T,
  args: CommandsWithArgs[T]["args"],
): Promise<CommandsWithArgs[T]["return"]>;
export async function run<T extends keyof Commands>(
  command: T,
  args?: Commands[T]["args"],
) {
  return invoke<Commands[T]["return"]>(command, args);
}
