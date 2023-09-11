import { knex as knexSetup, Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: process.env.DATABASE_URL ?? "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = knexSetup(config);
