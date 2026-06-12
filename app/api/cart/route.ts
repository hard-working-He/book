import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { getUserCart, getUserCartCount } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUserOrThrow();
    const [items, count] = await Promise.all([getUserCart(user.id), getUserCartCount(user.id)]);
    return successResponse({ items, count });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const bookId = String(body.bookId ?? "");
    const quantity = Math.max(1, Number(body.quantity ?? 1));

    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book || book.status !== "PUBLISHED") {
      return errorResponse("图书不存在或已下架", 404);
    }

    const current = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId
        }
      }
    });

    const nextQuantity = Math.min(book.stock, (current?.quantity ?? 0) + quantity);

    if (nextQuantity <= 0) {
      return errorResponse("库存不足");
    }

    await prisma.cartItem.upsert({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId
        }
      },
      update: {
        quantity: nextQuantity
      },
      create: {
        userId: user.id,
        bookId,
        quantity: nextQuantity
      }
    });

    return successResponse({
      count: await getUserCartCount(user.id)
    });
  } catch (error) {
    return mapServerError(error);
  }
}
