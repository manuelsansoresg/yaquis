export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { loadDatabaseEnvironment } = await import("./lib/runtime-env");
  loadDatabaseEnvironment();
}
