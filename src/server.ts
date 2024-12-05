// import "dotenv/config";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify, { FastifyPluginCallback } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { UserController } from "./domains/user/user.controller";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { Webhooks } from "./webhooks/webhooks";
import { ListController } from "./domains/list/list.controller";
import { ProductController } from "./domains/product/product.controller";

const app = Fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Wishlist API",
      description: "Documentação da API de wishlist utilizando Fastify",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(clerkPlugin);

const protectedRoutes: FastifyPluginCallback = async (app) => {
  app.addHook("preHandler", (request, reply, done) => {
    const auth = getAuth(request);
    if (!auth.userId) {
      reply.status(401);
      done(new Error("Unauthorized"));
    }
    done();
  });

  app.register(UserController, { prefix: "/users" });
};

const publicRoutes: FastifyPluginCallback = async (app) => {
  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.register(ListController, { prefix: "/lists" });
  app.register(ProductController, { prefix: "/products" });
  app.register(Webhooks, { prefix: "/webhooks" });
};

app.register(protectedRoutes);
app.register(publicRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("Server is running on http://localhost:3333");
});
