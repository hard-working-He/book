"use client";

export function getBrowserCsrfToken() {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("bookstore_csrf="))
    ?.split("=")[1] ?? "";
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getBrowserCsrfToken(),
      ...(init?.headers ?? {})
    }
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "请求失败");
  }

  return payload.data as T;
}
