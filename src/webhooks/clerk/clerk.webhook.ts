import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Webhook } from "svix";
import {
  ClerkWebhookCreatedUser,
  ClerkWebhookDeletedUser,
  ClerkWebhookHeaders,
  ClerkWebhookUpdatedUser,
} from "./clerk.schema";
import { UserService } from "../../domains/user/user.service";
import { BadRequest } from "../../errors/classes";
import z from "zod";

export const ClerkWebhook = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/clerk",
    {
      config: {
        rawBody: true,
      },
      schema: {
        summary: "Clerk webhook",
        tags: ["Webhooks"],
        headers: ClerkWebhookHeaders,
        body: z.coerce.string(),
      },
    },
    async (req, res) => {
      const SIGNING_SECRET = process.env.SIGNING_SECRET;

      if (!SIGNING_SECRET) {
        throw new BadRequest(
          "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
        );
      }

      // Create new Svix instance with secret
      const wh = new Webhook(SIGNING_SECRET);

      // Get headers and body
      const headers = req.headers;
      const payload = req.rawBody;

      // Get Svix headers for verification
      const svix_id = headers["svix-id"];
      const svix_timestamp = headers["svix-timestamp"];
      const svix_signature = headers["svix-signature"];

      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return void res.status(400).send({
          success: false,
          message: "Error: Missing svix headers",
        });
      }

      let evt: unknown;

      // Attempt to verify the incoming webhook
      // If successful, the payload will be available from 'evt'
      // If verification fails, error out and return error code
      try {
        if (!payload) {
          throw new BadRequest("Error: Missing payload");
        }
        evt = wh.verify(payload, {
          "svix-id": svix_id as string,
          "svix-timestamp": svix_timestamp as string,
          "svix-signature": svix_signature as string,
        });
      } catch (err) {
        console.log("Error: Could not verify webhook:", (err as Error).message);
        return void res.status(400).send({
          success: false,
          message: (err as Error).message,
        });
      }

      // Do something with payload
      // For this guide, log payload to console
      const typedEvt = evt as
        | ClerkWebhookCreatedUser
        | ClerkWebhookDeletedUser
        | ClerkWebhookUpdatedUser;
      const eventType = typedEvt.type;

      console.log(
        `Received webhook with ID ${typedEvt.data.id} and event type of ${eventType}`
      );
      console.log("Webhook payload:", typedEvt.data);

      if (eventType === "user.created") {
        if (!typedEvt.data.username) {
          throw new BadRequest("Error: Missing username");
        }

        await UserService.create({
          email: typedEvt.data.email_addresses[0].email_address,
          id: typedEvt.data.id,
          firstName: typedEvt.data.first_name,
          lastName: typedEvt.data.last_name,
          profileImageUrl: typedEvt.data.profile_image_url,
          username: typedEvt.data.username,
        });
      } else if (eventType === "user.deleted") {
        await UserService.remove(typedEvt.data.id);
      } else if (eventType === "user.updated") {
        if (!typedEvt.data.username) {
          throw new BadRequest("Error: Missing username");
        }
        await UserService.update(typedEvt.data.id, {
          email: typedEvt.data.email_addresses[0].email_address,
          firstName: typedEvt.data.first_name,
          lastName: typedEvt.data.last_name,
          profileImageUrl: typedEvt.data.image_url,
          username: typedEvt.data.username,
        });
      } else {
        return void res.status(400).send({
          success: false,
          message: "Invalid event type",
        });
      }

      return void res.status(200).send({
        success: true,
        message: "Webhook received",
      });
    }
  );
};
