export type Role = "USER" | "ADMIN";
export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
}

export interface CartLine {
  id: string;
  quantity: number;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    price: number;
    coverUrl: string | null;
    stock: number;
  };
}
