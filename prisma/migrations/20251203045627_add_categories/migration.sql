-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriesToListings" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoriesToListings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE INDEX "_CategoriesToListings_B_index" ON "_CategoriesToListings"("B");

-- AddForeignKey
ALTER TABLE "_CategoriesToListings" ADD CONSTRAINT "_CategoriesToListings_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToListings" ADD CONSTRAINT "_CategoriesToListings_B_fkey" FOREIGN KEY ("B") REFERENCES "Listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
