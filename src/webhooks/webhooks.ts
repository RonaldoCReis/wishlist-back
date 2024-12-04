import { FastifyInstance } from "fastify";
import { ClerkWebhook } from "./clerk/clerk.webhook";

export const Webhooks = async (app: FastifyInstance) => {
  app.register(ClerkWebhook);
};
