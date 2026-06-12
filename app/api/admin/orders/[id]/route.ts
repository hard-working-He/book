import { OrderStatus } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitize";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    await getCurrentAdminOrThrow();
    const body = await request.json();
    const status = sanitizeText(body.status) as OrderStatus;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        paymentStatus: status === OrderStatus.CANCELLED ? "REFUNDED" : "SUCCESS"
      }
    });

    return successResponse({ order });
  } catch (error) {
    return mapServerError(error);
  }
}
