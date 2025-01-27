import fs from "fs";
import {
  NewUser,
  UpdateUser,
  User,
  Users,
} from "@ronaldocreis/wishlist-schema";
import { BadRequest, NotFound } from "../../errors/classes";
import { UserRepository } from "./user.repository";
import { MultipartFile } from "@fastify/multipart";
import path from "path";

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
    name: user.name,
    id: user.id,
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

const updateUserImage = async (id: User["id"], data: MultipartFile) => {
  const uploadDir = "/app/uploads/images";
  const fileExtension = path.extname(data.filename); // Get file extension (e.g., .jpg, .png)
  const newFileName = `${id}${fileExtension}`; // Rename file to user ID

  const filePath = path.join(uploadDir, newFileName);

  // Ensure the directory exists
  fs.mkdirSync(uploadDir, { recursive: true });

  // Save the file
  const fileStream = fs.createWriteStream(filePath);
  await data.file.pipe(fileStream);

  console.log(`File saved to: ${filePath}`);

  // Return the accessible image URL
  const imageUrl = `${process.env.BASE_URL}/images/${newFileName}`;

  const updatedUser = await UserRepository.updateUserImage(id, imageUrl);

  return { imageUrl, updatedUser };
};

export const UserService = {
  findAll,
  findById,
  findByUsername,
  create,
  remove,
  update,
  updateUserImage,
};
