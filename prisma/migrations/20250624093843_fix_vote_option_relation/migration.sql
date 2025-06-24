/*
  Warnings:

  - You are about to drop the column `option` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `optionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "option",
ADD COLUMN     "optionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
