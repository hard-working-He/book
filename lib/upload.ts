import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, folder: "avatars" | "books") {
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() ?? "png";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const relativePath = `/uploads/${folder}/${safeName}`;
  const fullPath = path.join(process.cwd(), "public", relativePath);

  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes);

  return relativePath;
}
