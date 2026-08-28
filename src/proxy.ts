import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Next.js 16 renamed Middleware to Proxy. `auth()` here only decodes the
// session JWT from the cookie (optimistic check) — it never touches Prisma.
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/personas", req.nextUrl));
  }
});

export const config = {
  // Excluye también cualquier archivo estático (con extensión: /art/*.webp,
  // /icons/*.png, /icon.png, /manifest.webmanifest...), no solo favicon.ico —
  // si no, el optimizador de imágenes de Next hace un fetch interno sin la
  // cookie de sesión y el proxy lo redirige a /login, rompiendo la imagen.
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
