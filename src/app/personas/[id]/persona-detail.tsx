"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  softDeletePersona,
  restorePersona,
  updatePersona,
  type PersonaFormState,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft } from "@/components/icons";
import { PlanIntegracionView, type HitoData } from "@/app/servicio/bautismos/plan-integracion-view";
import { RegistrarBautismoInline } from "@/app/servicio/bautismos/registrar-bautismo-inline";
import type { PersonaRowData } from "../types";

type BautismoConPlan = {
  id: string;
  fecha: Date;
  planIntegracion: { hitos: HitoData[] } | null;
} | null;

export function PersonaDetail({
  persona,
  bautismo,
}: {
  persona: PersonaRowData;
  bautismo: BautismoConPlan;
}) {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<PersonaFormState>(undefined);
  const [pending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updatePersona(persona.id, undefined, formData);
      if (result?.errors) {
        setErrors(result);
        return;
      }
      setErrors(undefined);
      setEditing(false);
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative overflow-hidden bg-deep-water px-6 pt-6 pb-6 lg:px-10 lg:pt-8">
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -top-20 -right-10 h-56 w-56 opacity-[.15]"
          fill="none"
          stroke="var(--mist)"
        >
          <circle cx="100" cy="100" r="28" />
          <circle cx="100" cy="100" r="52" />
          <circle cx="100" cy="100" r="78" />
        </svg>

        <Link
          href="/personas"
          className="relative mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-mist lg:hidden"
        >
          <IconArrowLeft width={20} height={20} stroke="currentColor" />
        </Link>

        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <h1 className="font-serif text-[28px] leading-[34px] text-linen lg:text-[32px] lg:leading-[38px]">
              {persona.nombres} {persona.apellidos}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {persona.deletedAt ? (
                <Badge variant="eliminado">Eliminada</Badge>
              ) : (
                <Badge variant="en-curso">Activa</Badge>
              )}
            </div>
            {(persona.telefono || persona.notas) && (
              <p className="font-sans text-sm text-mist/80">
                {[persona.telefono, persona.notas].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          <div className="flex flex-none gap-2">
            {persona.telefono && (
              <a href={`tel:${persona.telefono}`}>
                <Button variant="primary">Llamar</Button>
              </a>
            )}
            {!editing && !persona.deletedAt && (
              <Button
                variant="secondary"
                className="border-mist/45 text-mist hover:bg-white/10"
                onClick={() => setEditing(true)}
              >
                Editar
              </Button>
            )}
            {persona.deletedAt ? (
              <Button
                variant="secondary"
                className="border-mist/45 text-mist hover:bg-white/10"
                disabled={pending}
                onClick={() => startTransition(() => restorePersona(persona.id))}
              >
                Restaurar
              </Button>
            ) : (
              !editing && (
                <Button
                  variant="secondary"
                  className="border-mist/45 text-mist hover:bg-white/10"
                  disabled={pending}
                  onClick={() => startTransition(() => softDeletePersona(persona.id))}
                >
                  Eliminar
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 lg:p-10">
        {editing ? (
          <form
            action={handleSave}
            className="grid grid-cols-1 gap-3 rounded-[20px] border border-deep-water/8 bg-white p-5 sm:grid-cols-2"
          >
            <h2 className="col-span-full font-serif text-lg text-deep-water">Editar persona</h2>
            <div className="space-y-1">
              <label htmlFor="nombres" className="font-sans text-xs font-medium text-ink">
                Nombres
              </label>
              <input
                id="nombres"
                name="nombres"
                defaultValue={persona.nombres}
                required
                className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="apellidos" className="font-sans text-xs font-medium text-ink">
                Apellidos
              </label>
              <input
                id="apellidos"
                name="apellidos"
                defaultValue={persona.apellidos}
                required
                className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="telefono" className="font-sans text-xs font-medium text-ink">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                defaultValue={persona.telefono ?? ""}
                className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="notas" className="font-sans text-xs font-medium text-ink">
                Notas
              </label>
              <input
                id="notas"
                name="notas"
                defaultValue={persona.notas ?? ""}
                className="w-full rounded-xl border border-line px-3 py-2 font-sans text-sm outline-none focus:border-living-teal"
              />
            </div>
            {errors?.errors && (
              <p className="col-span-full font-sans text-xs text-rojo">
                Revisa nombres y apellidos.
              </p>
            )}
            <div className="col-span-full flex gap-2">
              <Button type="submit" variant="primary" disabled={pending}>
                Guardar
              </Button>
              <Button type="button" variant="tertiary" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : bautismo?.planIntegracion ? (
          <div className="rounded-[20px] border border-deep-water/8 bg-white p-5">
            <PlanIntegracionView hitos={bautismo.planIntegracion.hitos} />
          </div>
        ) : (
          <RegistrarBautismoInline personaId={persona.id} />
        )}

        <div className="rounded-[20px] border border-dashed border-deep-water/15 bg-white/60 p-6 font-sans text-sm text-water-mid">
          El historial unificado de esta persona llega en la próxima fase, sobre este mismo perfil.
        </div>
      </div>
    </div>
  );
}
