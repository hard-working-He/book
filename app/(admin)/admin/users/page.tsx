import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          addresses: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <section className="table-card" style={{ padding: 22 }}>
      <div className="between" style={{ marginBottom: 18 }}>
        <div>
          <h2 className="heading-lg">用户管理</h2>
          <p className="muted">查看用户角色、订单数量与地址信息，支持权限扩展。</p>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>订单数</th>
            <th>地址数</th>
            <th>注册时间</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user._count.orders}</td>
              <td>{user._count.addresses}</td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
