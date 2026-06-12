"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { useAppDispatch } from "@/store/hooks";
import { setCartCount } from "@/store/slices/cart-slice";

export function AddToCartButton(props: { bookId: string; quantity?: number }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);

  async function handleAdd() {
    try {
      setPending(true);
      const data = await apiFetch<{ count: number }>("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          bookId: props.bookId,
          quantity: props.quantity ?? 1
        })
      });
      dispatch(setCartCount(data.count));
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "加入购物车失败";
      if (message.includes("登录")) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      window.alert(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className="btn btn-primary" onClick={handleAdd} disabled={pending}>
      {pending ? "加入中..." : "加入购物车"}
    </button>
  );
}
