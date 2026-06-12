"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import { setCartCount } from "@/store/slices/cart-slice";
import type { SessionUser } from "@/types";

export function LoginForm(props: { adminOnly?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const data = await apiFetch<{ user: SessionUser; cartCount: number }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          adminOnly: props.adminOnly ?? false
        })
      });
      dispatch(setUser(data.user));
      dispatch(setCartCount(data.cartCount));

      const redirect = params.get("redirect");
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(props.adminOnly ? "/admin" : "/");
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "登录失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
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
      {error ? <div className="muted" style={{ color: "var(--danger)" }}>{error}</div> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "登录中..." : "立即登录"}
      </button>
    </form>
  );
}
