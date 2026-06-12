"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { formatCurrency } from "@/lib/format";
import { useAppDispatch } from "@/store/hooks";
import { setCartCount } from "@/store/slices/cart-slice";
import type { CartLine } from "@/types";

interface Address {
  id: string;
  receiver: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  postalCode?: string | null;
  isDefault: boolean;
}

export function CheckoutClient(props: { items: CartLine[]; addresses: Address[] }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [addressId, setAddressId] = useState(
    props.addresses.find((item) => item.isDefault)?.id ?? props.addresses[0]?.id ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState("模拟支付");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  const total = useMemo(
    () => props.items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0),
    [props.items]
  );

  async function handleCheckout() {
    try {
      setPending(true);
      const data = await apiFetch<{ orderId: string }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          addressId,
          paymentMethod,
          note
        })
      });
      dispatch(setCartCount(0));
      router.push(`/orders?created=${data.orderId}`);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "提交订单失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid grid-2">
      <section className="panel stack" style={{ padding: 22 }}>
        <h2 className="heading-md">收货地址</h2>
        {props.addresses.length === 0 ? (
          <div className="muted">请先在个人中心新增收货地址。</div>
        ) : (
          props.addresses.map((address) => (
            <label
              key={address.id}
              className="panel"
              style={{
                padding: 16,
                borderRadius: 18,
                border: addressId === address.id ? "2px solid var(--brand)" : "1px solid var(--line)"
              }}
            >
              <div className="row">
                <input
                  type="radio"
                  checked={addressId === address.id}
                  onChange={() => setAddressId(address.id)}
                />
                <div>
                  <strong>
                    {address.receiver} {address.phone}
                  </strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {address.province}
                    {address.city}
                    {address.district}
                    {address.detail}
                  </p>
                </div>
              </div>
            </label>
          ))
        )}

        <div className="stack">
          <h2 className="heading-md">支付方式</h2>
          <select className="select" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="模拟支付">模拟支付</option>
            <option value="支付宝">支付宝</option>
            <option value="微信支付">微信支付</option>
          </select>
          <textarea
            className="textarea"
            placeholder="订单备注"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </section>

      <aside className="panel stack" style={{ padding: 22, height: "fit-content" }}>
        <h2 className="heading-md">确认订单</h2>
        {props.items.map((item) => (
          <div key={item.id} className="between">
            <span>
              {item.book.title} x {item.quantity}
            </span>
            <strong>{formatCurrency(Number(item.book.price) * item.quantity)}</strong>
          </div>
        ))}
        <div className="between">
          <span className="muted">总计</span>
          <strong className="price">{formatCurrency(total)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={pending || !addressId || props.items.length === 0}
        >
          {pending ? "下单中..." : "提交订单并支付"}
        </button>
      </aside>
    </div>
  );
}
