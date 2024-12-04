import { prisma } from "../../lib/prisma";
import { NewUser, UpdateUser, User } from "./user.schema";

const findAll = () => prisma.user.findMany();

const findById = (id: User["id"]) => prisma.user.findUnique({ where: { id } });

const create = (data: NewUser) => prisma.user.create({ data });

const remove = (id: User["id"]) => prisma.user.delete({ where: { id } });

const update = (id: User["id"], data: UpdateUser) =>
  prisma.user.update({ where: { id }, data });

export const UserRepository = {
  findAll,
  findById,
  create,
  remove,
  update,
};
