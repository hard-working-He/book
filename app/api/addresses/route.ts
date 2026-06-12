import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const isDefault = Boolean(body.isDefault);

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        receiver: sanitizeText(body.receiver),
        phone: sanitizeText(body.phone),
        province: sanitizeText(body.province),
        city: sanitizeText(body.city),
        district: sanitizeText(body.district),
        detail: sanitizeText(body.detail),
        postalCode: sanitizeText(body.postalCode) || null,
        isDefault
      }
    });

    return successResponse({ address });
  } catch (error) {
    return mapServerError(error);
  }
}
