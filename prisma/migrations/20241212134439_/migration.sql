/*
  Warnings:

  - The `visibility` column on the `lists` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" DEFAULT 'public';
