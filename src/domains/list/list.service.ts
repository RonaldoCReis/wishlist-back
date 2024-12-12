import {
  List,
  Lists,
  NewList,
  UpdateList,
  User,
} from "@ronaldocreis/wishlist-schema";
import { NotFound } from "../../errors/classes";
import { ListRepository } from "./list.repository";

const findAll = async (userId: User["id"]): Promise<Lists> => {
  const lists = await ListRepository.findAll(userId);
  const newLists: Lists = lists.map((list) => ({
    id: list.id,
    name: list.name,
    visibility: list.visibility,
    productCount: list.products.length,
    productImages: list.products.map((product) => product.imageUrl),
  }));
  return newLists;
};

const findById = async (id: List["id"]) => {
  const list = await ListRepository.findById(id);
  if (!list) {
    throw new NotFound("list not found");
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
    throw new NotFound("list not found");
  }
  const deletedList = await ListRepository.remove(id);

  return deletedList;
};

const update = async (id: List["id"], data: UpdateList) => {
  const list = await ListRepository.findById(id);
  if (!list) {
    throw new NotFound("list not found");
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
