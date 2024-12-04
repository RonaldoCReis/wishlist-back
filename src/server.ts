import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { UserController } from "./domains/user/user.controller";

const app = fastify();

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

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.register(UserController);

app.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("Server is running on http://localhost:3333");
});
