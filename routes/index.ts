import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import {
  addCard,
  deleteCard,
  getCards,
  updateCard,
} from "../controllers/cards.ts";
import { signin, signup } from "../controllers/users.ts";
import MongoAPI from "../api/mongoAPI.ts";

const router = new Router();

router
  .get("/api", (ctx) => {
    ctx.response.body = "hello world!";
  })
  .get("/api/card", getCards)
  .post("/api/card", addCard)
  .patch("/api/card/:id", updateCard)
  .delete("/api/card/:id", deleteCard)
  .post("/api/auth/signup", signup)
  .post("/api/auth/signin", signin)
  .get("/api/secret", async (ctx) => {
    const mongoAPI = MongoAPI.getInstance();

    ctx.response.status = 200;
    ctx.response.body = await mongoAPI.getAllCards();
  });

export default router;
