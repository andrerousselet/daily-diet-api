import { app } from "./app";

app.get("/hello", (_request, reply) => {
  return reply.send("Hello world!");
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running on port 3333");
  });
