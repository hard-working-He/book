import { OrderStatus } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, mapServerError, successResponse } from "@/lib/api";
import { getCurrentUserOrThrow } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { getUserOrders } from "@/lib/db";
import { createOrderNo } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUserOrThrow();
    const orders = await getUserOrders(user.id);
    return successResponse({ orders });
  } catch (error) {
    return mapServerError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrf(request)) {
      return errorResponse("CSRF 校验失败", 403);
    }

    const user = await getCurrentUserOrThrow();
    const body = await request.json();
    const addressId = String(body.addressId ?? "");
    const paymentMethod = String(body.paymentMethod ?? "模拟支付");
    const note = String(body.note ?? "");

    const [address, cartItems] = await Promise.all([
      prisma.address.findFirst({
        where: {
          id: addressId,
          userId: user.id
        }
      }),
      prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { book: true }
      })
    ]);

    if (!address) {
      return errorResponse("请选择有效的收货地址");
    }

    if (cartItems.length === 0) {
      return errorResponse("购物车为空");
    }

    for (const item of cartItems) {
      if (item.book.stock < item.quantity) {
        return errorResponse(`《${item.book.title}》库存不足`);
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNo: createOrderNo(),
          userId: user.id,
          totalAmount,
          paymentMethod,
          paymentStatus: "SUCCESS",
          status: OrderStatus.PAID,
          note,
          addressSnapshot: {
            receiver: address.receiver,
            phone: address.phone,
            province: address.province,
            city: address.city,
            district: address.district,
            detail: address.detail,
            postalCode: address.postalCode
          }
        }
      });

      for (const item of cartItems) {
        const subtotal = Number(item.book.price) * item.quantity;
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            bookId: item.bookId,
            titleSnapshot: item.book.title,
            priceSnapshot: item.book.price,
            quantity: item.quantity,
            subtotal
          }
        });

        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: { decrement: item.quantity },
            sales: { increment: item.quantity }
          }
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      });

      return createdOrder;
    });

    return successResponse({ orderId: order.id, orderNo: order.orderNo });
  } catch (error) {
    return mapServerError(error);
  }
}
