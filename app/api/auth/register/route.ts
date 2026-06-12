import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { signAuthToken, hashPassword } from "@/lib/auth";
import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const body = await request.json();
    const name = sanitizeText(body.name);
    const email = sanitizeText(body.email).toLowerCase();
    const password = sanitizeText(body.password);

    if (!name || !email || password.length < 6) {
      return errorResponse("请填写完整信息，且密码长度不少于 6 位");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse("该邮箱已注册");
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role: UserRole.USER
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true
      }
    });

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

    return successResponse({ user });
  } catch (error) {
    return mapServerError(error);
  }
}
