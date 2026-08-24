"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconRing } from "@/components/icons";
import { Button } from "@/components/ui/button";

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

    router.push("/inicio");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-4">
      <form
        action={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-[26px] border border-deep-water/8 bg-white p-8 shadow-[0_18px_44px_rgba(14,59,67,.12)]"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <IconRing width={34} height={34} stroke="var(--living-teal)" />
          <div>
            <h1 className="font-serif text-2xl text-deep-water">Centro de Servicio</h1>
            <p className="mt-1 font-sans text-sm text-water-mid">Inicia sesión para continuar.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="font-sans text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-sans text-sm text-ink outline-none focus:border-living-teal"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="font-sans text-sm font-medium text-ink">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-sans text-sm text-ink outline-none focus:border-living-teal"
          />
        </div>

        {error && <p className="font-sans text-sm text-rojo">{error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </main>
  );
}
