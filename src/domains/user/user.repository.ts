import { NewUser, UpdateUser, User } from "@ronaldocreis/wishlist-schema";
import { prisma } from "../../lib/prisma";

const findAll = () => prisma.user.findMany();

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

const update = (
  id: User["id"],
  { email, firstName, lastName, profileImageUrl, username, bio }: UpdateUser
) =>
  prisma.user.update({
    where: { id },
    data: { email, firstName, lastName, profileImageUrl, bio, username },
  });

export const UserRepository = {
  findAll,
  findById,
  findByUsername,
  create,
  remove,
  update,
};
