import crypto from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/", async (_request, _reply) => {
    const users = await knex("users").select();
    return { users };
  });

  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const parsedUserBody = createUserBodySchema.safeParse(request.body);
    if (!parsedUserBody.success) {
      return reply.status(400).send({ error: parsedUserBody.error });
    }
    const { name, email, password } = parsedUserBody.data;
    await knex("users").insert({
      id: crypto.randomUUID(),
      name,
      email,
      password,
    });
    return reply.status(201).send();
  });
}
