import { Application, Router, assertEquals, superoak } from '../deps.ts';
import { addCard, deleteCard, getCards, updateCard } from './cards.ts';

// import { Application, Router } from 'https://deno.land/x/oak@v10.4.0/mod.ts';

const router = new Router();
router
  .get('/api/card', (ctx) => {
    ctx.state = { userId: 'user123' };
    return getCards(ctx);
  })
  .post('/api/card', (ctx) => {
    ctx.state = { userId: 'user123' };
    return addCard(ctx);
  })
  .patch('/api/card/:id', (ctx) => {
    ctx.state = { userId: 'user123' };
    return updateCard(ctx);
  })
  .delete('/api/card/:id', (ctx) => {
    ctx.state = { userId: 'user123' };
    return deleteCard(ctx);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

Deno.test('it should create new card', async () => {
  const request = await superoak(app);
  await request
    .post('/api/card')
    .send({
      question: 'CPU의 본딧말',
      answer: 'Central Processing Unit',
      submitDate: 'Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)',
      stackCount: '0',
    })
    .expect(201);
});

Deno.test('it should read new card', async () => {
  const request = await superoak(app);
  await request.get('/api/card').expect(200);
});
