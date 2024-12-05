-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_list_id_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "list_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
