import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function PATCH(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const name = sanitizeText(body.name);
    const avatarUrl = sanitizeText(body.avatarUrl);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        avatarUrl: avatarUrl || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true
      }
    });

    return successResponse({ user: updated });
  } catch (error) {
    return mapServerError(error);
  }
}
