import { readdir, rm } from "fs/promises";
import path from "path";

import { prisma } from "@/lib/prisma";

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  const products = await prisma.product.findMany({
    select: { imageUrl: true },
  });

  const referencedUploads = new Set(
    products
      .map((product: { imageUrl: string | null }) => product.imageUrl)
      .filter((imageUrl: string | null): imageUrl is string => Boolean(imageUrl && imageUrl.startsWith("/uploads/")))
      .map((imageUrl: string) => imageUrl.replace(/^\/uploads\//, ""))
  );

  const files = await readdir(uploadsDir).catch(() => [] as string[]);
  const orphanedFiles = files.filter((file) => !referencedUploads.has(file));

  if (orphanedFiles.length === 0) {
    console.log("No orphaned upload files found.");
    return;
  }

  if (isDryRun) {
    console.log("Dry run enabled. Orphaned files:");
    orphanedFiles.forEach((file) => console.log(` - ${file}`));
    return;
  }

  await Promise.all(
    orphanedFiles.map((file) => rm(path.join(uploadsDir, file), { force: true }))
  );

  console.log(`Removed ${orphanedFiles.length} orphaned upload file(s).`);
}

main()
  .catch((error) => {
    console.error("Failed to clean uploads:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
