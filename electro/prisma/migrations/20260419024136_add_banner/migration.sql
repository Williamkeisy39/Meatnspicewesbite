-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "placement" TEXT NOT NULL DEFAULT 'side',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_placement_idx" ON "Banner"("placement");

-- CreateIndex
CREATE INDEX "Banner_status_idx" ON "Banner"("status");

-- CreateIndex
CREATE INDEX "Banner_placement_sortOrder_idx" ON "Banner"("placement", "sortOrder");
