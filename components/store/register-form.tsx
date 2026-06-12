"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import type { SessionUser } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setPending(true);
    setError("");

    try {
      const data = await apiFetch<{ user: SessionUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      dispatch(setUser(data.user));
      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "注册失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="姓名"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        required
      />
      <input
        className="input"
        placeholder="邮箱"
        type="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        required
      />
      <input
        className="input"
        placeholder="密码"
        type="password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        required
      />
      <input
        className="input"
        placeholder="确认密码"
        type="password"
        value={form.confirmPassword}
        onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        required
      />
      <p className="muted" style={{ margin: 0 }}>
        已有账号？<Link href="/login">去登录</Link>
      </p>
      {error ? <div className="muted" style={{ color: "var(--danger)" }}>{error}</div> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "注册中..." : "创建账户"}
      </button>
    </form>
  );
}
