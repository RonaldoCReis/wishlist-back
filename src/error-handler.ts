import { FastifyInstance } from "fastify";
import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from "./errors/classes";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: "Response Validation Error",
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
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

  if (error instanceof Error) {
    return reply.status(500).send({ message: error.message });
  }
};
