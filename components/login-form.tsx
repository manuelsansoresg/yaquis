"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="surface form-fields p-7 w-full max-w-md mx-auto"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        try {
          const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(data)),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          router.push("/admin");
          router.refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "No se pudo conectar.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="page-kicker">Liga Yaquis</p>
      <h1 className="display-font text-3xl font-black">Iniciar sesión</h1>
      <p className="muted text-sm">Accede con tu correo y contraseña.</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <label>
        Correo
        <input
          name="email"
          type="email"
          required
          maxLength={190}
          autoComplete="username"
        />
      </label>
      <label>
        Contraseña
        <input
          name="password"
          type="password"
          required
          maxLength={128}
          autoComplete="current-password"
        />
      </label>
      <button disabled={busy} className="button-primary">
        {busy ? "Ingresando…" : "Entrar"}
      </button>
    </form>
  );
}
