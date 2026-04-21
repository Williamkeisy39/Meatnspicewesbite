import { unlink } from "fs/promises";
import path from "path";

export function isLocalUploadUrl(imageUrl: string | null | undefined) {
  return Boolean(imageUrl && imageUrl.startsWith("/uploads/"));
}

export function resolveUploadPath(imageUrl: string) {
  const normalized = imageUrl.replace(/^\/+/, "");
  return path.join(process.cwd(), "public", normalized);
}

export async function deleteUploadedFileByUrl(imageUrl: string | null | undefined) {
  if (!imageUrl || !isLocalUploadUrl(imageUrl)) {
    return;
  }

  const filePath = resolveUploadPath(imageUrl);

  try {
    await unlink(filePath);
  } catch {
    return;
  }
}
