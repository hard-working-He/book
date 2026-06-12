import { LoginForm } from "@/components/store/login-form";

export default function AdminLoginPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="panel stack" style={{ padding: 28 }}>
          <span className="badge">后台登录</span>
          <h1 className="heading-lg">管理员后台认证</h1>
          <p className="muted">仅管理员账户可访问图书管理、订单管理、用户管理与销售报表。</p>
          <LoginForm adminOnly />
        </div>
      </div>
    </div>
  );
}
