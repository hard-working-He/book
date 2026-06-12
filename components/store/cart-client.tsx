"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/client-api";
import { formatCurrency } from "@/lib/format";
import { useAppDispatch } from "@/store/hooks";
import { setCartCount } from "@/store/slices/cart-slice";
import type { CartLine } from "@/types";

export function CartClient(props: { items: CartLine[] }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState(props.items);
  const [pendingId, setPendingId] = useState<string>("");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0),
    [items]
  );

  async function updateItem(itemId: string, quantity: number) {
    try {
      setPendingId(itemId);
      const data = await apiFetch<{ items: CartLine[]; count: number }>(`/api/cart/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity })
      });
      setItems(data.items);
      dispatch(setCartCount(data.count));
      router.refresh();
    } finally {
      setPendingId("");
    }
  }

  async function removeItem(itemId: string) {
    try {
      setPendingId(itemId);
      const data = await apiFetch<{ items: CartLine[]; count: number }>(`/api/cart/${itemId}`, {
        method: "DELETE"
      });
      setItems(data.items);
      dispatch(setCartCount(data.count));
      router.refresh();
    } finally {
      setPendingId("");
    }
  }

  return (
    <div className="grid grid-2">
      <div className="panel stack" style={{ padding: 22 }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="between"
            style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)", alignItems: "stretch" }}
          >
            <div className="row" style={{ flex: 1 }}>
              <div style={{ position: "relative", width: 90, minWidth: 90, aspectRatio: "3 / 4", overflow: "hidden", borderRadius: 12 }}>
                <Image
                  src={item.book.coverUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"}
                  alt={item.book.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="stack" style={{ gap: 8, flex: 1 }}>
                <div>
                  <strong>{item.book.title}</strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {item.book.author} · {item.book.category}
                  </p>
                </div>
                <strong>{formatCurrency(Number(item.book.price))}</strong>
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                    disabled={pendingId === item.id}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    disabled={pendingId === item.id}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeItem(item.id)}
                    disabled={pendingId === item.id}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="panel stack" style={{ padding: 22, height: "fit-content" }}>
        <h2 className="heading-md">订单汇总</h2>
        <div className="between">
          <span className="muted">商品数量</span>
          <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
        </div>
        <div className="between">
          <span className="muted">订单金额</span>
          <strong className="price">{formatCurrency(total)}</strong>
        </div>
        <Link href="/checkout" className="btn btn-primary">
          去结算
        </Link>
      </aside>
    </div>
  );
}
