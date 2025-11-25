#!/usr/bin/env tsx

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface RepoConfig {
  composeExecutable: "docker" | "podman";
}

const CONFIG_DIR = join(process.cwd(), ".config");
const CONFIG_PATH = join(CONFIG_DIR, "repo-config.json");

function detectComposeExecutable(): "docker" | "podman" {
  try {
    execSync("podman --version", { stdio: "ignore" });
    return "podman";
  } catch {
    try {
      execSync("docker --version", { stdio: "ignore" });
      return "docker";
    } catch {
      return "docker";
    }
  }
}

function loadOrCreateConfig(): RepoConfig {
  if (existsSync(CONFIG_PATH)) {
    try {
      const configContent = readFileSync(CONFIG_PATH, "utf-8");
      const config = JSON.parse(configContent) as RepoConfig;
      return config;
    } catch (error) {
    }
  }

  const config: RepoConfig = {
    composeExecutable: detectComposeExecutable(),
  };

  return config;
}

function saveConfig(config: RepoConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

function main(): void {
  try {
    const config = loadOrCreateConfig();
    saveConfig(config);
  } catch (error) {
    process.exit(1);
  }
}

main();

