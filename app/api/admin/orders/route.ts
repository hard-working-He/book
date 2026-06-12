import { mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await getCurrentAdminOrThrow();
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: true
      },
      orderBy: { createdAt: "desc" }
    });
    return successResponse({ orders });
  } catch (error) {
    return mapServerError(error);
  }
}
