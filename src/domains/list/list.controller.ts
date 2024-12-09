import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ListService } from "./list.service";
import { getAuth } from "@clerk/fastify";
import { Error } from "../../errors/errorSchema";
import z from "zod";
import { Forbidden, Unauthorized } from "../../errors/classes";
import {
  List,
  Lists,
  NewList,
  Products,
  UpdateList,
} from "@ronaldocreis/wishlist-schema";

export const ListController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "List all lists from current user",
        tags: ["Lists"],
        response: { 200: Lists, 401: Error },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }
      const lists = await ListService.findAll(userId);
      res.send(lists);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Create a new list",
        tags: ["Lists"],
        body: NewList.omit({ userId: true }),
        response: { 201: List, 401: Error },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }
      const newList = await ListService.create({ ...req.body, userId });
      res.status(201).send(newList);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        summary: "Delete a list",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
        }),
        response: { 200: List, 401: Error, 404: Error },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }
      const { userId: listUserId } = await ListService.findById(req.params.id);

      if (listUserId !== userId) {
        throw new Forbidden("This list does not belong to you");
      }

      const deletedList = await ListService.remove(req.params.id);
      res.status(200).send(deletedList);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      schema: {
        summary: "Update a list",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
        }),
        body: UpdateList,
        response: { 200: List, 401: Error, 404: Error },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }

      const { userId: listUserId } = await ListService.findById(req.params.id);

      if (listUserId !== userId) {
        throw new Forbidden("This list does not belong to you");
      }

      const updatedList = await ListService.update(req.params.id, req.body);
      res.status(200).send(updatedList);
    }
  );
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        summary: "Get list by ID",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: List.extend({
            products: Products,
          }),
          404: Error,
        },
      },
    },
    async (req, res) => {
      const list = await ListService.findById(req.params.id);
      res.status(200).send(list);
    }
  );
};
