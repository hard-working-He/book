"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import { setCartCount } from "@/store/slices/cart-slice";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector((state) => state.cart.count);
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    try {
      setPending(true);
      await apiFetch("/api/auth/logout", { method: "POST" });
      dispatch(setUser(null));
      dispatch(setCartCount(0));
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <header className="section" style={{ paddingBottom: 8 }}>
      <div className="container">
        <div className="hero-card" style={{ padding: 18 }}>
          <div className="between">
            <div className="stack" style={{ gap: 8 }}>
              <Link href="/" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.05em" }}>
                云书城
              </Link>
              <span className="muted">在线购书、订单管理、后台运营一体化平台</span>
            </div>

            <nav className="row" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Link href="/">首页</Link>
              <Link href="/cart">购物车 ({cartCount})</Link>
              <Link href="/orders">我的订单</Link>
              <Link href="/profile">个人中心</Link>
              {user?.role === "ADMIN" ? <Link href="/admin">后台管理</Link> : null}
              {user ? (
                <>
                  <span className="badge">{user.name}</span>
                  <button type="button" className="btn btn-secondary" onClick={handleLogout} disabled={pending}>
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-secondary" href="/login">
                    登录
                  </Link>
                  <Link className="btn btn-primary" href="/register">
                    注册
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
