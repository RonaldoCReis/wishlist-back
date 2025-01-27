import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import ogs from "open-graph-scraper";
import z from "zod";

export const OpenGraphController = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "Get Open Graph tags from URL",
        tags: ["Open Graph"],
        querystring: z.object({
          url: z.string().url(),
        }),
      },
    },
    async (req, res) => {
      const { url } = req.query;
      const options = { url };
      try {
        const data = await ogs(options);
        res.send(data.result);
      } catch (error) {
        res.status(500).send({ error });
      }
    }
  );
};
