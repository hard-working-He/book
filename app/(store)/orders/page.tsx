import Link from "next/link";

import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/db";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="panel empty">
            登录后可查看历史订单。<Link href="/login">去登录</Link>
          </div>
        </div>
      </div>
    );
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="section">
      <div className="container stack">
        <div>
          <h1 className="heading-lg">历史订单</h1>
          <p className="muted">可查询订单状态、支付信息与下单明细。</p>
        </div>
        {orders.length === 0 ? (
          <div className="panel empty">暂无历史订单。</div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="panel stack" style={{ padding: 22 }}>
              <div className="between">
                <div className="stack" style={{ gap: 6 }}>
                  <strong>{order.orderNo}</strong>
                  <span className="muted">{formatDate(order.createdAt)}</span>
                </div>
                <div className={`status-dot ${order.status.toLowerCase()}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </div>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                {order.items.map((item) => (
                  <div key={item.id} className="between">
                    <span>
                      {item.titleSnapshot} x {item.quantity}
                    </span>
                    <strong>{formatCurrency(Number(item.subtotal))}</strong>
                  </div>
                ))}
              </div>
              <div className="between">
                <span className="muted">支付方式：{order.paymentMethod}</span>
                <strong className="price" style={{ fontSize: 20 }}>
                  {formatCurrency(Number(order.totalAmount))}
                </strong>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
