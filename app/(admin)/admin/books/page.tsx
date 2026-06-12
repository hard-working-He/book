import { BookManager } from "@/components/admin/book-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="stack">
      <div>
        <h2 className="heading-lg">图书管理</h2>
        <p className="muted">支持新增、编辑、删除、价格调整、库存管理和上下架状态维护。</p>
      </div>
      <BookManager books={books as never} />
    </div>
  );
}
