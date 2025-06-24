/*
  Warnings:

  - You are about to drop the column `votes` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `txHash` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `option` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vote_pollId_idx";

-- DropIndex
DROP INDEX "Vote_txHash_key";

-- DropIndex
DROP INDEX "Vote_voterId_idx";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "votes";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "createdAt",
DROP COLUMN "optionId",
DROP COLUMN "status",
DROP COLUMN "txHash",
ADD COLUMN     "option" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
