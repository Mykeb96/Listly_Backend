/*
  Warnings:

  - Added the required column `cost` to the `Listings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listings" ADD COLUMN     "cost" DECIMAL(10,2) NOT NULL;
