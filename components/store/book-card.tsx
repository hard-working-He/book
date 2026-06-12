import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    price: number | { toString(): string };
    coverUrl: string | null;
    stock: number;
  };
}

export function BookCard({ book }: BookCardProps) {
  const price = Number(book.price);

  return (
    <article className="book-card stack" style={{ padding: 16 }}>
      <Link href={`/books/${book.id}`} style={{ display: "block" }}>
        <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", borderRadius: 18 }}>
          <Image
            src={book.coverUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>

      <div className="stack" style={{ gap: 10 }}>
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div>
            <span className="badge">{book.category}</span>
            <h3 className="heading-md" style={{ marginTop: 10 }}>
              <Link href={`/books/${book.id}`}>{book.title}</Link>
            </h3>
          </div>
          <strong className="price" style={{ fontSize: 20 }}>
            {formatCurrency(price)}
          </strong>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {book.author}
        </p>
        <p className="muted" style={{ margin: 0, minHeight: 44 }}>
          {book.description.slice(0, 56)}...
        </p>
        <div className="between">
          <span className="muted">库存 {book.stock}</span>
          <AddToCartButton bookId={book.id} />
        </div>
      </div>
    </article>
  );
}
