export function Footer() {
  return (
    <footer className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="hero-card" style={{ padding: 20 }}>
          <div className="between">
            <div>
              <strong>云书城管理与销售系统</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Next.js 14 + Prisma + Redux Toolkit + MySQL
              </p>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              支持用户购书、订单管理、后台运营与安全认证
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
