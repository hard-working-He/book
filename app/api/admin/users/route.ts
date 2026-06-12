import { mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await getCurrentAdminOrThrow();
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return successResponse({ users });
  } catch (error) {
    return mapServerError(error);
  }
}
