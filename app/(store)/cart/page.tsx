import Link from "next/link";

import { CartClient } from "@/components/store/cart-client";
import { getCurrentUser } from "@/lib/auth";
import { getUserCart } from "@/lib/db";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="panel empty">
            请先登录后查看购物车。<Link href="/login">去登录</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = await getUserCart(user.id);

  return (
    <div className="section">
      <div className="container stack">
        <div>
          <h1 className="heading-lg">购物车</h1>
          <p className="muted">支持数量修改、删除与结算预览。</p>
        </div>
        {items.length === 0 ? <div className="panel empty">购物车为空，先去挑选几本好书。</div> : <CartClient items={items as never} />}
      </div>
    </div>
  );
}
