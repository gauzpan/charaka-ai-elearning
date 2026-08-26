-- CreateTable
CREATE TABLE "FeedItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "sourceName" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedItem_url_key" ON "FeedItem"("url");

-- CreateIndex
CREATE INDEX "FeedItem_publishedAt_idx" ON "FeedItem"("publishedAt");
