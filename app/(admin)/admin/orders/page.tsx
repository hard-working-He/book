import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="table-card" style={{ padding: 22 }}>
      <div className="between" style={{ marginBottom: 18 }}>
        <div>
          <h2 className="heading-lg">订单管理</h2>
          <p className="muted">查看订单详情并更新订单状态。</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>订单明细</th>
            <th>总价</th>
            <th>状态</th>
            <th>下单时间</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNo}</td>
              <td>
                {order.user.name}
                <div className="muted">{order.user.email}</div>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item.id}>
                    {item.titleSnapshot} x {item.quantity}
                  </div>
                ))}
              </td>
              <td>{formatCurrency(Number(order.totalAmount))}</td>
              <td>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </td>
              <td>{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
