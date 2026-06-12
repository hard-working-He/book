import { NextRequest } from "next/server";

import { getPublishedBooks } from "@/lib/db";
import { mapServerError, successResponse } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const keyword = searchParams.get("keyword") ?? "";
    const category = searchParams.get("category") ?? "";

    const data = await getPublishedBooks({ page, keyword, category });
    return successResponse(data);
  } catch (error) {
    return mapServerError(error);
  }
}
