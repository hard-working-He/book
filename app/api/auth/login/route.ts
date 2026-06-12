import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { comparePassword, signAuthToken } from "@/lib/auth";
import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/constants";
import { getUserCartCount } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const body = await request.json();
    const email = sanitizeText(body.email).toLowerCase();
    const password = sanitizeText(body.password);
    const adminOnly = Boolean(body.adminOnly);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return errorResponse("邮箱或密码错误", 401);
    }

    if (adminOnly && user.role !== "ADMIN") {
      return errorResponse("当前账号没有后台访问权限", 403);
    }

    const token = await signAuthToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    cookies().set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return successResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      cartCount: await getUserCartCount(user.id)
    });
  } catch (error) {
    return mapServerError(error);
  }
}
