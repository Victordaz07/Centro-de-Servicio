# Centro de Servicio

Next.js (App Router) + Prisma + Postgres. Persona es la entidad central; Organización (núcleo operativo) y Servicio (módulos condicionados por los llamamientos del usuario) son vistas sobre estos mismos datos. Ver `prisma/schema.prisma` para el esquema completo (v3).

Construido hasta ahora: **fase 1** (esquema + auth + CRUD de Persona). El shell de navegación (Inicio/Personas/Organización/Servicio/Ajustes), el onboarding de llamamientos, PWA (`next-pwa`) y todos los módulos de fase 2+ todavía no existen.

## Setup

1. Copia tu connection string de Postgres (Vercel Postgres o Supabase) en `.env` → `DATABASE_URL`.
2. Ajusta `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` en `.env` (tu login inicial).
3. Crea las tablas y siembra tu usuario:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Arranca el servidor:

   ```bash
   npm run dev
   ```

5. Entra en `http://localhost:3000`, inicia sesión con las credenciales sembradas, y prueba `/personas` (crear, buscar, editar, enviar a la papelera y restaurar).

## Notas de stack

- **Prisma 7**: usa el generator `prisma-client` (no `prisma-client-js`) y requiere un driver adapter (`@prisma/adapter-pg`) — ver `src/lib/prisma.ts`. La URL de conexión vive en `prisma.config.ts` para el CLI y en `process.env.DATABASE_URL` (cargado automáticamente por Next.js) para la app.
- **Next.js 16**: `middleware.ts` se renombró a `src/proxy.ts` (misma función, corre en Node.js runtime). Revisa `node_modules/next/dist/docs/` antes de asumir convenciones de versiones anteriores.
- **Auth**: NextAuth v5 (beta) con Credentials provider + bcrypt, sesión JWT, sin adapter de Prisma (no hace falta para un solo usuario).
- **Autocompletado de Persona**: `src/components/persona-autocomplete.tsx` — reutilízalo en Agenda, Tareas, Rotaciones, etc. en vez de inputs de texto libre con nombres.
