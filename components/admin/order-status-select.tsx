"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";

export function OrderStatusSelect(props: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(props.status);
  const [pending, setPending] = useState(false);

  async function handleChange(nextValue: string) {
    setValue(nextValue);
    setPending(true);
    try {
      await apiFetch(`/api/admin/orders/${props.orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextValue })
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <select
      className="select"
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      disabled={pending}
      style={{ minWidth: 140 }}
    >
      <option value="PENDING">待支付</option>
      <option value="PAID">已支付</option>
      <option value="SHIPPED">已发货</option>
      <option value="COMPLETED">已完成</option>
      <option value="CANCELLED">已取消</option>
    </select>
  );
}
