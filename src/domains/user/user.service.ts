import {
  NewUser,
  UpdateUser,
  User,
  Users,
} from "@ronaldocreis/wishlist-schema";
import { BadRequest, NotFound } from "../../errors/classes";
import { UserRepository } from "./user.repository";

const findAll = async ({ query }: { query?: string }): Promise<Users> => {
  const users = await UserRepository.findAll({ query });
  return users;
};

const findById = async (id: User["id"]) => {
  const user = await UserRepository.findById(id);
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
};

const findByUsername = async (username: User["username"]): Promise<User> => {
  const user = await UserRepository.findByUsername(username);
  if (!user) {
    throw new NotFound("User not found");
  }

  const newUser: User = {
    createdAt: user.createdAt,
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    updatedAt: user.updatedAt,
    username: user.username,
    bio: user.bio,
    lists: user.lists.map((list) => ({
      id: list.id,
      name: list.name,
      visibility: list.visibility,
      productCount: list.products.length,
      productImages: list.products.map((product) => product.imageUrl),
    })),
  };
  return newUser;
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
