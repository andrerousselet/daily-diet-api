import { knex as knexSetup, Knex } from "knex";

export const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection: {
    filename: process.env.DATABASE_URL ?? "./db/app.db",
  },
};

export const knex = knexSetup(config);
