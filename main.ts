import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";

const app = new Application();
const router = new Router();

router
  .get("/", (ctx) => {
    ctx.response.body = "hello world!";
  })
  .get("/foo", (ctx) => {
    ctx.response.body = "hello foo!";
  })
  .get("/bar", (ctx) => {
    ctx.response.body = "hello bar!";
  })
  .get("/number/:id", (ctx) => {
    const { id } = ctx.params;
    ctx.response.body = `hello ${id}`;
  })
  .get("/string/:id", (ctx) => {
    const { id } = ctx.params;
    ctx.response.body = `hello ${id}`;
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
