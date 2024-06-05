/*
  Warnings:

  - You are about to drop the column `const` on the `FormSubmissions` table. All the data in the column will be lost.
  - Added the required column `content` to the `FormSubmissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormSubmissions" DROP COLUMN "const",
ADD COLUMN     "content" TEXT NOT NULL;
