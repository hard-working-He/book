import { mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/db";

export async function GET() {
  try {
    await getCurrentAdminOrThrow();
    return successResponse(await getAdminDashboardStats());
  } catch (error) {
    return mapServerError(error);
  }
}
