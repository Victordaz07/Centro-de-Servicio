// Plan de progreso del miembro nuevo — fuente: presidencia de estaca.
// Se instancia completo (sin marcar) al registrar un Bautismo con persona.
export const HITOS_SEED: {
  ventana: string;
  ordenVentana: number;
  diasDesdeBautismo: number;
  accion: string;
  responsableRoles: string[];
}[] = [
  { ventana: "Día 0", ordenVentana: 0, diasDesdeBautismo: 0, accion: "Bautismo y confirmación", responsableRoles: [] },
  { ventana: "Semana 1", ordenVentana: 1, diasDesdeBautismo: 7, accion: "Entrevista recomendo limitado del templo", responsableRoles: ["obispado"] },
  { ventana: "Semana 1", ordenVentana: 2, diasDesdeBautismo: 7, accion: "Entrevista ordenación Sacerdocio Aarónico", responsableRoles: ["obispado"] },
  { ventana: "Semanas 1-2", ordenVentana: 3, diasDesdeBautismo: 14, accion: "Asignar ministrantes + asignación de ministración", responsableRoles: ["obispado"] },
  { ventana: "Semanas 1-2", ordenVentana: 4, diasDesdeBautismo: 14, accion: "Extender un llamamiento", responsableRoles: ["cuorum_sds"] },
  { ventana: "Semanas 2-4", ordenVentana: 5, diasDesdeBautismo: 28, accion: "Deberes sacramentales / Sacerdocio Aarónico", responsableRoles: ["obispado"] },
  { ventana: "Mes 1", ordenVentana: 6, diasDesdeBautismo: 30, accion: "Investigar nombre familiar", responsableRoles: ["obispado", "cuorum_sds"] },
  { ventana: "Mes 1", ordenVentana: 7, diasDesdeBautismo: 30, accion: "Asistir al templo", responsableRoles: ["cuorum_sds"] },
  { ventana: "Mes 3", ordenVentana: 8, diasDesdeBautismo: 90, accion: "Repetir lecciones (Sendero del Convenio)", responsableRoles: ["obispado"] },
  { ventana: "Meses 3-9", ordenVentana: 9, diasDesdeBautismo: 180, accion: "Preparación bendición patriarcal", responsableRoles: ["mision"] },
  { ventana: "Meses 3-9", ordenVentana: 10, diasDesdeBautismo: 180, accion: "Ordenación Melquisedec", responsableRoles: ["obispado"] },
  { ventana: "Año 1", ordenVentana: 11, diasDesdeBautismo: 365, accion: "Preparación investidura del templo", responsableRoles: ["cuorum_sds", "obispado"] },
];

export const ROL_TAG_LABEL: Record<string, string> = {
  obispado: "Obispado",
  cuorum_sds: "Cuórum / SdS",
  mision: "Misión",
};
