import {
  List,
  NewProduct,
  Product,
  UpdateProduct,
} from "@ronaldocreis/wishlist-schema";
import { prisma } from "../../lib/prisma";

const findAll = (listId: List["id"]) =>
  prisma.product.findMany({ where: { listId } });

const findById = (id: Product["id"]) =>
  prisma.product.findUnique({ where: { id } });

const create = (data: NewProduct) => prisma.product.create({ data });

const remove = (id: Product["id"]) => prisma.product.delete({ where: { id } });

const update = (
  id: Product["id"],
  { name, url, imageUrl, price, store }: UpdateProduct
) =>
  prisma.product.update({
    where: { id },
    data: { name, url, imageUrl, price, store },
  });

export const ProductRepository = {
  findAll,
  findById,
  create,
  remove,
  update,
};
