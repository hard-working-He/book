import Link from "next/link";

import { BookCard } from "@/components/store/book-card";
import { Pagination } from "@/components/store/pagination";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { getPublishedBooks } from "@/lib/db";

export default async function HomePage(props: {
  searchParams?: {
    page?: string;
    keyword?: string;
    category?: string;
  };
}) {
  const page = Number(props.searchParams?.page ?? "1");
  const keyword = props.searchParams?.keyword ?? "";
  const category = props.searchParams?.category ?? "";
  const { books, pagination } = await getPublishedBooks({ page, keyword, category });

  return (
    <div className="section">
      <div className="container stack" style={{ gap: 28 }}>
        <section className="hero">
          <div className="hero-card" style={{ padding: 28 }}>
            <div className="grid grid-2">
              <div className="stack" style={{ gap: 18 }}>
                <span className="badge">Book Commerce Platform</span>
                <h1 className="heading-xl">从发现好书到在线下单，一站完成图书交易与后台管理</h1>
                <p className="muted" style={{ fontSize: 17, lineHeight: 1.7 }}>
                  前台覆盖搜索、详情、购物车、下单、订单追踪与用户资料维护，后台支持图书、库存、订单、用户与销售统计。
                </p>
              </div>
              <div className="panel stack" style={{ padding: 22 }}>
                <form action="/" className="stack">
                  <input
                    className="input"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="搜索书名、作者或内容关键词"
                  />
                  <select className="select" name="category" defaultValue={category}>
                    <option value="">全部分类</option>
                    {BOOK_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary">
                    搜索图书
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="stack" style={{ gap: 18 }}>
          <div className="row" style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
            <Link href="/" className={category ? "btn btn-secondary" : "btn btn-primary"}>
              全部
            </Link>
            {BOOK_CATEGORIES.map((item) => (
              <Link
                key={item}
                href={`/?category=${encodeURIComponent(item)}`}
                className={category === item ? "btn btn-primary" : "btn btn-secondary"}
              >
                {item}
              </Link>
            ))}
          </div>

          {books.length === 0 ? (
            <div className="panel empty">没有找到符合条件的图书，请调整关键词或分类。</div>
          ) : (
            <div className="grid grid-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book as never} />
              ))}
            </div>
          )}

          <Pagination
            pathname="/"
            pagination={pagination}
            query={{ keyword, category }}
          />
        </section>
      </div>
    </div>
  );
}
