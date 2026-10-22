import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
loadEnvConfig(process.cwd());
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});
try {
  await db.query(
    await readFile(new URL("./schema.sql", import.meta.url), "utf8"),
  );
  const [registrationColumns] = await db.query(
    "SHOW COLUMNS FROM registrations LIKE 'active_team_name'",
  );
  if (!registrationColumns.length)
    await db.query(
      "ALTER TABLE registrations ADD COLUMN active_team_name VARCHAR(120) GENERATED ALWAYS AS (CASE WHEN status IN ('pending','approved') THEN team_name ELSE NULL END) STORED, ADD UNIQUE KEY active_registration(active_team_name,season_id)",
    );
  for (const [kind, names] of Object.entries({
    division: ["I", "II", "III"],
    category: ["Libre", "Veteranos", "Juvenil"],
    season: ["2026"],
    venue: ["Cancha Yaquis"],
    position: ["Portero", "Defensa", "Medio", "Delantero"],
  })) {
    for (const name of names)
      await db.execute("INSERT IGNORE INTO catalogs(kind,name) VALUES (?,?)", [
        kind,
        name,
      ]);
  }
  const email = process.env.SEED_ADMIN_EMAIL;
  if (!email || !process.env.SEED_ADMIN_PASSWORD)
    throw new Error(
      "Configura SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD en .env.local",
    );
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(process.env.SEED_ADMIN_PASSWORD, salt, 64).toString("hex")}`;
  const [result] = await db.execute(
    "INSERT IGNORE INTO users(name,email,password_hash,role) VALUES (?,?,?,?)",
    [
      process.env.SEED_ADMIN_NAME || "Administrador",
      email.toLowerCase(),
      hash,
      "admin",
    ],
  );
  console.log(
    "Tablas y catálogos listos. Administrador: " +
      (result.affectedRows ? "creado." : "ya existía; se conserva su cuenta."),
  );
} finally {
  await db.end();
}
