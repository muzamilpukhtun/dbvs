/*
  Warnings:

  - A unique constraint covering the columns `[arid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_arid_key" ON "User"("arid");
