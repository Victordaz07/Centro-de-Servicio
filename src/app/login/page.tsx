"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.push("/personas");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-4">
      <form
        action={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-deep-water">
          Centro de Servicio
        </h1>
        <p className="text-sm text-ink/70">Inicia sesión para continuar.</p>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-living-teal"
          />
        </div>

        {error && <p className="text-sm text-rojo">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-deep-water py-2 text-sm font-medium text-white transition hover:bg-water-mid disabled:opacity-60"
        >
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
