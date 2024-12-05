import z from "zod";

export const Error = z.object({
  message: z.string(),
});
