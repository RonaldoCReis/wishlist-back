import z from "zod";
import { List } from "../list/list.schema";

export const NewProduct = z.object({
  url: z.string(),
  name: z.string(),
  price: z.number().nullish(),
  imageUrl: z.string().nullish(),
  store: z.string().nullish(),
  listId: List.shape.id,
});

export type NewProduct = z.infer<typeof NewProduct>;

export const Product = NewProduct.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof Product>;

export const Products = z.array(Product);

export type Products = z.infer<typeof Products>;

export const UpdateProduct = NewProduct.omit({ listId: true });

export type UpdateProduct = z.infer<typeof UpdateProduct>;
