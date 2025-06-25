/*
  Warnings:

  - Added the required column `status` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txHash` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "txHash" TEXT NOT NULL;
