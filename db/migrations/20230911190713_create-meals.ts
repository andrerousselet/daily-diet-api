import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table.uuid("session_id").index();
    table.uuid("user_id").notNullable();
    table.foreign("user_id").references("id").inTable("users");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.boolean("on_diet").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
