import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { addCard, getCards } from "../controllers/cards.ts";

const router = new Router();

router
  .get("/api", (ctx) => {
    ctx.response.body = "hello world!";
  })
  .get("/api/card", getCards)
  .post("/api/card", addCard);

export default router;
