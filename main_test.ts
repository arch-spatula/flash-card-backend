import { assertEquals } from 'https://deno.land/std@0.187.0/testing/asserts.ts';
// import { superdeno } from 'https://deno.land/x/superdeno@4.8.0/mod.ts';
import app from './main.ts';

const add = (a: number, b: number) => a + b;

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

// router
//   .get('/api/card', authMiddleware, getCards)
//   .post('/api/card', authMiddleware, addCard)
//   .patch('/api/card/:id', authMiddleware, updateCard)
//   .delete('/api/card/:id', authMiddleware, deleteCard)
//   .post('/api/auth/signup', signUp)
//   .post('/api/auth/signin', signIn)
//   .post('/api/auth/refresh', refreshUserAccessToken);

// Deno.test('should open server', async () => {
//   await superdeno(app.handle.bind(app)).get('/api/auth/signup').expect(400);
// });
