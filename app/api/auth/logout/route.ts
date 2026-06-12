import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/constants";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  if (!validateCsrf(request)) {
    return errorResponse("CSRF 校验失败", 403);
  }

  cookies().set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return successResponse({ ok: true });
}
