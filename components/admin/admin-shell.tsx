import Link from "next/link";

const navItems = [
  { href: "/admin", label: "控制台" },
  { href: "/admin/books", label: "图书管理" },
  { href: "/admin/orders", label: "订单管理" },
  { href: "/admin/users", label: "用户管理" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container stack" style={{ gap: 22 }}>
      <div className="hero-card" style={{ padding: 18 }}>
        <div className="between">
          <div>
            <span className="badge">Admin Console</span>
            <h1 className="heading-lg" style={{ marginTop: 12 }}>
              书城后台管理中心
            </h1>
          </div>
          <nav className="row" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="btn btn-secondary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
