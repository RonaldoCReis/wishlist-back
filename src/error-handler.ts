import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from "./errors/classes";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(422).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }

  if (error instanceof Unauthorized) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  if (error instanceof Forbidden) {
    return reply.status(403).send({ message: error.message });
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error" });
};
