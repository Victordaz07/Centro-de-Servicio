import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Íconos de trazo fino calcados del sistema de diseño (Claude Design). */

export function IconInicio(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} strokeLinejoin="round" {...props}>
      <path d="M4 11 12 4l8 7v9H4z" />
    </svg>
  );
}

export function IconPersonas(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c1.5-4.4 12.5-4.4 14 0" />
    </svg>
  );
}

export function IconOrganizacion(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
      <path d="M3 7h6l2 2h10v11H3z" />
    </svg>
  );
}

export function IconServicio(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 15l2-4 4-2-2 4z" />
    </svg>
  );
}

export function IconAjustes(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} strokeLinecap="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={3} strokeLinecap="round" {...props}>
      <path d="M5 13l4 4 10-10" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12" />
    </svg>
  );
}

export function IconRing(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" strokeWidth={1.6} {...props}>
      <circle cx="20" cy="20" r="5" />
      <circle cx="20" cy="20" r="11" />
      <circle cx="20" cy="20" r="17" />
    </svg>
  );
}
