import { List, NewList, UpdateList, User } from "@ronaldocreis/wishlist-schema";
import { prisma } from "../../lib/prisma";

const findAll = (userId: User["id"]) =>
  prisma.list.findMany({
    where: { userId },
    include: { products: { select: { imageUrl: true } } },
  });

const findById = (id: List["id"]) =>
  prisma.list.findUnique({
    where: { id },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });

const create = (data: NewList & { userId: User["id"] }) =>
  prisma.list.create({ data, include: { products: true } });

const remove = (id: List["id"]) =>
  prisma.list.delete({ where: { id }, include: { products: true } });

const update = (id: List["id"], { name }: UpdateList) =>
  prisma.list.update({
    where: { id },
    data: { name },
    include: { products: true },
  });

export const ListRepository = {
  findAll,
  findById,
  create,
  remove,
  update,
};
