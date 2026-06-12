"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { apiFetch } from "@/lib/client-api";
import { BOOK_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

interface BookRecord {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number | { toString(): string };
  stock: number;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

const emptyForm = {
  id: "",
  title: "",
  author: "",
  description: "",
  category: BOOK_CATEGORIES[0],
  price: "0",
  stock: "0",
  coverUrl: "",
  status: "DRAFT"
};

export function BookManager(props: { books: BookRecord[] }) {
  const router = useRouter();
  const [books, setBooks] = useState(props.books);
  const [form, setForm] = useState(emptyForm);
  const [keyword, setKeyword] = useState("");
  const [pending, setPending] = useState(false);

  const filteredBooks = useMemo(() => {
    const target = keyword.trim().toLowerCase();
    if (!target) {
      return books;
    }
    return books.filter((book) =>
      [book.title, book.author, book.category].some((item) => item.toLowerCase().includes(target))
    );
  }, [books, keyword]);

  function startEdit(book: BookRecord) {
    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      price: String(book.price),
      stock: String(book.stock),
      coverUrl: book.coverUrl ?? "",
      status: book.status
    });
  }

  async function saveBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      if (form.id) {
        await apiFetch(`/api/admin/books/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify(form)
        });
      } else {
        await apiFetch("/api/admin/books", {
          method: "POST",
          body: JSON.stringify(form)
        });
      }
      setForm(emptyForm);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function deleteBook(id: string) {
    if (!window.confirm("确认删除这本图书吗？")) {
      return;
    }
    setPending(true);
    try {
      await apiFetch(`/api/admin/books/${id}`, {
        method: "DELETE"
      });
      setBooks((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid grid-2">
      <section className="panel stack" style={{ padding: 22 }}>
        <div className="between">
          <h2 className="heading-md">{form.id ? "编辑图书" : "新增图书"}</h2>
          {form.id ? (
            <button type="button" className="btn btn-secondary" onClick={() => setForm(emptyForm)}>
              取消编辑
            </button>
          ) : null}
        </div>
        <form className="stack" onSubmit={saveBook}>
          <div className="form-grid">
            <input
              className="input"
              placeholder="书名"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="作者"
              value={form.author}
              onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
              required
            />
            <select
              className="select"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              {BOOK_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as typeof prev.status }))
              }
            >
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">上架</option>
              <option value="ARCHIVED">下架</option>
            </select>
            <input
              className="input"
              placeholder="价格"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="库存"
              type="number"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              required
            />
          </div>
          <input
            className="input"
            placeholder="封面 URL（或调用 /api/upload/book-cover 上传后填入）"
            value={form.coverUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, coverUrl: event.target.value }))}
          />
          <textarea
            className="textarea"
            placeholder="图书简介"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "提交中..." : form.id ? "更新图书" : "创建图书"}
          </button>
        </form>
      </section>

      <section className="panel stack" style={{ padding: 22 }}>
        <div className="between">
          <h2 className="heading-md">图书列表</h2>
          <input
            className="input"
            placeholder="搜索书名 / 作者 / 分类"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            style={{ maxWidth: 240 }}
          />
        </div>

        <div className="stack">
          {filteredBooks.map((book) => (
            <div key={book.id} className="panel" style={{ padding: 16, borderRadius: 18 }}>
              <div className="between">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{book.title}</strong>
                  <span className="muted">
                    {book.author} · {book.category}
                  </span>
                  <span className="muted">
                    {formatCurrency(Number(book.price))} · 库存 {book.stock} · {book.status}
                  </span>
                </div>
                <div className="row">
                  <button type="button" className="btn btn-secondary" onClick={() => startEdit(book)}>
                    编辑
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteBook(book.id)}>
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
