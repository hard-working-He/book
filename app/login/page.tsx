import { LoginForm } from "@/components/store/login-form";

export default function LoginPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="panel stack" style={{ padding: 28 }}>
          <span className="badge">用户登录</span>
          <h1 className="heading-lg">登录云书城</h1>
          <p className="muted">使用 JWT Cookie 认证，登录后可加入购物车、下单和查看订单历史。</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
