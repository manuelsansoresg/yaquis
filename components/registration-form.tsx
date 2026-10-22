"use client";
import { useState } from "react";
import type { Catalog } from "@/lib/league";
export function RegistrationForm({
  catalogs,
  seasonId,
}: {
  catalogs: Catalog[];
  seasonId?: number;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  return (
    <form
      className="form-fields rounded-lg border border-[#2c4557] bg-[#081927] p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setError("");
        setSuccess("");
        try {
          const response = await fetch("/api/registrations", {
            method: "POST",
            body: data,
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          setSuccess(
            `Solicitud #${result.id} recibida. La administración revisará tu inscripción.`,
          );
          form.reset();
        } catch (e) {
          setError(e instanceof Error ? e.message : "No se pudo conectar.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {success && (
        <p className="form-success" role="status">
          {success}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <label>
        Nombre del equipo
        <input
          name="team_name"
          required
          maxLength={120}
          placeholder="Ej. Guerreros FC"
        />
      </label>
      <label>
        Nombre del responsable
        <input name="manager" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        Correo
        <input
          name="email"
          type="email"
          required
          maxLength={190}
          autoComplete="email"
        />
      </label>
      <label>
        Teléfono
        <input
          name="phone"
          type="tel"
          required
          minLength={7}
          maxLength={30}
          autoComplete="tel"
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["category", "Categoría"],
          ["division", "División"],
          ["season", "Temporada"],
        ].map(([kind, label]) => (
          <label key={kind}>
            {label}
            <select
              name={`${kind}_id`}
              required
              defaultValue={kind === "season" ? seasonId : ""}
            >
              <option value="">Selecciona…</option>
              {catalogs
                .filter((c) => c.kind === kind && c.active)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {kind === "division" ? "División " : ""}
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
        ))}
        <label>
          Número de jugadores
          <input name="player_count" type="number" min={7} max={40} required />
        </label>
      </div>
      <label>
        Logo del equipo (opcional, máximo 2 MB)
        <input
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button disabled={busy} className="button-primary">
        {busy ? "Enviando…" : "Enviar inscripción"}
      </button>
      <p className="muted text-xs text-center">
        Tu equipo se publicará cuando un administrador apruebe la solicitud.
      </p>
    </form>
  );
}
