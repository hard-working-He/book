"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import type { SessionUser } from "@/types";

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

export function ProfileClient(props: { user: SessionUser; addresses: Address[] }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState({
    name: props.user.name,
    avatarUrl: props.user.avatarUrl ?? ""
  });
  const [address, setAddress] = useState({
    receiver: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: "",
    postalCode: "",
    isDefault: props.addresses.length === 0
  });
  const [pending, setPending] = useState("");

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("profile");
    try {
      const data = await apiFetch<{ user: SessionUser }>("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(profile)
      });
      dispatch(setUser(data.user));
      router.refresh();
    } finally {
      setPending("");
    }
  }

  async function addAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending("address");
    try {
      await apiFetch("/api/addresses", {
        method: "POST",
        body: JSON.stringify(address)
      });
      setAddress({
        receiver: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        detail: "",
        postalCode: "",
        isDefault: false
      });
      router.refresh();
    } finally {
      setPending("");
    }
  }

  async function setDefaultAddress(id: string) {
    setPending(id);
    try {
      await apiFetch(`/api/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isDefault: true })
      });
      router.refresh();
    } finally {
      setPending("");
    }
  }

  async function removeAddress(id: string) {
    setPending(id);
    try {
      await apiFetch(`/api/addresses/${id}`, {
        method: "DELETE"
      });
      router.refresh();
    } finally {
      setPending("");
    }
  }

  return (
    <div className="grid grid-2">
      <section className="panel stack" style={{ padding: 22 }}>
        <div>
          <h2 className="heading-md">用户资料</h2>
          <p className="muted">可更新昵称与头像地址，头像上传接口可对接文件上传组件。</p>
        </div>
        <form className="stack" onSubmit={saveProfile}>
          <input
            className="input"
            value={props.user.email}
            readOnly
            aria-label="邮箱"
          />
          <input
            className="input"
            placeholder="昵称"
            value={profile.name}
            onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className="input"
            placeholder="头像 URL（或调用 /api/upload/avatar 上传）"
            value={profile.avatarUrl}
            onChange={(event) => setProfile((prev) => ({ ...prev, avatarUrl: event.target.value }))}
          />
          <button type="submit" className="btn btn-primary" disabled={pending === "profile"}>
            {pending === "profile" ? "保存中..." : "保存资料"}
          </button>
        </form>
      </section>

      <section className="panel stack" style={{ padding: 22 }}>
        <div>
          <h2 className="heading-md">收货地址维护</h2>
          <p className="muted">支持新增、设为默认与删除地址。</p>
        </div>

        <div className="stack">
          {props.addresses.map((item) => (
            <div key={item.id} className="panel" style={{ padding: 16, borderRadius: 18 }}>
              <div className="between">
                <div>
                  <strong>
                    {item.receiver} {item.phone}
                  </strong>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {item.province}
                    {item.city}
                    {item.district}
                    {item.detail}
                  </p>
                </div>
                <div className="row">
                  {item.isDefault ? <span className="badge">默认地址</span> : null}
                  {!item.isDefault ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setDefaultAddress(item.id)}
                      disabled={pending === item.id}
                    >
                      设为默认
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeAddress(item.id)}
                    disabled={pending === item.id}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form className="stack" onSubmit={addAddress}>
          <div className="form-grid">
            <input
              className="input"
              placeholder="收件人"
              value={address.receiver}
              onChange={(event) => setAddress((prev) => ({ ...prev, receiver: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="手机号"
              value={address.phone}
              onChange={(event) => setAddress((prev) => ({ ...prev, phone: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="省份"
              value={address.province}
              onChange={(event) => setAddress((prev) => ({ ...prev, province: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="城市"
              value={address.city}
              onChange={(event) => setAddress((prev) => ({ ...prev, city: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="区县"
              value={address.district}
              onChange={(event) => setAddress((prev) => ({ ...prev, district: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="邮编"
              value={address.postalCode}
              onChange={(event) => setAddress((prev) => ({ ...prev, postalCode: event.target.value }))}
            />
          </div>
          <textarea
            className="textarea"
            placeholder="详细地址"
            value={address.detail}
            onChange={(event) => setAddress((prev) => ({ ...prev, detail: event.target.value }))}
            required
          />
          <label className="row" style={{ justifyContent: "flex-start" }}>
            <input
              type="checkbox"
              checked={address.isDefault}
              onChange={(event) => setAddress((prev) => ({ ...prev, isDefault: event.target.checked }))}
            />
            <span>设为默认地址</span>
          </label>
          <button type="submit" className="btn btn-primary" disabled={pending === "address"}>
            {pending === "address" ? "新增中..." : "新增地址"}
          </button>
        </form>
      </section>
    </div>
  );
}
