import { Application, Router, superoak } from '../deps.ts';
import { signIn, signUp, refreshUserAccessToken, checkEmail } from './users.ts';

const router = new Router();
router
  .post('/api/auth/signup', signUp)
  .post('/api/auth/signin', signIn)
  .post('/api/auth/refresh', refreshUserAccessToken)
  .post('/api/auth/check-email', checkEmail);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

Deno.test('it should make 2 token', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/signin')
    .send({
      email: 'username@email.com',
      password: '12345678',
    })
    .expect(201)
    .end();
});

Deno.test('it should throw err to not existing email', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/signin')
    .send({
      email: 'notexisting@email.com',
      password: '12345678',
    })
    .expect(400)
    .expect({ success: false, msg: 'Error: 이메일이 없습니다.' });
});

// @todo 삭제 기능 구현 후 signup 성공 케이스 추가하기
Deno.test('it should throw err to existing email', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/signup')
    .send({
      email: 'test@example.com',
      password: 'password123',
    })
    .expect(400);
});

Deno.test('it should not refresh invalid token', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/signup')
    .set({ Headers: { Application: 'Bearer qwer1234' } })
    .expect(400);
});

Deno.test('it should return error to existing email', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/check-email')
    .send({
      email: 'test@example.com',
    })
    .expect(409);
});

Deno.test('it should return null to nonexisting email', async () => {
  const request = await superoak(app);
  await request
    .post('/api/auth/check-email')
    .send({
      email: 'notexisting@example.com',
    })
    .expect(204);
});
