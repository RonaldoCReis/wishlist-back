/*
  Warnings:

  - Made the column `visibility` on table `lists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "visibility" SET NOT NULL,
ALTER COLUMN "visibility" DROP DEFAULT;
