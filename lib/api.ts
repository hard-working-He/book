import { NextResponse } from "next/server";

export function successResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function errorResponse(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...extra
    },
    { status }
  );
}

export function mapServerError(error: unknown) {
  const message = error instanceof Error ? error.message : "服务异常";
  if (message === "UNAUTHORIZED") {
    return errorResponse("请先登录后再操作", 401);
  }
  if (message === "FORBIDDEN") {
    return errorResponse("无权限访问该资源", 403);
  }
  return errorResponse(message, 500);
}
