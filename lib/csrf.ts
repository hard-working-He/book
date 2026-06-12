import { NextRequest } from "next/server";

export function createCsrfToken() {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateCsrf(request: NextRequest) {
  const cookieToken = request.cookies.get("bookstore_csrf")?.value ?? "";
  const headerToken = request.headers.get("x-csrf-token") ?? "";
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}
