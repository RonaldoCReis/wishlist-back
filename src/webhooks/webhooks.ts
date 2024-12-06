import { FastifyInstance } from "fastify";
import { ClerkWebhook } from "./clerk/clerk.webhook";
import fastifyRawBody from "fastify-raw-body";

export const Webhooks = async (app: FastifyInstance) => {
  app.register(fastifyRawBody, {
    global: false, // add the rawBody to every request. **Default true**
    jsonContentTypes: [], // array of content-types to handle as JSON. **Default ['application/json']**
  });
  app.register(ClerkWebhook);
};
