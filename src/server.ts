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

const app = Fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API de Exemplo",
      description: "Documentação da API de exemplo utilizando Fastify",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

const protectedRoutes: FastifyPluginCallback = async (app) => {
  app.register(clerkPlugin);
  app.addHook("preHandler", (request, reply, done) => {
    const auth = getAuth(request);
    if (!auth.userId) {
      reply.status(401);
      done(new Error("Unauthorized"));
    }
  });
};

const publicRoutes: FastifyPluginCallback = async (app) => {
  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.register(UserController, { prefix: "/users" });
  app.register(Webhooks, { prefix: "/webhooks" });

  // app.get("/", (req, res) => {
  //   res.send("Hello World!");
  // });
};

app.register(protectedRoutes);
app.register(publicRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("Server is running on http://localhost:3333");
});
