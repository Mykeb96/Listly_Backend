-- CreateTable
CREATE TABLE "Listings" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing_Images" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "listing_id" INTEGER NOT NULL,

    CONSTRAINT "Listing_Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing_Images" ADD CONSTRAINT "Listing_Images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
