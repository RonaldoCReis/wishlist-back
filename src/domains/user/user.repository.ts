import { NewUser, UpdateUser, User } from "@ronaldocreis/wishlist-schema";
import { prisma } from "../../lib/prisma";

const findAll = ({ query }: { query?: string }) =>
  prisma.user.findMany({
    where: { username: { contains: query, mode: "insensitive" } },
  });

const findById = (id: User["id"]) =>
  prisma.user.findUnique({ where: { id }, include: { lists: true } });

const findByUsername = (username: User["username"]) =>
  prisma.user.findUnique({
    where: { username },
    include: {
      lists: { include: { products: { select: { imageUrl: true } } } },
    },
  });

const create = (data: NewUser) =>
  prisma.user.create({ data, include: { lists: true } });

const remove = (id: User["id"]) => prisma.user.delete({ where: { id } });

const update = (id: User["id"], data: UpdateUser) =>
  prisma.user.update({
    where: { id },
    data,
  });

export const UserRepository = {
  findAll,
  findById,
  findByUsername,
  create,
  remove,
  update,
};
