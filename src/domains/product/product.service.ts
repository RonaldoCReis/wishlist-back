import { List } from "../list/list.schema";
import { ProductRepository } from "./product.repository";
import { NewProduct, Product, UpdateProduct } from "./product.schema";

const findAll = async (listId: List["id"]) =>
  await ProductRepository.findAll(listId);

const findById = async (id: Product["id"]) => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new Error("product not found");
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
    throw new Error("product not found");
  }
  const deletedProduct = await ProductRepository.remove(id);

  return deletedProduct;
};

const update = async (id: Product["id"], data: UpdateProduct) => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new Error("product not found");
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
