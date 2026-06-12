import { RegisterForm } from "@/components/store/register-form";

export default function RegisterPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="panel stack" style={{ padding: 28 }}>
          <span className="badge">用户注册</span>
          <h1 className="heading-lg">创建购书账户</h1>
          <p className="muted">注册后可维护个人资料、收货地址并完成在线购书流程。</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
