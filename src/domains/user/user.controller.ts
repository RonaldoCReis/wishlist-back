import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import path from "path";
import fs from "fs";
import { UserService } from "./user.service";
import Multipart from "@fastify/multipart";
import {
  NewUserSchema,
  UpdateUserImageSchema,
  UpdateUserSchema,
  UserSchema,
  UsersQuerySchema,
  UsersSchema,
} from "@ronaldocreis/wishlist-schema";
import { getAuth } from "@clerk/fastify";
import { Forbidden, Unauthorized } from "../../errors/classes";

export const UserController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "List all users",
        querystring: UsersQuerySchema,
        tags: ["Users"],
        response: {
          200: UsersSchema,
        },
      },
    },
    async (req, res) => {
      const query = req.query.search;
      const users = await UserService.findAll({ query });
      res.send(users);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/:username",
    {
      schema: {
        summary: "Get user by username",
        tags: ["Users"],
        params: z.object({
          username: UserSchema.shape.username,
        }),
        response: {
          200: UserSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const user = await UserService.findByUsername(req.params.username);
      res.status(200).send(user);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Create a new user",
        tags: ["Users"],
        body: NewUserSchema,
        response: {
          201: UserSchema.shape.id,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const user = await UserService.create(req.body);
      res.status(201).send(user.id);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        summary: "Delete user by ID",
        tags: ["Users"],
        params: z.object({
          id: UserSchema.shape.id,
        }),
        response: {
          200: UserSchema.shape.id,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }
      if (req.params.id !== userId) {
        throw new Forbidden("Only the user can delete their account");
      }
      const user = await UserService.remove(req.params.id);
      res.status(200).send(user.id);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/",
    {
      schema: {
        summary: "Update user",
        tags: ["Users"],
        body: UpdateUserSchema,
        response: {
          200: UserSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Unauthorized();
      }

      const updatedUser = await UserService.update(userId, req.body);
      const user = await UserService.findByUsername(updatedUser.username);
      res.status(200).send(user);
    }
  );

  const imageUpload: FastifyPluginCallback = async (app) => {
    app.register(Multipart);

    app.withTypeProvider<ZodTypeProvider>().patch(
      "/image",
      {
        schema: {
          summary: "Update user profile image",
          tags: ["Users"],

          response: {
            200: UserSchema,
            404: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { userId } = getAuth(req);
        if (!userId) {
          throw new Unauthorized();
        }

        const data = await req.file();
        if (!data) {
          return res.status(400).send({ message: "No image provided" });
        }

        const { updatedUser } = await UserService.updateUserImage(userId, data);

        const user = await UserService.findByUsername(updatedUser.username);

        res.status(200).send(user);
      }
    );
  };

  app.register(imageUpload);
};
