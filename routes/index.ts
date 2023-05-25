import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { addCard, getCards } from "../controllers/cards.ts";
import { signin, signup } from "../controllers/users.ts";

const router = new Router();

router
  .get("/api", (ctx) => {
    ctx.response.body = "hello world!";
  })
  .get("/api/card", getCards)
  .post("/api/card", addCard)
  .post("/api/auth/signup", signup)
  .post("/api/auth/signin", signin);

export default router;
