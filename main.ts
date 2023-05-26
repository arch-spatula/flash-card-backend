import { Application } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import router from "./routes/index.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
