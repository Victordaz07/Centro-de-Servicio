-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CUORUM_SDS', 'EJECUTIVO', 'OBISPADO', 'ED');

-- CreateEnum
CREATE TYPE "EstadoEnsenanza" AS ENUM ('CONTACTADO', 'ENSENANDO', 'COMPROMISO_BAUTISMO', 'BAUTIZADO');

-- CreateEnum
CREATE TYPE "EstadoLlamamiento" AS ENUM ('ORANDO', 'PROPUESTO', 'EXTENDIDO');

-- CreateEnum
CREATE TYPE "EstadoEntrevista" AS ENUM ('PENDIENTE', 'AGENDADA', 'HECHA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roles" "Rol"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "notas" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnsenanzaProgreso" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "estado" "EstadoEnsenanza" NOT NULL,
    "lecciones" JSONB NOT NULL,
    "compromisos" JSONB NOT NULL,

    CONSTRAINT "EnsenanzaProgreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bautismo" (
    "id" TEXT NOT NULL,
    "personaId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "himnos" JSONB NOT NULL,
    "programa" JSONB NOT NULL,

    CONSTRAINT "Bautismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companerismo" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Companerismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionMinistracion" (
    "id" TEXT NOT NULL,
    "companerismoId" TEXT NOT NULL,
    "familiaId" TEXT NOT NULL,
    "ultimoContacto" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AsignacionMinistracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlamamientoConsideracion" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "llamamientoPropuesto" TEXT NOT NULL,
    "estado" "EstadoLlamamiento" NOT NULL DEFAULT 'ORANDO',
    "history" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LlamamientoConsideracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrevista" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),
    "estado" "EstadoEntrevista" NOT NULL DEFAULT 'PENDIENTE',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Entrevista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomendoTemplo" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "notas" TEXT,

    CONSTRAINT "RecomendoTemplo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramaSacramental" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "numerosMusicales" JSONB NOT NULL,
    "conductor" TEXT,

    CONSTRAINT "ProgramaSacramental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OradorAsignado" (
    "id" TEXT NOT NULL,
    "programaId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "tema" TEXT,

    CONSTRAINT "OradorAsignado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaEdificio" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "solicitante" TEXT NOT NULL,
    "proposito" TEXT,

    CONSTRAINT "ReservaEdificio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaseEscDominical" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "maestroPersonaId" TEXT,
    "suplentes" JSONB NOT NULL,
    "turnoActualSuplente" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClaseEscDominical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referencia" (
    "id" TEXT NOT NULL,
    "personaQueRefiereId" TEXT NOT NULL,
    "personaReferidaId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactada" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,

    CONSTRAINT "Referencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanIntegracion" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "bautismoId" TEXT NOT NULL,
    "fechaBautismo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanIntegracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitoIntegracion" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "ventana" TEXT NOT NULL,
    "ordenVentana" INTEGER NOT NULL,
    "diasDesdeBautismo" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "responsableRoles" TEXT[],
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "completadoPor" TEXT,
    "completadoFecha" TIMESTAMP(3),
    "notas" TEXT,

    CONSTRAINT "HitoIntegracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "responsablePersonaId" TEXT,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minuta" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "texto" TEXT NOT NULL,
    "history" JSONB NOT NULL,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Minuta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" TEXT NOT NULL,
    "quien" TEXT NOT NULL,
    "que" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "history" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rotacion" (
    "id" TEXT NOT NULL,
    "tarea" TEXT NOT NULL,
    "personas" JSONB NOT NULL,
    "turnoActual" INTEGER NOT NULL DEFAULT 0,
    "turnHistory" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Rotacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsejoBarrio" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "notas" TEXT,

    CONSTRAINT "ConsejoBarrio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FamiliaPersonas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FamiliaPersonas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Persona_apellidos_nombres_idx" ON "Persona"("apellidos", "nombres");

-- CreateIndex
CREATE UNIQUE INDEX "EnsenanzaProgreso_personaId_key" ON "EnsenanzaProgreso"("personaId");

-- CreateIndex
CREATE UNIQUE INDEX "Bautismo_personaId_key" ON "Bautismo"("personaId");

-- CreateIndex
CREATE INDEX "AsignacionMinistracion_companerismoId_idx" ON "AsignacionMinistracion"("companerismoId");

-- CreateIndex
CREATE INDEX "AsignacionMinistracion_familiaId_idx" ON "AsignacionMinistracion"("familiaId");

-- CreateIndex
CREATE INDEX "LlamamientoConsideracion_personaId_idx" ON "LlamamientoConsideracion"("personaId");

-- CreateIndex
CREATE INDEX "Entrevista_personaId_idx" ON "Entrevista"("personaId");

-- CreateIndex
CREATE INDEX "RecomendoTemplo_personaId_idx" ON "RecomendoTemplo"("personaId");

-- CreateIndex
CREATE INDEX "OradorAsignado_programaId_idx" ON "OradorAsignado"("programaId");

-- CreateIndex
CREATE INDEX "OradorAsignado_personaId_idx" ON "OradorAsignado"("personaId");

-- CreateIndex
CREATE INDEX "ClaseEscDominical_maestroPersonaId_idx" ON "ClaseEscDominical"("maestroPersonaId");

-- CreateIndex
CREATE UNIQUE INDEX "Referencia_personaReferidaId_key" ON "Referencia"("personaReferidaId");

-- CreateIndex
CREATE INDEX "Referencia_personaQueRefiereId_idx" ON "Referencia"("personaQueRefiereId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanIntegracion_personaId_key" ON "PlanIntegracion"("personaId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanIntegracion_bautismoId_key" ON "PlanIntegracion"("bautismoId");

-- CreateIndex
CREATE INDEX "HitoIntegracion_planId_idx" ON "HitoIntegracion"("planId");

-- CreateIndex
CREATE INDEX "AgendaItem_responsablePersonaId_idx" ON "AgendaItem"("responsablePersonaId");

-- CreateIndex
CREATE INDEX "_FamiliaPersonas_B_index" ON "_FamiliaPersonas"("B");

-- AddForeignKey
ALTER TABLE "EnsenanzaProgreso" ADD CONSTRAINT "EnsenanzaProgreso_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bautismo" ADD CONSTRAINT "Bautismo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionMinistracion" ADD CONSTRAINT "AsignacionMinistracion_companerismoId_fkey" FOREIGN KEY ("companerismoId") REFERENCES "Companerismo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionMinistracion" ADD CONSTRAINT "AsignacionMinistracion_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlamamientoConsideracion" ADD CONSTRAINT "LlamamientoConsideracion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrevista" ADD CONSTRAINT "Entrevista_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomendoTemplo" ADD CONSTRAINT "RecomendoTemplo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OradorAsignado" ADD CONSTRAINT "OradorAsignado_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "ProgramaSacramental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OradorAsignado" ADD CONSTRAINT "OradorAsignado_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaseEscDominical" ADD CONSTRAINT "ClaseEscDominical_maestroPersonaId_fkey" FOREIGN KEY ("maestroPersonaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referencia" ADD CONSTRAINT "Referencia_personaQueRefiereId_fkey" FOREIGN KEY ("personaQueRefiereId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referencia" ADD CONSTRAINT "Referencia_personaReferidaId_fkey" FOREIGN KEY ("personaReferidaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanIntegracion" ADD CONSTRAINT "PlanIntegracion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanIntegracion" ADD CONSTRAINT "PlanIntegracion_bautismoId_fkey" FOREIGN KEY ("bautismoId") REFERENCES "Bautismo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitoIntegracion" ADD CONSTRAINT "HitoIntegracion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PlanIntegracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_responsablePersonaId_fkey" FOREIGN KEY ("responsablePersonaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamiliaPersonas" ADD CONSTRAINT "_FamiliaPersonas_A_fkey" FOREIGN KEY ("A") REFERENCES "Familia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FamiliaPersonas" ADD CONSTRAINT "_FamiliaPersonas_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
