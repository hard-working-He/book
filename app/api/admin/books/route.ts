import { BookStatus } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { sanitizeNumber, sanitizeText } from "@/lib/sanitize";

export async function GET() {
  try {
    await getCurrentAdminOrThrow();
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" }
    });
    return successResponse({ books });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    await getCurrentAdminOrThrow();
    const body = await request.json();
    const title = sanitizeText(body.title);
    const status = (sanitizeText(body.status) as BookStatus) || BookStatus.DRAFT;

    const book = await prisma.book.create({
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
