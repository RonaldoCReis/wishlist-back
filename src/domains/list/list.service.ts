import { User } from "../user/user.schema";
import { ListRepository } from "./list.repository";
import { List, NewList, UpdateList } from "./list.schema";

const findAll = async (userId: User["id"]) =>
  await ListRepository.findAll(userId);

const findById = async (id: List["id"]) => {
  const list = await ListRepository.findById(id);
  if (!list) {
    throw new Error("list not found");
  }
  return list;
};

const create = async (data: NewList) => {
  const newList = await ListRepository.create(data);
  return newList;
};

const remove = async (id: List["id"]) => {
  const list = await ListRepository.findById(id);
  if (!list) {
    throw new Error("list not found");
  }
  const deletedList = await ListRepository.remove(id);

  return deletedList;
};

const update = async (id: List["id"], data: UpdateList) => {
  const list = await ListRepository.findById(id);
  if (!list) {
    throw new Error("list not found");
  }
  const updatedList = await ListRepository.update(id, data);

  return updatedList;
};

export const ListService = {
  findAll,
  findById,
  create,
  remove,
  update,
};
