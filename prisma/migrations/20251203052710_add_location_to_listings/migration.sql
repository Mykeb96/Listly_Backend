/*
  Warnings:

  - Added the required column `city` to the `Listings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Listings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Listings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `Listings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listings" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;
