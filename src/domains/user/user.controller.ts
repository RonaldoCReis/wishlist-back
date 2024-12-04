import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { NewUser, UpdateUser, User, Users } from "./user.schema";
import z from "zod";
import { UserService } from "./user.service";

export const UserController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      schema: {
        summary: "List all users",
        tags: ["Users"],
        response: {
          200: Users,
        },
      },
    },
    async (req, res) => {
      const users = await UserService.findAll();
      res.send(users);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:id",
    {
      schema: {
        summary: "Get user by ID",
        tags: ["Users"],
        params: z.object({
          id: User.shape.id,
        }),
        response: {
          200: User,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const user = await UserService.findById(req.params.id);
        res.status(200).send(user);
      } catch (error) {
        res.status(404).send({ message: (error as Error).message });
      }
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: {
        summary: "Create a new user",
        tags: ["Users"],
        body: NewUser,
        response: {
          201: User.pick({ id: true }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const user = await UserService.create(req.body);
        res.status(201).send(user);
      } catch (error) {
        res.status(400).send({ message: (error as Error).message });
      }
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/users/:id",
    {
      schema: {
        summary: "Delete user by ID",
        tags: ["Users"],
        params: z.object({
          id: User.shape.id,
        }),
        response: {
          200: User,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const user = await UserService.remove(req.params.id);
        res.status(200).send(user);
      } catch (error) {
        res.status(404).send({ message: (error as Error).message });
      }
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/users/:id",
    {
      schema: {
        summary: "Update user by ID",
        tags: ["Users"],
        params: z.object({
          id: User.shape.id,
        }),
        body: UpdateUser,
        response: {
          200: User,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const user = await UserService.update(req.params.id, req.body);
        res.status(200).send(user);
      } catch (error) {
        res.status(404).send({ message: (error as Error).message });
      }
    }
  );
};
