import { BookStatus, PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

import { slugify } from "../lib/format";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@bookstore.com" },
    update: {},
    create: {
      name: "平台管理员",
      email: "admin@bookstore.com",
      password: adminPassword,
      role: UserRole.ADMIN
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@bookstore.com" },
    update: {},
    create: {
      name: "测试用户",
      email: "user@bookstore.com",
      password: userPassword,
      role: UserRole.USER,
      addresses: {
        create: {
          receiver: "张三",
          phone: "13800000000",
          province: "上海市",
          city: "上海市",
          district: "浦东新区",
          detail: "张江高科技园区 88 号",
          postalCode: "200120",
          isDefault: true
        }
      }
    }
  });

  const books = [
    {
      title: "深入理解计算机系统",
      author: "Randal E. Bryant",
      category: "计算机",
      description: "从系统层面理解程序、数据与操作系统的经典教材。",
      price: "128.00",
      stock: 30,
      sales: 102,
      coverUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "活着",
      author: "余华",
      category: "文学",
      description: "以朴素而有力的叙事展现普通人在时代中的命运起伏。",
      price: "39.90",
      stock: 120,
      sales: 260,
      coverUrl:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "增长黑客",
      author: "肖恩·埃利斯",
      category: "经济管理",
      description: "面向互联网产品增长实践的系统方法论。",
      price: "58.00",
      stock: 65,
      sales: 150,
      coverUrl:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "设计心理学",
      author: "唐纳德·诺曼",
      category: "艺术设计",
      description: "从认知心理学角度解释产品为何易用或难用。",
      price: "69.00",
      stock: 44,
      sales: 84,
      coverUrl:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "刻意练习",
      author: "安德斯·艾利克森",
      category: "心理学",
      description: "关于高水平技能形成与训练方法的经典读物。",
      price: "49.90",
      stock: 88,
      sales: 132,
      coverUrl:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "中国通史",
      author: "吕思勉",
      category: "历史",
      description: "通俗而完整地梳理中国历史脉络。",
      price: "78.00",
      stock: 53,
      sales: 76,
      coverUrl:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "儿童趣味科学百科",
      author: "王宇",
      category: "少儿",
      description: "适合亲子阅读的科学启蒙图书。",
      price: "42.00",
      stock: 92,
      sales: 67,
      coverUrl:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "高等数学考研精讲",
      author: "李老师",
      category: "考试教育",
      description: "覆盖考研高数高频考点，配套例题解析。",
      price: "66.00",
      stock: 71,
      sales: 93,
      coverUrl:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: slugify(book.title) },
      update: {},
      create: {
        ...book,
        slug: slugify(book.title),
        status: BookStatus.PUBLISHED,
        publishedAt: new Date()
      }
    });
  }

  const sampleBook = await prisma.book.findFirst({
    where: { status: BookStatus.PUBLISHED }
  });

  if (sampleBook) {
    await prisma.cartItem.upsert({
      where: {
        userId_bookId: {
          userId: user.id,
          bookId: sampleBook.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        bookId: sampleBook.id,
        quantity: 1
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
