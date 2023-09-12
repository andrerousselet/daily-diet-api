import crypto from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionId } from "../middlewares/check-session-id";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionId] }, async (request, _reply) => {
    const { sessionId } = request.cookies;
    const meals = await knex("meals").where("session_id", sessionId).select();
    return { meals };
  });

  app.get("/:id", { preHandler: [checkSessionId] }, async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const parsedMealIdParam = getMealParamsSchema.safeParse(request.params);
    if (!parsedMealIdParam.success) {
      return reply.status(400).send({ error: parsedMealIdParam.error });
    }
    const { id } = parsedMealIdParam.data;
    const { sessionId } = request.cookies;
    const meal = await knex("meals")
      .where({
        session_id: sessionId,
        id,
      })
      .first();
    if (!meal) {
      return reply.status(404).send({ message: "Meal does not exist." });
    }
    return { meal };
  });

  app.post("/", async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string().min(3),
      description: z.string(),
      on_diet: z.boolean(),
      user_id: z.string().uuid(),
    });
    const parsedMealBody = createMealBodySchema.safeParse(request.body);
    if (!parsedMealBody.success) {
      return reply.status(400).send({ error: parsedMealBody.error });
    }
    const { name, description, on_diet, user_id } = parsedMealBody.data;
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }
    await knex("meals").insert({
      id: crypto.randomUUID(),
      name,
      description,
      on_diet,
      session_id: sessionId,
      user_id,
    });
    return reply.status(201).send();
  });
}
