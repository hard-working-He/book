import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { getUserCart, getUserCartCount } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const quantity = Math.max(1, Number(body.quantity ?? 1));

    const item = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        userId: user.id
      },
      include: {
        book: true
      }
    });

    if (!item) {
      return errorResponse("购物车项不存在", 404);
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: Math.min(item.book.stock, quantity)
      }
    });

    const [items, count] = await Promise.all([getUserCart(user.id), getUserCartCount(user.id)]);
    return successResponse({ items, count });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    await prisma.cartItem.deleteMany({
      where: {
        id: params.itemId,
        userId: user.id
      }
    });

    const [items, count] = await Promise.all([getUserCart(user.id), getUserCartCount(user.id)]);
    return successResponse({ items, count });
  } catch (error) {
    return mapServerError(error);
  }
}
