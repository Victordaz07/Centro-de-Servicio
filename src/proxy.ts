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
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
