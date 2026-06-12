import { BookStatus } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { sanitizeNumber, sanitizeText } from "@/lib/sanitize";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    await getCurrentAdminOrThrow();
    const body = await request.json();
    const title = sanitizeText(body.title);
    const status = sanitizeText(body.status) as BookStatus;

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title,
        slug: slugify(title),
        author: sanitizeText(body.author),
        description: sanitizeText(body.description),
        category: sanitizeText(body.category),
        price: sanitizeNumber(body.price),
        stock: Math.max(0, sanitizeNumber(body.stock)),
        coverUrl: sanitizeText(body.coverUrl) || null,
        status,
        publishedAt: status === BookStatus.PUBLISHED ? new Date() : null
      }
    });

    return successResponse({ book });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    await getCurrentAdminOrThrow();
    await prisma.book.delete({
      where: { id: params.id }
    });

    return successResponse({ ok: true });
  } catch (error) {
    return mapServerError(error);
  }
}
