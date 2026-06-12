import { StatsCards } from "@/components/admin/stats-cards";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { getAdminDashboardStats } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="stack" style={{ gap: 22 }}>
      <StatsCards totals={stats.totals} />
      <section className="table-card" style={{ padding: 22 }}>
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="heading-md">最近订单</h2>
          <span className="muted">累计销售额 {formatCurrency(stats.totals.revenue)}</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>用户</th>
              <th>金额</th>
              <th>状态</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>
                  {order.user.name}
                  <div className="muted">{order.user.email}</div>
                </td>
                <td>{formatCurrency(Number(order.totalAmount))}</td>
                <td>{ORDER_STATUS_LABELS[order.status]}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
