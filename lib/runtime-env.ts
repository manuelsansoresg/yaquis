import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadEnvFile } from "node:process";

// Hostinger keeps configuration outside its replaceable version directories.
export function loadDatabaseEnvironment() {
  if (process.env.LEAGUE_ENV_FILE) {
    loadEnvFile(process.env.LEAGUE_ENV_FILE);
    return;
  }

  if (process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) return;

  let directory = process.cwd();
  while (dirname(directory) !== directory) {
    if (directory.endsWith("/hbuilds")) {
      const file = join(directory, "config", "league.env");
      if (existsSync(file)) loadEnvFile(file);
      return;
    }
    directory = dirname(directory);
  }
}
