import { BadRequest, NotFound } from "../../errors/classes";
import { UserRepository } from "./user.repository";
import { NewUser, UpdateUser, User } from "./user.schema";

const findAll = async () => await UserRepository.findAll();

const findById = async (id: User["id"]) => {
  const user = await UserRepository.findById(id);
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
};

const findByUsername = async (username: User["username"]) => {
  const user = await UserRepository.findByUsername(username);
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
};

const create = async (data: NewUser) => {
  const user = await UserRepository.findById(data.id);
  if (user) {
    throw new BadRequest("User already exists");
  }
  const newUser = await UserRepository.create(data);

  return newUser;
};

const remove = async (id: User["id"]) => {
  const user = await UserRepository.findById(id);
  if (!user) {
    throw new NotFound("User not found");
  }
  const deletedUser = await UserRepository.remove(id);

  return deletedUser;
};

const update = async (id: User["id"], data: UpdateUser) => {
  const user = await UserRepository.findById(id);
  if (!user) {
    throw new NotFound("User not found");
  }
  const updatedUser = await UserRepository.update(id, data);

  return updatedUser;
};

export const UserService = {
  findAll,
  findById,
  findByUsername,
  create,
  remove,
  update,
};
