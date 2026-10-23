import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import nextEnv from "@next/env";
import mysql from "mysql2/promise";
nextEnv.loadEnvConfig(process.cwd());
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const marker = `QA-${Date.now()}`;
let cookie = "";
const created = [];
const mediaIds = [];
async function request(path, body, method = "POST", session = cookie) {
  const response = await fetch(base + path, {
    method,
    headers: {
      Origin: base,
      ...(session ? { Cookie: session } : {}),
      ...(!(body instanceof FormData) && body
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { response, data };
}
async function list(entity) {
  const { response, data } = await request("/api/admin/" + entity, null, "GET");
  assert.equal(response.status, 200);
  return data;
}
async function create(entity, body) {
  const { response, data } = await request("/api/admin/" + entity, body);
  assert.equal(response.status, 200, JSON.stringify(data));
  const all = await list(entity);
  const row = all[0];
  created.push([entity, row.id]);
  return row;
}
try {
  let result = await request("/api/admin/users", null, "GET", "");
  assert.equal(result.response.status, 403);
  result = await request("/api/auth", {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  });
  assert.equal(result.response.status, 200, JSON.stringify(result.data));
  cookie = result.response.headers.get("set-cookie").split(";")[0];
  const admin = (await list("users")).find(
    (u) => u.email === process.env.SEED_ADMIN_EMAIL,
  );
  assert.ok(admin);
  assert.equal("password_hash" in admin, false);
  result = await request("/api/admin/users", { ...admin, role: "user" });
  assert.equal(result.response.status, 400);
  const catalogs = await list("catalogs");
  const ref = (kind) => catalogs.find((c) => c.kind === kind && c.active).id;
  const catalog = await create("catalogs", {
    kind: "venue",
    name: marker,
    active: true,
  });
  result = await request("/api/admin/catalogs", { ...catalog, kind: "season" });
  assert.equal(result.response.status, 400);
  const fd = new FormData();
  for (const [key, value] of Object.entries({
    team_name: marker + " FC",
    manager: marker,
    email: `${marker}@example.com`,
    phone: "6441234567",
    player_count: "14",
    division_id: ref("division"),
    category_id: ref("category"),
    season_id: ref("season"),
  }))
    fd.set(key, String(value));
  fd.set(
    "logo",
    new Blob(
      [
        Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
          "base64",
        ),
      ],
      { type: "image/png" },
    ),
    "logo.png",
  );
  result = await request("/api/registrations", fd);
  assert.equal(result.response.status, 200, JSON.stringify(result.data));
  const regId = result.data.id;
  created.push(["registrations", regId]);
  const registration = (await list("registrations")).find(
    (r) => r.id === regId,
  );
  assert.equal(registration.status, "pending");
  assert.ok(registration.logo_id);
  mediaIds.push(registration.logo_id);
  result = await request("/api/admin/registrations", {
    id: regId,
    status: "approved",
  });
  assert.equal(result.response.status, 200, JSON.stringify(result.data));
  const home = (await list("teams")).find((t) => t.name === marker + " FC");
  assert.ok(home);
  created.push(["teams", home.id]);
  assert.equal(home.logo_id, registration.logo_id);
  result = await request("/api/admin/registrations", {
    id: regId,
    status: "approved",
  });
  assert.equal(result.response.status, 400);
  const logo = await fetch(base + "/api/media/" + home.logo_id);
  assert.equal(logo.status, 200);
  assert.equal(logo.headers.get("content-type"), "image/png");
  const interzoneDivision = await create("catalogs", {
    kind: "division",
    name: marker + " interzona",
    active: true,
  });
  const away = await create("teams", {
    name: marker + " visitante",
    short: "QAV",
    division_id: interzoneDivision.id,
    category_id: ref("category"),
    season_id: ref("season"),
    active: true,
  });
  const player = await create("players", {
    name: marker + " jugador",
    team_id: home.id,
    position_id: ref("position"),
    number: 9,
    active: true,
  });
  const match = await create("matches", {
    home_id: home.id,
    away_id: away.id,
    venue_id: catalog.id,
    kickoff: "2026-10-22T20:00",
    round: 1,
    status: "played",
    home_score: 3,
    away_score: 1,
  });
  result = await request("/api/admin/matches", { ...match, away_id: home.id });
  assert.equal(result.response.status, 400);
  for (const kind of ["season", "category"]) {
    const other = await create("catalogs", {
      kind,
      name: marker + " " + kind,
      active: true,
    });
    const incompatible = await create("teams", {
      ...away,
      id: undefined,
      name: marker + " " + kind,
      [`${kind}_id`]: other.id,
    });
    result = await request("/api/admin/matches", {
      ...match,
      away_id: incompatible.id,
    });
    assert.equal(result.response.status, 400, `Rechaza distinta ${kind}`);
  }
  const goal = await create("match_goals", {
    match_id: match.id,
    player_id: player.id,
    goals: 2,
  });
  result = await request("/api/admin/match_goals", { ...goal, goals: 4 });
  assert.equal(result.response.status, 400);
  result = await request("/api/admin/matches", { ...match, home_score: 1 });
  assert.equal(result.response.status, 400);
  await create("news", {
    tag: marker,
    title: marker + " noticia",
    copy: "Noticia de verificación temporal",
    published_on: "2026-10-22",
    active: true,
  });
  for (const path of [
    "/",
    "/equipos",
    "/plantillas",
    "/partidos",
    "/posiciones",
    "/goleadores",
  ]) {
    const page = await fetch(base + path);
    assert.equal(page.status, 200);
    assert.ok(
      (await page.text()).includes(marker),
      `Datos dinámicos en ${path}`,
    );
  }
  const standingsHtml = await (await fetch(base + "/posiciones")).text();
  const homeRow = standingsHtml.match(
    new RegExp(
      "<tr[^>]*>(?:(?!<\\/tr>)[\\s\\S])*?" +
        marker +
        " FC(?:(?!<\\/tr>)[\\s\\S])*?<\\/tr>",
    ),
  )?.[0];
  assert.ok(homeRow, "Fila pública del equipo");
  assert.ok(homeRow.includes(">3</td>"), "Tres puntos por victoria");
  assert.ok(homeRow.includes(">2</td>"), "Diferencia de goles 3-1");
  const scorersHtml = await (await fetch(base + "/goleadores")).text();
  assert.ok(scorersHtml.includes(marker + " jugador"));
  assert.ok(scorersHtml.includes(">2<!-- -->"));
  const userPassword = randomBytes(16).toString("hex");
  const normal = await create("users", {
    name: marker,
    email: marker + "-user@example.com",
    password: userPassword,
    role: "user",
    active: true,
  });
  result = await request(
    "/api/auth",
    { email: normal.email, password: userPassword },
    "POST",
    "",
  );
  assert.equal(result.response.status, 200);
  const normalCookie = result.response.headers.get("set-cookie").split(";")[0];
  result = await request("/api/admin/users", null, "GET", normalCookie);
  assert.equal(result.response.status, 403);
  result = await request(
    "/api/admin/teams",
    { name: "unauthorized" },
    "POST",
    normalCookie,
  );
  assert.equal(result.response.status, 403);
  result = await request("/api/auth", null, "DELETE", normalCookie);
  assert.equal(result.response.status, 200);
  result = await request("/api/admin/users", { ...normal, role: "admin" });
  assert.equal(result.response.status, 200);
  result = await request(
    "/api/auth",
    { email: normal.email, password: userPassword },
    "POST",
    "",
  );
  assert.equal(result.response.status, 200);
  const promotedCookie = result.response.headers
    .get("set-cookie")
    .split(";")[0];
  result = await request("/api/admin/users", null, "GET", promotedCookie);
  assert.equal(result.response.status, 200);
  const csrf = await fetch(base + "/api/admin/catalogs", {
    method: "POST",
    headers: {
      Origin: "https://invalid.example",
      Cookie: cookie,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kind: "venue", name: "invalid" }),
  });
  assert.equal(csrf.status, 400);
  console.log(
    "OK: autenticación, roles, catálogos, inscripción con logo, aprobación, equipos, jugadores, resultados, anotaciones, límites de marcador, publicación dinámica y protección de origen.",
  );
} finally {
  // Delete only records created by this run, in dependency order.
  const priority = [
    "match_goals",
    "matches",
    "players",
    "registrations",
    "teams",
    "news",
    "users",
    "catalogs",
  ];
  created.sort((a, b) => priority.indexOf(a[0]) - priority.indexOf(b[0]));
  for (const [entity, id] of created) {
    const { response, data } = await request(
      "/api/admin/" + entity,
      { id },
      "DELETE",
    );
    if (!response.ok)
      console.error("No se pudo limpiar prueba:", entity, id, data);
  }
  if (cookie) await request("/api/auth", null, "DELETE");
  if (mediaIds.length) {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    try {
      for (const id of mediaIds)
        await db.execute(
          "DELETE FROM media WHERE id=? AND NOT EXISTS(SELECT 1 FROM teams WHERE logo_id=?) AND NOT EXISTS(SELECT 1 FROM registrations WHERE logo_id=?)",
          [id, id, id],
        );
    } finally {
      await db.end();
    }
  }
}
