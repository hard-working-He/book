import Link from "next/link";

import { CheckoutClient } from "@/components/store/checkout-client";
import { getCurrentUser } from "@/lib/auth";
import { getUserCart } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="panel empty">
            请先登录后再提交订单。<Link href="/login">去登录</Link>
          </div>
        </div>
      </div>
    );
  }

  const [items, addresses] = await Promise.all([
    getUserCart(user.id),
    prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    })
  ]);

  return (
    <div className="section">
      <div className="container stack">
        <div>
          <h1 className="heading-lg">订单结算</h1>
          <p className="muted">支持默认地址选择、订单备注与模拟支付。</p>
        </div>
        {items.length === 0 ? (
          <div className="panel empty">
            购物车为空，<Link href="/">返回首页</Link>
          </div>
        ) : (
          <CheckoutClient items={items as never} addresses={addresses} />
        )}
      </div>
    </div>
  );
}
