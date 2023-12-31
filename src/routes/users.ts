import crypto from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/", async (_request, _reply) => {
    const users = await knex("users").select();
    return { users };
  });

  app.get("/:id", async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const parsedUserIdParam = getUserIdParamsSchema.safeParse(request.params);
    if (!parsedUserIdParam.success) {
      return reply.status(400).send({ error: parsedUserIdParam.error });
    }
    const { id } = parsedUserIdParam.data;
    const user = await knex("users").where({ id }).first();
    if (!user) return reply.status(404).send({ message: "User not found." });
    return { user };
  });

  app.put("/:id", async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const parsedUserIdParam = getUserIdParamsSchema.safeParse(request.params);
    if (!parsedUserIdParam.success) {
      return reply.status(400).send({ error: parsedUserIdParam.error });
    }
    const { id } = parsedUserIdParam.data;
    const updateUserBodySchema = z.object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    });
    const parsedUserBody = updateUserBodySchema.safeParse(request.body);
    if (!parsedUserBody.success) {
      return reply.status(400).send({ error: parsedUserBody.error });
    }
    await knex("users")
      .where({ id })
      .update({
        ...parsedUserBody.data,
        updated_at: knex.fn.now(),
      });
    return reply.status(204).send();
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

  app.delete("/:id", async (request, reply) => {
    const getUserIdParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const parsedUserIdParam = getUserIdParamsSchema.safeParse(request.params);
    if (!parsedUserIdParam.success) {
      return reply.status(400).send({ error: parsedUserIdParam.error });
    }
    const { id } = parsedUserIdParam.data;
    await knex("users").where({ id }).delete();
    return reply.status(204).send();
  });
}
