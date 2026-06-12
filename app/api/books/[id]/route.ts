import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getBookById, getRelatedBooks } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await getBookById(params.id);

    if (!book || book.status !== "PUBLISHED") {
      return errorResponse("图书不存在", 404);
    }

    const related = await getRelatedBooks(book.category, book.id);

    return successResponse({ book, related });
  } catch (error) {
    return mapServerError(error);
  }
}
