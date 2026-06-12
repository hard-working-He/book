import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("请先登录", 401);
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        ...(user.role === "ADMIN" ? {} : { userId: user.id })
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!order) {
      return errorResponse("订单不存在", 404);
    }

    return successResponse({ order });
  } catch (error) {
    return mapServerError(error);
  }
}
