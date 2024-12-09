import {
  List,
  NewProduct,
  Product,
  UpdateProduct,
} from "@ronaldocreis/wishlist-schema";
import { NotFound } from "../../errors/classes";
import { ProductRepository } from "./product.repository";

const findAll = async (listId: List["id"]) =>
  await ProductRepository.findAll(listId);

const findById = async (id: Product["id"]) => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new NotFound("product not found");
  }
  return product;
};

const create = async (data: NewProduct) => {
  const newProduct = await ProductRepository.create(data);
  return newProduct;
};

const remove = async (id: Product["id"]) => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new NotFound("product not found");
  }
  const deletedProduct = await ProductRepository.remove(id);

  return deletedProduct;
};

const update = async (id: Product["id"], data: UpdateProduct) => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new NotFound("product not found");
  }
  const updatedProduct = await ProductRepository.update(id, data);

  return updatedProduct;
};

export const ProductService = {
  findAll,
  findById,
  create,
  remove,
  update,
};
