/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "profilePicture" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");
