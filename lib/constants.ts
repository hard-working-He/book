export const AUTH_COOKIE = "bookstore_token";
export const CSRF_COOKIE = "bookstore_csrf";
export const DEFAULT_PAGE_SIZE = 8;
export const USER_PAGE_SIZE = 8;
export const ADMIN_PAGE_SIZE = 10;

export const BOOK_CATEGORIES = [
  "文学",
  "计算机",
  "经济管理",
  "少儿",
  "艺术设计",
  "历史",
  "心理学",
  "考试教育"
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "待支付",
  PAID: "已支付",
  SHIPPED: "已发货",
  COMPLETED: "已完成",
  CANCELLED: "已取消"
};
