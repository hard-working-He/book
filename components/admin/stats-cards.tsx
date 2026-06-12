import { formatCurrency } from "@/lib/format";

export function StatsCards(props: {
  totals: {
    users: number;
    books: number;
    orders: number;
    revenue: number;
  };
}) {
  const items = [
    { label: "用户总数", value: props.totals.users },
    { label: "图书总数", value: props.totals.books },
    { label: "订单总数", value: props.totals.orders },
    { label: "销售额", value: formatCurrency(props.totals.revenue) }
  ];

  return (
    <div className="grid grid-4">
      {items.map((item) => (
        <article key={item.label} className="stats-card stack" style={{ padding: 20 }}>
          <span className="muted">{item.label}</span>
          <strong style={{ fontSize: 28 }}>{item.value}</strong>
        </article>
      ))}
    </div>
  );
}
