import mysql, {
  type RowDataPacket,
  type ResultSetHeader,
} from "mysql2/promise";

export type SqlValue = string | number | boolean | Date | Buffer | null;
const globalDb = globalThis as unknown as { leaguePool?: mysql.Pool };
export const pool =
  globalDb.leaguePool ??
  mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    dateStrings: true,
    timezone: "+00:00",
  });
if (process.env.NODE_ENV !== "production") globalDb.leaguePool = pool;
export async function rows<T = Record<string, unknown>>(
  sql: string,
  values: SqlValue[] = [],
): Promise<T[]> {
  const [result] = await pool.execute<RowDataPacket[]>(sql, values);
  return result as T[];
}
export async function execute(sql: string, values: SqlValue[] = []) {
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result;
}
