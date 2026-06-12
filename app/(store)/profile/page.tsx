import Link from "next/link";

import { ProfileClient } from "@/components/store/profile-client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <div className="panel empty">
            请先登录后查看个人中心。<Link href="/login">去登录</Link>
          </div>
        </div>
      </div>
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="section">
      <div className="container stack">
        <div>
          <h1 className="heading-lg">个人中心</h1>
          <p className="muted">维护个人资料、头像与收货地址。</p>
        </div>
        <ProfileClient user={user} addresses={addresses} />
      </div>
    </div>
  );
}
