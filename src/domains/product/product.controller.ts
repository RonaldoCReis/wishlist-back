import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { NewProduct, Product, Products } from "./product.schema";
import { ProductService } from "./product.service";
import { List } from "../list/list.schema";
import z from "zod";
import { getAuth } from "@clerk/fastify";
import { Error } from "../../utils/errorSchema";
import { ListService } from "../list/list.service";

export const ProductController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "List all products from list",
        tags: ["Products"],
        response: {
          200: Products,
        },
        querystring: z.object({
          listId: List.shape.id,
        }),
      },
    },
    async (req, res) => {
      const products = await ProductService.findAll(req.query.listId);
      res.send(products);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        summary: "Get product by ID",
        tags: ["Products"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: Product,
        },
      },
    },
    async (req, res) => {
      const product = await ProductService.findById(req.params.id);
      res.status(200).send(product);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Create a new product",
        tags: ["Products"],
        body: NewProduct,
        response: {
          201: Product,
          401: Error,
          404: Error,
        },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const list = await ListService.findById(req.body.listId);

      if (list.userId !== userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const newProduct = await ProductService.create(req.body);
      res.status(201).send(newProduct);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        summary: "Delete a product",
        tags: ["Products"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: Product,
          401: Error,
          404: Error,
        },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const product = await ProductService.findById(req.params.id);
      const list = await ListService.findById(product.listId);

      if (list.userId !== userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const deletedProduct = await ProductService.remove(req.params.id);
      res.send(deletedProduct);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      schema: {
        summary: "Update a product",
        tags: ["Products"],
        params: z.object({
          id: z.string(),
        }),
        body: NewProduct,
        response: {
          200: Product,
          401: Error,
          404: Error,
        },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const product = await ProductService.findById(req.params.id);
      const list = await ListService.findById(product.listId);
      if (list.userId !== userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      const updatedProduct = await ProductService.update(
        req.params.id,
        req.body
      );
      res.send(updatedProduct);
    }
  );
};
