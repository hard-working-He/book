import { BookStatus, OrderStatus, Prisma } from "@prisma/client";

import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { buildPagination } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function getPublishedBooks(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
}) {
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = Math.max(1, Number(params.pageSize ?? DEFAULT_PAGE_SIZE));
  const keyword = (params.keyword ?? "").trim();
  const category = (params.category ?? "").trim();

  const where: Prisma.BookWhereInput = {
    status: BookStatus.PUBLISHED,
    ...(category ? { category } : {}),
    ...(keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { author: { contains: keyword } },
            { description: { contains: keyword } }
          ]
        }
      : {})
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.book.count({ where })
  ]);

  return {
    books,
    pagination: buildPagination(page, pageSize, total)
  };
}

export async function getBookById(id: string) {
  return prisma.book.findUnique({
    where: { id }
  });
}

export async function getRelatedBooks(category: string, currentBookId: string) {
  return prisma.book.findMany({
    where: {
      status: BookStatus.PUBLISHED,
      category,
      id: { not: currentBookId }
    },
    take: 4,
    orderBy: [{ sales: "desc" }, { createdAt: "desc" }]
  });
}

export async function getUserCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      book: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getUserCartCount(userId: string) {
  const result = await prisma.cartItem.aggregate({
    where: { userId },
    _sum: { quantity: true }
  });
  return result._sum.quantity ?? 0;
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminDashboardStats() {
  const [users, books, orders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED]
        }
      },
      _sum: {
        totalAmount: true
      }
    })
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return {
    totals: {
      users,
      books,
      orders,
      revenue: Number(revenue._sum.totalAmount ?? 0)
    },
    recentOrders
  };
}
