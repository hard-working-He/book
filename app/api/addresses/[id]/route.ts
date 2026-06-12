import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!address) {
      return errorResponse("地址不存在", 404);
    }

    if (body.isDefault === true) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.address.update({
      where: { id: params.id },
      data: {
        receiver: body.receiver !== undefined ? sanitizeText(body.receiver) : undefined,
        phone: body.phone !== undefined ? sanitizeText(body.phone) : undefined,
        province: body.province !== undefined ? sanitizeText(body.province) : undefined,
        city: body.city !== undefined ? sanitizeText(body.city) : undefined,
        district: body.district !== undefined ? sanitizeText(body.district) : undefined,
        detail: body.detail !== undefined ? sanitizeText(body.detail) : undefined,
        postalCode: body.postalCode !== undefined ? sanitizeText(body.postalCode) : undefined,
        isDefault: body.isDefault !== undefined ? Boolean(body.isDefault) : undefined
      }
    });

    return successResponse({ address: updated });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const result = await prisma.address.deleteMany({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (result.count === 0) {
      return errorResponse("地址不存在", 404);
    }

    return successResponse({ ok: true });
  } catch (error) {
    return mapServerError(error);
  }
}
