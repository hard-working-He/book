import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { BookCard } from "@/components/store/book-card";
import { formatCurrency } from "@/lib/format";
import { getBookById, getRelatedBooks } from "@/lib/db";

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book || book.status !== "PUBLISHED") {
    notFound();
  }

  const relatedBooks = await getRelatedBooks(book.category, book.id);

  return (
    <div className="section">
      <div className="container stack" style={{ gap: 28 }}>
        <section className="hero-card" style={{ padding: 26 }}>
          <div className="grid grid-2">
            <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 24 }}>
              <Image
                src={book.coverUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="stack" style={{ gap: 18 }}>
              <span className="badge">{book.category}</span>
              <h1 className="heading-lg">{book.title}</h1>
              <p className="muted">{book.author}</p>
              <strong className="price">{formatCurrency(Number(book.price))}</strong>
              <p className="muted" style={{ lineHeight: 1.8 }}>
                {book.description}
              </p>
              <div className="row">
                <span className="muted">库存 {book.stock}</span>
                <span className="muted">销量 {book.sales}</span>
              </div>
              <div className="row">
                <AddToCartButton bookId={book.id} />
              </div>
            </div>
          </div>
        </section>

        <section className="stack">
          <div className="between">
            <h2 className="heading-md">相关推荐</h2>
            <span className="muted">同分类热门图书</span>
          </div>
          <div className="grid grid-4">
            {relatedBooks.map((item) => (
              <BookCard key={item.id} book={item as never} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
