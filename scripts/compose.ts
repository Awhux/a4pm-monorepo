#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface RepoConfig {
  composeExecutable: "docker" | "podman";
}

const CONFIG_PATH = join(process.cwd(), ".config", "repo-config.json");

function loadConfig(): RepoConfig {
  if (!existsSync(CONFIG_PATH)) {
    console.error(
      "Configuration file not found. Please run 'pnpm install' first.",
    );
    process.exit(1);
  }

  const configContent = readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(configContent) as RepoConfig;
}

function runCompose(args: string[]): void {
  const config = loadConfig();
  const command = `${config.composeExecutable} compose ${args.join(" ")}`;

  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute compose command`);
    process.exit(1);
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("No compose command provided");
    console.log("Usage: tsx compose.ts <compose-args>");
    console.log("Example: tsx compose.ts up -d");
    process.exit(1);
  }

  runCompose(args);
}

main();

