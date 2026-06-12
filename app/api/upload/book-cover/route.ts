import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentAdminOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    await getCurrentAdminOrThrow();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse("请选择封面文件");
    }

    const url = await saveUploadedFile(file, "books");
    return successResponse({ url });
  } catch (error) {
    return mapServerError(error);
  }
}
