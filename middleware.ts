import { NextRequest, NextResponse } from "next/server";

import { CSRF_COOKIE } from "@/lib/constants";
import { createCsrfToken } from "@/lib/csrf";

function applySecurityHeaders(response: NextResponse, origin: string) {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'", origin];

  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push("ws:", "wss:", "http://localhost:3001", "http://127.0.0.1:3001");
  }

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: https://images.unsplash.com",
      "style-src 'self' 'unsafe-inline'",
      `script-src ${scriptSrc.join(" ")}`,
      `connect-src ${connectSrc.join(" ")}`,
      "font-src 'self' data:",
      "frame-ancestors 'none'"
    ].join("; ")
  );
}

export function middleware(request: NextRequest) {
  const origin = process.env.APP_ORIGIN ?? process.env.APP_URL ?? request.nextUrl.origin;

  if (request.method === "OPTIONS") {
    const preflight = NextResponse.json({}, { status: 200 });
    applySecurityHeaders(preflight, origin);
    return preflight;
  }

  const response = NextResponse.next();
  applySecurityHeaders(response, origin);

  if (!request.cookies.get(CSRF_COOKIE)) {
    response.cookies.set({
      name: CSRF_COOKIE,
      value: createCsrfToken(),
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
