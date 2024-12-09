import { List, NewList, UpdateList, User } from "@ronaldocreis/wishlist-schema";
import { prisma } from "../../lib/prisma";

const findAll = (userId: User["id"]) =>
  prisma.list.findMany({ where: { userId } });

const findById = (id: List["id"]) =>
  prisma.list.findUnique({ where: { id }, include: { products: true } });

const create = (data: NewList) => prisma.list.create({ data });

const remove = (id: List["id"]) => prisma.list.delete({ where: { id } });

const update = (id: List["id"], { name }: UpdateList) =>
  prisma.list.update({ where: { id }, data: { name } });

export const ListRepository = {
  findAll,
  findById,
  create,
  remove,
  update,
};
