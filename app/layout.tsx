import type { Metadata } from "next";

import "@/app/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/shared/providers";
import { getCurrentUser } from "@/lib/auth";
import { getUserCartCount } from "@/lib/db";

export const metadata: Metadata = {
  title: "云书城管理与销售系统",
  description: "基于 Next.js 14、Redux Toolkit、MySQL 与 Prisma 的在线购书系统"
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const cartCount = user ? await getUserCartCount(user.id) : 0;

  return (
    <html lang="zh-CN">
      <body>
        <Providers user={user} cartCount={cartCount}>
          <div className="site-shell">
            <Header />
            <main className="page-main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
